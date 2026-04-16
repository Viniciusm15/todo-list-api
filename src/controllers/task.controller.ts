import { Response } from 'express';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../middlewares/auth-middleware';
import { CreateTaskDTO, UpdateTaskDTO, TaskFiltersDTO } from '../dtos/task.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { onError } from '../utils';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    async create(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const taskData: CreateTaskDTO = req.body;
            const userId = req.userId!;

            const task = await this.taskService.create(userId, taskData);

            return res.status(201).json({
                success: true,
                message: 'Tarefa criada com sucesso',
                data: task,
            });
        } catch (error) {
            return onError(error, res);
        }
    }

    async findAll(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const userId = req.userId!;
            const { status, search } = req.query;

            const filters: TaskFiltersDTO = {};

            if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
                filters.status = status as TaskStatus;
            }

            if (search && typeof search === 'string') {
                filters.search = search;
            }

            const tasks = await this.taskService.findAll(userId, filters);

            return res.status(200).json({
                success: true,
                message: 'Tarefas listadas com sucesso',
                data: tasks,
            });
        } catch (error) {
            return onError(error, res);
        }
    }

    async findById(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string;
            const userId = req.userId!;

            const task = await this.taskService.findById(id, userId);

            return res.status(200).json({
                success: true,
                message: 'Tarefa encontrada com sucesso',
                data: task,
            });
        } catch (error) {
            return onError(error, res);
        }
    }

    async update(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string;
            const updateData: UpdateTaskDTO = req.body;
            const userId = req.userId!;

            if (updateData.status && !Object.values(TaskStatus).includes(updateData.status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Status inválido',
                });
            }

            const task = await this.taskService.update(id, userId, updateData);

            return res.status(200).json({
                success: true,
                message: 'Tarefa atualizada com sucesso',
                data: task,
            });
        } catch (error) {
            return onError(error, res);
        }
    }

    async delete(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string;
            const userId = req.userId!;

            await this.taskService.delete(id, userId);

            return res.status(200).json({
                success: true,
                message: 'Tarefa removida com sucesso',
            });
        } catch (error) {
            return onError(error, res);
        }
    }
}
