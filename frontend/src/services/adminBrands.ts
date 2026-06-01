import { adminGet, adminSend } from "./adminApi";
import type { AdminBrand } from "@/types/admin";

export interface BrandPayload {
  name: string;
  slug?: string;
  description?: string | null;
  active?: boolean;
  sortOrder?: number;
}

export function listAdminBrands(): Promise<AdminBrand[]> {
  return adminGet<AdminBrand[]>("/api/admin/brands");
}

export function createBrand(payload: BrandPayload): Promise<AdminBrand> {
  return adminSend<AdminBrand>(
    "POST",
    "/api/admin/brands",
    payload,
  ) as Promise<AdminBrand>;
}

export function updateBrand(
  id: number,
  payload: BrandPayload,
): Promise<AdminBrand> {
  return adminSend<AdminBrand>(
    "PUT",
    `/api/admin/brands/${id}`,
    payload,
  ) as Promise<AdminBrand>;
}

export function toggleBrandActive(id: number): Promise<AdminBrand> {
  return adminSend<AdminBrand>(
    "PATCH",
    `/api/admin/brands/${id}/toggle-active`,
  ) as Promise<AdminBrand>;
}

export function deleteBrand(id: number): Promise<null> {
  return adminSend<null>("DELETE", `/api/admin/brands/${id}`);
}
