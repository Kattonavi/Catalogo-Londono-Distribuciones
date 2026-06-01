import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "promo"
  | "new"
  | "featured"
  | "discount"
  | "neutral";

const variantStyles: Record<BadgeVariant, string> = {
  promo: "bg-promo text-white",
  new: "bg-new text-white",
  featured: "bg-featured text-white",
  discount: "bg-promo text-white shadow-sm",
  neutral: "bg-slate-900/80 text-white backdrop-blur",
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
