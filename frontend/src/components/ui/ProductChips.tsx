import {
  CupSoda,
  GlassWater,
  Milk,
  Droplet,
  Coffee,
  Tag,
  Package,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ProductCard } from "@/types/product";
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string }>;

/** Icono de presentación según el tipo de envase / presentación / categoría. */
export function containerIcon(
  container?: string | null,
  presentation?: string | null,
  category?: string | null,
): IconType {
  const t = `${container ?? ""} ${presentation ?? ""} ${category ?? ""}`.toLowerCase();
  if (t.includes("lata") || t.includes("can")) return CupSoda;
  if (t.includes("vidrio") || t.includes("glass")) return GlassWater;
  if (t.includes("agua") || t.includes("water")) return Droplet;
  if (t.includes("té") || t.includes("te ") || t.includes("café") || t.includes("cafe"))
    return Coffee;
  if (t.includes("botella") || t.includes("pet") || t.includes("ml") || t.includes("l"))
    return Milk;
  return Package;
}

function Chip({
  icon: Icon,
  label,
  className,
}: {
  icon: IconType;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-subtle px-2 py-0.5 text-[11px] font-semibold text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3 shrink-0 text-brand-500 dark:text-brand-400" />
      <span className="truncate">{label}</span>
    </span>
  );
}

/**
 * Fila de chips comerciales de una tarjeta: categoría + presentación,
 * sustituye el subtítulo plano. Cada chip lleva un icono lucide acorde.
 */
export function ProductChips({
  product,
  className,
}: {
  product: Pick<ProductCard, "category" | "presentation" | "containerType" | "flavor">;
  className?: string;
}) {
  const chips: { key: string; icon: IconType; label: string }[] = [];

  if (product.category?.name) {
    chips.push({ key: "cat", icon: Tag, label: product.category.name });
  }
  const presentation = product.presentation ?? product.flavor;
  if (presentation) {
    chips.push({
      key: "pres",
      icon: containerIcon(
        product.containerType,
        product.presentation,
        product.category?.name,
      ),
      label: presentation,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {chips.map((c) => (
        <Chip key={c.key} icon={c.icon} label={c.label} />
      ))}
    </div>
  );
}
