/* =====================================================================
 * DATOS DEMO DE DESARROLLO — FÁCIL DE ELIMINAR
 * ---------------------------------------------------------------------
 * Catálogo de muestra para validar visualmente las tarjetas, la ficha de
 * producto, las secciones del home y las promociones cuando el backend NO
 * devuelve productos (modo sin API o base vacía).
 *
 * Reglas de seguridad (ver wiring en services/*.ts):
 *  - NUNCA reemplaza datos reales: solo actúa como fallback cuando la fuente
 *    real viene vacía.
 *  - Se puede desactivar por completo con NEXT_PUBLIC_DEMO_FALLBACK=off.
 *  - Para quitarlo: borra este archivo y los pequeños wrappers `withDemo*`
 *    en services/products.ts, services/brands.ts y services/categories.ts.
 *
 * Los ids son NEGATIVOS para no colisionar jamás con ids reales del backend.
 * Todas las imágenes son `null` a propósito: así se luce el placeholder de
 * bebida (sin dependencias de internet).
 * ===================================================================== */

import type { BrandSummary } from "@/types/brand";
import type { CategorySummary } from "@/types/category";
import type { ProductCard, ProductDetail } from "@/types/product";

/** Interruptor maestro. Por defecto activo; SOLO `off` lo desactiva (vacío o
 *  ausente equivale a `on`). Pon `off` en producción. */
export const DEMO_FALLBACK_ENABLED =
  (process.env.NEXT_PUBLIC_DEMO_FALLBACK ?? "").trim().toLowerCase() !== "off";

/** Descuento derivado, replicando la regla del backend. */
function discount(oldPrice: number | null, currentPrice: number): number | null {
  if (oldPrice == null || oldPrice <= currentPrice) return null;
  return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
}

type DemoSeed = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: string;
  flavor: string | null;
  presentation: string | null;
  containerType: string | null;
  shortDescription: string;
  description: string;
  currentPrice: number;
  oldPrice: number | null;
  isFeatured?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
};

