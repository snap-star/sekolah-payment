import axios from 'axios';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter, GetParentsResponse } from '@/types/server/api';
import type { 
  LoginInput, 
  TokenResponse, 
  User,
  GetStudentsResponse,
  StudentResponse,
  CreateStudentInput,
  UpdateStudentInput,
  DeleteStudentResponse,
  CreateStudentGuardianInput,
  UpdateStudentGuardianInput,
  GetStudentGuardiansResponse,
  StudentGuardianResponse,
  GetFeeTypesResponse,
  FeeTypeResponse,
  CreateFeeTypeInput,
  UpdateFeeTypeInput
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
        // Create a sanitized error that doesn't expose the full API URL
        const sanitizedError = new Error('Authentication failed');
        Object.assign(sanitizedError, {
          response: error.response,
          // Don't include config/request that would expose the URL in logs
        });
        return Promise.reject(sanitizedError);
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
          const sanitizedRefreshError = new Error('Token refresh failed');
          // Properly type check the refresh error before accessing properties
          if (refreshError && typeof refreshError === 'object' && 'response' in refreshError) {
            Object.assign(sanitizedRefreshError, {
              response: (refreshError as { response?: unknown }).response,
            });
          }
          return Promise.reject(sanitizedRefreshError);
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
    
    // Create sanitized error for all other cases to prevent exposing API URL in console
    // But for student-guardians endpoints, keep full error details for debugging
    if (originalRequest.url?.includes('/student-guardians')) {
      return Promise.reject(error);
    }
    
    const sanitizedError = new Error('API request failed');
    Object.assign(sanitizedError, {
      response: error.response,
      // Omit the full config/request to prevent URL exposure in console logs
    });
    return Promise.reject(sanitizedError);
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
    
    // Get user info endpoint
    me: async (): Promise<User> => {
      const response = await axiosInstance.get<User>('/auth/me');
      return response.data;
    },
    
    // Refresh token endpoint
    refresh: async (): Promise<TokenResponse> => {
      const response = await axiosInstance.post<TokenResponse>('/auth/refresh');
      return response.data;
    },
    
    // Logout endpoint
    logout: async (): Promise<{ message: string }> => {
      const response = await axiosInstance.post<{ message: string }>('/auth/logout');
      return response.data;
    },
    
    // Admin test endpoint
    adminTest: async (): Promise<{ message: string }> => {
      const response = await axiosInstance.get<{ message: string }>('/admin-test');
      return response.data;
    },
  },

  // Student Guardians API (Orang Tua/Wali) - Standalone parent API section
  // This section implements all CRUD operations for student guardians based on .example documentation
  parent: {
    /**
     * Fetch all guardians/parents with pagination
     * Implements GET /api/student-guardians from documentation
     * @param params - Pagination parameters (page, perPage)
     */
    getAll: async (params?: { 
      page?: number; 
      perPage?: number;
    }): Promise<GetParentsResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.perPage) searchParams.append('per_page', params.perPage.toString());
      
      const url = `/student-guardians${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await axiosInstance.get<GetParentsResponse>(url);
      return response.data;
    },

    /**
     * Fetch single guardian by ID
     * Implements GET /api/student-guardians/{id} from documentation
     * @param guardianId - ID of the guardian to fetch
     */
    getById: async (guardianId: number): Promise<StudentGuardianResponse> => {
      const response = await axiosInstance.get<StudentGuardianResponse>(`/student-guardians/${guardianId}`);
      return response.data;
    },

    /**
     * Create a new guardian
     * Implements POST /api/student-guardians from documentation
     * @param input - Guardian data including student_id, name, relation, phone, etc.
     * Sends both 'relation' and 'relationship' to handle backend inconsistencies
     */
    create: async (input: CreateStudentGuardianInput): Promise<StudentGuardianResponse> => {
      try {
        // Send 'relationship' to match the database column name that's returned in responses
        // Even though documentation says 'relation', the backend database uses 'relationship'
        const payload = {
          student_id: input.student_id,
          name: input.name,
          phone: input.phone,
          relationship: input.relation,
          occupation: input.occupation ?? null,
          address: input.address ?? null,
        };
        
        console.log('Sending guardian create request with normalized payload:', payload);
        console.log('Payload JSON string length:', JSON.stringify(payload).length);
        
        const response = await axiosInstance.post<StudentGuardianResponse>('/student-guardians', payload);
        console.log('Guardian created successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating guardian:', error);
        if (axios.isAxiosError(error)) {
          // Log everything we can about the error
          console.error('Full axios error:', JSON.stringify(error, null, 2));
          console.error('Response data:', error.response?.data);
          console.error('Request data that was sent:', error.config?.data);
        } else {
          console.error('Non-axios error:', error);
        }
        throw error;
      }
    },

    /**
     * Update an existing guardian
     * Implements PUT /api/student-guardians/{id} from documentation
     * @param guardianId - ID of the guardian to update
     * @param input - Updated guardian data
     * Sends both 'relation' and 'relationship' to handle backend inconsistencies
     */
    update: async (guardianId: number, input: UpdateStudentGuardianInput): Promise<StudentGuardianResponse> => {
      try {
        // Send EXACTLY what the documentation specifies - only 'relation' field
        const payload = {
          ...input,
        };
      console.log('Sending guardian update request:', payload);
        const response = await axiosInstance.put<StudentGuardianResponse>(`/student-guardians/${guardianId}`, payload);
        console.log('Guardian updated successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating guardian:', error);
        if (axios.isAxiosError(error)) {
          console.error('Axios error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
          });
        }
        throw error;
      }
      },

    /**
     * Delete a guardian
     * Implements DELETE /api/student-guardians/{id} from documentation
     * @param guardianId - ID of the guardian to delete
     */
    delete: async (guardianId: number): Promise<{ success: boolean; message: string }> => {
      const response = await axiosInstance.delete(`/student-guardians/${guardianId}`);
      return response.data;
    },
  },

  // Student API search endpoint
  students: {
    getAll: async (params?: { 
      page?: number; 
      perPage?: number;
      search?: string;
      status?: string;
      gender?: string;
    }): Promise<GetStudentsResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.perPage) searchParams.append('per_page', params.perPage.toString());
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.gender) searchParams.append('gender', params.gender);
      
      const url = `/students${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await axiosInstance.get<GetStudentsResponse>(url);
      return response.data;
    },
    
    // Student API get by ID endpoint
    getById: async (id: number): Promise<StudentResponse> => {
      const response = await axiosInstance.get<StudentResponse>(`/students/${id}`);
      return response.data;
    },
    
    // Student API create endpoint
    create: async (input: CreateStudentInput): Promise<StudentResponse> => {
      const response = await axiosInstance.post<StudentResponse>('/students', input);
      return response.data;
    },
    
    // Student API update endpoint
    update: async (id: number, input: UpdateStudentInput): Promise<StudentResponse> => {
      const response = await axiosInstance.put<StudentResponse>(`/students/${id}`, input);
      return response.data;
    },

    // Student API delete endpoint
    delete: async (id: number): Promise<DeleteStudentResponse> => {
      const response = await axiosInstance.delete<DeleteStudentResponse>(`/students/${id}`);
      return response.data;
    },
    
    // Student Guardians API - Get all guardians for a specific student
    // This is a convenience method that uses the parent.getAll method with student_id filter
    getGuardians: async (studentId: number, params?: { 
    page?: number; 
    perPage?: number;
    }): Promise<GetStudentGuardiansResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.perPage) searchParams.append('per_page', params.perPage.toString());
    
    // Filter by student_id since we use the standalone student-guardians endpoint
    searchParams.append('student_id', studentId.toString());
    const url = `/student-guardians${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await axiosInstance.get<GetStudentGuardiansResponse>(url);
    return response.data;
    },
    
    // The CRUD operations for guardians have been moved to the parent section above
    // to avoid duplication and follow the API documentation structure
    // Use apiClient.parent.getById(), create(), update(), delete() instead
  },

  // Fee Types API - Jenis Biaya
  feeTypes: {
    // Get all fee types with pagination
    getAll: async (params?: { 
      page?: number; 
      perPage?: number;
    }): Promise<GetFeeTypesResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.perPage) searchParams.append('per_page', params.perPage.toString());
      
      const url = `/fee-types${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await axiosInstance.get<GetFeeTypesResponse>(url);
      return response.data;
    },

    // Get single fee type
    getById: async (id: number): Promise<FeeTypeResponse> => {
      const response = await axiosInstance.get<FeeTypeResponse>(`/fee-types/${id}`);
      return response.data;
    },

    // Create new fee type
    create: async (input: CreateFeeTypeInput): Promise<FeeTypeResponse> => {
      const response = await axiosInstance.post<FeeTypeResponse>('/fee-types', input);
      return response.data;
    },

    // Update fee type
    update: async (id: number, input: UpdateFeeTypeInput): Promise<FeeTypeResponse> => {
      const response = await axiosInstance.put<FeeTypeResponse>(`/fee-types/${id}`, input);
      return response.data;
    },

    // Delete fee type
    delete: async (id: number): Promise<{ success: boolean; message: string }> => {
      const response = await axiosInstance.delete<{ success: boolean; message: string }>(`/fee-types/${id}`);
      return response.data;
    },
  },
};

export { axiosInstance, tokenManager };
export default axiosInstance;