// src/validators/authValidators.ts
import { z } from 'zod';

const usernameSchema = z
  .string()
  .min(3, '用户名至少 3 个字符！')
  .max(20, '用户名最长 20 个字符');

const passwordSchema = z
  .string()
  .min(6, '密码至少需要 6 个字符！')
  .max(100, '密码太长了');

export const registerSchema = {
  body: z.object({
    username: usernameSchema,
    password: passwordSchema
  })
};

export const loginSchema = {
  body: z.object({
    username: usernameSchema,
    password: passwordSchema
  })
};

export const refreshSchema = {
  body: z.object({
    refreshToken: z.string().min(1, 'refreshToken 为必填字段')
  })
};

export const logoutSchema = {
  body: z.object({
    refreshToken: z.string().min(1, 'refreshToken 为必填字段')
  })
};
