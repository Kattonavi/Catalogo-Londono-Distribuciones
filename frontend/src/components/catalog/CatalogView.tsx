"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  SlidersHorizontal,
  PackageOpen,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchProducts } from "@/services/products";
import { getBrands } from "@/services/brands";
import { getCategories } from "@/services/categories";
import { SearchBar } from "./SearchBar";
import { CatalogFilters, type FlagKey } from "./CatalogFilters";
import { ProductGrid } from "./ProductGrid";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export function CatalogView() {
  const params = useSearchParams();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [brandSlug, setBrandSlug] = useState(() => params.get("marca") ?? "");
  const [categorySlug, setCategorySlug] = useState(
    () => params.get("categoria") ?? "",
  );
  const [sort, setSort] = useState("");
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>(() => ({
    isPromo: params.get("promo") === "true",
    isNew: params.get("nuevo") === "true",
    isFeatured: params.get("destacado") === "true",
  }));
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce de la búsqueda.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  function resetPage() {
    setPage(0);
  }

  const brandsQuery = useQuery({ queryKey: ["brands"], queryFn: getBrands });
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const productsQuery = useQuery({
    queryKey: [
      "products",
      { debouncedSearch, brandSlug, categorySlug, sort, flags, page },
    ],
    queryFn: () =>
      fetchProducts({
        search: debouncedSearch || undefined,
        brandSlug: brandSlug || undefined,
        categorySlug: categorySlug || undefined,
        isPromo: flags.isPromo || undefined,
        isNew: flags.isNew || undefined,
        isFeatured: flags.isFeatured || undefined,
        sort: sort || undefined,
        page,
        size: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const data = productsQuery.data;
  const products = data?.content ?? [];
  const total = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const hasActiveFilters =
    !!brandSlug ||
    !!categorySlug ||
    !!sort ||
    !!debouncedSearch ||
    flags.isPromo ||
    flags.isNew ||
    flags.isFeatured;

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setBrandSlug("");
    setCategorySlug("");
    setSort("");
    setFlags({ isPromo: false, isNew: false, isFeatured: false });
    resetPage();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              resetPage();
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm md:hidden"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="size-4" />
          Filtros
        </button>
      </div>

      <div
        className={cn(
          "rounded-card border border-slate-100 bg-white p-4 shadow-sm md:block",
          showFilters ? "block" : "hidden",
        )}
      >
        <CatalogFilters
          brands={brandsQuery.data ?? []}
          categories={categoriesQuery.data ?? []}
          brandSlug={brandSlug}
          categorySlug={categorySlug}
          sort={sort}
          flags={flags}
          onBrand={(v) => {
            setBrandSlug(v);
            resetPage();
          }}
          onCategory={(v) => {
            setCategorySlug(v);
            resetPage();
          }}
          onSort={(v) => {
            setSort(v);
            resetPage();
          }}
          onToggleFlag={(key) => {
            setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
            resetPage();
          }}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {!productsQuery.isLoading && !productsQuery.isError && (
        <p className="text-sm text-slate-500">
          {total === 0
            ? "Sin resultados"
            : `${total} ${total === 1 ? "producto" : "productos"}`}
        </p>
      )}

      {productsQuery.isLoading ? (
        <SkeletonGrid count={8} />
      ) : productsQuery.isError ? (
        <ErrorState onRetry={() => productsQuery.refetch()} />
      ) : products.length === 0 ? (
        <EmptyState
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />
      ) : (
        <>
          <div
            className={cn(
              "transition-opacity",
              productsQuery.isFetching && "opacity-60",
            )}
          >
            <ProductGrid products={products} />
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page <= 0 || productsQuery.isFetching}
              >
                <ChevronLeft className="size-4" /> Anterior
              </Button>
              <span className="text-sm font-medium text-slate-500">
                Página {page + 1} de {totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => setPage((p) => p + 1)}
                disabled={(data?.last ?? true) || productsQuery.isFetching}
              >
                Siguiente <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({
  hasActiveFilters,
  onClear,
}: {
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-slate-100 text-slate-400">
        <PackageOpen className="size-7" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No encontramos productos
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {hasActiveFilters
          ? "Prueba ajustar la búsqueda o quitar algunos filtros."
          : "Aún no hay productos disponibles. Vuelve pronto."}
      </p>
      {hasActiveFilters && (
        <Button variant="primary" className="mt-5" onClick={onClear}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-rose-200 bg-rose-50/50 px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-rose-100 text-rose-500">
        <AlertTriangle className="size-7" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No pudimos cargar el catálogo
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Revisa tu conexión e inténtalo de nuevo.
      </p>
      <Button variant="primary" className="mt-5" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
