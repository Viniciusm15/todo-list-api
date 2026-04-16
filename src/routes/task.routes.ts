import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth-middleware';

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(authMiddleware);

taskRoutes.post('/', taskController.create.bind(taskController));
taskRoutes.get('/', taskController.findAll.bind(taskController));
taskRoutes.get('/:id', taskController.findById.bind(taskController));
taskRoutes.put('/:id', taskController.update.bind(taskController));
taskRoutes.delete('/:id', taskController.delete.bind(taskController));

export { taskRoutes };