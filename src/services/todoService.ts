// src/services/todoService.ts
import Todo from '../models/Todo';
import { createError } from '../utils/errors';

export async function listTodos(userId: string) {
  return Todo.find({ userId }).sort({ createdAt: -1 });
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

  // 给出明确类型，避免 TS 报错
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

  return todo;
}

export async function deleteTodo(userId: string, todoId: string) {
  const result = await Todo.findOneAndDelete({ _id: todoId, userId });
  if (!result) {
    throw createError(404, '任务未找到');
  }
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
