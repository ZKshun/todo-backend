// src/controllers/todoController.ts
import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import todoService from '../services/todoService';
import { success } from '../utils/response';
import { createError } from '../utils/errors';

const listTodos = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError(401, '未认证');
  }

  const todos = await todoService.listTodos(userId);
  res.json(success(todos, '获取成功'));
});

const createTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError(401, '未认证');
  }

  const { title } = req.body as { title: string };
  const todo = await todoService.createTodo(userId, title);
  res.status(201).json(success(todo, '创建成功'));
});

const getTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError(401, '未认证');
  }

  const { id } = req.params as { id: string };
  const todo = await todoService.getTodo(userId, id);
  res.json(success(todo, '获取成功'));
});

const updateTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError(401, '未认证');
  }

  const { id } = req.params as { id: string };
  const { title, completed } = req.body as {
    title?: string;
    completed?: boolean;
  };

  const todo = await todoService.updateTodo(userId, id, { title, completed });
  res.json(success(todo, '更新成功'));
});

const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError(401, '未认证');
  }

  const { id } = req.params as { id: string };
  await todoService.deleteTodo(userId, id);
  res.status(204).send();
});

const todoController = {
  listTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo
};

export default todoController;
