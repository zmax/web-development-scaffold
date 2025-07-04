import type { User } from '@prisma/client';

// 用於公開顯示的使用者資訊，不包含密碼
export type UserProfile = Omit<User, 'password'>;
