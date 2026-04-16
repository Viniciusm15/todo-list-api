import { UserRepository } from '../database/user.repository';
import { CreateUserDTO, UserResponseDTO } from '../dtos/create-user.dto';
import { BcryptUtil } from '../utils/bcrypt';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data: CreateUserDTO): Promise<UserResponseDTO> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        const hashedPassword = await BcryptUtil.hash(data.password);

        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });

        return user;
    }
}
