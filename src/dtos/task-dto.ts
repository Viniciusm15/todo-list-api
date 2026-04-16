import { TaskDto } from "../models";
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

export type TaskResponseDTO = TaskDto;

export interface TaskFiltersDTO {
    status?: TaskStatus;
    search?: string;
}

export interface FindTaskDTO {
    taskId: string;
}
