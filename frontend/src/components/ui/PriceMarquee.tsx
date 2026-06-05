import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type MarqueeSize = "md" | "lg" | "xl";

const sizeClass: Record<MarqueeSize, string> = {
  md: "text-[26px]",
  lg: "text-4xl",
  xl: "text-5xl sm:text-6xl",
};

/**
 * Precio Marquesina: el dato comercial clave compuesto como número de portada
 * (Bricolage 900, tracking apretado). Sufijo de moneda en versalitas; precio
 * anterior tachado ARRIBA-derecha (no al lado) para que el número grande
 * domine; barra-sello lima cuando el producto está en promoción.
 */
export function PriceMarquee({
  currentPrice,
  oldPrice,
  currency = "COP",
  size = "md",
  promo = false,
  className,
}: {
  currentPrice: number;
  oldPrice?: number | null;
  currency?: string;
  size?: MarqueeSize;
  /** Dibuja la barra-sello lima bajo el número (productos en promoción). */
  promo?: boolean;
  className?: string;
}) {
  const hasDiscount = oldPrice != null && oldPrice > currentPrice;

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className="relative">
        <span
          className={cn(
            "block font-display font-black leading-[0.82] tracking-[-0.04em] text-foreground",
            sizeClass[size],
          )}
        >
          {formatPrice(currentPrice, currency)}
        </span>
        {promo && (
          <span className="ink-bar is-on" aria-hidden />
        )}
      </div>
      <div className="flex flex-col items-start gap-0.5 pb-0.5">
        {currency ? (
          <span className="eyebrow text-[10px] leading-none text-muted-foreground">
            {currency}
          </span>
        ) : null}
        {hasDiscount && (
          <span className="text-xs font-semibold leading-none text-muted-foreground line-through">
            {formatPrice(oldPrice, currency)}
          </span>
        )}
      </div>
    </div>
  );
}
