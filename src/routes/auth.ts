// src/routes/auth.ts
import { Router } from 'express';
import * as authController from '../controllers/authController';
import authMiddleware from '../middleware/auth';
import validate from '../middleware/validate';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema
} from '../validators/authValidators';

export default function createAuthRouter() {
  const router = Router();

  router.post('/register', validate(registerSchema), authController.register);
  router.post('/login', validate(loginSchema), authController.login);
  router.get('/me', authMiddleware, authController.me);
  router.post('/refresh', validate(refreshSchema), authController.refresh);
  router.post('/logout', validate(logoutSchema), authController.logout);

  return router;
}
