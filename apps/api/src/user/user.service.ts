import type { User } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { BadRequestError, NotFoundError } from '../lib/errors.js';

/**
 * 根據使用者 ID 獲取使用者資訊，並移除密碼欄位
 * @param id 使用者 ID
 * @returns 不含密碼的使用者物件
 */
export const getUserById = async (
  id: string
): Promise<Omit<User, 'password'>> => {
  // 根據 gemini.md 的 TDD 準則，先新增測試案例，再加入此驗證邏輯
  // 驗證傳入的 ID 是否為有效的 UUID 格式
  const uuidSchema = z.string().uuid({ message: '無效的使用者 ID 格式' });
  if (!uuidSchema.safeParse(id).success) {
    throw new BadRequestError('無效的使用者 ID 格式');
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError('找不到指定的使用者');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
