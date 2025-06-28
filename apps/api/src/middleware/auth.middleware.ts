import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/HttpError';

interface JwtPayload {
  userId: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, '未提供認證權杖'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // 這是伺服器設定問題，應拋出 500 錯誤
      throw new HttpError(500, '伺服器設定錯誤：JWT 金鑰未設定');
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = { id: decoded.userId }; // 將使用者 ID 附加到請求物件上
    next();
  } catch (error) {
    // 處理 jwt.verify 拋出的錯誤 (例如 TokenExpiredError, JsonWebTokenError)
    return next(new HttpError(401, '無效或過期的認證權杖'));
  }
};
