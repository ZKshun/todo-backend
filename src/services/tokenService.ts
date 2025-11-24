// src/services/tokenService.ts
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/config';
import { createError } from '../utils/errors';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';
import { IUser } from '../models/User'; // 如果你在 User.ts 里导出了接口的话

// 如果还没导出 IUser，可以先不写这一行，而是用 any：user: any

export function generateAccessToken(user: any) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    },
    jwtSecret,
    { expiresIn: '15m' }
  );
}

export async function generateRefreshToken(user: any) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 天

  await RefreshToken.deleteMany({ userId: user._id });

  await RefreshToken.create({
    userId: user._id,
    token,
    expiresAt
  });

  return token;
}

export async function refreshAccessToken(refreshToken: string) {
  const record = await RefreshToken.findOne({ token: refreshToken });

  if (!record) {
    throw createError(401, '无效的 refreshToken');
  }

  if (record.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ _id: record._id });
    throw createError(401, 'refreshToken 已过期');
  }

  const user = await User.findById(record.userId);
  if (!user) {
    throw createError(401, '关联用户不存在');
  }

  const newAccessToken = generateAccessToken(user);
  return newAccessToken;
}

export async function revokeRefreshToken(refreshToken: string) {
  if (!refreshToken) return;
  await RefreshToken.deleteOne({ token: refreshToken });
}
