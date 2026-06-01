# Contrato de API — Catálogo Londoño Distribuciones

> Contrato de los endpoints implementados (Fase 1 auth + Fase 2 catálogo). Es la frontera entre frontend y backend. Refleja la implementación actual del backend.

---

## 1. Convenciones generales

- **Base path**: `/api` (evolucionable a `/api/v1`).
- **Formato**: JSON en request y response (excepto subida de imágenes: `multipart/form-data`).
- **Autenticación**: header `Authorization: Bearer <accessToken>` en endpoints protegidos.
- **Roles**: endpoints bajo `/api/admin/**` requieren rol `ADMIN`. Endpoints bajo `/api/public/**` son abiertos (solo lectura). `/api/auth/**` y `/api/health` son públicos.
- **Códigos HTTP**:
  - `200 OK`, `201 Created`, `202 Accepted`, `204 No Content`
  - `400 Bad Request` (validación / referencia inválida), `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` (duplicado o borrado bloqueado), `502 Bad Gateway` (fallo de Cloudinary), `500 Internal Server Error`.
- **Errores** — cuerpo consistente (`ApiError`):
  ```json
  {
    "timestamp": "2026-06-01T10:00:00Z",
    "status": 400,
    "error": "Bad Request",
    "message": "name: must not be blank",
    "path": "/api/admin/products"
  }
  ```
- **Paginación** — parámetros y respuesta:
  - Query: `?page=0&size=12&sort=newest`
  - `sort` admite: `newest` (default), `oldest`, `price_asc`, `price_desc`, `name`. Sin `sort`, el orden es `sortOrder` asc + `createdAt` desc.
  - Respuesta (`PageResponse`):
    ```json
    {
      "content": [ /* items */ ],
      "page": 0,
      "size": 12,
      "totalElements": 120,
      "totalPages": 10,
      "first": true,
      "last": false
    }
    ```

---

## 2. Auth — `/api/auth`

### POST `/api/auth/login`
Inicia sesión. El login es por **email**.
- **Body**:
  ```json
  { "email": "admin@londono.local", "password": "secreto" }
  ```
- **200**:
  ```json
  {
    "accessToken": "jwt...",
    "refreshToken": "token...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": { "id": 1, "name": "Administrador", "email": "admin@londono.local", "role": "ADMIN" }
  }
  ```
  > `expiresIn` es la vida del access token en **segundos**. `refreshToken` es un token opaco con rotación en cada `refresh`.
- **401**: credenciales inválidas.

### POST `/api/auth/refresh`
Renueva el access token.
- **Body**: `{ "refreshToken": "token..." }`
- **200**: misma forma que login (nuevo `accessToken` + `refreshToken` rotado).
- **400/401**: refresh token inválido o expirado.

### POST `/api/auth/logout`
Invalida el refresh token actual.
- **Auth**: requerido.
- **204**: sin contenido.

### GET `/api/auth/me`
Devuelve el usuario autenticado.
- **Auth**: requerido.
- **200**: `{ "id": 1, "name": "Administrador", "email": "admin@londono.local", "role": "ADMIN" }`

---

## 3. Modelo de producto en la API

Campos expuestos por los DTO de producto (el descuento es **derivado**, nunca se recibe):

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | number | |
| `name` | string | obligatorio |
| `slug` | string | autogenerado desde `name` si no se envía; único |
| `brand` | objeto | `{ id, name, slug, logoUrl }` |
| `category` | objeto | `{ id, name, slug }` |
| `flavor` | string | sabor (opcional) |
| `presentation` | string | presentación, ej. "400 ml" (opcional) |
| `containerType` | string | tipo de envase, ej. "Botella" (opcional) |
| `shortDescription` | string | descripción corta (≤ 300) |
| `description` | string | descripción larga |
| `currentPrice` | number | obligatorio, ≥ 0 |
| `oldPrice` | number | opcional; si es > `currentPrice` se muestra descuento |
| `discountPercentage` | number\|null | derivado; `null` si `oldPrice` es null o ≤ `currentPrice` |
| `currency` | string | default `COP` |
| `imageUrl` | string\|null | URL Cloudinary |
| `imagePublicId` | string\|null | solo en respuestas admin |
| `isFeatured` | boolean | destacado |
| `isNew` | boolean | nuevo |
| `isPromo` | boolean | en promoción |
| `isVisible` | boolean | visible en el sitio público |
| `active` | boolean | activo (soft delete usa `false`) |
| `sortOrder` | number | orden de presentación |
| `viewCount` / `whatsappClickCount` | number | solo admin |
| `createdAt` / `updatedAt` | ISO-8601 | solo admin |

