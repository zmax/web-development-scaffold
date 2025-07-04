import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '@axiom/types';

interface AuthState {
  auth: AuthResponse | null;
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      auth: null,
      setAuth: (data: AuthResponse) => set({ auth: data }),
      clearAuth: () => set({ auth: null }),
    }),
    {
      name: 'auth-storage', // local storage 中的 key
    }
  )
);
