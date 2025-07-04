import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';
import type {
  AuthResponse,
  LoginUserDto,
  RegisterFormData,
} from '@axiom/types';

/**
 * 提供使用者註冊功能的 React Query Mutation Hook。
 * 它會自動處理 `confirmPassword` 欄位的移除。
 */
export const useRegister = () => {
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, RegisterFormData>({
    mutationFn: async userData => {
      // 核心修正：在發送請求前，從表單資料中移除 confirmPassword
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...dataToSend } = userData;
      return api.post<AuthResponse, typeof dataToSend>(
        '/auth/register',
        dataToSend
      );
    },
    onSuccess: data => {
      // 註冊成功後，更新認證狀態
      setAuth(data);
    },
  });
};

/**
 * 提供使用者登入功能的 React Query Mutation Hook。
 */
export const useLogin = () => {
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginUserDto>({
    mutationFn: async credentials => {
      return api.post<AuthResponse, LoginUserDto>('/auth/login', credentials);
    },
    onSuccess: data => {
      // 登入成功後，更新認證狀態
      setAuth(data);
    },
  });
};

/**
 * 提供使用者登出功能的函式。
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  return () => {
    // 清除本地認證狀態
    clearAuth();
    // 清除所有 React Query 的快取，確保登出後不會看到舊資料
    queryClient.clear();
  };
};
