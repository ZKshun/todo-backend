// src/controllers/adminController.ts
import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import * as adminService from '../services/adminService';
import { success } from '../utils/response';

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await adminService.listUsers();
  res.json(success(users));
});
