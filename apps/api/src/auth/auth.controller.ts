import { Router, Request, Response, NextFunction } from 'express';
// import { PrismaClient } from '@prisma/client';
import * as authService from './auth.service.js';
import { validate } from '../middleware/validation.middleware.js';
import { LoginUserSchema, RegisterUserDtoSchema } from '@axiom/types';

const router: Router = Router();

// POST /api/v1/auth/register
router.post(
  '/register',
  validate(RegisterUserDtoSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({ user, token });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/auth/login
router.post(
  '/login',
  validate(LoginUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await authService.login(req.body);
      res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
