// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/config';
import { createError } from '../utils/errors';

interface JwtPayload {
  userId: string;
  username: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export default function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next(createError(401, '未提供 Authorization 头'));
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next(createError(401, 'Authorization 格式错误，应为 Bearer token'));
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return next(createError(401, '无效或过期的 Token'));
  }
}
