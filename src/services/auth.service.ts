import { UserRepository } from '../database/user.repository';
import { LoginDTO, LoginResponseDTO } from '../dtos/login.dto';
import { BcryptUtil } from '../utils/bcrypt';
import { JwtUtil } from '../utils/jwt';
import { HTTPError } from '../utils/http.error';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async login(data: LoginDTO): Promise<LoginResponseDTO> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            throw new HTTPError(401, 'Credenciais inválidas');
        }

        const passwordMatch = await BcryptUtil.compare(data.password, user.getPassword());

        if (!passwordMatch) {
            throw new HTTPError(401, 'Credenciais inválidas');
        }

        const token = JwtUtil.generateToken({
            userId: user.getId(),
            email: user.getEmail(),
        });

        const userJson = user.toJSON();
        const { password, ...userWithoutPassword } = userJson;

        return {
            token,
            user: userWithoutPassword,
        };
    }
}
