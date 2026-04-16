import { Task, TaskDto } from './task.model';

export interface UserDto {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private createdAt: Date = new Date(),
        private updatedAt: Date = new Date(),
        private tasks?: Task[]
    ) { }

    public withTasks(tasks: Task[]) {
        this.tasks = tasks;
        return this;
    }

    public toJSON(): UserDto {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    public toJSONWithTasks(): UserDto & { tasks?: TaskDto[] } {
        return {
            ...this.toJSON(),
            tasks: this.tasks?.map(task => task.toJSON()),
        };
    }

    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getEmail(): string { return this.email; }
    public getPassword(): string { return this.password; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getUpdatedAt(): Date { return this.updatedAt; }
    public getTasks(): Task[] | undefined { return this.tasks; }
}
