// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodObject, ZodTypeAny } from 'zod';
import { createError } from '../utils/errors';

interface SchemaShape {
  body?: ZodObject<any> | ZodTypeAny;
  query?: ZodObject<any> | ZodTypeAny;
  params?: ZodObject<any> | ZodTypeAny;
}

export default function validate(schema: SchemaShape) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      if (schema.query) {
        // 这里用 any，避免 ParsedQs 类型引用带来的问题
        req.query = (await schema.query.parseAsync(req.query)) as any;
      }

      if (schema.params) {
        // 同理，这里也用 any
        req.params = (await schema.params.parseAsync(req.params)) as any;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const msg =
          err.issues?.map(issue => issue.message).join('; ') ||
          '请求参数不合法';
        return next(createError(400, msg));
      }
      next(err);
    }
  };
}
