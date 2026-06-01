# Roadmap — Catálogo Londoño Distribuciones

> Plan de implementación por fases. Cada fase es entregable e incremental. El objetivo es construir sin improvisar, apoyándose en la documentación base. Las fases pueden solaparse parcialmente, pero el orden de dependencias debe respetarse.

**Estado actual:** Fase 0 completada. Fase 1 (backend base) completada y validada a nivel de build/tests; pendiente la prueba de arranque contra una PostgreSQL real.

Leyenda de estado: ⬜ Pendiente · 🟡 En curso · ✅ Completado

---

## Fase 0 — Documentación y setup ✅

**Objetivo:** dejar la base documental y el esqueleto del monorepo listos para implementar sin improvisar.

- ✅ `README.md` con objetivo, stack, estructura, alcance y estado.
- ✅ `docs/requirements.md`.
- ✅ `docs/architecture.md`.
- ✅ `docs/database-model.md`.
- ✅ `docs/api-contract.md`.
- ✅ `docs/visual-direction.md`.
- ✅ `docs/cloudinary-flow.md`.
- ✅ `docs/roadmap.md`.
- ✅ Estructura del monorepo definida; carpeta `backend/` creada (Fase 1). `frontend/` se creará en la Fase 3.
- ⬜ Definir color de acento de marca y assets básicos (logo, número de WhatsApp) — tarea operativa, no bloquea; se retoma al iniciar el frontend (Fase 3).
- ⬜ Crear cuentas/servicios: repo en GitHub, proyecto en Railway, cuenta Cloudinary — tarea operativa, no bloquea; necesaria para el deploy (Fase 6).

**Entregable:** documentación completa y decisiones de setup tomadas. ✅

---

## Fase 1 — Backend base + Auth + Cloudinary ✅ (validada a nivel de build; pendiente prueba con BD real)

**Objetivo:** API funcional con autenticación segura y flujo de imágenes operativo.

- ✅ Inicializar proyecto Spring Boot 4.0.6 (Java 25, Maven + Maven Wrapper) en `backend/`.
- ✅ Configurar conexión a PostgreSQL y Flyway (Hibernate en `ddl-auto: validate`).
- ✅ Migración inicial `V1__init_schema.sql` con el esquema base completo: `users`, `brands`, `categories`, `products`, `product_events`.
- ✅ Entidades base y repositorios JPA: `User`, `Brand`, `Category`, `Product`, `ProductEvent`.
- ✅ Spring Security base + JWT + Refresh Tokens (refresh token opaco con rotación, almacenado en `users`).
- ✅ Endpoints `/api/auth` (login por **email**, refresh, logout, me).
- ✅ Seed de usuario `ADMIN` inicial (solo si la tabla `users` está vacía; credenciales por variables de entorno).
- ✅ Integración Cloudinary SDK + variables de entorno (`CloudinaryConfig`, `CloudinaryProperties`).
- ✅ `CloudinaryService` con métodos preparados: `uploadImage`, `replaceImage`, `deleteImage`, y validación de imagen (formato jpg/jpeg/png/webp, tamaño máximo configurable).
- ✅ Manejo de errores consistente (formato `ApiError` JSON, `GlobalExceptionHandler`) y CORS restringido a `FRONTEND_URL`.
- ✅ Healthcheck público `GET /api/health`.
- ✅ Build y tests exitosos: `mvn clean test` (3 tests OK) y `mvn -DskipTests package` (JAR ejecutable generado).
- ⬜ **Pendiente:** prueba de arranque real (`mvnw spring-boot:run`) contra una PostgreSQL en ejecución, verificando migraciones Flyway, login y `/api/health` end-to-end.

**Depende de:** Fase 0.
**Entregable:** backend que arranca, autentica y gestiona imágenes; verificable con cliente HTTP. *(Base completa y compilable; falta la verificación funcional contra una BD real.)*

---

## Fase 2 — Productos, marcas y categorías ⬜

**Objetivo:** núcleo del dominio y CRUD admin completo.

- ⬜ Migraciones: `brands`, `categories`, `products`, `product_events`.
- ⬜ Entidades JPA, repositorios y DTOs.
- ⬜ Lógica de negocio: cálculo de descuento, generación de slug, reglas de visibilidad.
- ⬜ CRUD admin de productos (`/api/admin/products`) incluyendo flags e imagen.
- ⬜ CRUD admin de marcas y categorías (con reglas de borrado RESTRICT).
- ⬜ Endpoints públicos de lectura (`/api/public/products`, brands, categories) con filtros y paginación.
- ⬜ Endpoints de eventos de producto (view / whatsapp-click) + contadores.
- ⬜ Endpoints de dashboard (summary, most-viewed, most-whatsapp-clicks).
- ⬜ Tests de los flujos críticos.

