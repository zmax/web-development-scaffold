import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { UserProfile } from '@types';

/**
 * 獲取當前登入使用者資料的 SWR Hook
 *
 * @returns {object} 包含使用者資料、載入狀態和錯誤資訊的物件
 */
export const useUser = () => {
  const { isAuthenticated } = useAuthStore();

  // 只有在使用者通過驗證時才發出請求
  const { data, error, isLoading } = useSWR<UserProfile>(
    isAuthenticated ? '/users/me' : null,
    fetcher
  );

  return { user: data, isLoading, error };
};
