# Frontend — Catálogo Londoño Distribuciones

Frontend **público** del catálogo comercial de Londoño Distribuciones. Primera versión (Fase 3): páginas de inicio, catálogo, detalle de producto y promociones, muy visuales y mobile-first, consumiendo la API pública del backend. **No** incluye panel admin (fase posterior).

---

## Stack

- **Next.js 16.2** (App Router) + **React 19.2** + **TypeScript**
- **Tailwind CSS 4** (configuración CSS-first con `@theme`)
- **motion** (Framer Motion) — animaciones suaves
- **lucide-react** — iconos
- **@tanstack/react-query** — datos del catálogo en cliente (búsqueda/filtros)

> Los componentes UI se construyeron a mano al estilo shadcn/ui (con `cn` = `clsx` + `tailwind-merge`), sin el CLI, para mantener un build determinista.

---

## Requisitos

- Node.js 20+ (probado con Node 22)
- El backend corriendo si quieres datos reales (ver [../backend/README.md](../backend/README.md))

---

## Variables de entorno

Son **públicas** (prefijo `NEXT_PUBLIC_`): se incluyen en el bundle del navegador. No pongas secretos aquí.

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL base del backend (sin barra final) | `http://localhost:8080` |
| `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER` | WhatsApp con código de país, solo dígitos | `573001234567` |

Copia la plantilla y complétala (nunca commitees `.env.local`):

```bash
cp .env.example .env.local
```

> **Sin backend / sin `NEXT_PUBLIC_API_URL`:** el sitio funciona igual mostrando **estados vacíos limpios** (no inventa datos). Para datos reales en SSR, define `NEXT_PUBLIC_API_URL` **antes** del `build` (las variables `NEXT_PUBLIC_` se inlinean en tiempo de build).

---

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # desarrollo (http://localhost:3000)
npm run build      # build de producción
npm run start      # servir el build de producción
npm run lint       # ESLint (config flat de Next 16)
```

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing visual: hero, categorías, promociones, destacados, nuevos, marcas, confianza/contacto |
| `/catalogo` | Catálogo con búsqueda, filtros (marca, categoría, promo/nuevo/destacado), orden, paginación, skeleton/empty/error |
| `/productos/[slug]` | Detalle: imagen grande, marca, categoría, sabor, presentación, envase, precios, descuento, badges, WhatsApp, relacionados |
| `/promociones` | Hero corto + grid de promociones + CTA WhatsApp |

---

## Integración con la API

Consume el contrato de [../docs/api-contract.md](../docs/api-contract.md):

- `GET /api/public/products` (catálogo con filtros y paginación)
- `GET /api/public/products/{featured,new,promotions}`
- `GET /api/public/products/{slug}`
- `GET /api/public/brands`, `GET /api/public/categories`
- `POST /api/public/products/{slug}/events/{view,whatsapp-click,promotion-click}`

Capas:
- `services/api.ts` — `safeGet` (nunca lanza, ideal para SSR y para que el build no falle sin backend) y `getJson` (lanza ante errores reales, para el estado de error del catálogo).
- `services/{products,brands,categories,events}.ts` — funciones por recurso.
- `types/*` — tipos alineados al contrato (`ProductCard`, `ProductDetail`, `PageResponse`, etc.).

### WhatsApp
- Por producto: `"Hola, quiero más información sobre [producto] de Londoño Distribuciones."`
- CTA general: `"Hola, vi el catálogo de Londoño Distribuciones y quiero hacer un pedido."`

### Eventos (analítica)
Fire-and-forget, **nunca bloquean** la navegación a WhatsApp ni rompen la UI si fallan:
- `view` al entrar al detalle de producto.
- `whatsapp-click` al pulsar WhatsApp desde una tarjeta/detalle.
- `promotion-click` al pulsar WhatsApp desde una tarjeta en contexto de promoción.

---

## Estructura

```
src/
├── app/                      # App Router: layout, providers, páginas
│   ├── layout.tsx, page.tsx, providers.tsx, globals.css, not-found.tsx
│   ├── catalogo/page.tsx
│   ├── promociones/page.tsx
│   └── productos/[slug]/page.tsx
├── components/
│   ├── layout/   (Navbar, Footer)
│   ├── home/     (Hero, ProductSection, BrandShowcase, CategoryShowcase, TrustContact)
│   ├── catalog/  (ProductCard, ProductGrid, CatalogView, CatalogFilters, SearchBar)
│   ├── product/  (ProductDetail)
│   └── ui/       (Badge, Button, Price, WhatsAppButton, ProductImage, SkeletonCard, ...)
├── services/     (api, products, brands, categories, events)
├── types/        (product, brand, category, page)
└── lib/          (utils=cn, format, whatsapp)
```

---

## Notas

- **Imágenes:** Cloudinary (`res.cloudinary.com`) configurado en `next.config.ts`; si un producto no tiene imagen se muestra un placeholder con degradado de marca.
- **Tipografía:** stack del sistema (sin descargas externas) para un build fiable; se puede cambiar a una fuente custom con `next/font` más adelante.
- **Accesibilidad/rendimiento:** respeta `prefers-reduced-motion`, usa `next/image`, y las animaciones priorizan `transform`/`opacity`.
