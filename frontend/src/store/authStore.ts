import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load initial state from localStorage if available
  const storedUser = localStorage.getItem('user');
  const storedAccess = localStorage.getItem('accessToken');
  const storedRefresh = localStorage.getItem('refreshToken');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    accessToken: storedAccess,
    refreshToken: storedRefresh,
    isAuthenticated: !!storedAccess,
    setAuth: (user, accessToken, refreshToken) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, accessToken, refreshToken, isAuthenticated: true });
    },
    updateAccessToken: (accessToken) => {
      localStorage.setItem('accessToken', accessToken);
      set({ accessToken });
    },
    clearAuth: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    },
  };
});
