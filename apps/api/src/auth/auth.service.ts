import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import type { RegisterUserDto, LoginUserDto } from '@axiom/types';
import prisma from '../lib/prisma.js';
import {
  // BadRequestError,
  ConflictError,
  UnauthorizedError,
} from '../lib/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '604800', 10); // 7 days in seconds

// 輔助函式：產生 JWT
const generateToken = (userId: string): string => {
  const payload = { id: userId };
  // 明確傳遞 SignOptions 物件
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(payload, JWT_SECRET, options);
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
export const register = async (input: RegisterUserDto) => {
  const { email, password, name } = input;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('此電子郵件已被註冊');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

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
export const login = async (input: LoginUserDto) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('電子郵件或密碼不正確');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('電子郵件或密碼不正確');
  }

  const token = generateToken(user.id);
  return { user: omitPassword(user), token };
};
