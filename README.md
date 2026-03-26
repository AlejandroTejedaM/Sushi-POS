# Sushi POS 🍣

A point-of-sale system for a sushi restaurant, built with a microservices architecture.

## Architecture
```
sushi-pos/
├── docker-compose.yml
├── database/
│   ├── users-db/       # Schema and seed for authentication database
│   └── orders-db/      # Schema and seed for orders database
└── services/
    ├── users-service/  # NestJS — authentication & user management
    └── orders-service/ # Spring Boot — orders, menu & tables (in progress)
```

## Tech Stack

| Service | Stack |
|---|---|
| users-service | NestJS · TypeScript · PostgreSQL · TypeORM · JWT |
| orders-service | Spring Boot · Java · PostgreSQL (in progress) |
| Infrastructure | Docker · Docker Compose · PostgreSQL 16 |

## Features (users-service)

- User registration and login
- JWT access token + refresh token rotation
- Secure logout with token invalidation
- Bcrypt password hashing
- Global exception filter with standardized error responses
- Custom decorators, guards, and interceptors

## Getting Started

**Requirements:** Docker Desktop
```bash
# Clone the repository
git clone https://github.com/AlejandroTejedaM/Sushi-POS.git
cd Sushi-POS

# Start the databases
docker-compose up -d

# Verify containers are running
docker-compose ps
```

Databases will be available at:
- `users_db` → localhost:5432
- `orders_db` → localhost:5433

## Author

Alejandro Tejeda Moreno — [LinkedIn](https://www.linkedin.com/in/alejandro-tejeda-moreno-195967268)
