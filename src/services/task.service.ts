import { TaskRepository } from '../database/task.repository';
import { CreateTaskDTO, UpdateTaskDTO, TaskResponseDTO, TaskFiltersDTO } from '../dtos/task.dto';
import { HTTPError } from '../utils/http.error';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async create(userId: string, data: CreateTaskDTO): Promise<TaskResponseDTO> {
        if (!data.title || data.title.trim() === '') {
            throw new HTTPError(400, 'Título é obrigatório', [
                {
                    type: 'required',
                    field: 'title',
                    description: 'O título da tarefa é obrigatório',
                    location: 'body',
                },
            ]);
        }

        const task = await this.taskRepository.create(userId, {
            title: data.title,
            description: data.description,
        });

        return task.toJSON();
    }

    async findAll(userId: string, filters?: TaskFiltersDTO): Promise<TaskResponseDTO[]> {
        const repoFilters = filters
            ? { status: filters.status, search: filters.search }
            : undefined;

        const tasks = await this.taskRepository.findAll(userId, repoFilters);

        return tasks.map(task => task.toJSON());
    }

    async findById(id: string, userId: string): Promise<TaskResponseDTO> {
        const task = await this.taskRepository.findByIdAndUserId(id, userId);

        if (!task) {
            throw new HTTPError(404, 'Tarefa não encontrada', [
                {
                    type: 'not_found',
                    field: 'id',
                    description: 'Tarefa não encontrada ou não pertence ao usuário',
                    location: 'params',
                },
            ]);
        }

        return task.toJSON();
    }

    async update(id: string, userId: string, data: UpdateTaskDTO): Promise<TaskResponseDTO> {
        const existingTask = await this.taskRepository.findByIdAndUserId(id, userId);

        if (!existingTask) {
            throw new HTTPError(404, 'Tarefa não encontrada', [
                {
                    type: 'not_found',
                    field: 'id',
                    description: 'Tarefa não encontrada ou não pertence ao usuário',
                    location: 'params',
                },
            ]);
        }

        if (data.title !== undefined && data.title.trim() === '') {
            throw new HTTPError(400, 'Título não pode ser vazio', [
                {
                    type: 'invalid',
                    field: 'title',
                    description: 'O título da tarefa não pode ser vazio',
                    location: 'body',
                },
            ]);
        }

        const updatedTask = await this.taskRepository.update(id, userId, {
            title: data.title,
            description: data.description,
            status: data.status,
        });

        return updatedTask.toJSON();
    }

    async delete(id: string, userId: string): Promise<void> {
        const existingTask = await this.taskRepository.findByIdAndUserId(id, userId);

        if (!existingTask) {
            throw new HTTPError(404, 'Tarefa não encontrada', [
                {
                    type: 'not_found',
                    field: 'id',
                    description: 'Tarefa não encontrada ou não pertence ao usuário',
                    location: 'params',
                },
            ]);
        }

        await this.taskRepository.delete(id, userId);
    }
}
