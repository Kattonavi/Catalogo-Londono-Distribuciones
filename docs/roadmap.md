# Roadmap — Catálogo Londoño Distribuciones

> Plan de implementación por fases. Cada fase es entregable e incremental. El objetivo es construir sin improvisar, apoyándose en la documentación base. Las fases pueden solaparse parcialmente, pero el orden de dependencias debe respetarse.

**Estado actual:** Fases 0, 1 y 2 completadas y **validadas funcionalmente contra una PostgreSQL real**. Fase 3 (frontend público) en curso: primera versión con `lint` y `build` exitosos; pendiente la verificación visual con datos reales. Pendientes de fondo: subida real de imágenes a Cloudinary (requiere credenciales).

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

## Fase 1 — Backend base + Auth + Cloudinary ✅ (validada funcionalmente contra PostgreSQL real)

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
- ✅ Build y tests exitosos: `mvn clean test` (10 tests OK) y `mvn -DskipTests package` (JAR ejecutable generado).
- ✅ **Validación funcional contra PostgreSQL real** (Docker Compose): Flyway aplicó `V1`+`V2`, se creó el admin seed, y se verificaron `GET /api/health`, `POST /api/auth/login` (email), `POST /api/auth/refresh` (con rotación) y `GET /api/auth/me`.
- ⬜ **Pendiente:** subida real de imágenes a Cloudinary (requiere credenciales válidas). El arranque con `CLOUDINARY_*` vacías se verificó sin errores.

**Depende de:** Fase 0.
**Entregable:** backend que arranca, autentica y gestiona imágenes; verificable con cliente HTTP. ✅ *(Validado contra BD real; solo falta la subida real a Cloudinary.)*

---

## Fase 2 — Productos, marcas y categorías ✅ (validada funcionalmente contra PostgreSQL real)

**Objetivo:** núcleo del dominio y CRUD admin completo.

- ✅ Migración `V2__phase2_catalog_attributes.sql`: atributos comerciales del producto (sabor, presentación, tipo de envase, descripción corta), `active`, `sort_order`, `brands.sort_order` y nuevo evento `PROMOTION_CLICK`. (Las tablas base se crearon en la Fase 1.)
- ✅ Entidades ampliadas (`Brand`, `Product`), repositorios extendidos y DTOs (request/response/summary/card/detail).
- ✅ Lógica de negocio: cálculo de descuento (derivado), generación de slug único (`SlugUtils`), reglas de visibilidad/activación.
- ✅ CRUD admin de productos (`/api/admin/products`) con toggles (visible/active/featured/new/promo), soft delete e imágenes (Cloudinary: subir/reemplazar/eliminar).
- ✅ CRUD admin de marcas y categorías con `toggle-active` y borrado bloqueado si hay productos asociados (409).
- ✅ Endpoints públicos de lectura (`/api/public/products`, featured/new/promotions, detalle por slug, brands, categories) con filtros y paginación (`PageResponse`).
- ✅ Endpoints de eventos de producto por slug (view / whatsapp-click / promotion-click) + contadores denormalizados.
- ✅ Endpoint de métricas admin (`/api/admin/products/analytics/summary`): totales + más vistos + más clicks a WhatsApp.
- ✅ Validaciones (Jakarta Validation) y errores consistentes (`ApiError`, incl. `ConflictException` → 409).
- ✅ Tests unitarios de `SlugUtils` (7) y del cálculo de descuento (3); `mvn clean test` y `package` exitosos.
- ✅ **Validación funcional contra PostgreSQL real** (Docker Compose): crear marca → categoría → producto; descuento derivado correcto (3000→2500 = 17%); slug único (`coca-cola-400-ml-2`); aparición en el catálogo público y detalle por slug; eventos `view`/`whatsapp-click` (202); métricas (`analytics/summary`); regla de borrado de marca con productos (**409**); validación de request inválido (**400**).
- ⬜ **Pendiente:** subida real de imágenes de producto a Cloudinary (requiere credenciales válidas); tests de integración con BD (p. ej. Testcontainers).

**Depende de:** Fase 1.
**Entregable:** API de catálogo completa según [api-contract.md](api-contract.md). ✅ *(Validada contra BD real; solo falta la subida real a Cloudinary.)*

---

## Fase 3 — Frontend público visual 🟡 (integrado con backend real + datos de prueba; pendiente revisión visual humana)

**Objetivo:** la cara pública premium, mobile-first, conectada a la API.

- ✅ Inicializar Next.js 16.2 + React 19.2 + TS + Tailwind 4 en `frontend/` (UI a mano estilo shadcn, sin CLI, para build determinista).
- ✅ Configurar tokens de diseño (color de marca, WhatsApp, badges, radios, tipografía del sistema) según [visual-direction.md](visual-direction.md) vía `@theme`.
- ✅ TanStack Query + capa de servicios (`services/api.ts` con `safeGet`/`getJson`) + variable `NEXT_PUBLIC_API_URL`.
- ✅ Componentes base: `ProductCard`, `Badge`/`ProductBadges`, `Price`, `WhatsAppButton`, `SkeletonCard`, `ProductImage`, `Navbar`, `Footer`.
- ✅ Página **Home** (`/`) con hero, categorías, promociones, destacados, nuevos, marcas y confianza/contacto.
- ✅ Página **Catálogo** (`/catalogo`) con búsqueda (debounce), filtros (marca, categoría, promo/nuevo/destacado), orden, paginación y estados loading/empty/error.
- ✅ Página **Producto** (`/productos/[slug]`) con imagen grande, atributos (sabor/presentación/envase), precios, descuento, badges, WhatsApp y relacionados.
- ✅ Página **Promociones** (`/promociones`) con hero corto, grid y CTA WhatsApp.
- ✅ Registro de eventos (`view` / `whatsapp-click` / `promotion-click`) fire-and-forget hacia el backend, sin bloquear la navegación.
- ✅ Animaciones suaves (motion / Framer Motion) respetando `prefers-reduced-motion`.
- ✅ Responsive mobile-first e imágenes vía `next/image` (Cloudinary) con placeholder.
- ✅ Validación: `npm run lint` y `npm run build` exitosos; smoke test de rutas (`/`, `/catalogo`, `/promociones` → 200; slug inexistente → 404).
- ✅ **Integración real validada** contra backend + PostgreSQL con datos de prueba ([`backend/scripts/seed-catalog-dev.http`](../backend/scripts/seed-catalog-dev.http)): home/promociones renderizan SSR con productos sembrados; filtros del catálogo (marca/categoría/promo/nuevo/destacado) consultan la API correctamente; detalle con atributos, precios, descuento (-17%/-19%) y relacionados; enlaces de WhatsApp con mensaje prellenado por producto; placeholders de imagen correctos sin Cloudinary.
- ✅ Ajuste menor de pulido: el ahorro en el detalle ahora usa formato de moneda (`Ahorras $500 (17%)`).
- ⬜ **Pendiente:** revisión visual humana / capturas (no fue posible automatizar screenshots en este entorno) e imágenes reales de Cloudinary.

**Depende de:** Fase 2 (API pública).
**Entregable:** sitio público navegable y atractivo, integrado con la API real. *(Validado a nivel de lint/build/smoke + integración con datos de prueba; falta la revisión visual humana y las imágenes reales.)*

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
