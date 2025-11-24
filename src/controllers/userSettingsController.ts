import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { success } from '../utils/response';
import { createError } from '../utils/errors';
import * as userSettingsService from '../services/userSettingsService';

export const getMySettings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw createError(401, '未认证');

  const settings = await userSettingsService.getSettings(userId);
  res.json(success(settings, '获取设置成功'));
});

export const updateMySettings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw createError(401, '未认证');

  const settings = await userSettingsService.updateSettings(userId, req.body);
  res.json(success(settings, '更新设置成功'));
});
