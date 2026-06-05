import type { CategorySummary } from "@/types/category";
import { safeGet } from "./api";
import { DEMO_CATEGORIES, DEMO_FALLBACK_ENABLED } from "@/lib/demoData";

/** Categorías activas (server-safe; nunca lanza). */
export async function getCategories(): Promise<CategorySummary[]> {
  const categories = await safeGet<CategorySummary[]>(
    "/api/public/categories",
    [],
  );
  if (DEMO_FALLBACK_ENABLED && categories.length === 0) {
    return DEMO_CATEGORIES;
  }
  return categories;
}
