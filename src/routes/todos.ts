// src/routes/todos.ts
import { Router } from 'express';
import todoController from '../controllers/todoController';
import validate from '../middleware/validate';
import {
  createTodoSchema,
  updateTodoSchema,
  idParamSchema
} from '../validators/todoValidators';

const router = Router();

// /todos 前面已经在 index.ts 用 authMiddleware 保护了
router.get('/', todoController.listTodos);
router.post('/', validate(createTodoSchema), todoController.createTodo);
router.get('/:id', validate(idParamSchema), todoController.getTodo);
router.put('/:id', validate(updateTodoSchema), todoController.updateTodo);
router.delete('/:id', validate(idParamSchema), todoController.deleteTodo);

export default router;
