import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { LoginInput, TokenResponse, User, ReportResponse, GetInvoicesResponse } from '@/types/server/api';

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

export const useFinanceTest = (options?: Omit<UseQueryOptions<{ message: string }, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['auth', 'finance-test'],
    queryFn: () => apiClient.auth.financeTest(),
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