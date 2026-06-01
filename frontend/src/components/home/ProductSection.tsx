import type { ProductCard } from "@/types/product";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/catalog/ProductGrid";

/**
 * Sección de productos para la home (destacados / nuevos / promociones).
 * Si no hay productos, no se renderiza nada (evita secciones vacías).
 */
export function ProductSection({
  title,
  subtitle,
  href,
  products,
  whatsappEvent = "whatsapp-click",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  products: ProductCard[];
  whatsappEvent?: "whatsapp-click" | "promotion-click";
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title={title} subtitle={subtitle} href={href} />
      <ProductGrid products={products} whatsappEvent={whatsappEvent} />
    </section>
  );
}
