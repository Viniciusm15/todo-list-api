# 📝 API To-Do List com Autenticação JWT

API REST para gerenciamento de tarefas com cadastro e autenticação de usuários. Cada usuário gerencia exclusivamente suas próprias tarefas, com segurança garantida por JWT e senhas protegidas com bcrypt.

---

## 🚀 Tecnologias utilizadas

| Tecnologia | Descrição |
|---|---|
| Node.js + TypeScript | Runtime e linguagem |
| Express | Framework HTTP |
| Prisma ORM | Acesso ao banco de dados |
| PostgreSQL | Banco de dados relacional |
| JWT (jsonwebtoken) | Autenticação e autorização |
| bcryptjs | Hash de senhas |
| express-validator | Validação de dados de entrada |
| Swagger (swagger-ui-express) | Documentação interativa da API |
| Docker + Docker Compose | Containerização |

---

## 🏗️ Arquitetura e Design Patterns

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

```
src/
 ┣ config/          # Configurações (Swagger)
 ┣ controllers/     # Recebem requisições, delegam para services
 ┣ database/        # Repository Pattern — acesso ao banco via Prisma
 ┣ docs/            # Definições Swagger
 ┣ dtos/            # Data Transfer Objects — contratos de entrada/saída
 ┣ enums/           # Enumerações (ex: TaskStatus)
 ┣ envs/            # Carregamento e validação de variáveis de ambiente
 ┣ middlewares/     # Auth JWT, validação de dados
 ┣ models/          # Entidades de domínio (User, Task)
 ┣ routes/          # Definição das rotas Express
 ┣ services/        # Service Layer — regras de negócio
 ┣ utils/           # Utilitários (bcrypt, jwt, error handling)
 ┣ app.ts           # Configuração do Express
 ┗ server.ts        # Inicialização do servidor
```

**Patterns utilizados:**
- **Repository Pattern** — `UserRepository` e `TaskRepository` abstraem o acesso ao Prisma
- **Service Layer** — regras de negócio isoladas dos controllers
- **Middleware Pattern** — autenticação JWT e validação de entrada como middlewares reutilizáveis

---

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
# Porta da aplicação
PORT=3030

# Banco de dados (Docker)
DATABASE_URL="postgresql://admin:senha123@db:5432/meu_banco?schema=public"
POSTGRES_USER=admin
POSTGRES_PASSWORD=senha123
POSTGRES_DB=meu_banco

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=24h
```

> ⚠️ **Nunca** commite o arquivo `.env` real. Use `.env.example` como referência.

---

## 🐳 Instalação e execução

### Com Docker (recomendado)

Pré-requisitos: [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

```bash
# 1. Clone o repositório
git clone https://github.com/Viniciusm15/todo-list-api.git
cd todo-list-api

# 2. Copie o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Suba os containers (API + banco de dados)
docker compose up --build

# 4. Em outro terminal, execute as migrations
docker compose exec app npx prisma migrate dev

# 5. (Opcional) Em outro terminal, abra o Prisma Studio para visualizar o banco 
docker compose exec app npx prisma studio
```

A API estará disponível em `http://localhost:3030`.

O Prisma Studio (interface gráfica do banco de dados) pode ser acessado em `http://localhost:5555`

---

### Sem Docker (local)

Pré-requisitos: Node.js 18+, PostgreSQL rodando localmente

```bash
# 1. Clone o repositório
git clone https://github.com/Viniciusm15/todo-list-api.git
cd todo-list-api

# 2. Copie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env e ajuste a DATABASE_URL para apontar para o seu PostgreSQL local:
# DATABASE_URL="postgresql://localhost:5432/meu_banco?schema=public"

# 3. Instale as dependências
npm install

# 4. Execute as migrations
npx prisma migrate dev

# 5. Inicie o servidor
npm run dev
```

---

## 📚 Documentação interativa (Swagger)

Com a aplicação rodando, acesse:

```
http://localhost:3030
```

Todas as rotas estão documentadas com exemplos de request, response e esquemas de erro.

---

## 🔐 Autenticação

A API utiliza **JWT Bearer Token**. O fluxo é:

1. Cadastre um usuário via `POST /users`
2. Faça login via `POST /auth/login` — você receberá um `token`
3. Inclua o token no header de todas as requisições de tarefas:

```
Authorization: Bearer <seu_token>
```

O token expira em **24 horas**.

---

## 📋 Rotas da API

### Usuários

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/users` | Cadastrar novo usuário | ❌ |

**Exemplo de requisição:**
```json
POST /users
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "clxyz123",
    "name": "Maria Silva",
    "email": "maria@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Autenticação

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/login` | Realizar login | ❌ |

**Exemplo de requisição:**
```json
POST /auth/login
{
  "email": "maria@email.com",
  "password": "123456"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clxyz123",
      "name": "Maria Silva",
      "email": "maria@email.com"
    }
  }
}
```

---

### Tarefas

> ⚠️ Todas as rotas abaixo exigem o header `Authorization: Bearer <token>`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/tasks` | Criar nova tarefa |
| GET | `/tasks` | Listar tarefas do usuário autenticado |
| GET | `/tasks/:id` | Buscar tarefa por ID |
| PUT | `/tasks/:id` | Atualizar tarefa |
| DELETE | `/tasks/:id` | Remover tarefa |

