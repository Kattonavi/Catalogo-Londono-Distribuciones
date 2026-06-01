# Backend — Catálogo Londoño Distribuciones

API REST del catálogo comercial de Londoño Distribuciones. Incluye la **base de la Fase 1** (seguridad JWT + refresh, JPA + Flyway, Cloudinary, health) y el **CRUD de catálogo de la Fase 2**: productos, marcas y categorías, imágenes de producto en Cloudinary, eventos públicos y métricas admin. El contrato completo está en [../docs/api-contract.md](../docs/api-contract.md). Pendiente: verificación funcional contra una PostgreSQL real (ver [../docs/roadmap.md](../docs/roadmap.md)).

---

## Stack backend

- **Java 25**
- **Spring Boot 4.0.6** (Web, Security, Data JPA, Validation)
- **Maven** (con Maven Wrapper)
- **PostgreSQL** + **Flyway** (migraciones)
- **JWT** (JJWT 0.12.6) + **Refresh Tokens**
- **Cloudinary Java SDK** (`cloudinary-http5` 2.4.0)

### Estructura de paquetes (`com.londono.distribuciones`)

| Paquete | Responsabilidad |
|---------|-----------------|
| `auth` | Login, refresh, logout, `/me` (controlador, servicio y DTOs) |
| `user` | Entidad `User` y repositorio |
| `product` | Entidad `Product`, repositorio, servicio, controlador, DTOs, filtros (`ProductSpecifications`) |
| `brand` | Entidad `Brand`, repositorio, servicio, controlador y DTOs |
| `category` | Entidad `Category`, repositorio, servicio, controlador y DTOs |
| `cloudinary` | Config, servicio de imágenes y validación |
| `analytics` | `ProductEvent`, eventos públicos y métricas admin (`AnalyticsService`) |
| `common` | `SlugUtils`, entidad base de auditoría, enums, excepciones, `ApiError`, `PageResponse`, health |
| `config` | Propiedades de CORS, seed de admin |
| `security` | `SecurityConfig`, `JwtService`, filtro JWT, `UserDetailsService` |

---

## Variables de entorno

Todas las configuraciones sensibles se inyectan por variables de entorno. **No** se commitea ningún `.env` con credenciales reales. En `application.yml` hay valores por defecto solo para desarrollo local.

| Variable | Descripción | Default (dev) |
|----------|-------------|---------------|
| `DATABASE_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5432/londono_distribuciones` |
| `DATABASE_USERNAME` | Usuario de la BD | `postgres` |
| `DATABASE_PASSWORD` | Contraseña de la BD | `postgres` |
| `JWT_SECRET` | Secreto HS256 (**≥ 32 caracteres**) | valor dev (cambiar) |
| `JWT_ACCESS_EXPIRATION` | Expiración del access token (ms) | `900000` (15 min) |
| `JWT_REFRESH_EXPIRATION` | Expiración del refresh token (ms) | `604800000` (7 días) |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary | _(vacío)_ |
| `CLOUDINARY_API_KEY` | API key de Cloudinary | _(vacío)_ |
| `CLOUDINARY_API_SECRET` | API secret (**solo backend**) | _(vacío)_ |
| `CLOUDINARY_UPLOAD_FOLDER` | Carpeta base de subida | `londono/products` |
| `CLOUDINARY_MAX_FILE_SIZE_MB` | Tamaño máximo de imagen (MB) | `5` |
| `FRONTEND_URL` | Origen permitido por CORS | `http://localhost:3000` |
| `WHATSAPP_PHONE_NUMBER` | Número de WhatsApp de la distribuidora | _(vacío)_ |
| `PORT` | Puerto del servidor | `8080` |
| `ADMIN_SEED_ENABLED` | Crear admin inicial si la BD está vacía | `true` |
| `ADMIN_SEED_NAME` | Nombre del admin sembrado | `Administrador` |
| `ADMIN_SEED_EMAIL` | Email del admin sembrado | `admin@londono.local` |
| `ADMIN_SEED_PASSWORD` | Contraseña del admin sembrado (**cambiar**) | `ChangeMe123!` |

> Para desarrollo local, exporta las variables en tu shell o usa un archivo de configuración local **no versionado** (`.env`, `application-local.properties`), ya ignorado por `.gitignore`.

---

## Ejecutar localmente con PostgreSQL (Docker Compose)

Para desarrollo local hay un [`docker-compose.yml`](docker-compose.yml) que levanta una PostgreSQL 16 (solo dev; en Railway la base es un servicio gestionado).

