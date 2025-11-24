// validators/todoValidators.js
import { z } from 'zod';

export const createTodoSchema = {
  body: z.object({
    title: z.string().min(1, 'title 是必填字段')
  })
};

export const updateTodoSchema = {
  params: z.object({
    id: z.string().min(1, 'id 不能为空')
  }),
  body: z.object({
    title: z.string().min(1, 'title 不能为空').optional(),
    completed: z.boolean().optional()
  })
};

export const idParamSchema = {
  params: z.object({
    id: z.string().min(1, 'id 不能为空')
  })
};
