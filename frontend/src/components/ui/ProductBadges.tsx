import type { ProductCard } from "@/types/product";
import { Badge } from "./Badge";

/**
 * Renderiza los badges de un producto con prioridad visual:
 * Promoción > Nuevo > Destacado. `max` limita cuántos se muestran (default 2).
 */
export function ProductBadges({
  product,
  max = 2,
  className,
}: {
  product: Pick<ProductCard, "isPromo" | "isNew" | "isFeatured">;
  max?: number;
  className?: string;
}) {
  const badges: { key: string; node: React.ReactNode }[] = [];
  if (product.isPromo)
    badges.push({ key: "promo", node: <Badge variant="promo">Promo</Badge> });
  if (product.isNew)
    badges.push({ key: "new", node: <Badge variant="new">Nuevo</Badge> });
  if (product.isFeatured)
    badges.push({
      key: "featured",
      node: <Badge variant="featured">Destacado</Badge>,
    });

  if (badges.length === 0) return null;

  return (
    <div className={className}>
      {badges.slice(0, max).map((b) => (
        <span key={b.key}>{b.node}</span>
      ))}
    </div>
  );
}
