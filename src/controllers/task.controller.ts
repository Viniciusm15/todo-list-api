import { Response } from 'express';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../middlewares/auth-middleware';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { title, description } = req.body;
            const userId = req.userId!;

            const task = await this.taskService.create(userId, { title, description });

            res.status(201).json(task);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }

    async findAll(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.userId!;
            const { status, search } = req.query;

            const filters: any = {};

            if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
                filters.status = status as TaskStatus;
            }

            if (search && typeof search === 'string') {
                filters.search = search;
            }

            const tasks = await this.taskService.findAll(userId, filters);

            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async findById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const userId = req.userId!;

            const task = await this.taskService.findById(id, userId);

            res.json(task);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Tarefa não encontrada') {
                    res.status(404).json({ error: error.message });
                } else {
                    res.status(400).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }

    async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const { title, description, status } = req.body;
            const userId = req.userId!;

            if (status && !Object.values(TaskStatus).includes(status)) {
                res.status(400).json({ error: 'Status inválido' });
                return;
            }

            const task = await this.taskService.update(id, userId, {
                title,
                description,
                status,
            });

            res.json(task);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Tarefa não encontrada') {
                    res.status(404).json({ error: error.message });
                } else {
                    res.status(400).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const userId = req.userId!;

            await this.taskService.delete(id, userId);

            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Tarefa não encontrada') {
                    res.status(404).json({ error: error.message });
                } else {
                    res.status(400).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }
}
