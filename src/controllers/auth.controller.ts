import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: 'Email e senha são obrigatórios' });
                return;
            }

            const result = await this.authService.login({ email, password });

            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Credenciais inválidas') {
                    res.status(401).json({ error: error.message });
                } else {
                    res.status(400).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }
}
