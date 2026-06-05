import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "promo"
  | "new"
  | "featured"
  | "discount"
  | "neutral";

// Texto navy oscuro sobre los fondos claros (cyan/ámbar/rosa) para cumplir
// contraste WCAG AA (blanco sobre estos tonos no llega a 4.5:1).
const variantStyles: Record<BadgeVariant, string> = {
  promo: "bg-promo text-[#0a1024] shadow-[0_0_0_3px_rgba(200,255,61,0.18)]",
  new: "bg-new text-[#0a1024]",
  featured: "bg-featured text-[#0a1024]",
  discount: "bg-promo text-[#0a1024] shadow-sm",
  neutral: "bg-foreground/80 text-background backdrop-blur",
};

export function Badge({
  variant = "neutral",
  children,
  className,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