1. **Variables de entorno.** Copia la plantilla y ajústala (nunca commitees `.env` real):
   ```bash
   cp .env.example .env
   ```
   > Spring Boot no lee `.env` automáticamente: exporta las variables en tu terminal/IDE, o usa los valores por defecto de `application.yml` para desarrollo.

2. **Levantar PostgreSQL:**
   ```bash
   docker compose up -d
   ```
   - Mapea el puerto **5432** del host por defecto. Si ya tienes algo en 5432, usa otro puerto:
     ```powershell
     # PowerShell (Windows) — ejemplo con 5433
     $env:DB_PORT="5433"; docker compose up -d
     ```
     ```bash
     # bash
     DB_PORT=5433 docker compose up -d
     ```
   - Crea la base `londono_distribuciones` (usuario/clave `postgres`/`postgres`).
   - Detener: `docker compose down` (conserva datos) · `docker compose down -v` (borra datos).

3. **Arrancar el backend** (apuntando a la base). Si usaste el puerto por defecto 5432 no necesitas exportar nada (coincide con `application.yml`). Si usaste otro puerto, exporta `DATABASE_URL`:
   ```powershell
   # PowerShell (Windows), base en 5433
   $env:DATABASE_URL="jdbc:postgresql://localhost:5433/londono_distribuciones"
   $env:JWT_SECRET="un-secreto-local-de-al-menos-32-caracteres-1234567890"
   .\mvnw.cmd spring-boot:run
   ```

Al arrancar, **Flyway aplica `V1` + `V2`** automáticamente y, si la tabla `users` está vacía, se **crea el admin** (`ADMIN_SEED_*`). Luego: `curl http://localhost:8080/api/health`.

> **Cloudinary:** si dejas `CLOUDINARY_*` vacías, el backend **arranca igual**; la subida real de imágenes queda deshabilitada hasta configurar credenciales válidas.

---

## Comandos para ejecutar

Desde la carpeta `backend/`. Usa el **Maven Wrapper** (`./mvnw` en Linux/Mac, `mvnw.cmd` en Windows); no requiere Maven instalado globalmente.

```bash
# Compilar
./mvnw clean compile

# Empaquetar (JAR ejecutable en target/)
./mvnw clean package

# Ejecutar la API en local (requiere PostgreSQL disponible)
./mvnw spring-boot:run

# Ejecutar el JAR empaquetado
java -jar target/distribuciones-backend-0.0.1-SNAPSHOT.jar
```

En Windows (PowerShell):
```powershell
.\mvnw.cmd clean package
.\mvnw.cmd spring-boot:run
```

### Verificar que arranca

```bash
curl http://localhost:8080/api/health
# {"status":"UP","service":"distribuciones-backend","timestamp":"..."}
```

