import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import type { UserCreateInput, UserLoginInput } from '@types';
import prisma from '../lib/prisma';
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from '../lib/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// 輔助函式：產生 JWT
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// 輔助函式：從 User 物件中移除密碼
const omitPassword = (user: User): Omit<User, 'password'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * 註冊新使用者
 * @param input - 使用者註冊資料
 * @returns 包含使用者資訊和 token 的物件
 */
export const register = async (input: UserCreateInput) => {
  const { email, password, name } = input;

  if (!email || !password || !name) {
    throw new BadRequestError('缺少必要的欄位：email, password, name');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('此電子郵件已被註冊');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  const token = generateToken(newUser.id);
  return { user: omitPassword(newUser), token };
};

/**
 * 使用者登入
 * @param input - 使用者登入資料
 * @returns 包含使用者資訊和 token 的物件
 */
export const login = async (input: UserLoginInput) => {
  const { email, password } = input;

  if (!email || !password) {
    throw new BadRequestError('缺少 email 或 password');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError('電子郵件或密碼不正確');
  }

  const token = generateToken(user.id);
  return { user: omitPassword(user), token };
};
