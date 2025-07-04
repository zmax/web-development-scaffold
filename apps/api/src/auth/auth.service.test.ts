import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockReset } from 'vitest-mock-extended';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prismaMock } from '../test/setup.js';
import * as authService from './auth.service.js';
import { ConflictError, UnauthorizedError } from '../lib/errors.js';
import type { RegisterUserDto, LoginUserDto } from '@axiom/types';
import type { User } from '@prisma/client';

// 模擬外部依賴
// 使用工廠函式來建立 mock，避免 TypeScript 類型推斷為 void
vi.mock('bcryptjs', () => {
  // 因為原始碼和測試都使用 `import bcrypt from 'bcryptjs'` (default import)
  // 所以我們的 mock 需要提供一個 default export，其值為包含 mock 函式的物件
  return {
    default: {
      hash: vi.fn(),
      compare: vi.fn(),
    },
  };
});
vi.mock('jsonwebtoken', () => ({
  // 同樣地，為 'jsonwebtoken' 的 default import 提供 mock
  default: {
    sign: vi.fn(),
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockReset(prismaMock);
  });

  describe('register', () => {
    const mockUserInput: RegisterUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('應該成功註冊新使用者並返回使用者資訊和 token', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(null); // 沒有已存在的使用者
      prismaMock.user.create.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedpassword');
      vi.mocked(jwt.sign).mockReturnValue('mocked-jwt-token');

      // Act
      const result = await authService.register(mockUserInput);

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUserInput.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: mockUserInput.email,
          name: mockUserInput.name,
          password: 'hashedpassword',
        },
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id },
        expect.any(String),
        { expiresIn: expect.any(Number) }
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = mockUser;
      expect(result.user).toEqual(userWithoutPassword);
      expect(result.token).toBe('mocked-jwt-token');
    });

    it('如果電子郵件已被註冊，應該拋出 ConflictError', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(mockUser); // 使用者已存在

      // Act & Assert
      await expect(authService.register(mockUserInput)).rejects.toThrow(
        ConflictError
      );
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockLoginInput: LoginUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('應該成功登入並返回使用者資訊和 token', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true); // 密碼正確
      vi.mocked(jwt.sign).mockReturnValue('mocked-jwt-token');

      // Act
      const result = await authService.login(mockLoginInput);

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockLoginInput.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginInput.password,
        mockUser.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id },
        expect.any(String),
        { expiresIn: expect.any(Number) }
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = mockUser;
      expect(result.user).toEqual(userWithoutPassword);
      expect(result.token).toBe('mocked-jwt-token');
    });

    it('如果找不到使用者，應該拋出 UnauthorizedError', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(null); // 找不到使用者

      // Act & Assert
      await expect(authService.login(mockLoginInput)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('如果密碼不正確，應該拋出 UnauthorizedError', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false); // 密碼不正確

      // Act & Assert
      await expect(authService.login(mockLoginInput)).rejects.toThrow(
        UnauthorizedError
      );
    });
  });
});