> El catálogo público (`ProductCardResponse` / `ProductDetailResponse`) omite `imagePublicId`, contadores y timestamps. El admin (`ProductResponse`) los incluye.

---

## 4. Productos públicos — `/api/public/products`

> Solo devuelven productos con `active = true` **y** `isVisible = true`.

### GET `/api/public/products`
Catálogo paginado con filtros.
- **Query params** (todos opcionales): `search`, `brandSlug`, `categorySlug`, `isFeatured`, `isNew`, `isPromo`, `minPrice`, `maxPrice`, `sort`, `page` (def. 0), `size` (def. 12, máx. 100).
- **200**: `PageResponse` de `ProductCardResponse`.

### GET `/api/public/products/featured`
- **Query**: `limit` (default 12).
- **200**: lista de `ProductCardResponse` (destacados, activos y visibles).

### GET `/api/public/products/new`
- **Query**: `limit` (default 12).
- **200**: lista de `ProductCardResponse` (nuevos).

### GET `/api/public/products/promotions`
- **Query**: `limit` (default 12).
- **200**: lista de `ProductCardResponse` (en promoción).

### GET `/api/public/products/{slug}`
Detalle público por slug.
- **200**: `ProductDetailResponse` (incluye `description`).
- **404**: no existe, o no está activo/visible.

---

## 5. Marcas y categorías públicas

### GET `/api/public/brands`
- **200**: marcas activas (resumen): `[ { "id": 1, "name": "Marca", "slug": "marca", "logoUrl": null } ]`

### GET `/api/public/brands/{slug}`
- **200**: `BrandResponse` (marca activa).
- **404**: no existe o inactiva.

### GET `/api/public/categories`
- **200**: categorías activas (resumen): `[ { "id": 1, "name": "Categoría", "slug": "categoria" } ]`

### GET `/api/public/categories/{slug}`
- **200**: `CategoryResponse` (categoría activa).
- **404**: no existe o inactiva.

---

## 6. Eventos de producto (públicos) — `/api/public/products/{slug}/events`

Registran interacción para métricas. No requieren autenticación. Solo se registran si el producto existe, está **activo y visible**.

- **POST** `/api/public/products/{slug}/events/view` → **202**. Incrementa `view_count`.
- **POST** `/api/public/products/{slug}/events/whatsapp-click` → **202**. Incrementa `whatsapp_click_count`.
- **POST** `/api/public/products/{slug}/events/promotion-click` → **202**. Solo registra el evento.
- **404**: el producto no existe o no está activo/visible.

> Cada evento crea un registro en `product_events`. Los contadores denormalizados alimentan el dashboard.

---

## 7. Productos admin — `/api/admin/products`

> Requieren `Authorization: Bearer` con rol `ADMIN`. Operan sobre todos los productos (visibles/ocultos, activos/inactivos).

### GET `/api/admin/products`
- **Query**: `search`, `brandId`, `categoryId`, `active`, `isVisible`, `isFeatured`, `isNew`, `isPromo`, `sort`, `page` (def. 0), `size` (def. 20, máx. 100).
- **200**: `PageResponse` de `ProductResponse`.

### GET `/api/admin/products/{id}`
- **200**: `ProductResponse`. **404**: no existe.

### POST `/api/admin/products`
- **Body**:
  ```json
  {
    "name": "Coca-Cola 400 ml",
    "brandId": 2,
    "categoryId": 3,
    "flavor": "Original",
    "presentation": "400 ml",
    "containerType": "Botella",
    "shortDescription": "Refresco de cola",
    "description": "...",
    "currentPrice": 2500.00,
    "oldPrice": 3000.00,
    "currency": "COP",
    "isFeatured": false,
    "isNew": true,
    "isPromo": true,
    "isVisible": true,
    "active": true,
    "sortOrder": 0
  }
  ```
