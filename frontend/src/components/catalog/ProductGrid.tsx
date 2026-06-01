import type { ProductCard as ProductCardType } from "@/types/product";
import { ProductCard } from "./ProductCard";

/** Rejilla responsive de tarjetas de producto. */
export function ProductGrid({
  products,
  whatsappEvent = "whatsapp-click",
}: {
  products: ProductCardType[];
  whatsappEvent?: "whatsapp-click" | "promotion-click";
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          whatsappEvent={whatsappEvent}
          priority={i < 4}
        />
      ))}
    </div>
  );
}
