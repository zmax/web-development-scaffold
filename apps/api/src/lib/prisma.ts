import { PrismaClient } from '@prisma/client';

// 建立一個 PrismaClient 的單例 (singleton)
// 這樣可以避免在應用程式中建立多個連線池
const prisma = new PrismaClient();

export default prisma;
