import { Router, Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

const router = Router();

// POST /api/v1/auth/register
router.post(
  '/register',
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
