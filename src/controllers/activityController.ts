import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { success } from '../utils/response';
import { createError } from '../utils/errors';
import * as activityService from '../services/activityService';

export const listMyActivities = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw createError(401, '未认证');

  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const activities = await activityService.listMyActivities(userId, limit);
  res.json(success(activities, '获取活动记录成功'));
});
