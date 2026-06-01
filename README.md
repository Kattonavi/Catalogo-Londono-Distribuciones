# Catálogo Londoño Distribuciones

Aplicación web comercial para **Londoño Distribuciones**: un catálogo de productos muy visual, moderno, responsive y profesional, con panel administrativo liviano y pedidos por WhatsApp.

---

## Descripción breve

Sitio público + panel admin que permite mostrar el catálogo de productos de la distribuidora, sus marcas, categorías, promociones, novedades y destacados, con precios claros y contacto/pedido directo por WhatsApp. El administrador gestiona todo el contenido desde un panel liviano, incluyendo imágenes alojadas en Cloudinary.

## Objetivo

Que cualquier visitante responda en segundos:

- ¿Qué vende Londoño Distribuciones?
- ¿Qué marcas maneja?
- ¿Qué productos hay disponibles?
- ¿Cuáles están en promoción, son nuevos o destacados?
- ¿Cuáles son sus precios?
- ¿Cómo pido información o realizo un pedido?

La experiencia debe sentirse **premium, comercial y confiable**, mobile-first, con las imágenes de producto como protagonistas — no una tabla básica de productos.

---

## Stack tecnológico

### Frontend
- Next.js 16.2.x (App Router)
- React 19.2
- TypeScript
- Tailwind CSS 4.x
- shadcn/ui
- Framer Motion / Motion
- Lucide React
- React Hook Form
- Zod
- TanStack Query

### Backend
- Java 25
- Spring Boot 4.0.6
- Spring Security
- JWT + Refresh Tokens
- Spring Data JPA
- PostgreSQL
- Flyway
- Cloudinary Java SDK
- Maven

### Infraestructura / Deploy
- GitHub (repositorio y CI)
- Railway (frontend, backend y PostgreSQL)
- Cloudinary (almacenamiento de imágenes/assets)

---

## Estructura del monorepo

```
Catalogo_Londono_Distribuciones/
├── README.md                  # Este archivo
├── .gitignore
├── docs/                      # Documentación base del proyecto
│   ├── requirements.md        # Requerimientos funcionales y reglas de negocio
│   ├── architecture.md        # Arquitectura, flujos y deploy
│   ├── database-model.md      # Modelo de datos (tablas, campos, relaciones)
│   ├── api-contract.md        # Contrato de la API (endpoints)
│   ├── visual-direction.md    # Dirección visual y diseño UI
│   ├── cloudinary-flow.md     # Flujo de imágenes con Cloudinary
│   └── roadmap.md             # Fases del proyecto
├── backend/                   # API Spring Boot 4 (Fases 1–2: auth + CRUD catálogo)
└── frontend/                  # App Next.js 16 (Fase 3: frontend público)
```

> `backend/` y `frontend/` ya existen. El backend cubre auth + CRUD de catálogo (validado contra PostgreSQL real); el frontend es la primera versión del sitio público. Detalle de avance en el [roadmap](docs/roadmap.md).

---

## Alcance inicial

- Catálogo público de productos.
- Página de inicio muy visual.
- Página de catálogo con búsqueda y filtros.
- Página individual por producto.
- Página/sección de promociones.
- Botones de WhatsApp por producto con mensaje prellenado.
- Panel admin liviano.
- Login seguro para administrador.
- CRUD de productos.
- CRUD de marcas.
- CRUD de categorías.
- Gestión de precio actual, precio anterior y cálculo automático de descuento.
- Marcar productos como nuevos, destacados, en promoción, visibles u ocultos.
- Subida, reemplazo y eliminación de imágenes vía Cloudinary desde el backend.
- Dashboard básico con métricas simples: total de productos, visibles, en promoción, destacados, nuevos, más vistos y con más clicks a WhatsApp.

## Fuera del alcance (inicial)

- Sistema de ventas.
- Carrito de compras.
- Pagos en línea.
- Gestión de clientes.
- Créditos.
- Vendedores.
- Inventario interno.
- Facturación.
- Reportes empresariales avanzados.

> El proyecto se mantiene enfocado en un **catálogo comercial administrable**. No evoluciona hacia un ERP.

---

## Comandos

### Frontend (`frontend/`)
```bash
npm install            # Instalar dependencias
npm run dev            # Servidor de desarrollo (http://localhost:3000)
npm run build          # Build de producción
npm run start          # Servir build de producción
npm run lint           # Linter (ESLint)
```

### Backend (`backend/`)
```bash
./mvnw clean install           # Compilar y empaquetar
./mvnw spring-boot:run         # Ejecutar API en local
./mvnw test                    # Tests
./mvnw flyway:migrate          # Aplicar migraciones de base de datos
```

---

## Estado actual

**🟢 Backend (Fases 1–2) completado y validado · Frontend público (Fase 3) primera versión** — Fases 0 ✅ · 1 ✅ · 2 ✅ · 3 🟡.

El **backend** (Spring Boot 4.0.6) cubre auth (JWT + refresh) y el CRUD de catálogo (productos, marcas, categorías, imágenes Cloudinary, eventos y métricas), **validado funcionalmente contra una PostgreSQL real** (Flyway V1+V2, login/refresh, CRUD y catálogo público). El **frontend** (Next.js 16.2) es la primera versión del sitio público (inicio, catálogo, detalle, promociones), con `lint` y `build` exitosos. **Pendientes:** subida real de imágenes a Cloudinary (requiere credenciales) y verificación visual del frontend con datos reales. Próximos pasos por fases en el [roadmap](docs/roadmap.md).

---

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [requirements.md](docs/requirements.md) | Requerimientos, usuarios, funcionalidades y reglas de negocio |
| [architecture.md](docs/architecture.md) | Arquitectura monorepo, flujos y deploy |
| [database-model.md](docs/database-model.md) | Tablas, campos, tipos y relaciones |
| [api-contract.md](docs/api-contract.md) | Contrato de endpoints de la API |
| [visual-direction.md](docs/visual-direction.md) | Dirección visual y diseño UI |
| [cloudinary-flow.md](docs/cloudinary-flow.md) | Flujo de imágenes con Cloudinary |
| [roadmap.md](docs/roadmap.md) | Fases del proyecto |
