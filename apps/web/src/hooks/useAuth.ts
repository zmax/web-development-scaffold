import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { sender, type ApiError } from '@/lib/api';
import type { UserLoginInput, AuthResponse, UserCreateInput } from '@types';

// 使用 Zod 建立註冊表單的驗證 Schema
export const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: '名稱為必填項' }),
    email: z.string().email({ message: '請輸入有效的電子郵件' }),
    password: z.string().min(6, { message: '密碼至少需要 6 個字元' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '兩次輸入的密碼不一致',
    // 將錯誤訊息附加到 confirmPassword 欄位上
    path: ['confirmPassword'],
  });

// 從 Zod Schema 推斷出 TypeScript 型別
export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * 處理使用者登入的 SWR Mutation Hook
 *
 * @returns {object} 包含登入函式、載入狀態和錯誤資訊的物件
 */
export function useLogin() {
  const { trigger, isMutating, error } = useSWRMutation<
    AuthResponse,
    ApiError,
    string, // 這裡的 string 代表 SWR key 的型別
    UserLoginInput // 這裡的 UserLoginInput 代表發送給 API 的請求資料型別 (arg)
  >('/auth/login', sender);

  return {
    login: trigger,
    isLoggingIn: isMutating,
    loginError: error,
  };
}

/**
 * 處理使用者註冊的 SWR Mutation Hook
 *
 * @returns {object} 包含註冊函式、載入狀態和錯誤資訊的物件
 */
export function useRegister() {
  const { trigger, isMutating, error } = useSWRMutation<
    AuthResponse,
    ApiError,
    string,
    UserCreateInput
  >('/auth/register', sender);

  return {
    registerUser: trigger,
    isRegistering: isMutating,
    registerError: error,
  };
}
