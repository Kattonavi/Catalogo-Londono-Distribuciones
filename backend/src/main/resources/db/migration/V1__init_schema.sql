-- =====================================================================
-- V1__init_schema.sql
-- Esquema inicial del catalogo Londono Distribuciones.
-- Sigue docs/database-model.md. Notas de reconciliacion:
--   * users: se usa "name" (en lugar de username + full_name) y el login
--     es por "email" (NOT NULL, UNIQUE). Se conservan los campos de refresh
--     token y last_login_at del modelo documentado.
--   * products: NO se almacena discount_percentage (es derivado; opcion
--     recomendada en database-model.md). Se calcula en el backend.
-- =====================================================================

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                       BIGSERIAL    PRIMARY KEY,
    name                     VARCHAR(150) NOT NULL,
    email                    VARCHAR(150) NOT NULL,
    password_hash            VARCHAR(255) NOT NULL,
    role                     VARCHAR(30)  NOT NULL DEFAULT 'ADMIN',
    is_active                BOOLEAN      NOT NULL DEFAULT TRUE,
    refresh_token            VARCHAR(500),
    refresh_token_expires_at TIMESTAMP,
    last_login_at            TIMESTAMP,
    created_at               TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at               TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- ---------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------
CREATE TABLE brands (
    id             BIGSERIAL    PRIMARY KEY,
    name           VARCHAR(120) NOT NULL,
    slug           VARCHAR(140) NOT NULL,
    description    TEXT,
    logo_url       VARCHAR(500),
    logo_public_id VARCHAR(255),
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_brands_name UNIQUE (name),
    CONSTRAINT uq_brands_slug UNIQUE (slug)
);

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    id              BIGSERIAL    PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    slug            VARCHAR(140) NOT NULL,
    description     TEXT,
    image_url       VARCHAR(500),
    image_public_id VARCHAR(255),
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    sort_order      INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_categories_name UNIQUE (name),
    CONSTRAINT uq_categories_slug UNIQUE (slug)
);

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
CREATE TABLE products (
    id                   BIGSERIAL      PRIMARY KEY,
    name                 VARCHAR(180)   NOT NULL,
    slug                 VARCHAR(200)   NOT NULL,
    description          TEXT,
    brand_id             BIGINT         NOT NULL,
    category_id          BIGINT         NOT NULL,
    current_price        NUMERIC(12, 2) NOT NULL,
    previous_price       NUMERIC(12, 2),
    currency             VARCHAR(3)     NOT NULL DEFAULT 'COP',
    image_url            VARCHAR(500),
    image_public_id      VARCHAR(255),
    is_new               BOOLEAN        NOT NULL DEFAULT FALSE,
    is_featured          BOOLEAN        NOT NULL DEFAULT FALSE,
    is_on_promotion      BOOLEAN        NOT NULL DEFAULT FALSE,
    is_visible           BOOLEAN        NOT NULL DEFAULT TRUE,
    view_count           BIGINT         NOT NULL DEFAULT 0,
    whatsapp_click_count BIGINT         NOT NULL DEFAULT 0,
    created_at           TIMESTAMP      NOT NULL DEFAULT now(),
    updated_at           TIMESTAMP      NOT NULL DEFAULT now(),
    CONSTRAINT uq_products_slug          UNIQUE (slug),
    CONSTRAINT chk_products_current_price  CHECK (current_price >= 0),
    CONSTRAINT chk_products_previous_price CHECK (previous_price IS NULL OR previous_price >= 0),
    CONSTRAINT fk_products_brand
        FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE RESTRICT,
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);

CREATE INDEX idx_products_brand_id        ON products (brand_id);
CREATE INDEX idx_products_category_id     ON products (category_id);
CREATE INDEX idx_products_is_visible      ON products (is_visible);
CREATE INDEX idx_products_is_on_promotion ON products (is_on_promotion);
CREATE INDEX idx_products_is_featured     ON products (is_featured);
CREATE INDEX idx_products_is_new          ON products (is_new);

-- ---------------------------------------------------------------------
-- product_events
-- ---------------------------------------------------------------------
CREATE TABLE product_events (
    id          BIGSERIAL    PRIMARY KEY,
    product_id  BIGINT       NOT NULL,
    event_type  VARCHAR(30)  NOT NULL,
    occurred_at TIMESTAMP    NOT NULL DEFAULT now(),
    ip_hash     VARCHAR(64),
    user_agent  VARCHAR(300),
    referrer    VARCHAR(300),
    CONSTRAINT chk_product_events_type CHECK (event_type IN ('VIEW', 'WHATSAPP_CLICK')),
    CONSTRAINT fk_product_events_product
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE INDEX idx_product_events_product_id  ON product_events (product_id);
CREATE INDEX idx_product_events_type        ON product_events (event_type);
CREATE INDEX idx_product_events_occurred_at ON product_events (occurred_at);
