import { z } from 'zod';

const nameSchema = z.string().min(1, '项目名称必填').max(50, '项目名称最长 50 个字符');

export const createProjectSchema = {
  body: z.object({
    name: nameSchema,
    description: z.string().max(200, '描述太长了').optional(),
    color: z
      .string()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, '颜色必须是合法的 hex 格式，如 #FF0000')
      .optional()
  })
};

export const updateProjectSchema = {
  body: z.object({
    name: nameSchema.optional(),
    description: z.string().max(200, '描述太长了').optional(),
    color: z
      .string()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, '颜色必须是合法的 hex 格式，如 #FF0000')
      .optional()
  })
};

export const projectIdParamSchema = {
  params: z.object({
    id: z.string().min(1, '项目 id 必填')
  })
};
