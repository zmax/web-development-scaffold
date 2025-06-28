import { Router, Response } from 'express';
import * as userService from './user.service';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as string;
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;
