-- =====================================================================
-- V2__phase2_catalog_attributes.sql
-- Atributos comerciales de la Fase 2 (CRUD de catalogo).
--   * brands: sort_order (orden de presentacion).
--   * products: atributos comerciales (sabor, presentacion, tipo de envase,
--     descripcion corta), bandera de borrado logico (active) y sort_order.
--   * product_events: se admite el evento PROMOTION_CLICK.
-- Nota: se mantienen los nombres de columnas de la Fase 1 (previous_price,
--   is_on_promotion, etc.); los DTO de la API los exponen como oldPrice/isPromo.
-- =====================================================================

-- ---------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------
ALTER TABLE brands
    ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
ALTER TABLE products
    ADD COLUMN flavor            VARCHAR(120),
    ADD COLUMN presentation      VARCHAR(120),
    ADD COLUMN container_type    VARCHAR(60),
    ADD COLUMN short_description VARCHAR(300),
    ADD COLUMN active            BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN sort_order        INTEGER NOT NULL DEFAULT 0;

CREATE INDEX idx_products_active     ON products (active);
CREATE INDEX idx_products_sort_order ON products (sort_order);

-- ---------------------------------------------------------------------
-- product_events: ampliar los tipos de evento permitidos
-- ---------------------------------------------------------------------
ALTER TABLE product_events
    DROP CONSTRAINT chk_product_events_type;

ALTER TABLE product_events
    ADD CONSTRAINT chk_product_events_type
        CHECK (event_type IN ('VIEW', 'WHATSAPP_CLICK', 'PROMOTION_CLICK'));
