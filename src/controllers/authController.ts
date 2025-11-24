// src/controllers/authController.ts
import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import * as authService from '../services/authService';
import { refreshAccessToken, revokeRefreshToken } from '../services/tokenService';
import { success } from '../utils/response';
import { createError } from '../utils/errors';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string; password: string };
  const user = await authService.register(username, password);
  res.json(success(user, '注册成功'));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string; password: string };
  const tokens = await authService.login(username, password);
  res.json(success(tokens, '登录成功'));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createError(401, '未认证');
  }
  const profile = await authService.getProfile(req.user.userId);
  res.json(success(profile));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  if (!refreshToken) {
    throw createError(400, 'refreshToken 为必填字段');
  }
  const newAccessToken = await refreshAccessToken(refreshToken);
  res.json(success({ accessToken: newAccessToken }));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  await revokeRefreshToken(refreshToken);
  res.json(success(null, '已退出登录'));
});
