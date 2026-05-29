import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/mock/api';
// import api from '@/lib/api'; // SWAP THIS WHEN BACKEND IS READY

const USE_MOCK = true;

export function useAuth() {
  const qc = useQueryClient();

  const user = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      if (USE_MOCK) return mockApi.me();
      // Real API: const { data } = await api.get('/me'); return data;
      return null;
    },
    retry: false,
    staleTime: Infinity,
  });

  const login = useMutation({
    mutationFn: async (creds: { email: string; password: string; rememberMe: boolean }) => {
      if (USE_MOCK) return mockApi.login(creds);
      // Real API: const { data } = await api.post('/login', creds); return data;
      return null;
    },
    onSuccess: (data) => {
      if (data?.token) localStorage.setItem('sekolahpay_token', data.token);
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const logout = async () => {
    if (USE_MOCK) await mockApi.logout();
    // else await api.post('/logout');
    localStorage.removeItem('sekolahpay_token');
    qc.clear();
    window.location.href = '/login';
  };

  return {
    user: user.data,
    isLoading: user.isLoading,
    isAuthenticated: !!user.data,
    login,
    logout,
  };
}