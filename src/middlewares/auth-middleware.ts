import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ error: 'Token não fornecido' });
            return;
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            res.status(401).json({ error: 'Token mal formatado' });
            return;
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            res.status(401).json({ error: 'Token mal formatado' });
            return;
        }

        const decoded = JwtUtil.verifyToken(token);

        req.userId = decoded.userId;
        req.userEmail = decoded.email;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};
