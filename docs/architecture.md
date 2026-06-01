# Arquitectura — Catálogo Londoño Distribuciones

> Visión técnica de alto nivel: estructura del monorepo, separación de responsabilidades, flujos principales y consideraciones de deploy.

---

## 1. Arquitectura monorepo

El proyecto vive en un único repositorio Git que contiene dos aplicaciones independientes que se despliegan por separado:

```
Catalogo_Londono_Distribuciones/
├── docs/                  # Documentación base
├── frontend/              # (Futuro) Next.js 16 + React 19 + TS
└── backend/               # (Futuro) Spring Boot 4 + Java 25
```

**Ventajas del monorepo aquí:**
- Un solo lugar para issues, documentación y versionado.
- Frontend y backend evolucionan de forma coordinada (contrato de API compartido).
- Facilita la configuración de CI y deploy hacia Railway desde subdirectorios.

**Principios:**
- `frontend/` y `backend/` no comparten código en runtime; se comunican solo vía HTTP/JSON.
- El **contrato de API** ([api-contract.md](api-contract.md)) es la frontera entre ambos.
- Cada app tiene su propio ciclo de build, dependencias y despliegue.

---

## 2. Separación frontend / backend

### Frontend (Next.js — capa de presentación)
Responsabilidades:
- Renderizar el catálogo público de forma muy visual (SSR/SSG/ISR según convenga).
- Páginas: home, catálogo, producto, promociones.
- Panel admin (rutas protegidas) que consume la API.
- Manejo de estado de datos remotos con TanStack Query.
- Formularios con React Hook Form + validación Zod.
- Disparo de eventos de producto (vista, click WhatsApp) hacia el backend.

No hace:
- Acceso directo a base de datos.
- Manejo de secretos de Cloudinary o de la base de datos.
- Lógica de negocio sensible (precios autoritativos, validaciones de seguridad).

### Backend (Spring Boot — capa de dominio y datos)
Responsabilidades:
- API REST con el contrato definido.
- Autenticación y autorización (Spring Security, JWT + refresh).
- Lógica de negocio: cálculo de descuento, reglas de visibilidad, validaciones.
- Persistencia con Spring Data JPA sobre PostgreSQL.
- Migraciones con Flyway.
- Integración con Cloudinary (subida/reemplazo/eliminación de imágenes).
- Registro de eventos y agregación de métricas para el dashboard.

No hace:
- Renderizado de UI.
- Almacenamiento de imágenes en disco propio (delega en Cloudinary).

```
┌─────────────────────┐        HTTPS / JSON         ┌──────────────────────┐
│      Frontend       │  ───────────────────────▶   │       Backend        │
│   Next.js / React   │   (API REST + JWT)          │   Spring Boot / Java │
│                     │  ◀───────────────────────   │                      │
└─────────────────────┘                             └──────────┬───────────┘
                                                               │
                                          ┌────────────────────┼────────────────────┐
                                          ▼                                          ▼
                                 ┌─────────────────┐                       ┌──────────────────┐
                                 │   PostgreSQL    │                       │    Cloudinary    │
                                 │   (Railway)     │                       │   (imágenes)     │
                                 └─────────────────┘                       └──────────────────┘
```

---

## 3. Flujo público

1. El visitante abre el sitio (home) desde el celular.
2. El frontend solicita al backend los datos necesarios:
   - Productos destacados / nuevos / en promoción (home).
   - Listado paginado con filtros (catálogo).
   - Detalle de un producto (página de producto).
3. El backend devuelve **solo productos visibles** y los datos derivados (ej. % de descuento).
4. El frontend renderiza tarjetas visuales, badges y precios.
5. Al ver un producto, el frontend registra un evento `VIEW`.
6. Al hacer click en WhatsApp, el frontend registra un evento `WHATSAPP_CLICK` y abre WhatsApp con mensaje prellenado.

> Las páginas públicas pueden cachearse (ISR/SSG) para rendimiento; los eventos siempre se envían en cliente.

---

## 4. Flujo admin

1. El administrador entra a `/admin` (o subdominio/ruta protegida).
2. Si no está autenticado, se le redirige al login.
3. Tras autenticarse, el frontend guarda el access token y usa el refresh token para renovar.
4. El panel consume endpoints protegidos:
   - Dashboard (métricas).
   - CRUD de productos, marcas y categorías.
   - Subida/reemplazo/eliminación de imágenes.
5. Cada operación de escritura viaja con el header `Authorization: Bearer <accessToken>`.
6. El backend valida el token, autoriza por rol `ADMIN` y ejecuta la operación.

---

## 5. Flujo de autenticación

Esquema: **JWT de acceso (corta duración) + Refresh Token (larga duración)**.

```
1. POST /api/auth/login  { username, password }
        │
        ▼
   Backend valida credenciales (password hasheada con BCrypt)
        │
        ▼
   Devuelve  { accessToken (JWT ~15 min), refreshToken (~7 días) }
        │
        ▼
2. Frontend guarda los tokens
   - accessToken: en memoria / store (preferente)
   - refreshToken: cookie httpOnly segura (recomendado) o almacenamiento controlado
        │
        ▼
3. Cada request protegido envía: Authorization: Bearer <accessToken>
        │
        ▼
4. Si el accessToken expira → POST /api/auth/refresh { refreshToken }
        │
        ▼
   Backend valida refresh token y emite un nuevo accessToken (y opcionalmente rota el refresh)
        │
        ▼
5. POST /api/auth/logout → invalida el refresh token
```

