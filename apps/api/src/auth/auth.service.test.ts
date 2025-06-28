import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient, User } from '@prisma/client';
import * as authService from './auth.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

vi.mock('bcryptjs');
vi.mock('jsonwebtoken');

const prismaMock = mockDeep<PrismaClient>();

describe('Auth Service', () => {
  beforeEach(() => {
    mockReset(prismaMock);
    vi.resetAllMocks();
  });

  describe('register', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw an error if user already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userData as User);

      await expect(
        authService.register(userData, prismaMock as unknown as PrismaClient)
      ).rejects.toThrow('User already exists');
    });

    it('should create a new user and return user and token', async () => {
      const hashedPassword = 'hashedpassword';
      const createdUser = {
        id: '1',
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = createdUser;

      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as vi.Mock).mockResolvedValue(hashedPassword);
      prismaMock.user.create.mockResolvedValue(createdUser);
      (jwt.sign as vi.Mock).mockReturnValue('fake-jwt-token');

      const result = await authService.register(
        userData,
        prismaMock as unknown as PrismaClient
      );

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: { ...userData, password: hashedPassword },
      });
      expect(result.user).toEqual(userWithoutPassword);
      expect(result.token).toBe('fake-jwt-token');
    });
  });

  describe('login', () => {
    const loginData = { email: 'test@example.com', password: 'password123' };
    const userInDb = {
      id: '1',
      name: 'Test User',
      ...loginData,
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should throw an error if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login(loginData, prismaMock as unknown as PrismaClient)
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error for invalid password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userInDb);
      (bcrypt.compare as vi.Mock).mockResolvedValue(false);

      await expect(
        authService.login(loginData, prismaMock as unknown as PrismaClient)
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
