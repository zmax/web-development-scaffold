import { Router, Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/users/me - 獲取當前登入使用者的資訊
router.get(
  '/me',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    // authMiddleware 會驗證 JWT 並將使用者 ID 附加到 req.user
    if (!req.user?.id) {
      // 雖然 authMiddleware 應該已經處理了，但多一層防護總是好的
      return res.status(401).json({ message: '未經授權' });
    }

    try {
      const user = await userService.getUserById(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
