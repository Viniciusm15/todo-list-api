import { prisma } from '../database/prisma.repository';
import { CreateTaskDTO, UpdateTaskDTO, TaskFiltersDTO } from '../dtos/task.dto';

export class TaskRepository {
    async create(userId: string, data: CreateTaskDTO) {
        const task = await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                userId,
            },
        });

        return task;
    }

    async findAll(userId: string, filters?: TaskFiltersDTO) {
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

        return tasks;
    }

    async findById(id: string) {
        const task = await prisma.task.findUnique({
            where: { id },
        });

        return task;
    }

    async findByIdAndUserId(id: string, userId: string) {
        const task = await prisma.task.findFirst({
            where: {
                id,
                userId,
            },
        });

        return task;
    }

    async update(id: string, data: UpdateTaskDTO) {
        const task = await prisma.task.update({
            where: { id },
            data,
        });

        return task;
    }

    async delete(id: string) {
        await prisma.task.delete({
            where: { id },
        });
    }
}
