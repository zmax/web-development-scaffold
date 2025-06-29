import type { User } from '@prisma/client';
import prisma from '../lib/prisma';
import { NotFoundError } from '../lib/errors';

/**
 * 根據使用者 ID 獲取使用者資訊，並移除密碼欄位
 * @param id 使用者 ID
 * @returns 不含密碼的使用者物件
 */
export const getUserById = async (
  id: string
): Promise<Omit<User, 'password'>> => {
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
