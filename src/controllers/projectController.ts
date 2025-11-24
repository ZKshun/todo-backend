import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { success } from '../utils/response';
import { createError } from '../utils/errors';
import * as projectService from '../services/projectService';

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw createError(401, '未认证');

  const projects = await projectService.listProjects(userId);
  res.json(success(projects, '获取项目列表成功'));
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw createError(401, '未认证');

  const { name, description, color } = req.body as {
    name: string;
    description?: string;
    color?: string;
  };

  const project = await projectService.createProject(userId, { name, description, color });
  res.status(201).json(success(project, '创建项目成功'));
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw createError(401, '未认证');

  const { id } = req.params as { id: string };
  const project = await projectService.getProject(userId, id);
  res.json(success(project, '获取项目成功'));
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw createError(401, '未认证');

  const { id } = req.params as { id: string };
  const { name, description, color } = req.body as {
    name?: string;
    description?: string;
    color?: string;
  };

  const project = await projectService.updateProject(userId, id, { name, description, color });
  res.json(success(project, '更新项目成功'));
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw createError(401, '未认证');

  const { id } = req.params as { id: string };
  await projectService.deleteProject(userId, id);
  res.status(204).send();
});
