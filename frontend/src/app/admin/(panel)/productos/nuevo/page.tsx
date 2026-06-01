"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createProduct, type ProductPayload } from "@/services/adminProducts";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/Toast";

export default function NuevoProductoPage() {
  const router = useRouter();
  const toast = useToast();

  async function onSubmit(payload: ProductPayload) {
    try {
      const created = await createProduct(payload);
      toast.success("Producto creado. Ahora puedes subir su imagen.");
      router.push(`/admin/productos/${created.id}/editar`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo crear el producto");
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
      <PageHeader
        title="Nuevo producto"
        subtitle="Crea el producto; la imagen se sube después de guardar."
      />
      <ProductForm submitLabel="Crear producto" onSubmit={onSubmit} />
    </div>
  );
}
