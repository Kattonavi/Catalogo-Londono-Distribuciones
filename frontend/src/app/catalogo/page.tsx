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
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-lime-accent" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Todo el catálogo
          </span>
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Catálogo
        </h1>
        <p className="mt-2 text-muted-foreground">
          Encuentra productos por marca, categoría o promoción.
        </p>
      </header>

      <Suspense fallback={<SkeletonGrid count={8} />}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