**Depende de:** Fase 1.
**Entregable:** API completa según [api-contract.md](api-contract.md).

---

## Fase 3 — Frontend público visual ⬜

**Objetivo:** la cara pública premium, mobile-first, conectada a la API.

- ⬜ Inicializar Next.js 16 + React 19 + TS + Tailwind 4 + shadcn/ui en `frontend/`.
- ⬜ Configurar tokens de diseño (color, tipografía, radios, sombras) según [visual-direction.md](visual-direction.md).
- ⬜ TanStack Query + cliente API + variable `NEXT_PUBLIC_API_BASE_URL`.
- ⬜ Componentes base: ProductCard, Badge, PriceTag, WhatsAppButton, skeletons.
- ⬜ Página **Home** con hero, marcas, destacados, nuevos, promociones, categorías.
- ⬜ Página **Catálogo** con búsqueda, filtros (bottom sheet móvil / sidebar escritorio), orden y grid.
- ⬜ Página **Producto** con galería, precios, descripción y WhatsApp prellenado.
- ⬜ Página **Promociones**.
- ⬜ Registro de eventos (view / whatsapp-click) hacia el backend.
- ⬜ Animaciones suaves (Framer Motion) respetando `reduced-motion`.
- ⬜ Responsive y rendimiento (imágenes Cloudinary optimizadas).

**Depende de:** Fase 2 (API pública).
**Entregable:** sitio público navegable y atractivo, conectado a datos reales.

---

## Fase 4 — Panel admin ⬜

**Objetivo:** gestión cómoda del catálogo desde la web.

- ⬜ Layout de admin (sidebar + contenido) y rutas protegidas.
- ⬜ Login y manejo de sesión (access + refresh) en el frontend.
- ⬜ CRUD de productos con formularios (React Hook Form + Zod), flags y vista previa de descuento.
- ⬜ Subida/reemplazo/eliminación de imágenes con previsualización y progreso.
- ⬜ CRUD de marcas y categorías.
- ⬜ Confirmaciones para acciones destructivas y toasts de feedback.
- ⬜ Manejo de errores de la API en UI.

**Depende de:** Fase 1 (auth) y Fase 2 (CRUD API).
**Entregable:** administrador autónomo para gestionar todo el catálogo.

---

## Fase 5 — Promociones y métricas ⬜

**Objetivo:** pulir la propuesta comercial y cerrar el dashboard.

- ⬜ Refinar la sección de **Promociones** (orden por descuento, énfasis visual).
- ⬜ **Dashboard** admin completo: tarjetas de métricas + listas (más vistos / más clicks WhatsApp).
- ⬜ Verificar conteo correcto de eventos y métricas.
- ⬜ (Opcional) deduplicación de eventos por IP/ventana de tiempo.
- ⬜ Ajustes finos de badges y prioridades visuales.

**Depende de:** Fases 2, 3 y 4.
**Entregable:** experiencia comercial pulida + métricas confiables.

---

## Fase 6 — Deploy Railway y optimización ⬜

**Objetivo:** producción estable, rápida y segura.

- ⬜ Configurar servicios en Railway: PostgreSQL, backend, frontend.
- ⬜ Variables de entorno por servicio (DB, JWT, Cloudinary, CORS, API base URL, WhatsApp).
- ⬜ Pipeline GitHub → Railway (build y deploy por subdirectorio).
- ⬜ Migraciones Flyway aplicadas en el arranque de producción.
- ⬜ Dominios y CORS coherentes (frontend ↔ backend).
- ⬜ Optimización de rendimiento (caché/ISR, imágenes, lazy loading, bundle).
- ⬜ SEO básico (metadatos, slugs, sitemap, Open Graph).
- ⬜ Revisión de seguridad (headers, secretos, rate limiting básico en eventos).
- ⬜ Pruebas finales en producción y checklist de calidad visual ([visual-direction.md](visual-direction.md) §13).

**Depende de:** todas las fases anteriores.
**Entregable:** aplicación en producción, optimizada y lista para usar.

---

## Resumen de fases

| Fase | Nombre | Foco | Depende de |
|------|--------|------|------------|
| 0 | Documentación y setup | Bases y decisiones | — |
| 1 | Backend base + Auth + Cloudinary | API, seguridad, imágenes | 0 |
| 2 | Productos, marcas y categorías | Dominio y CRUD API | 1 |
| 3 | Frontend público visual | Cara pública premium | 2 |
| 4 | Panel admin | Gestión del catálogo | 1, 2 |
| 5 | Promociones y métricas | Pulido comercial + dashboard | 2, 3, 4 |
| 6 | Deploy Railway y optimización | Producción | 0–5 |

> Regla transversal: el alcance se mantiene en **catálogo comercial administrable**. No se añaden inventario, ventas, clientes, créditos ni facturación en ninguna fase.
