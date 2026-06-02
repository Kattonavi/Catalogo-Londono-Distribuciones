# Deploy en Railway — Catálogo Londoño Distribuciones

Guía para desplegar el monorepo en [Railway](https://railway.app). El proyecto usa **3 servicios** dentro del mismo proyecto Railway:

1. **PostgreSQL** (base de datos gestionada).
2. **Backend** — Spring Boot 4 / **Java 25**, construido con **Dockerfile** (Root Directory `backend`).
3. **Frontend** — Next.js 16, construido con **Railpack** (Root Directory `frontend`).

> El backend usa **Dockerfile** a propósito: así Java 25 queda fijo y se evita que Railpack instale JDK 21 (causa del fallo de build inicial).

---

## 1. PostgreSQL

- En el proyecto Railway: **New → Database → PostgreSQL**.
- Railway expone variables del servicio Postgres: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` (entre otras).
- No hay que crear el esquema a mano: **Flyway** aplica `V1` + `V2` al arrancar el backend.

---

## 2. Backend (Dockerfile, Java 25)

### Configuración del servicio
- **Root Directory:** `backend`
- **Builder:** Dockerfile (ya configurado en [`backend/railway.toml`](../backend/railway.toml) → `builder = "DOCKERFILE"`).
- **Healthcheck:** `/api/health` (ya configurado, timeout 300 s).
- El [`backend/Dockerfile`](../backend/Dockerfile) es multi-stage:
  - build: `eclipse-temurin:25-jdk` → `./mvnw -DskipTests package`
  - runtime: `eclipse-temurin:25-jre` → `java -jar app.jar`
- El puerto lo inyecta Railway vía `PORT`; el backend lo respeta (`server.port=${PORT:8080}`).

### Variables de entorno del backend
Configúralas en el panel **Variables** del servicio backend. Para la base de datos, **referencia** el servicio Postgres (no copies credenciales):

```
DATABASE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}

JWT_SECRET=<cadena aleatoria >= 32 caracteres>
JWT_ACCESS_EXPIRATION=900000        # milisegundos (15 min)
JWT_REFRESH_EXPIRATION=604800000    # milisegundos (7 días)

FRONTEND_URL=https://<frontend>.up.railway.app   # se ajusta tras desplegar el frontend
WHATSAPP_PHONE_NUMBER=573001234567

ADMIN_SEED_EMAIL=admin@tudominio.com
ADMIN_SEED_PASSWORD=<contraseña fuerte>
ADMIN_SEED_NAME=Administrador

CLOUDINARY_CLOUD_NAME=<opcional>
CLOUDINARY_API_KEY=<opcional>
CLOUDINARY_API_SECRET=<opcional>
```

> **JWT en milisegundos:** el backend lee `JWT_ACCESS_EXPIRATION` / `JWT_REFRESH_EXPIRATION` en **ms**. Usa `900000` y `604800000`, no `900`/`604800` (esos valores en segundos harían que los tokens expiren en menos de un segundo).

> `${{Postgres.PGHOST}}` etc. son **referencias de Railway** entre servicios. Escríbelas tal cual en el panel; Railway las resuelve. No guardes credenciales reales en Git.

### Probar el backend
```bash
# Healthcheck
curl https://<backend>.up.railway.app/api/health
# -> {"status":"UP","service":"distribuciones-backend",...}

# Login admin (con las credenciales del seed)
curl -X POST https://<backend>.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tudominio.com","password":"<contraseña>"}'
# -> { "accessToken": "...", "refreshToken": "...", "user": {...} }
```

---

## 3. Frontend (Railpack, Next.js)

### Configuración del servicio
- **Root Directory:** `frontend`
- **Builder:** Railpack (ya configurado en [`frontend/railway.toml`](../frontend/railway.toml)).
- **Build:** `npm ci && npm run build` · **Start:** `npm run start` · **Healthcheck:** `/`.
- `next start` respeta el `PORT` que inyecta Railway.

### Variables de entorno del frontend
```
NEXT_PUBLIC_API_URL=https://<backend>.up.railway.app
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER=573001234567
```

> **Importante:** `NEXT_PUBLIC_API_URL` debe apuntar a la **URL pública del backend en Railway**. Las variables `NEXT_PUBLIC_*` se inlinean en el **build**: si las cambias, hay que **reconstruir** (redeploy) el frontend.

### Probar el frontend
Abre en el navegador:
- `/` — landing
- `/catalogo` — catálogo
- `/promociones` — promociones
- `/admin/login` — login del panel (usa el admin del seed)

---

## 4. CORS

- El backend solo permite el origen definido en `FRONTEND_URL` (ver `SecurityConfig`).
- **Flujo:** despliega primero el frontend, copia su URL pública, ponla en `FRONTEND_URL` del backend y **redeploya el backend**.
- Si ves errores de CORS en el navegador, casi siempre es que `FRONTEND_URL` no coincide exactamente con la URL del frontend (incluido `https://`, sin barra final).

