import type { BrandSummary } from "@/types/brand";
import { safeGet } from "./api";
import { DEMO_BRANDS, DEMO_FALLBACK_ENABLED } from "@/lib/demoData";

/** Marcas activas (server-safe; nunca lanza). */
export async function getBrands(): Promise<BrandSummary[]> {
  const brands = await safeGet<BrandSummary[]>("/api/public/brands", []);
  if (DEMO_FALLBACK_ENABLED && brands.length === 0) {
    return DEMO_BRANDS;
  }
  return brands;
}
