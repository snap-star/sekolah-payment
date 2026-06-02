import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, tokenManager } from '@/lib/api';

import type { User, LoginInput, TokenResponse } from '@/types/server/api';

export function useAuth() {
  const qc = useQueryClient();

  const hasToken = !!tokenManager.getToken();
  
  const user = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      // Only try to fetch user if we have a valid token
      if (!hasToken || tokenManager.isTokenExpired()) {
        tokenManager.clearToken();
        return null;
      }
      try {
        return await apiClient.auth.me();
      } catch {
        tokenManager.clearToken();
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
    enabled: hasToken && !tokenManager.isTokenExpired(), // Only run query if we have a valid token
  });

  const login = useMutation<
    TokenResponse,
    Error,
    { email: string; password: string; rememberMe: boolean }
  >({
    mutationFn: async (creds) => {
      const loginInput: LoginInput = {
        email: creds.email,
        password: creds.password,
      };
      return await apiClient.auth.login(loginInput);
    },
    onSuccess: (data) => {
      // Store token with proper expiration tracking
      tokenManager.setToken(data.access_token, data.expires_in);
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await apiClient.auth.logout();
    },
    onSuccess: () => {
      tokenManager.clearToken();
      qc.clear();
      window.location.href = '/login';
    },
  });

  // Expose token status for UI
  const tokenExpiryTime = tokenManager.getTimeUntilExpiry();
  
  return {
    user: user.data,
    isLoading: user.isLoading,
    isAuthenticated: !!user.data,
    isTokenExpired: tokenManager.isTokenExpired(),
    tokenExpiresIn: tokenExpiryTime,
    login,
    logout,
  };
}