**Reglas de seguridad:**
- Contraseñas hasheadas con BCrypt; nunca se almacenan en texto plano.
- Access token de vida corta; refresh token de vida más larga y revocable.
- Endpoints públicos no requieren token; endpoints admin exigen rol `ADMIN`.
- CORS configurado para permitir solo el origen del frontend.
- Validación de todas las entradas (Zod en frontend, Bean Validation en backend).

> Contrato detallado en [api-contract.md](api-contract.md).

---

## 6. Flujo de carga de imágenes con Cloudinary

La subida **siempre pasa por el backend**; el frontend nunca expone credenciales de Cloudinary.

```
1. Admin selecciona imagen en el panel (validación previa de formato/tamaño en frontend)
        │
        ▼
2. Frontend → POST /api/admin/products/{id}/image  (multipart/form-data, con JWT)
        │
        ▼
3. Backend valida (rol, formato, tamaño) y sube el archivo a Cloudinary vía SDK
        │
        ▼
4. Cloudinary devuelve  { secure_url, public_id }
        │
        ▼
5. Backend guarda en la base:  image_url = secure_url,  image_public_id = public_id
        │
        ▼
6. Si era un reemplazo → backend elimina la imagen anterior en Cloudinary (por su public_id)
        │
        ▼
7. Backend responde con la URL final; el frontend actualiza la vista
```

> Detalle completo (reemplazo, eliminación, fallos, validaciones) en [cloudinary-flow.md](cloudinary-flow.md).

---

## 7. Comunicación frontend ↔ backend

- **Protocolo**: HTTPS, REST, JSON.
- **Base URL** del backend configurada en el frontend vía variable de entorno (`NEXT_PUBLIC_API_BASE_URL`).
- **Autenticación**: header `Authorization: Bearer <token>` en rutas protegidas.
- **Datos remotos**: TanStack Query gestiona cache, revalidación, estados de carga/error y reintentos.
- **Errores**: el backend responde con códigos HTTP estándar y un cuerpo JSON de error consistente:
  ```json
  { "timestamp": "...", "status": 400, "error": "Bad Request", "message": "...", "path": "..." }
  ```
- **Paginación**: parámetros `page`, `size`, y respuesta con metadatos (`totalElements`, `totalPages`, etc.).
- **Versionado**: prefijo `/api` (se puede evolucionar a `/api/v1` si fuese necesario).
- **CORS**: el backend permite el origen del frontend (dominio de Railway / dominio propio).

---

## 8. Consideraciones para deploy en Railway

### 8.1 Servicios en Railway
- **PostgreSQL**: instancia gestionada por Railway; provee la `DATABASE_URL`.
- **Backend (Spring Boot)**: servicio que ejecuta el JAR; se conecta a PostgreSQL y a Cloudinary.
- **Frontend (Next.js)**: servicio que ejecuta el servidor de Next; consume la API del backend.

### 8.2 Build y arranque
- Cada servicio se construye desde su subdirectorio (`backend/`, `frontend/`) del monorepo (root directory configurable en Railway).
- Backend: build con Maven → JAR ejecutable; arranque con `java -jar`.
- Frontend: `npm install` + `npm run build` → `npm run start`.

### 8.3 Variables de entorno (por servicio)
**Backend:**
- `DATABASE_URL` / credenciales de PostgreSQL.
- `JWT_SECRET`, `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- `CORS_ALLOWED_ORIGINS` (origen del frontend).
- Credenciales del admin inicial (seed) o estrategia de creación.

**Frontend:**
- `NEXT_PUBLIC_API_BASE_URL` (URL pública del backend).
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (o se obtiene del backend/config).

> Detalle de variables de Cloudinary en [cloudinary-flow.md](cloudinary-flow.md).

### 8.4 Migraciones
- Flyway corre las migraciones al arrancar el backend, asegurando el esquema antes de servir tráfico.

### 8.5 Buenas prácticas de deploy
- Secretos solo en variables de entorno de Railway, nunca en el repositorio.
- Healthcheck del backend (ej. `/actuator/health` o endpoint propio) para readiness.
- Logs centralizados en Railway.
- Dominios: backend y frontend con sus URLs; CORS y `NEXT_PUBLIC_API_BASE_URL` coherentes.
- Pipeline: push a `main` en GitHub → Railway construye y despliega cada servicio.

---

## 9. Resumen de responsabilidades

| Capa | Tecnología | Responsabilidad principal |
|------|-----------|---------------------------|
| Presentación | Next.js / React | UI visual, catálogo, admin, eventos en cliente |
| Estado remoto | TanStack Query | Cache y sincronización de datos de la API |
| API / Dominio | Spring Boot | Reglas de negocio, autenticación, integración Cloudinary |
| Persistencia | Spring Data JPA + PostgreSQL | Almacenamiento de datos |
| Migraciones | Flyway | Versionado del esquema |
| Imágenes | Cloudinary | Almacenamiento y entrega optimizada de imágenes |
| Infraestructura | Railway + GitHub | Build, deploy y hosting |
