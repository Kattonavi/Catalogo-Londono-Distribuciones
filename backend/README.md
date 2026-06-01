# Backend — Catálogo Londoño Distribuciones

API REST del catálogo comercial de Londoño Distribuciones. Esta es la **base de la Fase 1**: infraestructura de seguridad (JWT + refresh), persistencia (JPA + Flyway), integración con Cloudinary y endpoint de salud. El CRUD visual completo del catálogo se construye en fases posteriores (ver [../docs/roadmap.md](../docs/roadmap.md)).

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
| `product` | Entidad `Product`, repositorio y regla de descuento derivado |
| `brand` | Entidad `Brand` y repositorio |
| `category` | Entidad `Category` y repositorio |
| `cloudinary` | Config, servicio de imágenes y validación |
| `analytics` | Entidad `ProductEvent` y repositorio (métricas) |
| `common` | Entidad base de auditoría, enums, excepciones, manejo de errores, health |
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

> El test incluido (`ProductDiscountTest`) valida la regla de negocio del **descuento derivado** y **no** requiere base de datos ni contexto de Spring. Las pruebas de integración con BD se añadirán en fases posteriores (p. ej. con Testcontainers).

---

## Cloudinary (explicación básica)

Las imágenes de productos, marcas y categorías se almacenan en **Cloudinary**, no en el servidor.

- **Toda subida pasa por el backend**: el frontend nunca recibe el `API_SECRET`.
- El backend valida la imagen (formato `jpg/jpeg/png/webp` y tamaño máximo configurable) antes de subir.
- Tras subir, Cloudinary devuelve una `secure_url` y un `public_id`. Ambos se guardan en la base de datos (`image_url` e `image_public_id`).
- `CloudinaryService` ofrece los métodos preparados para las próximas fases:
  - `uploadImage(file)` — sube y valida.
  - `replaceImage(file, oldPublicId)` — sube la nueva y borra la anterior (best-effort).
  - `deleteImage(publicId)` — elimina (idempotente si ya no existe).
- Detalle completo del flujo y manejo de fallos: [../docs/cloudinary-flow.md](../docs/cloudinary-flow.md).

---

## Flyway (explicación básica)

El esquema de la base de datos se gestiona con **Flyway**, no con Hibernate.

- Las migraciones viven en `src/main/resources/db/migration/`.
- Se aplican **automáticamente al arrancar** la aplicación, antes de servir tráfico.
- Convención de nombres: `V<versión>__<descripción>.sql` (p. ej. `V1__init_schema.sql`).
- Las migraciones son **inmutables**: una vez aplicada una versión, no se edita; los cambios van en una nueva (`V2__...`, `V3__...`).
- Hibernate está en modo `ddl-auto: validate`: nunca modifica el esquema, solo verifica que las entidades coincidan con las tablas creadas por Flyway.

Migración inicial: [`V1__init_schema.sql`](src/main/resources/db/migration/V1__init_schema.sql) — crea `users`, `brands`, `categories`, `products` y `product_events` según [../docs/database-model.md](../docs/database-model.md).

---

## Notas de implementación (Fase 1)

- **Login por email.** La entidad `User` usa `name` + `email` (según la tarea de Fase 1); el identificador de login es el `email`. Esto reconcilia el modelo documentado (que usaba `username` + `full_name`) — ver comentarios en `V1__init_schema.sql` y `User.java`.
- **Descuento no almacenado.** `discount_percentage` se calcula en el backend (`Product.getDiscountPercentage()`), siguiendo la opción recomendada en la documentación.
- **Refresh token opaco** almacenado en la tabla `users`, con rotación en cada refresh.
- **Seed de admin** solo si la tabla `users` está vacía; credenciales por variables de entorno.
