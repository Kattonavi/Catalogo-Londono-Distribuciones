import type { CategorySummary } from "@/types/category";
import { safeGet } from "./api";

/** Categorías activas (server-safe; nunca lanza). */
export function getCategories(): Promise<CategorySummary[]> {
  return safeGet<CategorySummary[]>("/api/public/categories", []);
}
