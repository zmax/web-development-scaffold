import { vi, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import type { PrismaClient } from '@prisma/client';

// Mock Prisma Client
const prismaMock = mockDeep<PrismaClient>();

vi.mock('../lib/prisma.js', () => ({
  __esModule: true,
  default: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export { prismaMock };
