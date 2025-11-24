import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import { listMyActivities } from '../controllers/activityController';

const router = Router();

router.use(authMiddleware);

// GET /activity/me?limit=50
router.get('/me', listMyActivities);

export default router;
