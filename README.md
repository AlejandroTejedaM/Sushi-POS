# Sushi POS

Sistema de punto de venta para restaurante de sushi.  
Arquitectura de microservicios con NestJS y Spring Boot.

## Estructura del proyecto

```
sushi-pos/
├── docker-compose.yml
├── database/
│   ├── users-db/
│   │   └── init.sql        - esquema y seed de users_db
│   └── orders-db/
│       └── init.sql        - esquema y seed de orders_db
└── services/
    ├── users-service/      - NestJS (autenticación y usuarios)
    └── orders-service/     - Spring Boot (órdenes, menú, mesas)
```

## Requisitos

- Docker Desktop instalado y corriendo

## Levantar el entorno de desarrollo

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd sushi-pos

# 2. Levantar las bases de datos
docker-compose up -d

# 3. Verificar que están corriendo
docker-compose ps
```

Las bases de datos quedan disponibles en:
- `users_db`  → localhost:5432
- `orders_db` → localhost:5433

El `init.sql` de cada base de datos se ejecuta automáticamente
la primera vez que se levanta el volumen.