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

// Base axios instance for direct API calls
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach token to axios requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('sekolahpay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sekolahpay_token');
      window.location.href = '/login';
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
        const token = localStorage.getItem('sekolahpay_token');
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
    
    financeTest: async (): Promise<{ message: string }> => {
      const response = await axiosInstance.get<{ message: string }>('/auth/finance-test');
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

export default axiosInstance;