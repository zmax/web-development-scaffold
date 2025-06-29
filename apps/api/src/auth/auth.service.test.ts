import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockReset } from 'vitest-mock-extended';
import { prismaMock } from '../test/setup.js';
import { register, login } from './auth.service.js';
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from '../lib/errors.js';
import type { User } from '@prisma/client';
import type { RegisterUserDto } from '@axiom/types';

// Mock 依賴項
vi.mock('bcryptjs');
vi.mock('jsonwebtoken');

describe('Auth Service', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserInput: RegisterUserDto = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  beforeEach(() => {
    // 重置所有 vi.mock 的模擬
    vi.resetAllMocks();
    // 在每個測試案例開始前，重置 prisma mock 的狀態
    mockReset(prismaMock);
  });

  describe('register', () => {
    it('應���成功註冊新使用者並返回使用者和 token', async () => {
      // 安排 (Arrange)
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedpassword' as never);
      prismaMock.user.create.mockResolvedValue(mockUser);
      vi.mocked(jwt.sign).mockReturnValue('mock-token' as never);

      // 行動 (Act)
      const result = await register(mockUserInput);

      // 斷言 (Assert)
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUserInput.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: mockUserInput.email,
          password: 'hashedpassword',
          name: mockUserInput.name,
        },
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id },
        expect.any(String),
        {
          expiresIn: expect.any(Number),
        }
      );
      expect(result.token).toBe('mock-token');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(result.user).not.toHaveProperty('password');
    });

    it('如果 email 已被使用，應該拋出 ConflictError', async () => {
      // 安排
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      // 行動 & 斷言
      await expect(register(mockUserInput)).rejects.toThrow(ConflictError);
      await expect(register(mockUserInput)).rejects.toThrow(
        '此電子郵件已被註冊'
      );
    });

    it('如果缺少必要欄位，服務層應該拋出 BadRequestError', async () => {
      // 註：在實際應用中，這應該由 controller 層的 Zod 驗證攔截，
      // 但我們仍然測試服務層的防禦性檢查。
      const input = { email: '', password: '', name: '' };
      await expect(register(input)).rejects.toThrow(BadRequestError);
    });

    it('當密碼雜湊失敗時，應該拋出錯誤', async () => {
      // 安排
      const hashError = new Error('Hashing failed');
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockRejectedValue(hashError as never);

      // 行動 & 斷言
      await expect(register(mockUserInput)).rejects.toThrow(hashError);
    });

    it('當資料庫建立使用者失敗時，應該拋出錯誤', async () => {
      // 安排
      const dbError = new Error('Database creation failed');
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedpassword' as never);
      prismaMock.user.create.mockRejectedValue(dbError);

      // 行動 & 斷言
      await expect(register(mockUserInput)).rejects.toThrow(dbError);
    });

    it('當 JWT 簽署失敗時，應該拋出錯誤', async () => {
      // 安排
      const jwtError = new Error('JWT signing failed');
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedpassword' as never);
      prismaMock.user.create.mockResolvedValue(mockUser);
      vi.mocked(jwt.sign).mockImplementation(() => {
        throw jwtError;
      });

      // 行動 & 斷言
      await expect(register(mockUserInput)).rejects.toThrow(jwtError);
    });
  });

  describe('login', () => {
    const loginInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('應該成功登入並返回使用者和 token', async () => {
      // 安排
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue('mock-token' as never);

      // 行動
      const result = await login(loginInput);

      // 斷言
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginInput.password,
        mockUser.password
      );
      expect(result.token).toBe('mock-token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('如果使用者不存在，應該拋出 UnauthorizedError', async () => {
      // 安排
      prismaMock.user.findUnique.mockResolvedValue(null);

      // 行動 & 斷言
      await expect(login(loginInput)).rejects.toThrow(UnauthorizedError);
    });

    it('如果密碼不正確，應該拋出 UnauthorizedError', async () => {
      // 安排
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      // 行動 & 斷言
      await expect(login(loginInput)).rejects.toThrow(UnauthorizedError);
    });

    it('如果缺少 email 或 password，應該拋出 BadRequestError', async () => {
      await expect(login({ email: '', password: 'password' })).rejects.toThrow(
        BadRequestError
      );
      await expect(
        login({ email: 'test@test.com', password: '' })
      ).rejects.toThrow(BadRequestError);
    });

    it('當密碼比對過程發生錯誤時，應該拋出原始錯誤', async () => {
      // 安排
      const compareError = new Error('Comparison failed');
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockRejectedValue(compareError as never);

      // 行動 & 斷言
      await expect(login(loginInput)).rejects.toThrow(compareError);
    });

    it('當 JWT 簽署失敗時，應該拋出錯誤', async () => {
      // 安排
      const jwtError = new Error('JWT signing failed');
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockImplementation(() => {
        throw jwtError;
      });

      // 行動 & 斷言
      await expect(login(loginInput)).rejects.toThrow(jwtError);
    });
  });
});
