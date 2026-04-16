import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                res.status(400).json({ error: 'Todos os campos são obrigatórios' });
                return;
            }

            const user = await this.userService.create({ name, email, password });

            res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Email já cadastrado') {
                    res.status(409).json({ error: error.message });
                } else {
                    res.status(400).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }
}
