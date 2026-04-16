import { prisma } from './prisma.repository';
import { TaskStatus } from '../enums/task-status.enum';
import { Task } from '../models';

type TaskEntity = Awaited<ReturnType<typeof prisma.task.findUnique>>;

export class TaskRepository {

    async create(userId: string, data: { title: string; description?: string | null }): Promise<Task> {
        const newTask = await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                userId,
            },
        });

        return this.mapToModel(newTask);
    }

    async findAll(userId: string, filters?: { status?: TaskStatus; search?: string }): Promise<Task[]> {
        const where: any = { userId };

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return tasks.map(task => this.mapToModel(task));
    }

    async findById(id: string): Promise<Task | null> {
        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) return null;

        return this.mapToModel(task);
    }

    async findByIdAndUserId(id: string, userId: string): Promise<Task | null> {
        const task = await prisma.task.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!task) return null;

        return this.mapToModel(task);
    }

    async update(id: string, data: { title?: string; description?: string | null; status?: TaskStatus }): Promise<Task> {
        const updatedTask = await prisma.task.update({
            where: { id },
            data,
        });

        return this.mapToModel(updatedTask);
    }

    async delete(id: string): Promise<Task> {
        const deletedTask = await prisma.task.delete({
            where: { id },
        });

        return this.mapToModel(deletedTask);
    }

    private mapToModel(entity: NonNullable<TaskEntity>): Task {
        return new Task(
            entity.id,
            entity.title,
            entity.userId,
            entity.status as TaskStatus,
            entity.description,
            entity.createdAt,
            entity.updatedAt,
        );
    }
}
