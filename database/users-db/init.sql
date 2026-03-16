-- ============================================================
--  users_db — Servicio NestJS
-- ============================================================

-- ------------------------------------------------------------
--  Catálogo de roles
-- ------------------------------------------------------------

CREATE TABLE user_roles (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(30) NOT NULL UNIQUE,
    name        VARCHAR(60) NOT NULL,
    description TEXT,
    sort_order  INT         NOT NULL DEFAULT 0,
    active      BOOLEAN     NOT NULL DEFAULT TRUE
);

INSERT INTO user_roles (code, name, description, sort_order) VALUES
    ('ADMIN',   'Administrador', 'Gestiona menú, mesas y usuarios del sistema', 1),
    ('WAITER',  'Mesero',        'Toma y gestiona órdenes de las mesas',        2),
    ('KITCHEN', 'Cocina',        'Ve y actualiza el estado de las órdenes',     3);

-- ------------------------------------------------------------
--  Usuarios
-- ------------------------------------------------------------

CREATE TABLE users (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id       UUID         NOT NULL REFERENCES user_roles(id),
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
CREATE INDEX idx_users_role_id          ON users(role_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token   ON refresh_tokens(token);

-- ------------------------------------------------------------
--  Seed
-- ------------------------------------------------------------

-- Usuario admin inicial
-- Contraseña: admin123 (cámbialo en producción)
INSERT INTO users (full_name, email, password_hash, role_id)
SELECT
    'Administrador',
    'admin@sushipos.com',
    '$2b$10$ZeyYixp.2.cDn/J.obaHUuNIrsMUe8zMKK4/j/9ULOT5.l8.aQ9eq',
    id
FROM user_roles
WHERE code = 'ADMIN';