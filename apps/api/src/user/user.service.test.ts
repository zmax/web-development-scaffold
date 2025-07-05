import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockReset } from 'vitest-mock-extended';
import { prismaMock } from '../test/setup.js';
import * as userService from './user.service.js';
import { BadRequestError, NotFoundError } from '../lib/errors.js';

describe('User Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockReset(prismaMock);
  });

  describe('getUserById', () => {
    // 修正：使用一個有效的 UUID 作為測試 ID，以符合服務層中新增的格式驗證
    const validUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    it('should return a user without the password', async () => {
      const user = {
        id: validUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await userService.getUserById(user.id);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(result).toEqual(userWithoutPassword);
    });

    it('如果找不到使用者，應該拋出 NotFoundError', async () => {
      const nonExistentId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserById(nonExistentId)).rejects.toThrow(
        NotFoundError
      );
    });

    // 根據 gemini.md 的 TDD 準則新增的測試案例
    it('如果 ID 格式不正確 (不是 UUID)，應該拋出 BadRequestError', async () => {
      const invalidId = 'not-a-valid-uuid';

      await expect(userService.getUserById(invalidId)).rejects.toThrow(
        BadRequestError
      );
    });

    it('當資料庫查詢失敗時，應該拋出錯誤', async () => {
      const dbError = new Error('Database query failed');
      const anyValidId = '123e4567-e89b-12d3-a456-426614174000';
      prismaMock.user.findUnique.mockRejectedValue(dbError);

      await expect(userService.getUserById(anyValidId)).rejects.toThrow(
        dbError
      );
    });
  });
});
