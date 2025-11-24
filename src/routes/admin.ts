import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import requireRole from '../middleware/requireRole';
import * as adminController from '../controllers/adminController';

const router = Router();

router.get(
  '/users',
  authMiddleware,
  requireRole('admin'),
  adminController.listUsers
);

export default router;
