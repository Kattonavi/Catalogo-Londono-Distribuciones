import { adminGet, adminSend } from "./adminApi";
import type { AdminCategory } from "@/types/admin";

export interface CategoryPayload {
  name: string;
  slug?: string;
  description?: string | null;
  active?: boolean;
  sortOrder?: number;
}

export function listAdminCategories(): Promise<AdminCategory[]> {
  return adminGet<AdminCategory[]>("/api/admin/categories");
}

export function createCategory(
  payload: CategoryPayload,
): Promise<AdminCategory> {
  return adminSend<AdminCategory>(
    "POST",
    "/api/admin/categories",
    payload,
  ) as Promise<AdminCategory>;
}

export function updateCategory(
  id: number,
  payload: CategoryPayload,
): Promise<AdminCategory> {
  return adminSend<AdminCategory>(
    "PUT",
    `/api/admin/categories/${id}`,
    payload,
  ) as Promise<AdminCategory>;
}

export function toggleCategoryActive(id: number): Promise<AdminCategory> {
  return adminSend<AdminCategory>(
    "PATCH",
    `/api/admin/categories/${id}/toggle-active`,
  ) as Promise<AdminCategory>;
}

export function deleteCategory(id: number): Promise<null> {
  return adminSend<null>("DELETE", `/api/admin/categories/${id}`);
}
