import { adminGet } from "./adminApi";
import type { AnalyticsSummary } from "@/types/admin";

export function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return adminGet<AnalyticsSummary>("/api/admin/products/analytics/summary");
}
