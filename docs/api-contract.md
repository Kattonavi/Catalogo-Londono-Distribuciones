# Contrato de API — Catálogo Londoño Distribuciones

> Definición de los endpoints iniciales. Es un **contrato**, no implementación. Sirve como frontera entre frontend y backend. Los nombres, rutas y formas de payload pueden ajustarse durante la implementación, pero deben mantenerse acordados entre ambas apps.

---

## 1. Convenciones generales

- **Base path**: `/api` (evolucionable a `/api/v1`).
- **Formato**: JSON en request y response (excepto subida de imágenes: `multipart/form-data`).
- **Autenticación**: header `Authorization: Bearer <accessToken>` en endpoints protegidos.
- **Roles**: endpoints bajo `/api/admin/**` requieren rol `ADMIN`. Endpoints bajo `/api/public/**` son abiertos (solo lectura).
- **Códigos HTTP**:
  - `200 OK`, `201 Created`, `204 No Content`
  - `400 Bad Request` (validación), `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `500 Internal Server Error`.
- **Errores** — cuerpo consistente:
  ```json
  {
    "timestamp": "2026-06-01T10:00:00Z",
    "status": 400,
    "error": "Bad Request",
    "message": "El campo 'name' es obligatorio",
    "path": "/api/admin/products"
  }
  ```
- **Paginación** — parámetros y respuesta:
  - Query: `?page=0&size=12&sort=createdAt,desc`
  - Respuesta:
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
Inicia sesión.
- **Body**:
  ```json
  { "username": "admin", "password": "secreto" }
  ```
- **200**:
  ```json
  {
    "accessToken": "jwt...",
    "refreshToken": "token...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": { "id": 1, "username": "admin", "role": "ADMIN", "fullName": "..." }
  }
  ```
- **401**: credenciales inválidas.

### POST `/api/auth/refresh`
Renueva el access token.
- **Body**:
  ```json
  { "refreshToken": "token..." }
  ```
- **200**:
  ```json
  { "accessToken": "jwt...", "refreshToken": "token...", "expiresIn": 900 }
  ```
- **401**: refresh token inválido o expirado.

### POST `/api/auth/logout`
Invalida el refresh token actual.
- **Auth**: requerido.
- **Body** (o vía token): `{ "refreshToken": "token..." }`
- **204**: sin contenido.

### GET `/api/auth/me`
Devuelve el usuario autenticado.
- **Auth**: requerido.
- **200**:
  ```json
  { "id": 1, "username": "admin", "role": "ADMIN", "fullName": "...", "email": "..." }
  ```

---

## 3. Productos públicos — `/api/public/products`

> Solo devuelven productos con `is_visible = true`. Incluyen `discountPercentage` derivado.

### GET `/api/public/products`
Listado paginado con filtros para el catálogo.
- **Query params** (todos opcionales):
  - `search` — texto libre (nombre / marca).
  - `categorySlug` — filtrar por categoría.
  - `brandSlug` — filtrar por marca.
  - `onPromotion` — `true` para solo promociones.
  - `isNew` — `true` para solo nuevos.
  - `isFeatured` — `true` para solo destacados.
  - `sort` — ej. `createdAt,desc`, `currentPrice,asc`.
  - `page`, `size`.
- **200**: respuesta paginada de `ProductPublicCard`:
  ```json
  {
    "content": [
      {
        "id": 10,
        "name": "Producto X",
        "slug": "producto-x",
        "brand": { "id": 2, "name": "Marca", "slug": "marca" },
        "category": { "id": 3, "name": "Categoría", "slug": "categoria" },
        "currentPrice": 50000.00,
        "previousPrice": 70000.00,
        "discountPercentage": 29,
        "currency": "COP",
        "imageUrl": "https://res.cloudinary.com/.../x.jpg",
        "isNew": true,
        "isFeatured": false,
        "isOnPromotion": true
      }
    ],
    "page": 0, "size": 12, "totalElements": 50, "totalPages": 5, "first": true, "last": false
  }
  ```

### GET `/api/public/products/{slug}`
Detalle de un producto por slug.
- **200**: `ProductPublicDetail` (incluye `description` y datos completos).
- **404**: no existe o no es visible.

### GET `/api/public/products/featured`
Productos destacados para la home.
- **Query**: `limit` (opcional, default ej. 8).
- **200**: lista de `ProductPublicCard`.

### GET `/api/public/products/new`
Productos nuevos para la home.
- **Query**: `limit`.
- **200**: lista de `ProductPublicCard`.

### GET `/api/public/products/promotions`
Productos en promoción.
- **Query**: `page`, `size` (o `limit` para home).
- **200**: lista/paginado de `ProductPublicCard`.

---

## 4. Marcas y categorías públicas

### GET `/api/public/brands`
- **200**: lista de marcas activas:
  ```json
  [ { "id": 1, "name": "Marca", "slug": "marca", "logoUrl": "..." } ]
  ```

### GET `/api/public/categories`
- **200**: lista de categorías activas:
  ```json
  [ { "id": 1, "name": "Categoría", "slug": "categoria", "imageUrl": "..." } ]
  ```

---

## 5. Eventos de producto (públicos) — `/api/public/products/{id}/events`

Registran interacción para métricas. No requieren autenticación.

### POST `/api/public/products/{id}/events/view`
Registra una vista.
- **Body** (opcional): `{ "referrer": "..." }`
- **202 / 204**: aceptado (fire-and-forget).

### POST `/api/public/products/{id}/events/whatsapp-click`
Registra un click al botón de WhatsApp.
- **202 / 204**: aceptado.

> El backend incrementa los contadores denormalizados (`view_count`, `whatsapp_click_count`) y crea un registro en `product_events`.

---

## 6. Productos admin — `/api/admin/products`

> Todos requieren `Authorization: Bearer` con rol `ADMIN`. Devuelven todos los productos (visibles u ocultos).

### GET `/api/admin/products`
Listado paginado para gestión.
- **Query**: `search`, `categoryId`, `brandId`, `isVisible`, `onPromotion`, `page`, `size`, `sort`.
- **200**: paginado de `ProductAdmin` (incluye flags, contadores, fechas).

### GET `/api/admin/products/{id}`
- **200**: `ProductAdmin` completo.
- **404**: no existe.

### POST `/api/admin/products`
Crea un producto (sin imagen aún; la imagen se sube en endpoint aparte, o se permite crear con imagen luego).
- **Body**:
  ```json
  {
    "name": "Producto X",
    "description": "...",
    "brandId": 2,
    "categoryId": 3,
    "currentPrice": 50000.00,
    "previousPrice": 70000.00,
    "currency": "COP",
    "isNew": true,
    "isFeatured": false,
    "isOnPromotion": true,
    "isVisible": true
  }
  ```
- **201**: producto creado (con `id` y `slug` generado). `discountPercentage` calculado.
- **400/409**: validación / slug duplicado.

### PUT `/api/admin/products/{id}`
Actualiza un producto.
- **Body**: mismos campos que en creación (los editables).
- **200**: producto actualizado.
- **404**: no existe.

### PATCH `/api/admin/products/{id}/flags`
Atajo para alternar estados.
- **Body** (cualquier subconjunto):
  ```json
  { "isNew": true, "isFeatured": false, "isOnPromotion": true, "isVisible": false }
  ```
- **200**: producto actualizado.

### DELETE `/api/admin/products/{id}`
Elimina un producto (y su imagen en Cloudinary + sus eventos).
- **204**: eliminado.
- **404**: no existe.

---

## 7. Flujo de imágenes (Cloudinary) — `/api/admin/products/{id}/image`

> Detalle completo en [cloudinary-flow.md](cloudinary-flow.md). La subida siempre pasa por el backend.

### POST `/api/admin/products/{id}/image`
Sube o **reemplaza** la imagen principal del producto.
- **Content-Type**: `multipart/form-data`.
- **Form field**: `file` (imagen).
- **Comportamiento**: sube a Cloudinary, guarda `image_url` + `image_public_id`; si ya había una imagen, elimina la anterior en Cloudinary.
- **200**:
  ```json
  { "imageUrl": "https://res.cloudinary.com/.../x.jpg", "imagePublicId": "londono/products/x" }
  ```
- **400**: formato/tamaño inválido.
- **404**: producto no existe.
- **502**: fallo de Cloudinary (la BD no se actualiza).

### DELETE `/api/admin/products/{id}/image`
Elimina la imagen del producto.
- **Comportamiento**: elimina en Cloudinary por `public_id` y limpia `image_url`/`image_public_id` en la BD.
- **204**: eliminada.
- **404**: producto o imagen no existe.

> El mismo patrón aplica a logos de marca (`/api/admin/brands/{id}/logo`) e imágenes de categoría (`/api/admin/categories/{id}/image`) si se requiere.

---

## 8. Marcas admin — `/api/admin/brands`

### GET `/api/admin/brands`
- **200**: lista (o paginado) de marcas con estado.

### POST `/api/admin/brands`
- **Body**: `{ "name": "Marca", "description": "...", "isActive": true }` (slug autogenerado).
- **201**: marca creada.
- **409**: nombre/slug duplicado.

### PUT `/api/admin/brands/{id}`
- **Body**: campos editables.
- **200**: actualizada.

### DELETE `/api/admin/brands/{id}`
- **204**: eliminada.
- **409**: tiene productos asociados (no se permite eliminar).

### POST `/api/admin/brands/{id}/logo` / DELETE `/api/admin/brands/{id}/logo`
- Subida/eliminación de logo (igual patrón Cloudinary).

---

## 9. Categorías admin — `/api/admin/categories`

### GET `/api/admin/categories`
- **200**: lista (o paginado) de categorías.

### POST `/api/admin/categories`
- **Body**: `{ "name": "Categoría", "description": "...", "sortOrder": 0, "isActive": true }`.
- **201**: creada.
- **409**: duplicado.

### PUT `/api/admin/categories/{id}`
- **200**: actualizada.

### DELETE `/api/admin/categories/{id}`
- **204**: eliminada.
- **409**: tiene productos asociados.

### POST/DELETE `/api/admin/categories/{id}/image`
- Subida/eliminación de imagen (igual patrón Cloudinary).

---

## 10. Dashboard / Métricas — `/api/admin/dashboard`

### GET `/api/admin/dashboard/summary`
Métricas simples para el panel.
- **200**:
  ```json
  {
    "totalProducts": 120,
    "visibleProducts": 100,
    "onPromotionProducts": 25,
    "featuredProducts": 12,
    "newProducts": 18,
    "totalBrands": 14,
    "totalCategories": 9
  }
  ```

### GET `/api/admin/dashboard/most-viewed`
- **Query**: `limit` (default 5).
- **200**: lista de productos con `id`, `name`, `viewCount`.

### GET `/api/admin/dashboard/most-whatsapp-clicks`
- **Query**: `limit` (default 5).
- **200**: lista de productos con `id`, `name`, `whatsappClickCount`.

---

## 11. Resumen de endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | Renovar token |
| POST | `/api/auth/logout` | Sí | Cerrar sesión |
| GET | `/api/auth/me` | Sí | Usuario actual |
| GET | `/api/public/products` | No | Catálogo (filtros) |
| GET | `/api/public/products/{slug}` | No | Detalle producto |
| GET | `/api/public/products/featured` | No | Destacados |
| GET | `/api/public/products/new` | No | Nuevos |
| GET | `/api/public/products/promotions` | No | Promociones |
| GET | `/api/public/brands` | No | Marcas activas |
| GET | `/api/public/categories` | No | Categorías activas |
| POST | `/api/public/products/{id}/events/view` | No | Registrar vista |
| POST | `/api/public/products/{id}/events/whatsapp-click` | No | Registrar click WhatsApp |
| GET | `/api/admin/products` | ADMIN | Listar (gestión) |
| GET | `/api/admin/products/{id}` | ADMIN | Detalle |
| POST | `/api/admin/products` | ADMIN | Crear |
| PUT | `/api/admin/products/{id}` | ADMIN | Actualizar |
| PATCH | `/api/admin/products/{id}/flags` | ADMIN | Cambiar estados |
| DELETE | `/api/admin/products/{id}` | ADMIN | Eliminar |
| POST | `/api/admin/products/{id}/image` | ADMIN | Subir/reemplazar imagen |
| DELETE | `/api/admin/products/{id}/image` | ADMIN | Eliminar imagen |
| GET/POST/PUT/DELETE | `/api/admin/brands` | ADMIN | CRUD marcas |
| GET/POST/PUT/DELETE | `/api/admin/categories` | ADMIN | CRUD categorías |
| GET | `/api/admin/dashboard/summary` | ADMIN | Métricas |
| GET | `/api/admin/dashboard/most-viewed` | ADMIN | Más vistos |
| GET | `/api/admin/dashboard/most-whatsapp-clicks` | ADMIN | Más clicks |

> Este contrato se mantendrá sincronizado con la implementación. Cualquier cambio se refleja aquí primero.