---

## 5. Cloudinary (imágenes)

- Variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Si se dejan **vacías**, el backend **arranca igual**, pero **subir imágenes fallará** (responde error controlado). El catálogo muestra placeholders.
- El `API_SECRET` vive **solo en el backend**; nunca se expone al frontend ni se commitea.
- Detalle del flujo en [cloudinary-flow.md](cloudinary-flow.md).

---

## 6. Admin seed

- Variables: `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_NAME`.
- Al arrancar, **si la tabla `users` está vacía**, se crea ese administrador. Si ya hay usuarios, no hace nada.
- Cambia la contraseña tras el primer ingreso.

---

## 7. Orden recomendado de deploy

1. **Crear PostgreSQL** en el proyecto Railway.
2. **Deploy del backend** (Root Directory `backend`, Dockerfile) con sus variables (DB por referencia, JWT, admin seed, etc.).
3. **Probar** `GET /api/health` y el `POST /api/auth/login`.
4. **Deploy del frontend** (Root Directory `frontend`) con `NEXT_PUBLIC_API_URL` apuntando al backend.
5. **Actualizar `FRONTEND_URL`** del backend con la URL pública del frontend y **redeploy del backend** (para CORS).
6. **Probar** catálogo público y `/admin/login`.
7. **Configurar Cloudinary** y probar la subida/edición de imágenes desde el admin.

---

## 8. Troubleshooting

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| Build instala **JDK 21** / falla por Java | Railpack en vez de Dockerfile | Asegúrate de Root Directory `backend` y `builder = "DOCKERFILE"` en `railway.toml`; el Dockerfile fija `eclipse-temurin:25-*`. |
| `Dockerfile parse error` / `unknown instruction` | BOM o codificación rara | El Dockerfile y `railway.toml` están guardados en UTF-8 **sin BOM**. No los edites con un editor que reintroduzca BOM. |
| `mvnw: permission denied` | Wrapper sin permiso de ejecución | El Dockerfile hace `RUN chmod +x ./mvnw`. |
| Errores de **CORS** en el navegador | `FRONTEND_URL` no coincide | Pon la URL exacta del frontend (https, sin barra final) y redeploy del backend. |
| Backend no conecta a la BD / `DATABASE_URL` mal formada | URL JDBC incorrecta | Usa `jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}` + user/password por referencia. |
| El frontend no ve la API | `NEXT_PUBLIC_API_URL` vacía o local | Defínela con la URL del backend Railway y **reconstruye** (las `NEXT_PUBLIC_*` se fijan en build). |
| Tokens expiran al instante | JWT en segundos | `JWT_ACCESS_EXPIRATION`/`REFRESH` están en **ms**: usa `900000` / `604800000`. |
| **Healthcheck** falla | App no arrancó o puerto incorrecto | Revisa logs; el backend escucha en `$PORT`; healthcheck `/api/health` (back) y `/` (front). |
| Subir imagen falla | Cloudinary sin credenciales | Configura `CLOUDINARY_*`; sin ellas la subida está deshabilitada. |

---

## 9. Notas de seguridad

- **Nunca** commitees `.env` ni credenciales reales. Solo se versionan los `.env.example` (plantillas vacías).
- `docker-compose.yml` y `backend/scripts/seed-catalog-dev.http` son **solo para desarrollo local** (no usan secretos reales).
- Genera un `JWT_SECRET` fuerte y único por entorno; cámbialo si se filtra.