/** Catálogo de muestra. El primero es el producto demo solicitado. */
const SEEDS: DemoSeed[] = [
  {
    id: -1,
    name: "Gaseosa Glacial Manzana 1.5L",
    slug: "gaseosa-glacial-manzana-15l",
    brand: "Glacial",
    category: "Gaseosas",
    flavor: "Manzana",
    presentation: "Botella 1.5L",
    containerType: "Botella PET",
    shortDescription:
      "Gaseosa sabor manzana, refrescante y rendidora para tu negocio.",
    description:
      "Gaseosa sabor manzana ideal para tiendas, restaurantes, reuniones y consumo familiar.",
    currentPrice: 4500,
    oldPrice: null,
    isFeatured: true,
  },
  {
    id: -2,
    name: "Agua Cristal sin gas 600 ml",
    slug: "agua-cristal-sin-gas-600ml",
    brand: "Cristal",
    category: "Aguas",
    flavor: null,
    presentation: "Botella 600 ml",
    containerType: "Botella PET",
    shortDescription: "Hidratación pura para el día a día del negocio.",
    description:
      "Agua sin gas de gran pureza, perfecta para tiendas, oficinas y restaurantes. Presentación práctica de 600 ml.",
    currentPrice: 1800,
    oldPrice: null,
    isNew: true,
  },
  {
    id: -3,
    name: "Jugo Hit Mango 500 ml",
    slug: "jugo-hit-mango-500ml",
    brand: "Hit",
    category: "Jugos",
    flavor: "Mango",
    presentation: "Botella 500 ml",
    containerType: "Botella PET",
    shortDescription: "Néctar de mango con el dulce de la fruta natural.",
    description:
      "Jugo de mango refrescante, ideal para acompañar comidas y para la venta rápida en tienda. Sabor intenso y precio rendidor.",
    currentPrice: 2400,
    oldPrice: 3000,
    isPromo: true,
  },
  {
    id: -4,
    name: "Gaseosa Cola Premium 3L",
    slug: "gaseosa-cola-premium-3l",
    brand: "Glacial",
    category: "Gaseosas",
    flavor: "Cola",
    presentation: "Botella 3L",
    containerType: "Botella PET",
    shortDescription: "El formato familiar que más rota en tienda.",
    description:
      "Gaseosa sabor cola en presentación familiar de 3 litros. Rinde más, vende más: la favorita para reuniones, restaurantes y consumo en casa.",
    currentPrice: 6900,
    oldPrice: 7900,
    isFeatured: true,
    isPromo: true,
  },
  {
    id: -5,
    name: "Energizante Volt 250 ml",
    slug: "energizante-volt-250ml",
    brand: "Volt",
    category: "Energizantes",
    flavor: "Cítrico",
    presentation: "Lata 250 ml",
    containerType: "Lata",
    shortDescription: "Energía y recarga para los días intensos.",
    description:
      "Bebida energizante con un perfil cítrico potente. Alta rotación en tiendas, gimnasios y puntos de venta nocturnos.",
    currentPrice: 2800,
    oldPrice: null,
    isNew: true,
  },
  {
    id: -6,
    name: "Té Frío Limón 400 ml",
    slug: "te-frio-limon-400ml",
    brand: "Mr. Tea",
    category: "Tés",
    flavor: "Limón",
    presentation: "Botella 400 ml",
    containerType: "Botella PET",
    shortDescription: "Té helado de limón, ligero y refrescante.",
    description:
      "Té frío sabor limón, equilibrado y poco dulce. Una alternativa fresca para clientes que buscan algo distinto a la gaseosa.",
    currentPrice: 2600,
    oldPrice: null,
    isFeatured: true,
  },
  {
    id: -7,
    name: "Malta Vigor 330 ml",
    slug: "malta-vigor-330ml",
    brand: "Vigor",
    category: "Maltas",
    flavor: "Malta",
    presentation: "Botella 330 ml",
    containerType: "Botella de vidrio",
    shortDescription: "Malta clásica, nutritiva y sin alcohol.",
    description:
      "Bebida de malta sin alcohol, dulce y con cuerpo. Un clásico de tienda que nunca falta en la nevera.",
    currentPrice: 2200,
    oldPrice: 2700,
    isPromo: true,
  },
  {
    id: -8,
    name: "Agua Tónica 250 ml",
    slug: "agua-tonica-250ml",
    brand: "Cristal",
    category: "Aguas",
    flavor: "Tónica",
    presentation: "Lata 250 ml",
    containerType: "Lata",
    shortDescription: "Burbujeante y seca, perfecta para preparar.",
    description:
      "Agua tónica con burbuja fina y final seco. Ideal para coctelería y para clientes que buscan algo más sofisticado.",
    currentPrice: 2500,
    oldPrice: null,
  },
];

// Marcas combinantes (acentos) U+0300–U+036F, vía RegExp por string para
// evitar caracteres combinantes literales en el fuente (robusto en cualquier
// codificación).
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Marcas y categorías derivadas de los seeds (ids negativos, estables).
const brandIndex = new Map<string, BrandSummary>();
const categoryIndex = new Map<string, CategorySummary>();
let brandId = -1;
let categoryId = -1;
for (const s of SEEDS) {
  if (!brandIndex.has(s.brand)) {
    brandIndex.set(s.brand, {
      id: brandId--,
      name: s.brand,
      slug: toSlug(s.brand),
      logoUrl: null,
    });
  }
  if (!categoryIndex.has(s.category)) {
    categoryIndex.set(s.category, {
      id: categoryId--,
      name: s.category,
      slug: toSlug(s.category),
    });
  }
}

export const DEMO_BRANDS: BrandSummary[] = Array.from(brandIndex.values());
export const DEMO_CATEGORIES: CategorySummary[] = Array.from(
  categoryIndex.values(),
);

