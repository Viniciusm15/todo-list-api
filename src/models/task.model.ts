import { TaskStatus } from "../enums/task-status.enum";

export interface TaskDto {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Task {
    constructor(
        private id: string,
        private title: string,
        private userId: string,
        private status: TaskStatus = TaskStatus.PENDENTE,
        private description: string | null = null,
        private createdAt: Date = new Date(),
        private updatedAt: Date = new Date(),
    ) { }

    public toJSON(): TaskDto {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            userId: this.userId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    public getId(): string { return this.id; }
    public getTitle(): string { return this.title; }
    public getDescription(): string | null { return this.description; }
    public getStatus(): TaskStatus { return this.status; }
    public getUserId(): string { return this.userId; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getUpdatedAt(): Date { return this.updatedAt; }
}
