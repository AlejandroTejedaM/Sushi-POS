-- ============================================================
--  users_db — Servicio NestJS
-- ============================================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'WAITER', 'KITCHEN');

CREATE TABLE users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          user_role    NOT NULL DEFAULT 'WAITER',
    active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token   ON refresh_tokens(token);

-- Seed: usuario admin inicial
-- Contraseña: admin123 (hash generado con bcrypt, cámbialo en producción)
INSERT INTO users (full_name, email, password_hash, role) VALUES
    ('Administrador', 'admin@sushipos.com', '$2b$10$placeholderHashCambiarEnProduccion', 'ADMIN');
