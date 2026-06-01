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
  "h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200";

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
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
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
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
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
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
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
        <SlidersHorizontal className="size-4 text-slate-400" />
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
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700",
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
            className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
