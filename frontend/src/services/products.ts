import type { PageResponse } from "@/types/page";
import type { ProductCard, ProductDetail } from "@/types/product";
import { buildQuery, getJson, safeGet } from "./api";
// Fallback de desarrollo (ver lib/demoData.ts). Solo actúa cuando la fuente
// real viene vacía; nunca oculta productos reales.
import {
  DEMO_FALLBACK_ENABLED,
  DEMO_FEATURED,
  DEMO_NEW,
  DEMO_PROMOS,
  findDemoProduct,
  queryDemoCards,
  relatedDemoCards,
} from "@/lib/demoData";

export interface ProductFilters {
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

export const EMPTY_PAGE: PageResponse<ProductCard> = {
  content: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

/** Catálogo paginado con filtros (cliente; lanza ante errores reales). */
export async function fetchProducts(
  filters: ProductFilters,
): Promise<PageResponse<ProductCard>> {
  const qs = buildQuery({ ...filters });
  const page = await getJson<PageResponse<ProductCard>>(
    `/api/public/products${qs}`,
    EMPTY_PAGE,
  );
  if (DEMO_FALLBACK_ENABLED && page.content.length === 0) {
    return queryDemoCards(filters);
  }
  return page;
}

/** Server-safe: nunca lanza. */
export async function getFeaturedProducts(limit = 8): Promise<ProductCard[]> {
  const list = await safeGet<ProductCard[]>(
    `/api/public/products/featured?limit=${limit}`,
    [],
  );
  if (DEMO_FALLBACK_ENABLED && list.length === 0) {
    return DEMO_FEATURED.slice(0, limit);
  }
  return list;
}

export async function getNewProducts(limit = 8): Promise<ProductCard[]> {
  const list = await safeGet<ProductCard[]>(
    `/api/public/products/new?limit=${limit}`,
    [],
  );
  if (DEMO_FALLBACK_ENABLED && list.length === 0) {
    return DEMO_NEW.slice(0, limit);
  }
  return list;
}

export async function getPromotionProducts(limit = 12): Promise<ProductCard[]> {
  const list = await safeGet<ProductCard[]>(
    `/api/public/products/promotions?limit=${limit}`,
    [],
  );
  if (DEMO_FALLBACK_ENABLED && list.length === 0) {
    return DEMO_PROMOS.slice(0, limit);
  }
  return list;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const product = await safeGet<ProductDetail | null>(
    `/api/public/products/${encodeURIComponent(slug)}`,
    null,
  );
  if (DEMO_FALLBACK_ENABLED && !product) {
    return findDemoProduct(slug);
  }
  return product;
}

/** Productos relacionados por categoría (excluye el actual). Server-safe. */
export async function getRelatedProducts(
  categorySlug: string | null | undefined,
  excludeSlug: string,
  limit = 4,
): Promise<ProductCard[]> {
  const page = categorySlug
    ? await safeGet<PageResponse<ProductCard>>(
        `/api/public/products${buildQuery({ categorySlug, size: limit + 1 })}`,
        EMPTY_PAGE,
      )
    : EMPTY_PAGE;
  const related = page.content
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, limit);
  // El demo solo rellena cuando la fuente REAL vino vacía (no cuando la
  // categoría real solo contiene el propio producto) — así no inyecta demo
  // junto a un producto real.
  if (DEMO_FALLBACK_ENABLED && page.content.length === 0) {
    return relatedDemoCards(categorySlug, excludeSlug, limit);
  }
  return related;
}
