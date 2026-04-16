import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { onError } from '../utils';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos os campos são obrigatórios',
                });
            }

            const user = await this.userService.create({ name, email, password });

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