**Criar tarefa — `POST /tasks`:**
```json
{
  "title": "Estudar TypeScript",
  "description": "Revisar tipos e interfaces"
}
```

**Listar tarefas com filtros — `GET /tasks`:**

Parâmetros de query opcionais:
- `status` — filtra por status: `PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA`
- `search` — busca por título ou descrição (case-insensitive)

```
GET /tasks?status=PENDENTE&search=typescript
```

**Atualizar tarefa — `PUT /tasks/:id`:**
```json
{
  "title": "Estudar TypeScript Avançado",
  "status": "EM_ANDAMENTO"
}
```

**Resposta padrão de tarefa:**
```json
{
  "success": true,
  "message": "Tarefa encontrada com sucesso",
  "data": {
    "id": "clxyz456",
    "title": "Estudar TypeScript",
    "description": "Revisar tipos e interfaces",
    "status": "PENDENTE",
    "userId": "clxyz123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## ❌ Respostas de erro

Todos os erros seguem o mesmo formato:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "details": [
    {
      "type": "required",
      "field": "title",
      "description": "O título da tarefa é obrigatório",
      "location": "body"
    }
  ]
}
```

| Código | Situação |
|---|---|
| 400 | Dados de entrada inválidos |
| 401 | Não autenticado ou token inválido/expirado |
| 404 | Recurso não encontrado (ou não pertence ao usuário) |
| 409 | Conflito (ex: email já cadastrado) |
| 500 | Erro interno do servidor |
---

## 🔒 Regras de autorização

- Um usuário autenticado **não pode acessar, editar ou excluir tarefas de outro usuário**
- A verificação é feita combinando `id` da tarefa com `userId` do token em todas as operações
- Tentativas de acesso a tarefas de outro usuário retornam `404` (não revela a existência do recurso)

---

## 🔑 Status de tarefas

| Valor | Descrição |
|---|---|
| `PENDENTE` | Tarefa ainda não iniciada (padrão) |
| `EM_ANDAMENTO` | Tarefa em progresso |
| `CONCLUIDA` | Tarefa finalizada |

## 🧪 Testando a API pelo Swagger
 
Com a aplicação rodando, acesse `http://localhost:3030` para abrir a documentação interativa.
 
---
 
### 1. Criar usuário — `POST /users`
 
1. Clique na rota **POST /users** e depois em **Try it out**
2. No campo *Request body*, preencha:
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```
3. Clique em **Execute**
4. Resposta esperada: **201** com os dados do usuário criado
---
 
### 2. Fazer login — `POST /auth/login`
 
1. Clique na rota **POST /auth/login** e depois em **Try it out**
2. No campo *Request body*, preencha com o email e senha cadastrados:
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```
3. Clique em **Execute**
4. Resposta esperada: **200** com o campo `token` no corpo da resposta
5. **Copie o valor do `token`** — ele será necessário para todas as rotas de tarefas
---
 
### 3. Autenticar no Swagger
 
1. Clique no botão **Authorize 🔒** no topo da página
2. No campo *Value*, cole o token no formato:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. Clique em **Authorize** e depois em **Close**
A partir daqui, todas as requisições às rotas de tarefas serão enviadas com o token automaticamente.
 
---
 
### 4. Criar tarefa — `POST /tasks`
 
1. Clique na rota **POST /tasks** e depois em **Try it out**
2. No campo *Request body*, preencha:
```json
{
  "title": "Estudar TypeScript",
  "description": "Revisar conceitos de types e interfaces"
}
```
3. Clique em **Execute**
4. Resposta esperada: **201** com os dados da tarefa criada
5. **Anote o `id`** retornado — será usado nas próximas etapas
---
 
### 5. Listar tarefas — `GET /tasks`
 
1. Clique na rota **GET /tasks** e depois em **Try it out**
2. Os parâmetros de filtro são opcionais:
   - `status`: `PENDENTE`, `EM_ANDAMENTO` ou `CONCLUIDA`
   - `search`: texto para buscar no título ou descrição
3. Clique em **Execute**
4. Resposta esperada: **200** com a lista de tarefas do usuário autenticado
---
 
### 6. Buscar tarefa por ID — `GET /tasks/{id}`
 
1. Clique na rota **GET /tasks/{id}** e depois em **Try it out**
2. Informe o `id` da tarefa criada no passo 4
3. Clique em **Execute**
4. Resposta esperada: **200** com os dados da tarefa
---
 
### 7. Atualizar tarefa — `PUT /tasks/{id}`
 
1. Clique na rota **PUT /tasks/{id}** e depois em **Try it out**
2. Informe o `id` da tarefa e preencha o *Request body* com os campos que deseja alterar:
```json
{
  "title": "Estudar TypeScript Avançado",
  "status": "EM_ANDAMENTO"
}
```
3. Clique em **Execute**
4. Resposta esperada: **200** com os dados atualizados
---
 
### 8. Remover tarefa — `DELETE /tasks/{id}`
 
1. Clique na rota **DELETE /tasks/{id}** e depois em **Try it out**
2. Informe o `id` da tarefa
3. Clique em **Execute**
4. Resposta esperada: **200** confirmando a remoção

