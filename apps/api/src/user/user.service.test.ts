import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockReset } from 'vitest-mock-extended';
import { prismaMock } from '../test/setup.js';
import * as userService from './user.service.js';
import { NotFoundError } from '../lib/errors.js';

describe('User Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockReset(prismaMock);
  });

  describe('getUserById', () => {
    it('should return a user without the password', async () => {
      const user = {
        id: '1',
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
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserById('non-existent-id')).rejects.toThrow(
        NotFoundError
      );
    });

    it('當資料庫查詢失敗時，應該拋出錯誤', async () => {
      const dbError = new Error('Database query failed');
      prismaMock.user.findUnique.mockRejectedValue(dbError);

      await expect(userService.getUserById('any-id')).rejects.toThrow(dbError);
    });
  });
});
