import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../config/swagger.config';

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
