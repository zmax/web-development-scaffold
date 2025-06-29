import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockReset } from 'vitest-mock-extended';
import { prismaMock } from '../test/setup';
import { register, login } from './auth.service';
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from '../lib/errors';
import type { User } from '@prisma/client';

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

  const mockUserInput = {
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
    it('應該成功註冊新使用者並返回使用者和 token', async () => {
      // 安排 (Arrange)
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedpassword');
      prismaMock.user.create.mockResolvedValue(mockUser);
      vi.mocked(jwt.sign).mockReturnValue('mock-token');

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
          expiresIn: expect.any(String),
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

    it.each([
      { ...mockUserInput, email: '' },
      { ...mockUserInput, password: '' },
      { ...mockUserInput, name: '' },
    ])('如果缺少必要欄位 ($#)，應該拋出 BadRequestError', async input => {
      await expect(register(input)).rejects.toThrow(BadRequestError);
      await expect(register(input)).rejects.toThrow(
        '缺少必要的欄位：email, password, name'
      );
    });

    it('當密碼雜湊失敗時，應該拋出錯誤', async () => {
      // 安排
      const hashError = new Error('Hashing failed');
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockRejectedValue(hashError);

      // 行動 & 斷言
      await expect(register(mockUserInput)).rejects.toThrow(hashError);
    });

    it('當資料庫建立使用者失敗時，應該拋出錯誤', async () => {
      // 安排
      const dbError = new Error('Database creation failed');
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedpassword');
      prismaMock.user.create.mockRejectedValue(dbError);

      // 行動 & 斷言
      await expect(register(mockUserInput)).rejects.toThrow(dbError);
    });

    it('當 JWT 簽署失敗時，應該拋出錯誤', async () => {
      // 安排
      const jwtError = new Error('JWT signing failed');
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedpassword');
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
      vi.mocked(bcrypt.compare).mockResolvedValue(true);
      vi.mocked(jwt.sign).mockReturnValue('mock-token');

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
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      // 行動 & 斷言
      await expect(login(loginInput)).rejects.toThrow(UnauthorizedError);
    });

    it.each([
      { email: 'test@example.com', password: '' },
      { email: '', password: 'password123' },
    ])(
      '如果缺少 email 或 password ($#)，應該拋出 BadRequestError',
      async input => {
        await expect(login(input)).rejects.toThrow(BadRequestError);
        await expect(login(input)).rejects.toThrow('缺少 email 或 password');
      }
    );

    it('當密碼比對過程發生錯誤時，應該拋出原始錯誤', async () => {
      // 安排
      const compareError = new Error('Comparison failed');
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockRejectedValue(compareError);

      // 行動 & 斷言
      // 註：此處測試的是服務目前直接拋出 bcrypt 錯誤的行為。
      // 在更複雜的系統中，可能會選擇捕獲此錯誤並拋出一個通用的 UnauthorizedError。
      await expect(login(loginInput)).rejects.toThrow(compareError);
    });

    it('當 JWT 簽署失敗時，應該拋出錯誤', async () => {
      // 安排
      const jwtError = new Error('JWT signing failed');
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);
      vi.mocked(jwt.sign).mockImplementation(() => {
        throw jwtError;
      });

      // 行動 & 斷言
      await expect(login(loginInput)).rejects.toThrow(jwtError);
    });
  });
});
