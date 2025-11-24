import { z } from 'zod';

export const updateSettingsSchema = {
  body: z.object({
    language: z.string().optional(), // 可以以后做枚举
    timezone: z.string().optional(),
    notifications: z
      .object({
        email: z.boolean().optional(),
        inApp: z.boolean().optional()
      })
      .optional()
  })
};
