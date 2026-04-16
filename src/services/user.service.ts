import { UserRepository } from '../database/user.repository';
import { CreateUserDTO, UserResponseDTO } from '../dtos/user.dto';
import { BcryptUtil } from '../utils/bcrypt';
import { HTTPError } from '../utils/http.error';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data: CreateUserDTO): Promise<UserResponseDTO> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new HTTPError(409, 'Email já cadastrado', [
                {
                    type: 'duplicate',
                    field: 'email',
                    description: 'Este email já está em uso',
                    location: 'body',
                },
            ]);
        }

        const hashedPassword = await BcryptUtil.hash(data.password);

        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });

        const userJson = user.toJSON();
        const { password, ...userWithoutPassword } = userJson;

        return userWithoutPassword as UserResponseDTO;
    }
}
