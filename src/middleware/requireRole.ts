// src/middleware/requireRole.ts
import { Request, Response, NextFunction } from 'express';
import { createError } from '../utils/errors';

export default function requireRole(...roles: Array<'user' | 'admin'>) {
  return function (req: Request, _res: Response, next: NextFunction) {
    if (!req.user) {
      return next(createError(401, '未认证'));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(403, '权限不足'));
    }

    next();
  };
}
