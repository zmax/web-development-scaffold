import type { User } from '@prisma/client';

// 用於公開顯示的使用者資訊，不包含密碼
export type UserProfile = Omit<User, 'password'>;

// 用於建立新使用者的輸入資料
export type UserCreateInput = Pick<User, 'email' | 'password' | 'name'> & {
  confirmPassword?: string;
};

// 用於使用者登入的輸入資料
export type UserLoginInput = Pick<User, 'email' | 'password'>;
