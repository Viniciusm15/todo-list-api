import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dtos/login.dto';
import { onError } from '../utils';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const loginData: LoginDTO = req.body;

            if (!loginData.email || !loginData.password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email e senha são obrigatórios',
                });
            }

            const result = await this.authService.login(loginData);

            return res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso',
                data: result,
            });
        } catch (error) {
            return onError(error, res);
        }
    }
}
