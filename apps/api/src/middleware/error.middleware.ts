import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../lib/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // 對於未預期的錯誤，回傳通用的 500 錯誤
  return res.status(500).json({
    message: '伺服器內部發生錯誤',
  });
};
