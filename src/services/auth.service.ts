import { UserRepository } from '../database/user.repository';
import { LoginDTO, LoginResponseDTO } from '../dtos/login.dto';
import { BcryptUtil } from '../utils/bcrypt';
import { JwtUtil } from '../utils/jwt';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async login(data: LoginDTO): Promise<LoginResponseDTO> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        const passwordMatch = await BcryptUtil.compare(data.password, user.password);

        if (!passwordMatch) {
            throw new Error('Credenciais inválidas');
        }

        const token = JwtUtil.generateToken({
            userId: user.id,
            email: user.email,
        });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
}
