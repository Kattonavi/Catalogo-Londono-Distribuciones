import type { PageResponse } from "@/types/page";
import type { ProductCard, ProductDetail } from "@/types/product";
import { buildQuery, getJson, safeGet } from "./api";

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
export function fetchProducts(
  filters: ProductFilters,
): Promise<PageResponse<ProductCard>> {
  const qs = buildQuery({ ...filters });
  return getJson<PageResponse<ProductCard>>(
    `/api/public/products${qs}`,
    EMPTY_PAGE,
  );
}

/** Server-safe: nunca lanza. */
export function getFeaturedProducts(limit = 8): Promise<ProductCard[]> {
  return safeGet<ProductCard[]>(
    `/api/public/products/featured?limit=${limit}`,
    [],
  );
}

export function getNewProducts(limit = 8): Promise<ProductCard[]> {
  return safeGet<ProductCard[]>(`/api/public/products/new?limit=${limit}`, []);
}

export function getPromotionProducts(limit = 12): Promise<ProductCard[]> {
  return safeGet<ProductCard[]>(
    `/api/public/products/promotions?limit=${limit}`,
    [],
  );
}

export function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  return safeGet<ProductDetail | null>(
    `/api/public/products/${encodeURIComponent(slug)}`,
    null,
  );
}

/** Productos relacionados por categoría (excluye el actual). Server-safe. */
export async function getRelatedProducts(
  categorySlug: string | null | undefined,
  excludeSlug: string,
  limit = 4,
): Promise<ProductCard[]> {
  if (!categorySlug) return [];
  const page = await safeGet<PageResponse<ProductCard>>(
    `/api/public/products${buildQuery({ categorySlug, size: limit + 1 })}`,
    EMPTY_PAGE,
  );
  return page.content.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}
