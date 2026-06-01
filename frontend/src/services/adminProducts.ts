import { buildQuery } from "./api";
import { adminGet, adminSend, adminUpload } from "./adminApi";
import type { PageResponse } from "@/types/page";
import type {
  AdminProduct,
  ProductFlag,
  ProductImageResult,
} from "@/types/admin";

export interface AdminProductFilters {
  search?: string;
  brandId?: number;
  categoryId?: number;
  active?: boolean;
  isVisible?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  sort?: string;
  page?: number;
  size?: number;
}

export interface ProductPayload {
  name: string;
  slug?: string;
  brandId: number;
  categoryId: number;
  flavor?: string | null;
  presentation?: string | null;
  containerType?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  currentPrice: number;
  oldPrice?: number | null;
  currency?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  isVisible?: boolean;
  active?: boolean;
  sortOrder?: number;
}

export function listAdminProducts(
  filters: AdminProductFilters,
): Promise<PageResponse<AdminProduct>> {
  return adminGet<PageResponse<AdminProduct>>(
    `/api/admin/products${buildQuery({ ...filters })}`,
  );
}

export function getAdminProduct(id: number): Promise<AdminProduct> {
  return adminGet<AdminProduct>(`/api/admin/products/${id}`);
}

export function createProduct(payload: ProductPayload): Promise<AdminProduct> {
  return adminSend<AdminProduct>(
    "POST",
    "/api/admin/products",
    payload,
  ) as Promise<AdminProduct>;
}

export function updateProduct(
  id: number,
  payload: ProductPayload,
): Promise<AdminProduct> {
  return adminSend<AdminProduct>(
    "PUT",
    `/api/admin/products/${id}`,
    payload,
  ) as Promise<AdminProduct>;
}

export function toggleProductFlag(
  id: number,
  flag: ProductFlag,
): Promise<AdminProduct> {
  return adminSend<AdminProduct>(
    "PATCH",
    `/api/admin/products/${id}/toggle-${flag}`,
  ) as Promise<AdminProduct>;
}

export function softDeleteProduct(id: number): Promise<null> {
  return adminSend<null>("DELETE", `/api/admin/products/${id}`);
}

export function uploadProductImage(
  id: number,
  file: File,
): Promise<ProductImageResult> {
  const fd = new FormData();
  fd.append("file", file);
  return adminUpload<ProductImageResult>(
    "POST",
    `/api/admin/products/${id}/image`,
    fd,
  );
}

export function replaceProductImage(
  id: number,
  file: File,
): Promise<ProductImageResult> {
  const fd = new FormData();
  fd.append("file", file);
  return adminUpload<ProductImageResult>(
    "PUT",
    `/api/admin/products/${id}/image`,
    fd,
  );
}

export function deleteProductImage(id: number): Promise<null> {
  return adminSend<null>("DELETE", `/api/admin/products/${id}/image`);
}
