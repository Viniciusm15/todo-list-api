import { TaskRepository } from '../database/task.repository';
import { CreateTaskDTO, UpdateTaskDTO, TaskResponseDTO, TaskFiltersDTO } from '../dtos/task-dto';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async create(userId: string, data: CreateTaskDTO): Promise<TaskResponseDTO> {
        if (!data.title || data.title.trim() === '') {
            throw new Error('Título é obrigatório');
        }

        const task = await this.taskRepository.create(userId, data);

        return task as TaskResponseDTO;
    }

    async findAll(userId: string, filters?: TaskFiltersDTO): Promise<TaskResponseDTO[]> {
        const tasks = await this.taskRepository.findAll(userId, filters);
        return tasks as TaskResponseDTO[];
    }

    async findById(id: string, userId: string): Promise<TaskResponseDTO> {
        const task = await this.taskRepository.findByIdAndUserId(id, userId);

        if (!task) {
            throw new Error('Tarefa não encontrada');
        }

        return task as TaskResponseDTO;
    }

    async update(id: string, userId: string, data: UpdateTaskDTO): Promise<TaskResponseDTO> {
        const existingTask = await this.taskRepository.findByIdAndUserId(id, userId);

        if (!existingTask) {
            throw new Error('Tarefa não encontrada');
        }

        if (data.title !== undefined && data.title.trim() === '') {
            throw new Error('Título não pode ser vazio');
        }

        const updatedTask = await this.taskRepository.update(id, data);

        return updatedTask as TaskResponseDTO;
    }

    async delete(id: string, userId: string): Promise<void> {
        const existingTask = await this.taskRepository.findByIdAndUserId(id, userId);

        if (!existingTask) {
            throw new Error('Tarefa não encontrada');
        }

        await this.taskRepository.delete(id);
    }
}
