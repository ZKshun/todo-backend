import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import validate from '../middleware/validate';
import { updateSettingsSchema } from '../validators/userSettingsValidators';
import { getMySettings, updateMySettings } from '../controllers/userSettingsController';

const router = Router();

router.use(authMiddleware);

router.get('/me', getMySettings);
router.put('/me', validate(updateSettingsSchema), updateMySettings);

export default router;
