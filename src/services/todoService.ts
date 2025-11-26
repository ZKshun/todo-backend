// src/services/todoService.ts
import Todo from '../models/Todo';
import { createError } from '../utils/errors';
import { getJSON, setJSON, delKey } from '../lib/redisClient';

const TODO_LIST_CACHE_KEY = (userId: string) => `todos:${userId}`;
const TODO_CACHE_TTL = 60; // 秒

export async function listTodos(userId: string) {
  // 1. 从 Redis 里查是否有缓存
  const cache = await getJSON<any[]>(TODO_LIST_CACHE_KEY(userId));
  if (cache) {
    return cache;
  }

  // 2. 没有命中，就查 Mongo
  const todos = await Todo.find({ userId }).sort({ createdAt: -1 }).lean();

  // 3. 写入缓存
  await setJSON(TODO_LIST_CACHE_KEY(userId), todos, TODO_CACHE_TTL);

  return todos;
}

export async function createTodo(userId: string, title: string) {
  if (!title) {
    throw createError(400, 'title 是必填字段');
  }

  const todo = await Todo.create({
    title,
    completed: false,
    userId
  });

  // 清除缓存
  await delKey(TODO_LIST_CACHE_KEY(userId));

  return todo;
}


export async function getTodo(userId: string, todoId: string) {
  const todo = await Todo.findOne({ _id: todoId, userId });
  if (!todo) {
    throw createError(404, '任务未找到');
  }
  return todo;
}

export async function updateTodo(
  userId: string,
  todoId: string,
  payload: { title?: string; completed?: boolean }
) {
  const { title, completed } = payload;

  const updateData: { title?: string; completed?: boolean } = {};
  if (title !== undefined) updateData.title = title;
  if (completed !== undefined) updateData.completed = completed;

  const todo = await Todo.findOneAndUpdate(
    { _id: todoId, userId },
    { $set: updateData },
    { new: true }
  );

  if (!todo) {
    throw createError(404, '任务未找到');
  }

  // 清理缓存
  await delKey(TODO_LIST_CACHE_KEY(userId));

  return todo;
}


export async function deleteTodo(userId: string, todoId: string) {
  const result = await Todo.findOneAndDelete({ _id: todoId, userId });
  if (!result) {
    throw createError(404, '任务未找到');
  }

  // 清理缓存
  await delKey(TODO_LIST_CACHE_KEY(userId));
}


// 可选：导出一个默认对象，方便 controller 使用 default 导入
const todoService = {
  listTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo
};

export default todoService;
