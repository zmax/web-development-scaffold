import type { User } from '@prisma/client';
import { z } from 'zod';

// 用於公開顯示的使用者資訊，不包含密碼
export type UserProfile = Omit<User, 'password'>;

// 用於註冊的 Zod Schema
export const RegisterUserSchema = z.object({
  name: z.string().min(2, '名稱至少需要 2 個字元'),
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(8, '密碼至少需要 8 個字元'),
});

// 從 Zod Schema 推導出註冊 DTO 型別
export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;

// 用於登入的 Zod Schema
export const LoginUserSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(1, '密碼為必填項'),
});

// 從 Zod Schema 推導出登入 DTO 型別
export type LoginUserDto = z.infer<typeof LoginUserSchema>;
