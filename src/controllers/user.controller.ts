import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dtos/user.dto';
import { onError } from '../utils';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const userData: CreateUserDTO = req.body;

            if (!userData.name || !userData.email || !userData.password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos os campos são obrigatórios',
                });
            }

            const user = await this.userService.create(userData);

            return res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                data: user,
            });
        } catch (error) {
            return onError(error, res);
        }
    }
}