function toDetail(seed: DemoSeed): ProductDetail {
  return {
    id: seed.id,
    name: seed.name,
    slug: seed.slug,
    brand: brandIndex.get(seed.brand) ?? null,
    category: categoryIndex.get(seed.category) ?? null,
    flavor: seed.flavor,
    presentation: seed.presentation,
    containerType: seed.containerType,
    shortDescription: seed.shortDescription,
    description: seed.description,
    currentPrice: seed.currentPrice,
    oldPrice: seed.oldPrice,
    discountPercentage: discount(seed.oldPrice, seed.currentPrice),
    currency: "COP",
    imageUrl: null,
    isFeatured: Boolean(seed.isFeatured),
    isNew: Boolean(seed.isNew),
    isPromo: Boolean(seed.isPromo),
  };
}

/** Todos los productos demo como ProductDetail (incluye `description`). */
export const DEMO_PRODUCTS: ProductDetail[] = SEEDS.map(toDetail);

/** Vista de tarjeta (sin `description`) para grids y secciones. */
export const DEMO_CARDS: ProductCard[] = DEMO_PRODUCTS.map(
  ({ description: _description, ...card }) => card,
);

export const DEMO_FEATURED: ProductCard[] = DEMO_CARDS.filter(
  (p) => p.isFeatured,
);
export const DEMO_NEW: ProductCard[] = DEMO_CARDS.filter((p) => p.isNew);
export const DEMO_PROMOS: ProductCard[] = DEMO_CARDS.filter((p) => p.isPromo);

/** Busca un producto demo por slug (para la ficha de detalle). */
export function findDemoProduct(slug: string): ProductDetail | null {
  return DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

/** Filtros aceptados por el catálogo (subconjunto de ProductFilters). */
export interface DemoQuery {
  search?: string;
  brandSlug?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  size?: number;
}

/** Página demo de tarjetas respetando filtros, orden y paginación. */
export function queryDemoCards(q: DemoQuery): {
  content: ProductCard[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
} {
  const term = q.search?.trim().toLowerCase();
  let list = DEMO_CARDS.filter((p) => {
    if (q.brandSlug && p.brand?.slug !== q.brandSlug) return false;
    if (q.categorySlug && p.category?.slug !== q.categorySlug) return false;
    if (q.isFeatured && !p.isFeatured) return false;
    if (q.isNew && !p.isNew) return false;
    if (q.isPromo && !p.isPromo) return false;
    if (q.minPrice != null && p.currentPrice < q.minPrice) return false;
    if (q.maxPrice != null && p.currentPrice > q.maxPrice) return false;
    if (term) {
      // Mismos campos que busca el backend (name, shortDescription, flavor,
      // presentation); marca/categoría se filtran por slug, no por texto.
      const haystack = [p.name, p.shortDescription, p.flavor, p.presentation]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  switch (q.sort) {
    case "price_asc":
      list = [...list].sort((a, b) => a.currentPrice - b.currentPrice);
      break;
    case "price_desc":
      list = [...list].sort((a, b) => b.currentPrice - a.currentPrice);
      break;
    case "name":
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
    case "oldest":
      list = [...list].reverse();
      break;
    default:
      break; // newest / recomendado: orden natural
  }

  const size = q.size && q.size > 0 ? q.size : 12;
  const page = q.page && q.page > 0 ? q.page : 0;
  const totalElements = list.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = page * size;
  const content = list.slice(start, start + size);

  return {
    content,
    page,
    size,
    totalElements,
    totalPages,
    first: page === 0,
    last: page >= totalPages - 1,
  };
}

/** Relacionados demo: misma categoría, excluyendo el actual. */
export function relatedDemoCards(
  categorySlug: string | null | undefined,
  excludeSlug: string,
  limit = 4,
): ProductCard[] {
  return DEMO_CARDS.filter(
    (p) =>
      p.slug !== excludeSlug &&
      (!categorySlug || p.category?.slug === categorySlug),
  ).slice(0, limit);
}
