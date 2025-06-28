import { Router, Request, Response } from 'express';
import * as authService from './auth.service';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;
