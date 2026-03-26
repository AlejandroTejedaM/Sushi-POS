# users-service

Authentication and user management microservice for Sushi POS.

## Stack

NestJS · TypeScript · PostgreSQL · TypeORM · JWT · bcrypt

## Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | /auth/login | Login, returns access + refresh token | Public |
| POST | /auth/logout | Invalidates refresh token | Public |
| POST | /users | Create user | Public |
| GET | /users/:id | Get user by ID | JWT required |

## Setup
```bash
cp env.example .env
npm install
npm run start:dev
```

## Project Structure
```
src/
├── auth/           # Login, logout, JWT logic
├── users/          # User CRUD and refresh token management
└── common/         # Guards, interceptors, decorators, filters, constants
```
