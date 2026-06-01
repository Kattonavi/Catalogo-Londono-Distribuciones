import type { BrandSummary } from "./brand";
import type { CategorySummary } from "./category";

/** Tarjeta de producto del catálogo público (ProductCardResponse). */
export interface ProductCard {
  id: number;
  name: string;
  slug: string;
  brand: BrandSummary | null;
  category: CategorySummary | null;
  flavor: string | null;
  presentation: string | null;
  containerType: string | null;
  shortDescription: string | null;
  currentPrice: number;
  oldPrice: number | null;
  discountPercentage: number | null;
  currency: string;
  imageUrl: string | null;
  isFeatured: boolean;
  isNew: boolean;
  isPromo: boolean;
}

/** Detalle público del producto (ProductDetailResponse): tarjeta + descripción. */
export interface ProductDetail extends ProductCard {
  description: string | null;
}
