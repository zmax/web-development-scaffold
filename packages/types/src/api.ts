import { z } from 'zod';
import type { UserProfile } from './user';

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// Schema for the actual data transfer object (DTO) sent to the API for registration.
// This represents the backend's expectation and does not include `confirmPassword`.
export const RegisterUserDtoSchema = z.object({
  name: z.string().min(2, '名稱至少需要 2 個字元'),
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(8, '密碼至少需要 8 個字元'),
});

export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;

// Schema for the frontend registration form.
// Includes client-side-only fields like `confirmPassword`.
export const RegisterFormSchema = RegisterUserDtoSchema.extend({
  confirmPassword: z.string().min(1, '請再次輸入密碼'),
}).refine(data => data.password === data.confirmPassword, {
  message: '密碼不匹配',
  path: ['confirmPassword'],
});

// Type for the form data, derived from the form schema.
export type RegisterFormData = z.infer<typeof RegisterFormSchema>;

// Schema for user login.
export const LoginUserSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(1, '請輸入密碼'),
});

export type LoginUserDto = z.infer<typeof LoginUserSchema>;
