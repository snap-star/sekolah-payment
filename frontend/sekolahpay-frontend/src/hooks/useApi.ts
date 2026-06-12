import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { 
  LoginInput, 
  TokenResponse, 
  User, 
  GetUsersResponse,
  AdminUser,
  CreateUserInput,
  UpdateUserInput,
  DeleteUserResponse,
  GetDashboardResponse,
  GetInvoicesResponse,
  InvoiceResponse,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  DeleteInvoiceResponse,
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
  UpdateFeeTypeInput,
  GetSchoolYearsResponse,
  SchoolYearResponse,
  CreateSchoolYearInput,
  UpdateSchoolYearInput,
  DeleteSchoolYearResponse
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
// School Year Hooks (Tahun Ajaran)
// ============================================================================

export const useSchoolYears = (
  params?: { 
    page?: number; 
    perPage?: number;
  },
  options?: Omit<UseQueryOptions<GetSchoolYearsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['school-years', params],
    queryFn: () => apiClient.schoolYears.getAll(params),
    ...options,
  });
};

export const useSchoolYear = (id: number, options?: Omit<UseQueryOptions<SchoolYearResponse, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['school-years', id],
    queryFn: () => apiClient.schoolYears.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateSchoolYear = (options?: Omit<UseMutationOptions<SchoolYearResponse, Error, CreateSchoolYearInput>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (input: CreateSchoolYearInput) => apiClient.schoolYears.create(input),
    ...options,
  });
};

export const useUpdateSchoolYear = (options?: Omit<UseMutationOptions<SchoolYearResponse, Error, { id: number; data: UpdateSchoolYearInput }>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSchoolYearInput }) => apiClient.schoolYears.update(id, data),
    ...options,
  });
};

export const useDeleteSchoolYear = (options?: Omit<UseMutationOptions<DeleteSchoolYearResponse, Error, number>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (id: number) => apiClient.schoolYears.delete(id),
    ...options,
  });
};

// ============================================================================
// Invoice Hooks (Tagihan)
// ============================================================================

export const useInvoices = (
  params?: { 
    page?: number; 
    perPage?: number;
    search?: string;
    status?: string;
  },
  options?: Omit<UseQueryOptions<GetInvoicesResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => apiClient.invoices.getAll(params),
    ...options,
  });
};

export const useInvoice = (id: number, options?: Omit<UseQueryOptions<InvoiceResponse, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => apiClient.invoices.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateInvoice = (options?: Omit<UseMutationOptions<InvoiceResponse, Error, CreateInvoiceInput>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => apiClient.invoices.create(input),
    ...options,
  });
};

export const useUpdateInvoice = (options?: Omit<UseMutationOptions<InvoiceResponse, Error, { id: number; data: UpdateInvoiceInput }>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInvoiceInput }) => apiClient.invoices.update(id, data),
    ...options,
  });
};

export const useDeleteInvoice = (options?: Omit<UseMutationOptions<DeleteInvoiceResponse, Error, number>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (id: number) => apiClient.invoices.delete(id),
    ...options,
  });
};

// ============================================================================
// Report Hooks
// ============================================================================

export const useReport = (
  params?: { 
    page?: number; 
    perPage?: number;
    search?: string;
    status?: string;
  },
  options?: Omit<UseQueryOptions<GetInvoicesResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: async () => {
      return apiClient.invoices.getAll(params);
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
    queryKey: ['student-guardians', 'parents', studentId, params],
    queryFn: () => apiClient.students.getGuardians(studentId, params),
    enabled: !!studentId,
    ...options,
  });
};

/**
 * Hook to fetch a single student guardian by ID
 * Updated to use apiClient.parent.getById() which implements the documented API
 * @param guardianId - ID of the guardian to fetch
 */
export const useStudentGuardian = (
  guardianId: number,
  studentId: number,
  options?: Omit<UseQueryOptions<StudentGuardianResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['student-guardian', 'parents', studentId, guardianId],
    queryFn: () => apiClient.parent.getById(guardianId),
    enabled: !!guardianId,
    ...options,
  });
};

/**
 * Hook to create a new student guardian (orang tua/wali)
 * Updated to use apiClient.parent.create() which implements the documented API
 * Fixes duplication issues by using the centralized parent API section
 */
export const useCreateStudentGuardian = (options?: Omit<UseMutationOptions<StudentGuardianResponse, Error, CreateStudentGuardianInput>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (input: CreateStudentGuardianInput) => 
      apiClient.parent.create(input),
    ...options,
  });
};

/**
 * Hook to update an existing student guardian
 * Updated to use apiClient.parent.update() which implements the documented API
 */
export const useUpdateStudentGuardian = (options?: Omit<UseMutationOptions<StudentGuardianResponse, Error, { id: number; data: UpdateStudentGuardianInput }>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentGuardianInput }) => 
      apiClient.parent.update(id, data),
    ...options,
  });
};

/**
 * Hook to delete a student guardian
 * Updated to use apiClient.parent.delete() which implements the documented API
 */
export const useDeleteStudentGuardian = (options?: Omit<UseMutationOptions<{ success: boolean; message: string }, Error, number>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (guardianId: number) => 
      apiClient.parent.delete(guardianId),
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

// ============================================================================
// User Admin Hooks (Admin only)
// ============================================================================

export const useUsers = (
  params?: { 
    page?: number; 
    perPage?: number;
    search?: string;
  },
  options?: Omit<UseQueryOptions<GetUsersResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => apiClient.users.getAll(params),
    ...options,
  });
};

export const useCreateUser = (
  options?: Omit<UseMutationOptions<AdminUser, Error, CreateUserInput>, 'mutationFn' | 'mutationKey'>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => apiClient.users.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    ...options,
  });
};

export const useUpdateUser = (
  options?: Omit<UseMutationOptions<AdminUser, Error, { id: number; data: UpdateUserInput }>, 'mutationFn' | 'mutationKey'>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserInput }) => apiClient.users.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    ...options,
  });
};

export const useDeleteUser = (
  options?: Omit<UseMutationOptions<DeleteUserResponse, Error, number>, 'mutationFn' | 'mutationKey'>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    ...options,
  });
};

// ============================================================================
// Dashboard Hook
// ============================================================================

export const useDashboard = (
  options?: Omit<UseQueryOptions<GetDashboardResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.dashboard.get(),
    ...options,
  });
};