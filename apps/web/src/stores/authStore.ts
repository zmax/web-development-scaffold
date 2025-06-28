import { create } from 'zustand';
import { User } from '@types/index';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => {
    // 在實際應用中，您可能會在這裡將 token 存儲到 localStorage
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    // 在實際應用中，您可能會在這裡從 localStorage 清除 token
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: user => {
    set({ user });
  },
}));
