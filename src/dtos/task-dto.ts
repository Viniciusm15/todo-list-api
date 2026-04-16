import { TaskStatus } from "../enums/task-status.enum";

export interface CreateTaskDTO {
    title: string;
    description?: string | null;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
}

export interface TaskResponseDTO {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskFiltersDTO {
    status?: TaskStatus;
    search?: string;
}