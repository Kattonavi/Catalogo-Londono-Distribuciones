import type { BrandSummary } from "./brand";
import type { CategorySummary } from "./category";

/** Usuario autenticado (respuesta de /api/auth/me y del login). */
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

/** Producto completo (ProductResponse) para el panel admin. */
export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  brand: BrandSummary | null;
  category: CategorySummary | null;
  flavor: string | null;
  presentation: string | null;
  containerType: string | null;
  shortDescription: string | null;
  description: string | null;
  currentPrice: number;
  oldPrice: number | null;
  discountPercentage: number | null;
  currency: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  isFeatured: boolean;
  isNew: boolean;
  isPromo: boolean;
  isVisible: boolean;
  active: boolean;
  sortOrder: number;
  viewCount: number;
  whatsappClickCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Marca completa (BrandResponse). */
export interface AdminBrand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  logoPublicId: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Categoría completa (CategoryResponse). */
export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMetricItem {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  count: number;
}

/** Resumen de métricas (AnalyticsSummaryResponse). */
export interface AnalyticsSummary {
  totalProducts: number;
  visibleProducts: number;
  activeProducts: number;
  featuredProducts: number;
  newProducts: number;
  promoProducts: number;
  totalViews: number;
  totalWhatsappClicks: number;
  mostViewedProducts: ProductMetricItem[];
  mostWhatsappClickedProducts: ProductMetricItem[];
}

export interface ProductImageResult {
  productId: number;
  imageUrl: string | null;
  imagePublicId: string | null;
}

/** Banderas booleanas que se pueden alternar vía PATCH. */
export type ProductFlag = "visible" | "active" | "featured" | "new" | "promo";
