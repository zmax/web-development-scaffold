import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile } from '@types';

// 定義狀態的型別
interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  setAuth: (user: UserProfile, token: string) => void;
  logout: () => void;
}

// 使用 Zustand 建立 store
export const useAuthStore = create<AuthState>()(
  // 使用 persist 中介軟體將狀態儲存到 localStorage
  persist(
    set => ({
      isAuthenticated: false,
      user: null,
      token: null,
      // 登入或註冊成功後，設定驗證狀態
      setAuth: (user, token) => set({ isAuthenticated: true, user, token }),
      // 登出時，重設為初始狀態
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    {
      name: 'auth-storage', // localStorage 中的 key
      storage: createJSONStorage(() => localStorage), // 指定使用 localStorage
    }
  )
);
