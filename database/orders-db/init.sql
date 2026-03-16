-- ============================================================
--  orders_db — Servicio Spring Boot
-- ============================================================

-- ------------------------------------------------------------
--  Catálogos de estado
-- ------------------------------------------------------------

CREATE TABLE session_statuses (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(30) NOT NULL UNIQUE,
    name        VARCHAR(60) NOT NULL,
    description TEXT,
    sort_order  INT         NOT NULL DEFAULT 0,
    active      BOOLEAN     NOT NULL DEFAULT TRUE
);

INSERT INTO session_statuses (code, name, description, sort_order) VALUES
    ('OPEN',   'Abierta', 'Mesa ocupada con clientes',  1),
    ('CLOSED', 'Cerrada', 'Mesa libre, sesión terminada', 2);

CREATE TABLE order_statuses (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(30) NOT NULL UNIQUE,
    name        VARCHAR(60) NOT NULL,
    description TEXT,
    color       VARCHAR(7),  -- hex color para la pantalla de cocina
    sort_order  INT         NOT NULL DEFAULT 0,
    active      BOOLEAN     NOT NULL DEFAULT TRUE
);

INSERT INTO order_statuses (code, name, description, color, sort_order) VALUES
    ('PENDING',     'Pendiente',      'Orden recién creada, esperando cocina', '#6B7280', 1),
    ('IN_PROGRESS', 'En preparación', 'Cocina tomó la orden',                  '#F59E0B', 2),
    ('READY',       'Listo',          'Listo para entregar al mesero',          '#10B981', 3),
    ('DELIVERED',   'Entregado',      'Mesero entregó la orden a la mesa',      '#3B82F6', 4);

-- ------------------------------------------------------------
--  Menú
-- ------------------------------------------------------------

CREATE TABLE categories (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(80) NOT NULL UNIQUE,
    display_order INT         NOT NULL DEFAULT 0,
    active        BOOLEAN     NOT NULL DEFAULT TRUE
);

CREATE TABLE products (
    id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID           NOT NULL REFERENCES categories(id),
    name        VARCHAR(120)   NOT NULL,
    description TEXT,
    price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url   VARCHAR(500),
    is_combo    BOOLEAN        NOT NULL DEFAULT FALSE,
    active      BOOLEAN        NOT NULL DEFAULT TRUE
);

-- Un combo contiene otros productos
-- combo_id   → el producto padre (is_combo = true)
-- product_id → cada hijo que lo compone
CREATE TABLE combo_items (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    combo_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity   INT  NOT NULL DEFAULT 1 CHECK (quantity > 0),
    CONSTRAINT combo_cannot_reference_itself CHECK (combo_id <> product_id)
);

-- Índices menú
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_combo_items_combo_id  ON combo_items(combo_id);

-- ------------------------------------------------------------
--  Mesas y sesiones
-- ------------------------------------------------------------

CREATE TABLE tables (
    id       UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    number   INT     NOT NULL UNIQUE CHECK (number > 0),
    capacity INT     NOT NULL DEFAULT 4 CHECK (capacity > 0),
    active   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE table_sessions (
    id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id  UUID        NOT NULL REFERENCES tables(id),
    waiter_id UUID        NOT NULL,      -- referencia lógica a users.id (otro servicio)
    status_id UUID        NOT NULL REFERENCES session_statuses(id),
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ                -- NULL mientras la sesión está abierta
);

-- Solo puede haber una sesión abierta por mesa a la vez.
-- Índice único parcial: aplica solo cuando el status es OPEN,
-- permitiendo múltiples sesiones cerradas (historial) para la misma mesa.
CREATE UNIQUE INDEX idx_one_open_session_per_table
    ON table_sessions(table_id)
    WHERE status_id = (SELECT id FROM session_statuses WHERE code = 'OPEN');

-- ------------------------------------------------------------
--  Órdenes
-- ------------------------------------------------------------

CREATE TABLE orders (
    id        UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID          NOT NULL REFERENCES table_sessions(id),
    waiter_id UUID           NOT NULL,   -- referencia lógica a users.id
    status_id UUID           NOT NULL REFERENCES order_statuses(id),

    notes     TEXT,

    -- Desglose fiscal (precios con IVA incluido al 16%)
    -- subtotal   = total / 1.16        (base sin IVA)
    -- tax_amount = total - subtotal    (IVA desglosado)
    -- tax_rate se guarda para preservar la tasa vigente al momento de la orden.
    subtotal   NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax_rate   NUMERIC(5, 4)  NOT NULL DEFAULT 0.1600,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total      NUMERIC(10, 2) NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   UUID           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID           NOT NULL REFERENCES products(id),
    quantity   INT            NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),  -- precio al momento de la orden
    subtotal   NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),    -- quantity * unit_price precalculado
    notes      TEXT                                               -- "sin pepino", "extra spicy", etc.
);

-- Índices órdenes
CREATE INDEX idx_orders_session_id       ON orders(session_id);
CREATE INDEX idx_orders_status_id        ON orders(status_id);
CREATE INDEX idx_order_items_order_id    ON order_items(order_id);
CREATE INDEX idx_table_sessions_table_id ON table_sessions(table_id);

-- ------------------------------------------------------------
--  Seed
-- ------------------------------------------------------------

INSERT INTO categories (name, display_order) VALUES
    ('Entradas',  1),
    ('Rollos',    2),
    ('Nigiris',   3),
    ('Sashimi',   4),
    ('Combos',    5),
    ('Bebidas',   6),
    ('Postres',   7);

INSERT INTO tables (number, capacity) VALUES
    (1, 2), (2, 2), (3, 4),
    (4, 4), (5, 4), (6, 6),
    (7, 8), (8, 8);