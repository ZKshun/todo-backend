// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { fail } from '../utils/response';

export default function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = (err as AppError).status || 500;
  const message = err.message || '服务器错误';

  console.error('❌ Error:', {
    status,
    message,
    stack: err.stack
  });

  res.status(status).json(fail(message, status));
}
