import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../lib/errors.js';
import logger from '../lib/logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,

  _next: NextFunction
) => {
  logger.error(
    {
      err,
      request: {
        method: req.method,
        url: req.url,
        body: req.body,
        ip: req.ip,
      },
    },
    'An error occurred in the application'
  );

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // 對於未預期的錯誤，回傳通用的 500 錯誤
  return res.status(500).json({
    message: '伺服器內部發生錯誤',
  });
};
