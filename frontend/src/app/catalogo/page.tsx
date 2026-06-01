import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora todo el catálogo de Londoño Distribuciones: busca, filtra por marca, categoría y promociones.",
};

export default function CatalogoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Catálogo
        </h1>
        <p className="mt-1 text-slate-500">
          Encuentra productos por marca, categoría o promoción.
        </p>
      </header>

      <Suspense fallback={<SkeletonGrid count={8} />}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