- **201**: `ProductResponse` (con `slug` generado y `discountPercentage` calculado).
- **400**: validación, o `brandId`/`categoryId` inexistente.

### PUT `/api/admin/products/{id}`
Reemplazo completo. Los flags nulos conservan el valor actual.
- **200**: `ProductResponse`. **404**: no existe.

### PATCH (toggles) — alternan un estado y devuelven el `ProductResponse`
- `PATCH /api/admin/products/{id}/toggle-visible`
- `PATCH /api/admin/products/{id}/toggle-active`
- `PATCH /api/admin/products/{id}/toggle-featured`
- `PATCH /api/admin/products/{id}/toggle-new`
- `PATCH /api/admin/products/{id}/toggle-promo`

### DELETE `/api/admin/products/{id}` (soft delete)
Pone `active = false` e `isVisible = false`. **No** borra el registro ni la imagen.
- **204**. **404**: no existe.

---

## 8. Imágenes de producto (Cloudinary) — `/api/admin/products/{id}/image`

> Detalle del flujo en [cloudinary-flow.md](cloudinary-flow.md). Toda subida pasa por el backend; el `API_SECRET` nunca se expone. Validación: `jpg/jpeg/png/webp`, tamaño máx. configurable.

### POST `/api/admin/products/{id}/image`
Sube la imagen **solo si el producto no tiene una**.
- **Content-Type**: `multipart/form-data`, campo `file`.
- **200**: `{ "productId": 10, "imageUrl": "...", "imagePublicId": "londono/products/x" }`
- **400**: imagen inválida, o el producto ya tiene imagen (usar PUT).
- **404**: producto no existe. **502**: fallo de Cloudinary (BD intacta).

### PUT `/api/admin/products/{id}/image`
Reemplaza: sube la nueva y, si tiene éxito, elimina la anterior (best-effort). Si la subida falla, se conserva la imagen anterior.
- **200**: `{ "productId": 10, "imageUrl": "...", "imagePublicId": "..." }`
- **400/404/502** según corresponda.

### DELETE `/api/admin/products/{id}/image`
Elimina en Cloudinary y limpia `imageUrl`/`imagePublicId`. Si Cloudinary falla, responde **502** y **no** limpia la BD.
- **204**. **404**: producto sin imagen o inexistente.

---

## 9. Marcas admin — `/api/admin/brands`

> Rol `ADMIN`. Devuelven marcas activas e inactivas.

- **GET** `/api/admin/brands` → lista de `BrandResponse`.
- **GET** `/api/admin/brands/{id}` → `BrandResponse`. 404 si no existe.
- **POST** `/api/admin/brands` → **201** `BrandResponse`.
  - **Body**: `{ "name": "Marca", "slug": "marca-opcional", "description": "...", "active": true, "sortOrder": 0 }` (slug autogenerado si se omite).
  - **409**: nombre duplicado.
- **PUT** `/api/admin/brands/{id}` → **200** `BrandResponse`. 409 si nombre duplicado.
- **PATCH** `/api/admin/brands/{id}/toggle-active` → **200** `BrandResponse`.
- **DELETE** `/api/admin/brands/{id}` → **204** si no tiene productos; **409** si tiene productos asociados (preferir desactivar).

> Gestión de **logo** de marca (Cloudinary): fuera del alcance de la Fase 2. `logoUrl`/`logoPublicId` se exponen como solo lectura.

---

## 10. Categorías admin — `/api/admin/categories`

> Rol `ADMIN`. Devuelven categorías activas e inactivas.

- **GET** `/api/admin/categories` → lista de `CategoryResponse`.
- **GET** `/api/admin/categories/{id}` → `CategoryResponse`. 404 si no existe.
- **POST** `/api/admin/categories` → **201** `CategoryResponse`.
  - **Body**: `{ "name": "Gaseosas", "slug": "gaseosas-opcional", "description": "...", "active": true, "sortOrder": 0 }`.
  - **409**: nombre duplicado.
- **PUT** `/api/admin/categories/{id}` → **200** `CategoryResponse`. 409 si nombre duplicado.
- **PATCH** `/api/admin/categories/{id}/toggle-active` → **200** `CategoryResponse`.
- **DELETE** `/api/admin/categories/{id}` → **204** si no tiene productos; **409** si tiene productos asociados.

