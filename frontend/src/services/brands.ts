import type { BrandSummary } from "@/types/brand";
import { safeGet } from "./api";

/** Marcas activas (server-safe; nunca lanza). */
export function getBrands(): Promise<BrandSummary[]> {
  return safeGet<BrandSummary[]>("/api/public/brands", []);
}
