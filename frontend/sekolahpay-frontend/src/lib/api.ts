import axios from 'axios';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/types/server/api';
import type { 
  LoginInput, 
  TokenResponse, 
  User,
  GetStudentsResponse,
  StudentResponse,
  CreateStudentInput,
  UpdateStudentInput,
  DeleteStudentResponse
} from '@/types/server/api';

// Token management utilities
const TOKEN_KEY = 'sekolahpay_token';
const TOKEN_EXPIRY_KEY = 'sekolahpay_token_expiry';

// Token manager - must be defined before axios instance that uses it
const tokenManager = {
  setToken: (token: string, expiresIn: number) => {
    localStorage.setItem(TOKEN_KEY, token);
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },
  
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },
  
  isTokenExpired: () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  },
  
  getTimeUntilExpiry: () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return 0;
    return parseInt(expiry) - Date.now();
  }
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Base axios instance for direct API calls
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Refresh token function - must be defined after axiosInstance
const refreshToken = async (): Promise<string> => {
  try {
    const response = await axiosInstance.post('/auth/refresh');
    const { access_token, expires_in } = response.data;
    tokenManager.setToken(access_token, expires_in);
    return access_token;
  } catch (error) {
    tokenManager.clearToken();
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    throw error;
  } finally {
    isRefreshing = false;
  }
};

// Attach token to axios requests
axiosInstance.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're already on login page, don't try to refresh
      if (window.location.pathname.includes('/login')) {
        return Promise.reject(error);
      }
      
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;
        
        try {
          const newToken = await refreshToken();
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      
      // Queue requests while refreshing
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }
    
    return Promise.reject(error);
  }
);

// Create tRPC client that uses our axios instance for full type safety
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
      fetch: async (input, init) => {
        const token = tokenManager.getToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(init?.headers as Record<string, string>),
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(input, {
          ...init,
          headers,
          credentials: 'include',
        });
        return response;
      },
    }),
  ],
});

// Type-safe API client with implementations that map to Laravel backend routes
export const apiClient = {
  auth: {
    login: async (input: LoginInput): Promise<TokenResponse> => {
      const response = await axiosInstance.post<TokenResponse>('/auth/login', input);
      return response.data;
    },
    
    me: async (): Promise<User> => {
      const response = await axiosInstance.get<User>('/auth/me');
      return response.data;
    },
    
    refresh: async (): Promise<TokenResponse> => {
      const response = await axiosInstance.post<TokenResponse>('/auth/refresh');
      return response.data;
    },
    
    logout: async (): Promise<{ message: string }> => {
      const response = await axiosInstance.post<{ message: string }>('/auth/logout');
      return response.data;
    },
    
    adminTest: async (): Promise<{ message: string }> => {
      const response = await axiosInstance.get<{ message: string }>('/admin-test');
      return response.data;
    },
  },
  
  students: {
    getAll: async (): Promise<GetStudentsResponse> => {
      const response = await axiosInstance.get<GetStudentsResponse>('/students');
      return response.data;
    },
    
    getById: async (id: number): Promise<StudentResponse> => {
      const response = await axiosInstance.get<StudentResponse>(`/students/${id}`);
      return response.data;
    },
    
    create: async (input: CreateStudentInput): Promise<StudentResponse> => {
      const response = await axiosInstance.post<StudentResponse>('/students', input);
      return response.data;
    },
    
    update: async (id: number, input: UpdateStudentInput): Promise<StudentResponse> => {
      const response = await axiosInstance.put<StudentResponse>(`/students/${id}`, input);
      return response.data;
    },
    
    delete: async (id: number): Promise<DeleteStudentResponse> => {
      const response = await axiosInstance.delete<DeleteStudentResponse>(`/students/${id}`);
      return response.data;
    },
  },
};

// Also delete the useApi.ts file that references the removed financeTest
// Export only once
export { axiosInstance, tokenManager };
export default axiosInstance;