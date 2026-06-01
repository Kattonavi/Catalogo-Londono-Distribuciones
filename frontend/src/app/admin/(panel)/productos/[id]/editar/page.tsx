"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ExternalLink } from "lucide-react";
import {
  getAdminProduct,
  updateProduct,
  type ProductPayload,
} from "@/services/adminProducts";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingBlock, ErrorBlock } from "@/components/admin/States";
import { useToast } from "@/components/admin/Toast";

export default function EditarProductoPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const qc = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => getAdminProduct(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  async function onSubmit(payload: ProductPayload) {
    try {
      await updateProduct(id, payload);
      toast.success("Producto actualizado");
      qc.invalidateQueries({ queryKey: ["admin-product", id] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo actualizar");
    }
  }

  return (
    <div>
      <Link
        href="/admin/productos"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="size-4" /> Volver a productos
      </Link>

      {query.isLoading ? (
        <LoadingBlock label="Cargando producto..." />
      ) : query.isError || !query.data ? (
        <ErrorBlock
          message="No se pudo cargar el producto."
          onRetry={() => query.refetch()}
        />
      ) : (
        <>
          <PageHeader
            title="Editar producto"
            subtitle={query.data.name}
            action={
              <Link
                href={`/productos/${query.data.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                Ver en el sitio <ExternalLink className="size-4" />
              </Link>
            }
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <ProductForm
              product={query.data}
              submitLabel="Guardar cambios"
              onSubmit={onSubmit}
            />
            <ProductImageManager
              product={query.data}
              onChanged={() =>
                qc.invalidateQueries({ queryKey: ["admin-product", id] })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
