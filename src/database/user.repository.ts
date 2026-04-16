import { prisma } from './prisma.repository';
import { CreateUserDTO } from '../dtos/create-user.dto';

export class UserRepository {
    async create(data: CreateUserDTO) {
        const user = await prisma.user.create({
            data,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        return user;
    }

    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }
}
