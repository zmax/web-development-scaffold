import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import * as userService from './user.service';

const prismaMock = mockDeep<PrismaClient>();

describe('User Service', () => {
  beforeEach(() => {
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

      const result = await userService.getUserById(
        user.id,
        prismaMock as unknown as PrismaClient
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw an error if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        userService.getUserById('1', prismaMock as unknown as PrismaClient)
      ).rejects.toThrow('User not found');
    });
  });
});