> Gestión de **imagen** de categoría (Cloudinary): fuera del alcance de la Fase 2.

---

## 11. Métricas admin — `/api/admin/products/analytics/summary`

### GET `/api/admin/products/analytics/summary`
Resumen simple para el dashboard. Rol `ADMIN`.
- **200**:
  ```json
  {
    "totalProducts": 120,
    "visibleProducts": 100,
    "activeProducts": 110,
    "featuredProducts": 12,
    "newProducts": 18,
    "promoProducts": 25,
    "totalViews": 5400,
    "totalWhatsappClicks": 320,
    "mostViewedProducts": [ { "id": 10, "name": "...", "slug": "...", "imageUrl": "...", "count": 900 } ],
    "mostWhatsappClickedProducts": [ { "id": 7, "name": "...", "slug": "...", "imageUrl": "...", "count": 80 } ]
  }
  ```

---

## 12. Resumen de endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Login (email) |
| POST | `/api/auth/refresh` | No | Renovar token |
| POST | `/api/auth/logout` | Sí | Cerrar sesión |
| GET | `/api/auth/me` | Sí | Usuario actual |
| GET | `/api/health` | No | Healthcheck |
| GET | `/api/public/products` | No | Catálogo (filtros + paginación) |
| GET | `/api/public/products/featured` | No | Destacados |
| GET | `/api/public/products/new` | No | Nuevos |
| GET | `/api/public/products/promotions` | No | Promociones |
| GET | `/api/public/products/{slug}` | No | Detalle producto |
| GET | `/api/public/brands` | No | Marcas activas |
| GET | `/api/public/brands/{slug}` | No | Marca por slug |
| GET | `/api/public/categories` | No | Categorías activas |
| GET | `/api/public/categories/{slug}` | No | Categoría por slug |
| POST | `/api/public/products/{slug}/events/view` | No | Registrar vista |
| POST | `/api/public/products/{slug}/events/whatsapp-click` | No | Registrar click WhatsApp |
| POST | `/api/public/products/{slug}/events/promotion-click` | No | Registrar click promoción |
| GET | `/api/admin/products` | ADMIN | Listar (gestión, filtros) |
| GET | `/api/admin/products/{id}` | ADMIN | Detalle |
| POST | `/api/admin/products` | ADMIN | Crear |
| PUT | `/api/admin/products/{id}` | ADMIN | Actualizar |
| PATCH | `/api/admin/products/{id}/toggle-{visible,active,featured,new,promo}` | ADMIN | Alternar estado |
| DELETE | `/api/admin/products/{id}` | ADMIN | Soft delete |
| POST | `/api/admin/products/{id}/image` | ADMIN | Subir imagen |
| PUT | `/api/admin/products/{id}/image` | ADMIN | Reemplazar imagen |
| DELETE | `/api/admin/products/{id}/image` | ADMIN | Eliminar imagen |
| GET | `/api/admin/brands` | ADMIN | Listar marcas |
| GET | `/api/admin/brands/{id}` | ADMIN | Detalle marca |
| POST | `/api/admin/brands` | ADMIN | Crear marca |
| PUT | `/api/admin/brands/{id}` | ADMIN | Actualizar marca |
| PATCH | `/api/admin/brands/{id}/toggle-active` | ADMIN | Activar/desactivar marca |
| DELETE | `/api/admin/brands/{id}` | ADMIN | Eliminar marca (si no tiene productos) |
| GET | `/api/admin/categories` | ADMIN | Listar categorías |
| GET | `/api/admin/categories/{id}` | ADMIN | Detalle categoría |
| POST | `/api/admin/categories` | ADMIN | Crear categoría |
| PUT | `/api/admin/categories/{id}` | ADMIN | Actualizar categoría |
| PATCH | `/api/admin/categories/{id}/toggle-active` | ADMIN | Activar/desactivar categoría |
| DELETE | `/api/admin/categories/{id}` | ADMIN | Eliminar categoría (si no tiene productos) |
| GET | `/api/admin/products/analytics/summary` | ADMIN | Métricas del dashboard |

> Este contrato se mantiene sincronizado con la implementación del backend.
