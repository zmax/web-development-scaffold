import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { HttpError } from '../lib/errors.js';

export const validate =
  (schema: z.AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(e => e.message).join(', ');
        next(new HttpError(400, `輸入驗證失敗: ${formattedErrors}`));
      } else {
        next(error);
      }
    }
  };
