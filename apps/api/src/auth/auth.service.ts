import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from 'types/src';

const prisma = new PrismaClient();

export const register = async (
  userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  db: PrismaClient = prisma
) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await db.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
  return user;
};

export const login = async (
  credentials: Pick<User, 'email' | 'password'>,
  db: PrismaClient = prisma
) => {
  const user = await db.user.findUnique({
    where: { email: credentials.email },
  });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );
  return { user, token };
};
