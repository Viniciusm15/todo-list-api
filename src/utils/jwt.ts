import jwt from 'jsonwebtoken';
import { envs } from '../envs';

export interface TokenPayload {
    userId: string;
    email: string;
}

export class JwtUtil {
    static generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, envs.JWT_SECRET, {
            expiresIn: '24h',
        });
    }

    static verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, envs.JWT_SECRET) as TokenPayload;
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }
}
