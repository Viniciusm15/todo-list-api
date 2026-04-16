import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from '../envs';

export interface TokenPayload {
    userId: string;
    email: string;
}

export class JwtUtil {
    static generateToken(payload: TokenPayload): string {
        const options: SignOptions = {
            expiresIn: (envs.JWT_EXPIRES_IN ?? '24h') as SignOptions['expiresIn'],
        };
        return jwt.sign(payload, envs.JWT_SECRET, options);
    }

    static verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, envs.JWT_SECRET) as TokenPayload;
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }
}
