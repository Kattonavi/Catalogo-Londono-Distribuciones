"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Power,
  ChevronLeft,
  ChevronRight,
  Package,
  ChevronsUpDown,
} from "lucide-react";
import {
  listAdminProducts,
  toggleProductFlag,
  softDeleteProduct,
  type AdminProductFilters,
} from "@/services/adminProducts";
import { listAdminBrands } from "@/services/adminBrands";
import { listAdminCategories } from "@/services/adminCategories";
import type { AdminProduct, ProductFlag } from "@/types/admin";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "./PageHeader";
import { ConfirmDialog } from "./Dialog";
import { inputClass, selectClass } from "./fields";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "./States";
import { useToast } from "./Toast";

const PAGE_SIZE = 12;
type TriState = "" | "true" | "false";

export function ProductsAdminView() {
  const toast = useToast();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [activeFilter, setActiveFilter] = useState<TriState>("");
  const [visibleFilter, setVisibleFilter] = useState<TriState>("");
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const brandsQuery = useQuery({
    queryKey: ["admin-brands"],
    queryFn: listAdminBrands,
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: listAdminCategories,
  });

  const filters: AdminProductFilters = {
    search: debounced || undefined,
    brandId: brandId ? Number(brandId) : undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
    active: activeFilter === "" ? undefined : activeFilter === "true",
    isVisible: visibleFilter === "" ? undefined : visibleFilter === "true",
    page,
    size: PAGE_SIZE,
  };

  const query = useQuery({
    queryKey: ["admin-products", filters],
    queryFn: () => listAdminProducts(filters),
    placeholderData: keepPreviousData,
  });

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  }

  const toggleMutation = useMutation({
    mutationFn: ({ id, flag }: { id: number; flag: ProductFlag }) =>
      toggleProductFlag(id, flag),
    onSuccess: () => invalidate(),
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "No se pudo actualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => softDeleteProduct(id),
    onSuccess: () => {
      invalidate();
      toast.success("Producto archivado (oculto e inactivo)");
      setDeleteTarget(null);
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
      setDeleteTarget(null);
    },
  });

  function resetFilters() {
    setSearch("");
    setDebounced("");
    setBrandId("");
    setCategoryId("");
    setActiveFilter("");
    setVisibleFilter("");
    setPage(0);
  }

  const data = query.data;
  const products = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const hasFilters =
    !!debounced || !!brandId || !!categoryId || !!activeFilter || !!visibleFilter;

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Gestiona el catálogo completo"
        action={
          <Link href="/admin/productos/nuevo">
            <Button>
              <Plus className="size-5" /> Nuevo producto
            </Button>
          </Link>
        }
      />

      {/* Filtros */}
      <div className="mb-5 space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Buscar por nombre..."
            className={cn(inputClass, "pl-10")}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={brandId}
            onChange={(e) => {
              setBrandId(e.target.value);
              setPage(0);
            }}
            className={selectClass}
          >
            <option value="">Todas las marcas</option>
            {(brandsQuery.data ?? []).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(0);
            }}
            className={selectClass}
          >
            <option value="">Todas las categorías</option>
            {(categoriesQuery.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value as TriState);
              setPage(0);
            }}
            className={selectClass}
          >
            <option value="">Activos e inactivos</option>
            <option value="true">Solo activos</option>
            <option value="false">Solo inactivos</option>
          </select>
          <select
            value={visibleFilter}
            onChange={(e) => {
              setVisibleFilter(e.target.value as TriState);
              setPage(0);
            }}
            className={selectClass}
          >
            <option value="">Visibles y ocultos</option>
            <option value="true">Solo visibles</option>
            <option value="false">Solo ocultos</option>
          </select>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {query.isLoading ? (
        <LoadingBlock label="Cargando productos..." />
      ) : query.isError ? (
        <ErrorBlock onRetry={() => query.refetch()} />
      ) : products.length === 0 ? (
        <EmptyBlock
          title="Sin productos"
          message={
            hasFilters
              ? "Ningún producto coincide con los filtros."
              : "Crea tu primer producto."
          }
          action={
            hasFilters ? (
              <Button className="mt-2" variant="ghost" onClick={resetFilters}>
                Limpiar filtros
              </Button>
            ) : (
              <Link href="/admin/productos/nuevo" className="mt-2">
                <Button>
                  <Plus className="size-5" /> Nuevo producto
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-opacity",
            query.isFetching && "opacity-60",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Badges</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {p.imageUrl ? (
                            <Image
                              src={p.imageUrl}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="grid h-full w-full place-items-center text-slate-300">
                              <Package className="size-5" />
                            </span>
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {p.name}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {[p.brand?.name, p.category?.name]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {formatPrice(p.currentPrice, p.currency)}
                      </div>
                      {p.discountPercentage != null && (
                        <div className="text-xs text-promo">
                          -{p.discountPercentage}% ·{" "}
                          <span className="text-slate-400 line-through">
                            {formatPrice(p.oldPrice, p.currency)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <FlagPill
                          label="Dest"
                          on={p.isFeatured}
                          onClick={() =>
                            toggleMutation.mutate({ id: p.id, flag: "featured" })
                          }
                        />
                        <FlagPill
                          label="Nuevo"
                          on={p.isNew}
                          onClick={() =>
                            toggleMutation.mutate({ id: p.id, flag: "new" })
                          }
                        />
                        <FlagPill
                          label="Promo"
                          on={p.isPromo}
                          onClick={() =>
                            toggleMutation.mutate({ id: p.id, flag: "promo" })
                          }
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <IconToggle
                          title={p.isVisible ? "Visible" : "Oculto"}
                          on={p.isVisible}
                          onClick={() =>
                            toggleMutation.mutate({ id: p.id, flag: "visible" })
                          }
                        >
                          {p.isVisible ? (
                            <Eye className="size-4" />
                          ) : (
                            <EyeOff className="size-4" />
                          )}
                        </IconToggle>
                        <IconToggle
                          title={p.active ? "Activo" : "Inactivo"}
                          on={p.active}
                          onClick={() =>
                            toggleMutation.mutate({ id: p.id, flag: "active" })
                          }
                        >
                          <Power className="size-4" />
                        </IconToggle>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/productos/${p.id}/editar`}
                          title="Editar"
                          className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
                        >
                          <Pencil className="size-4 text-slate-500" />
                        </Link>
                        <button
                          type="button"
                          title="Archivar"
                          onClick={() => setDeleteTarget(p)}
                          className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
                        >
                          <Trash2 className="size-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page <= 0 || query.isFetching}
          >
            <ChevronLeft className="size-4" /> Anterior
          </Button>
          <span className="text-sm font-medium text-slate-500">
            <ChevronsUpDown className="mr-1 inline size-3 rotate-90" />
            Página {page + 1} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={(data?.last ?? true) || query.isFetching}
          >
            Siguiente <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Archivar producto"
        message={`"${deleteTarget?.name}" se ocultará y desactivará (borrado lógico). No se elimina de la base de datos ni su imagen.`}
        confirmLabel="Archivar"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function FlagPill({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
        on
          ? "bg-brand-600 text-white"
          : "bg-slate-100 text-slate-400 hover:bg-slate-200",
      )}
    >
      {label}
    </button>
  );
}

function IconToggle({
  title,
  on,
  onClick,
  children,
}: {
  title: string;
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(
        "grid size-9 place-items-center rounded-lg transition-colors",
        on
          ? "text-emerald-600 hover:bg-emerald-50"
          : "text-slate-300 hover:bg-slate-100",
      )}
    >
      {children}
    </button>
  );
}
