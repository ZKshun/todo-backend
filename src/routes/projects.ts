import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import validate from '../middleware/validate';
import * as projectController from '../controllers/projectController';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema
} from '../validators/projectValidators';

const router = Router();

// 统一前缀 /projects，建议在 index.ts 里用 app.use('/projects', router);
router.use(authMiddleware);

router.get('/', projectController.listProjects);
router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/:id', validate(projectIdParamSchema), projectController.getProject);
router.put(
  '/:id',
  validate({ ...projectIdParamSchema, ...updateProjectSchema }),
  projectController.updateProject
);
router.delete('/:id', validate(projectIdParamSchema), projectController.deleteProject);

export default router;
