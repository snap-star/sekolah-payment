import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { 
  LoginInput, 
  TokenResponse, 
  User, 
  ReportResponse, 
  GetInvoicesResponse,
  GetStudentsResponse,
  GetParentsResponse,
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

// ============================================================================
// Auth Hooks 
// ============================================================================

export const useMe = (options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.auth.me(),
    ...options,
  });
};

export const useLogin = (options?: Omit<UseMutationOptions<TokenResponse, Error, LoginInput>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (input: LoginInput) => apiClient.auth.login(input),
    ...options,
  });
};

export const useLogout = (options?: Omit<UseMutationOptions<{ message: string }, Error, void>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: () => apiClient.auth.logout(),
    ...options,
  });
};

export const useRefreshToken = (options?: Omit<UseMutationOptions<TokenResponse, Error, void>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: () => apiClient.auth.refresh(),
    ...options,
  });
};

export const useAdminTest = (options?: Omit<UseQueryOptions<{ message: string }, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['auth', 'admin-test'],
    queryFn: () => apiClient.auth.adminTest(),
    enabled: false, // Only run when explicitly called
    ...options,
  });
};

// ============================================================================
// Invoice Hooks
// ============================================================================

export const useInvoices = (options?: Omit<UseQueryOptions<GetInvoicesResponse, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      // This would be implemented when the backend adds this endpoint
      // For now, we import from mock api
      const { mockApi } = await import('@/mock/api');
      return mockApi.getTagihan();
    },
    ...options,
  });
};

// ============================================================================
// Report Hooks
// ============================================================================

export const useReport = (options?: Omit<UseQueryOptions<ReportResponse, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      // This would be implemented when the backend adds this endpoint
      // For now, we import from mock api
      const { mockApi } = await import('@/mock/api');
      return mockApi.getReport();
    },
    ...options,
  });
};

// ============================================================================
// Student Hooks
// ============================================================================

export const useStudents = (
  params?: { 
    page?: number; 
    perPage?: number;
    search?: string;
    status?: string;
    gender?: string;
  },
  options?: Omit<UseQueryOptions<GetStudentsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => apiClient.students.getAll(params),
    ...options,
  });
};

export const useStudent = (id: number, options?: Omit<UseQueryOptions<StudentResponse, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => apiClient.students.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateStudent = (options?: Omit<UseMutationOptions<StudentResponse, Error, CreateStudentInput>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (input: CreateStudentInput) => apiClient.students.create(input),
    ...options,
  });
};

export const useUpdateStudent = (options?: Omit<UseMutationOptions<StudentResponse, Error, { id: number; data: UpdateStudentInput }>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentInput }) => apiClient.students.update(id, data),
    ...options,
  });
};

export const useDeleteStudent = (options?: Omit<UseMutationOptions<DeleteStudentResponse, Error, number>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (id: number) => apiClient.students.delete(id),
    ...options,
  });
};

// ============================================================================
// Student Guardian Hooks (Orang Tua/Wali)
// ============================================================================

export const useStudentGuardians = (
  studentId: number,
  params?: { 
    page?: number; 
    perPage?: number;
  },
  options?: Omit<UseQueryOptions<GetStudentGuardiansResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['student-guardians', studentId, params],
    queryFn: () => apiClient.students.getGuardians(studentId, params),
    enabled: !!studentId,
    ...options,
  });
};

export const useStudentGuardian = (
  studentId: number, 
  guardianId: number, 
  options?: Omit<UseQueryOptions<StudentGuardianResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['parents', guardianId],
    queryFn: () => apiClient.students.getGuardianById(studentId, guardianId),
    enabled: !!studentId && !!guardianId,
    ...options,
  });
};

export const useCreateStudentGuardian = (options?: Omit<UseMutationOptions<StudentGuardianResponse, Error, { studentId: number; data: CreateStudentGuardianInput }>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: ({ studentId, data }: { studentId: number; data: CreateStudentGuardianInput }) => 
      apiClient.students.createGuardian(studentId, data),
    ...options,
  });
};

export const useUpdateStudentGuardian = (options?: Omit<UseMutationOptions<StudentGuardianResponse, Error, { studentId: number; guardianId: number; data: UpdateStudentGuardianInput }>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: ({ studentId, guardianId, data }: { studentId: number; guardianId: number; data: UpdateStudentGuardianInput }) => 
      apiClient.students.updateGuardian(studentId, guardianId, data),
    ...options,
  });
};

export const useDeleteStudentGuardian = (options?: Omit<UseMutationOptions<{ success: boolean; message: string }, Error, { studentId: number; guardianId: number }>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: ({ studentId, guardianId }: { studentId: number; guardianId: number }) => 
      apiClient.students.deleteGuardian(studentId, guardianId),
    ...options,
  });
};

// ============================================================================
// Fee Types Hooks (Jenis Biaya)
// ============================================================================

export const useFeeTypes = (
  params?: { 
    page?: number; 
    perPage?: number;
  },
  options?: Omit<UseQueryOptions<GetFeeTypesResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['fee-types', params],
    queryFn: () => apiClient.feeTypes.getAll(params),
    ...options,
  });
};

export const useFeeType = (id: number, options?: Omit<UseQueryOptions<FeeTypeResponse, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['fee-types', id],
    queryFn: () => apiClient.feeTypes.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateFeeType = (options?: Omit<UseMutationOptions<FeeTypeResponse, Error, CreateFeeTypeInput>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (input: CreateFeeTypeInput) => apiClient.feeTypes.create(input),
    ...options,
  });
};

export const useUpdateFeeType = (options?: Omit<UseMutationOptions<FeeTypeResponse, Error, { id: number; data: UpdateFeeTypeInput }>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFeeTypeInput }) => apiClient.feeTypes.update(id, data),
    ...options,
  });
};

export const useDeleteFeeType = (options?: Omit<UseMutationOptions<{ success: boolean; message: string }, Error, number>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (id: number) => apiClient.feeTypes.delete(id),
    ...options,
  });
};

// ============================================================================
// Parent/Guardian List Hooks (All guardians across all students)
// ============================================================================

export const useParents = (
  params?: { 
    page?: number; 
    perPage?: number;
  },
  options?: Omit<UseQueryOptions<GetParentsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['parents', params],
    queryFn: () => apiClient.parent.getAll(params),
    ...options,
  });
};