import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@axiom/types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  clearAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
      logout: () => {
        get().clearAuth();
        // You might want to clear other caches or redirect here
      },
    }),
    {
      name: 'auth-storage', // local storage 中的 key
    }
  )
);
