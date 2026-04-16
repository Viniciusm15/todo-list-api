import { prisma } from './prisma.repository';
import { User } from '../models';

type UserEntity = Awaited<ReturnType<typeof prisma.user.findUnique>>;

export class UserRepository {

    async create(data: { name: string; email: string; password: string }): Promise<User> {
        const newUser = await prisma.user.create({
            data,
        });

        return this.mapToModel(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        const userDB = await prisma.user.findUnique({
            where: { email },
        });

        if (!userDB) return null;

        return this.mapToModel(userDB);
    }

    async findById(id: string): Promise<User | null> {
        const userDB = await prisma.user.findUnique({
            where: { id },
        });

        if (!userDB) return null;

        return this.mapToModel(userDB);
    }

    private mapToModel(entity: NonNullable<UserEntity>): User {
        return new User(
            entity.id,
            entity.name,
            entity.email,
            entity.password,
            entity.createdAt,
            entity.updatedAt,
        );
    }
}