### Probar autenticación (con el admin sembrado)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@londono.local","password":"ChangeMe123!"}'
```

---

## Comandos para tests

```bash
# Ejecutar todos los tests
./mvnw test
```

> Tests incluidos (10): `ProductDiscountTest` (3, descuento derivado) y `SlugUtilsTest` (7, generación de slug y unicidad por sufijo). **No** requieren base de datos ni contexto de Spring. Las pruebas de integración con BD se añadirán en fases posteriores (p. ej. con Testcontainers).

---

## Cloudinary (explicación básica)

Las imágenes de productos, marcas y categorías se almacenan en **Cloudinary**, no en el servidor.

- **Toda subida pasa por el backend**: el frontend nunca recibe el `API_SECRET`.
- El backend valida la imagen (formato `jpg/jpeg/png/webp` y tamaño máximo configurable) antes de subir.
- Tras subir, Cloudinary devuelve una `secure_url` y un `public_id`. Ambos se guardan en la base de datos (`image_url` e `image_public_id`).
- `CloudinaryService` (usado por las imágenes de producto en la Fase 2):
  - `uploadImage(file)` — sube y valida.
  - `replaceImage(file, oldPublicId)` — sube la nueva y borra la anterior (best-effort).
  - `deleteImage(publicId)` — elimina (idempotente si ya no existe).
- Endpoints: `POST` (subir), `PUT` (reemplazar) y `DELETE` `/api/admin/products/{id}/image`.
- La gestión de imágenes de **marca** y **categoría** queda fuera del alcance de la Fase 2.
- Detalle completo del flujo y manejo de fallos: [../docs/cloudinary-flow.md](../docs/cloudinary-flow.md).

---

## Flyway (explicación básica)

El esquema de la base de datos se gestiona con **Flyway**, no con Hibernate.

- Las migraciones viven en `src/main/resources/db/migration/`.
- Se aplican **automáticamente al arrancar** la aplicación, antes de servir tráfico.
- Convención de nombres: `V<versión>__<descripción>.sql` (p. ej. `V1__init_schema.sql`).
- Las migraciones son **inmutables**: una vez aplicada una versión, no se edita; los cambios van en una nueva (`V2__...`, `V3__...`).
- Hibernate está en modo `ddl-auto: validate`: nunca modifica el esquema, solo verifica que las entidades coincidan con las tablas creadas por Flyway.
- **Dependencia (Spring Boot 4):** la autoconfiguración de Flyway vive en `spring-boot-starter-flyway` (no en `flyway-core` suelto). Sin ese starter, Flyway no se ejecuta y Hibernate falla la validación por tablas faltantes. No lo quites del `pom.xml`.

Migraciones:
- [`V1__init_schema.sql`](src/main/resources/db/migration/V1__init_schema.sql) — crea `users`, `brands`, `categories`, `products` y `product_events` según [../docs/database-model.md](../docs/database-model.md).
- [`V2__phase2_catalog_attributes.sql`](src/main/resources/db/migration/V2__phase2_catalog_attributes.sql) — añade atributos comerciales del producto (`flavor`, `presentation`, `container_type`, `short_description`), `active`, `sort_order`, `brands.sort_order` y el evento `PROMOTION_CLICK`.

---

## API de catálogo (Fase 2)

Contrato completo y formas de payload en [../docs/api-contract.md](../docs/api-contract.md). Resumen:

**Público (lectura, sin auth):**
- `GET /api/public/products` — catálogo con filtros (`search`, `brandSlug`, `categorySlug`, `isFeatured`, `isNew`, `isPromo`, `minPrice`, `maxPrice`, `sort`, `page`, `size`) y paginación.
- `GET /api/public/products/{slug}` · `/featured` · `/new` · `/promotions`.
- `GET /api/public/brands` · `/api/public/brands/{slug}`.
- `GET /api/public/categories` · `/api/public/categories/{slug}`.
- `POST /api/public/products/{slug}/events/{view|whatsapp-click|promotion-click}` — eventos (202).

**Admin (rol `ADMIN`):**
- Productos: `GET` (lista con filtros) · `GET /{id}` · `POST` · `PUT /{id}` · `PATCH /{id}/toggle-{visible,active,featured,new,promo}` · `DELETE /{id}` (soft delete).
- Imágenes de producto: `POST` / `PUT` / `DELETE` `/api/admin/products/{id}/image`.
- Marcas: `GET` · `GET /{id}` · `POST` · `PUT /{id}` · `PATCH /{id}/toggle-active` · `DELETE /{id}`.
- Categorías: `GET` · `GET /{id}` · `POST` · `PUT /{id}` · `PATCH /{id}/toggle-active` · `DELETE /{id}`.
- Métricas: `GET /api/admin/products/analytics/summary`.

---

## Notas de implementación (Fase 1)

- **Login por email.** La entidad `User` usa `name` + `email` (según la tarea de Fase 1); el identificador de login es el `email`. Esto reconcilia el modelo documentado (que usaba `username` + `full_name`) — ver comentarios en `V1__init_schema.sql` y `User.java`.
- **Descuento no almacenado.** `discount_percentage` se calcula en el backend (`Product.getDiscountPercentage()`), siguiendo la opción recomendada en la documentación.
- **Refresh token opaco** almacenado en la tabla `users`, con rotación en cada refresh.
- **Seed de admin** solo si la tabla `users` está vacía; credenciales por variables de entorno.

## Notas de implementación (Fase 2)

- **Vocabulario de la API vs. entidad.** Los DTO exponen `oldPrice` e `isPromo`; internamente la entidad/columna siguen siendo `previousPrice`/`previous_price` e `isOnPromotion`/`is_on_promotion` (decisión de la Fase 1, no se renombró la BD).
- **Soft delete.** `DELETE /api/admin/products/{id}` pone `active = false` e `isVisible = false`; no borra el registro ni la imagen.
- **Borrado de marcas/categorías** bloqueado (409) si tienen productos asociados; se recomienda desactivar.
- **Slug único** generado con `SlugUtils` (sufijos `-2`, `-3`, …). El descuento nunca se recibe del cliente: se deriva de los precios.
- **Imágenes de producto** vía Cloudinary: `POST` solo si no hay imagen, `PUT` reemplaza, `DELETE` elimina; ante fallo de Cloudinary se responde 502 sin dejar la BD inconsistente.
- **Imágenes de marca/categoría:** fuera del alcance de la Fase 2 (campos de logo/imagen expuestos solo lectura).
