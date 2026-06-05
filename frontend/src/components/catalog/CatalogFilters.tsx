"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { BrandSummary } from "@/types/brand";
import type { CategorySummary } from "@/types/category";
import { cn } from "@/lib/utils";

export type FlagKey = "isPromo" | "isNew" | "isFeatured";

const flagLabels: Record<FlagKey, string> = {
  isPromo: "En promoción",
  isNew: "Nuevos",
  isFeatured: "Destacados",
};

const selectClass =
  "h-11 w-full rounded-full border border-border bg-input px-4 text-sm font-medium text-foreground shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export function CatalogFilters({
  brands,
  categories,
  brandSlug,
  categorySlug,
  sort,
  flags,
  onBrand,
  onCategory,
  onSort,
  onToggleFlag,
  onClear,
  hasActiveFilters,
}: {
  brands: BrandSummary[];
  categories: CategorySummary[];
  brandSlug: string;
  categorySlug: string;
  sort: string;
  flags: Record<FlagKey, boolean>;
  onBrand: (slug: string) => void;
  onCategory: (slug: string) => void;
  onSort: (value: string) => void;
  onToggleFlag: (key: FlagKey) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>
            Marca
          </span>
          <select
            value={brandSlug}
            onChange={(e) => onBrand(e.target.value)}
            className={selectClass}
          >
            <option value="">Todas las marcas</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>
            Categoría
          </span>
          <select
            value={categorySlug}
            onChange={(e) => onCategory(e.target.value)}
            className={selectClass}
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>
            Ordenar
          </span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className={selectClass}
          >
            <option value="">Recomendado</option>
            <option value="newest">Más recientes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="name">Nombre (A–Z)</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="size-4 text-muted-foreground" />
        {(Object.keys(flagLabels) as FlagKey[]).map((key) => {
          const active = flags[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggleFlag(key)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                active
                  ? "border-transparent bg-soda text-white"
                  : "border-border bg-card text-muted-foreground hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400",
              )}
            >
              {flagLabels[key]}
            </button>
          );
        })}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-subtle hover:text-foreground"
          >
            <X className="size-4" /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
