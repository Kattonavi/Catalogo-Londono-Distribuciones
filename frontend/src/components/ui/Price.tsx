import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Bloque de precio: actual destacado + anterior tachado si aplica. */
export function Price({
  currentPrice,
  oldPrice,
  currency = "COP",
  size = "md",
  className,
}: {
  currentPrice: number;
  oldPrice?: number | null;
  currency?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const hasDiscount = oldPrice != null && oldPrice > currentPrice;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "font-extrabold tracking-tight text-slate-900",
          size === "lg" ? "text-3xl" : "text-xl",
        )}
      >
        {formatPrice(currentPrice, currency)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            "font-medium text-slate-400 line-through",
            size === "lg" ? "text-base" : "text-sm",
          )}
        >
          {formatPrice(oldPrice, currency)}
        </span>
      )}
    </div>
  );
}
