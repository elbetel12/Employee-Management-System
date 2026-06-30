import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import type { LoginInput, ChangePasswordInput } from '../features/auth/auth.schema';

export const useAuth = () => {
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data } = await apiClient.post('/auth/login', credentials);
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      clearAuth();
    },
    onError: () => {
      // In case server fails, still clean up client state
      clearAuth();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      const { data: res } = await apiClient.patch('/auth/change-password', data);
      return res;
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
