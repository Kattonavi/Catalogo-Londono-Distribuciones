# Modelo de Base de Datos — Catálogo Londoño Distribuciones

> Propuesta de esquema relacional para PostgreSQL. Define tablas, campos sugeridos, tipos y relaciones. Es una guía de diseño; la implementación final se versiona con Flyway.

---

## 1. Visión general

Tablas principales:

- **users** — administradores del sistema.
- **brands** — marcas que maneja la distribuidora.
- **categories** — categorías de productos.
- **products** — productos del catálogo.
- **product_events** — eventos de interacción (vistas, clicks a WhatsApp).

```
brands (1) ───────< (N) products >─────── (N) ... (1) categories
                          │
                          │ (1)
                          ▼
                       (N) product_events

users  (independiente — autenticación admin)
```

Convenciones:
- Claves primarias `BIGSERIAL` (o `UUID` si se prefiere; aquí se propone `BIGSERIAL` por simplicidad).
- Timestamps `created_at` / `updated_at` en todas las tablas de dominio.
- Slugs únicos para URLs legibles.
- Precios como `NUMERIC(12,2)` para evitar errores de punto flotante.
- Borrado: se evalúa borrado físico vs. lógico. Para productos se recomienda usar el flag `visible` para ocultar y borrado físico real solo desde el admin; marcas/categorías con productos asociados **no** se pueden borrar (FK con `ON DELETE RESTRICT`).

---

## 2. Tabla `users`

Administradores que acceden al panel.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `BIGSERIAL` | PK | Identificador |
| `username` | `VARCHAR(50)` | NOT NULL, UNIQUE | Usuario de login |
| `email` | `VARCHAR(150)` | UNIQUE, NULL | Email (opcional) |
| `password_hash` | `VARCHAR(255)` | NOT NULL | Contraseña hasheada (BCrypt) |
| `full_name` | `VARCHAR(150)` | NULL | Nombre del administrador |
| `role` | `VARCHAR(30)` | NOT NULL, DEFAULT `'ADMIN'` | Rol (preparado para crecer) |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Permite desactivar cuentas |
| `refresh_token` | `VARCHAR(500)` | NULL | Refresh token vigente (o tabla aparte) |
| `refresh_token_expires_at` | `TIMESTAMP` | NULL | Expiración del refresh token |
| `last_login_at` | `TIMESTAMP` | NULL | Último inicio de sesión |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Creación |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Última actualización |

**Notas:**
- En el alcance inicial habrá uno o pocos usuarios `ADMIN` (seed inicial).
- El refresh token puede modelarse en una tabla `refresh_tokens` separada si se quiere soportar múltiples sesiones/dispositivos. Para el alcance inicial, basta un campo en `users`.

---

## 3. Tabla `brands`

Marcas de los productos.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `BIGSERIAL` | PK | Identificador |
| `name` | `VARCHAR(120)` | NOT NULL, UNIQUE | Nombre de la marca |
| `slug` | `VARCHAR(140)` | NOT NULL, UNIQUE | Slug para URL |
| `description` | `TEXT` | NULL | Descripción opcional |
| `logo_url` | `VARCHAR(500)` | NULL | URL del logo (Cloudinary) |
| `logo_public_id` | `VARCHAR(255)` | NULL | public_id del logo en Cloudinary |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Marca visible/activa |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Creación |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Actualización |

**Relación:** `brands (1) ──< (N) products`.

---

## 4. Tabla `categories`

Categorías de los productos.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `BIGSERIAL` | PK | Identificador |
| `name` | `VARCHAR(120)` | NOT NULL, UNIQUE | Nombre de la categoría |
| `slug` | `VARCHAR(140)` | NOT NULL, UNIQUE | Slug para URL |
| `description` | `TEXT` | NULL | Descripción opcional |
| `image_url` | `VARCHAR(500)` | NULL | Imagen representativa (opcional) |
| `image_public_id` | `VARCHAR(255)` | NULL | public_id en Cloudinary (opcional) |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Categoría visible/activa |
| `sort_order` | `INTEGER` | NOT NULL, DEFAULT `0` | Orden de presentación |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Creación |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Actualización |

**Relación:** `categories (1) ──< (N) products`.

---

## 5. Tabla `products`

Núcleo del catálogo.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `BIGSERIAL` | PK | Identificador |
| `name` | `VARCHAR(180)` | NOT NULL | Nombre del producto |
| `slug` | `VARCHAR(200)` | NOT NULL, UNIQUE | Slug para URL |
| `description` | `TEXT` | NULL | Descripción / detalles |
| `brand_id` | `BIGINT` | NOT NULL, FK → `brands(id)` | Marca |
| `category_id` | `BIGINT` | NOT NULL, FK → `categories(id)` | Categoría |
| `current_price` | `NUMERIC(12,2)` | NOT NULL, CHECK ≥ 0 | Precio actual |
| `previous_price` | `NUMERIC(12,2)` | NULL, CHECK ≥ 0 | Precio anterior (para descuento) |
| `discount_percentage` | `INTEGER` | NULL | (Derivado) % de descuento, ver nota |
| `currency` | `VARCHAR(3)` | NOT NULL, DEFAULT `'COP'` | Moneda |
| `image_url` | `VARCHAR(500)` | NULL | URL imagen principal (Cloudinary) |
| `image_public_id` | `VARCHAR(255)` | NULL | public_id en Cloudinary |
| `is_new` | `BOOLEAN` | NOT NULL, DEFAULT `false` | Badge "nuevo" |
| `is_featured` | `BOOLEAN` | NOT NULL, DEFAULT `false` | Badge "destacado" |
| `is_on_promotion` | `BOOLEAN` | NOT NULL, DEFAULT `false` | Badge "promoción" |
| `is_visible` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Visible en el sitio público |
| `view_count` | `BIGINT` | NOT NULL, DEFAULT `0` | Contador de vistas (denormalizado) |
| `whatsapp_click_count` | `BIGINT` | NOT NULL, DEFAULT `0` | Contador de clicks a WhatsApp (denormalizado) |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Creación |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Actualización |

