import { envs } from '../envs';

export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API To-Do List',
            version: '1.0.0',
            description: 'API para gerenciamento de tarefas com autenticação JWT',
        },
        servers: [
            {
                url: `http://localhost:${envs.PORT}/api`,
                description: 'Servidor de Desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // User schemas
                CreateUserDTO: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'João Silva' },
                        email: { type: 'string', format: 'email', example: 'joao@email.com' },
                        password: { type: 'string', format: 'password', example: '123456' },
                    },
                },
                UserResponseDTO: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'cl123456' },
                        name: { type: 'string', example: 'João Silva' },
                        email: { type: 'string', format: 'email', example: 'joao@email.com' },
                        createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                    },
                },
                // Auth schemas
                LoginDTO: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'joao@email.com' },
                        password: { type: 'string', format: 'password', example: '123456' },
                    },
                },
                LoginResponseDTO: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: 'cl123456' },
                                name: { type: 'string', example: 'João Silva' },
                                email: { type: 'string', format: 'email', example: 'joao@email.com' },
                                createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                                updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                            },
                        },
                    },
                },
                // Task schemas
                CreateTaskDTO: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: { type: 'string', example: 'Estudar TypeScript' },
                        description: { type: 'string', example: 'Revisar conceitos de types e interfaces' },
                    },
                },
                UpdateTaskDTO: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', example: 'Estudar TypeScript Avançado' },
                        description: { type: 'string', example: 'Revisar conceitos avançados de TypeScript' },
                        status: {
                            type: 'string',
                            enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'],
                            example: 'EM_ANDAMENTO',
                        },
                    },
                },
                TaskResponseDTO: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'cl123456' },
                        title: { type: 'string', example: 'Estudar TypeScript' },
                        description: { type: 'string', example: 'Revisar conceitos de types e interfaces' },
                        status: {
                            type: 'string',
                            enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'],
                            example: 'PENDENTE',
                        },
                        userId: { type: 'string', example: 'cl123456' },
                        createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                    },
                },
                // Standard Response (padrão dos controllers)
                StandardResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operação realizada com sucesso' },
                        data: { type: 'object' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Mensagem de erro' },
                        details: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    field: { type: 'string' },
                                    description: { type: 'string' },
                                    location: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
        tags: [
            { name: 'Users', description: 'Rotas de usuários' },
            { name: 'Auth', description: 'Rotas de autenticação' },
            { name: 'Tasks', description: 'Rotas de tarefas (protegidas)' },
        ],
        paths: {
            // Users
            '/users': {
                post: {
                    tags: ['Users'],
                    summary: 'Criar novo usuário',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreateUserDTO' },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Usuário criado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Usuário criado com sucesso' },
                                            data: { $ref: '#/components/schemas/UserResponseDTO' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                        409: {
                            description: 'Email já cadastrado',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
            // Auth
            '/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Realizar login',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginDTO' },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Login realizado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Login realizado com sucesso' },
                                            data: { $ref: '#/components/schemas/LoginResponseDTO' },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: 'Credenciais inválidas',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
            // Tasks
            '/tasks': {
                get: {
                    tags: ['Tasks'],
                    summary: 'Listar tarefas do usuário',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'status',
                            in: 'query',
                            description: 'Filtrar por status',
                            schema: { type: 'string', enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'] },
                        },
                        {
                            name: 'search',
                            in: 'query',
                            description: 'Buscar por título ou descrição',
                            schema: { type: 'string' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Lista de tarefas',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Tarefas listadas com sucesso' },
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/TaskResponseDTO' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: 'Não autenticado',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
                post: {
                    tags: ['Tasks'],
                    summary: 'Criar nova tarefa',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreateTaskDTO' },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Tarefa criada com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Tarefa criada com sucesso' },
                                            data: { $ref: '#/components/schemas/TaskResponseDTO' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                        401: {
                            description: 'Não autenticado',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
            '/tasks/{id}': {
                get: {
                    tags: ['Tasks'],
                    summary: 'Buscar tarefa por ID',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID da tarefa',
                            schema: { type: 'string' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Tarefa encontrada',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Tarefa encontrada com sucesso' },
                                            data: { $ref: '#/components/schemas/TaskResponseDTO' },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: 'Não autenticado',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                        404: {
                            description: 'Tarefa não encontrada',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
                put: {
                    tags: ['Tasks'],
                    summary: 'Atualizar tarefa',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID da tarefa',
                            schema: { type: 'string' },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UpdateTaskDTO' },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Tarefa atualizada com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Tarefa atualizada com sucesso' },
                                            data: { $ref: '#/components/schemas/TaskResponseDTO' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                        401: {
                            description: 'Não autenticado',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                        404: {
                            description: 'Tarefa não encontrada',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
                delete: {
                    tags: ['Tasks'],
                    summary: 'Remover tarefa',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID da tarefa',
                            schema: { type: 'string' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Tarefa removida com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Tarefa removida com sucesso' },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: 'Não autenticado',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                        404: {
                            description: 'Tarefa não encontrada',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
        },
    },
    apis: [],
};
