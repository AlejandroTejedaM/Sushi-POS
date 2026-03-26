# users-service

Authentication and user management microservice for Sushi POS.

## Stack

NestJS · TypeScript · PostgreSQL · TypeORM · JWT · bcrypt

## Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | /auth/login | Login, returns access + refresh token | Public |
| POST | /auth/logout | Invalidates refresh token | JWT required |
| POST | /auth/refresh | Refresh a token | JWT required |
| POST | /users | Create user | Public | (in progress)
| GET | /users/:id | Get user by ID | JWT required | (in progress)

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
├── users/          # User CRUD and refresh token management (in progress)
└── common/         # Guards, interceptors, decorators, filters, constants
```