**Notas sobre el descuento:**
- `discount_percentage` se considera **derivado** de `current_price` y `previous_price`:
  `discount = round((previous_price - current_price) / previous_price * 100)` cuando `previous_price > current_price`.
- Opciones de implementación:
  1. **No almacenarlo** y calcularlo siempre en el backend al exponer el producto (más simple, fuente única de verdad). **Recomendado.**
  2. Almacenarlo (columna mostrada) y recalcularlo en cada save vía lógica del backend (útil para ordenar/filtrar por descuento en SQL).
- Si no se almacena, se elimina la columna `discount_percentage` y se expone solo en la respuesta de la API.

**Notas sobre contadores:**
- `view_count` y `whatsapp_click_count` son denormalizaciones para que el dashboard sea rápido. La fuente de verdad detallada está en `product_events`. Se actualizan al registrar cada evento.

**Índices recomendados:**
- `idx_products_brand_id` (`brand_id`)
- `idx_products_category_id` (`category_id`)
- `idx_products_is_visible` (`is_visible`)
- `idx_products_is_on_promotion` (`is_on_promotion`)
- `idx_products_is_featured` (`is_featured`)
- `idx_products_is_new` (`is_new`)
- `idx_products_slug` (`slug`, UNIQUE)
- Índice de texto para búsqueda por `name` (ej. `GIN` con `pg_trgm` o índice simple, según necesidad).

**Relaciones:**
- `products.brand_id` → `brands.id` (`ON DELETE RESTRICT`).
- `products.category_id` → `categories.id` (`ON DELETE RESTRICT`).

---

## 6. Tabla `product_events`

Registro de interacciones para métricas.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `BIGSERIAL` | PK | Identificador |
| `product_id` | `BIGINT` | NOT NULL, FK → `products(id)` | Producto relacionado |
| `event_type` | `VARCHAR(30)` | NOT NULL | `VIEW` o `WHATSAPP_CLICK` |
| `occurred_at` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Momento del evento |
| `ip_hash` | `VARCHAR(64)` | NULL | Hash de IP (anti-abuso / dedupe, opcional) |
| `user_agent` | `VARCHAR(300)` | NULL | Agente del navegador (opcional) |
| `referrer` | `VARCHAR(300)` | NULL | Origen de la visita (opcional) |

**Notas:**
- `event_type` se modela como `VARCHAR` con valores controlados (`VIEW`, `WHATSAPP_CLICK`). Puede usarse un `CHECK` o un enum a nivel de aplicación.
- Para evitar inflar métricas, se puede deduplicar por `ip_hash` + ventana de tiempo (opcional, fase posterior).
- Esta tabla puede crecer mucho; se recomienda índice por `product_id` y por `occurred_at`.
- Las métricas del dashboard se calculan agregando esta tabla y/o leyendo los contadores denormalizados de `products`.

**Relación:** `products (1) ──< (N) product_events` (`ON DELETE CASCADE`: al borrar un producto se borran sus eventos).

**Índices recomendados:**
- `idx_product_events_product_id` (`product_id`)
- `idx_product_events_type` (`event_type`)
- `idx_product_events_occurred_at` (`occurred_at`)

---

## 7. Resumen de relaciones

| Relación | Cardinalidad | Regla de borrado |
|----------|--------------|------------------|
| `brands` → `products` | 1 : N | RESTRICT (no borrar marca con productos) |
| `categories` → `products` | 1 : N | RESTRICT (no borrar categoría con productos) |
| `products` → `product_events` | 1 : N | CASCADE (borrar eventos con el producto) |
| `users` | — | Independiente (autenticación) |

---

## 8. Consideraciones futuras (no implementar ahora)

> Solo como previsión de diseño; **fuera del alcance inicial**. No se implementan hasta que se decidan explícitamente.

- **Múltiples imágenes por producto**: tabla `product_images` (product_id, url, public_id, sort_order, is_primary).
- **Tabla `refresh_tokens`** separada para multi-sesión.
- **Auditoría** (`created_by`, `updated_by`) referenciando `users`.
- **Borrado lógico** (`deleted_at`) si se necesita papelera.
- **Etiquetas/atributos** flexibles por producto.

Estas extensiones se diseñan para añadirse sin romper el esquema base.
