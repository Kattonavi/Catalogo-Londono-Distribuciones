import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora todo el catálogo de Londoño Distribuciones: busca, filtra por marca, categoría y promociones.",
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // La URL es la fuente de verdad de los filtros iniciales: usamos el query
  // como `key` para remontar CatalogView ante cualquier cambio de query
  // (navegación entre /catalogo?x y /catalogo?y, back/forward), reejecutando
  // los inicializadores que leen los filtros.
  const sp = await searchParams;
  const catalogKey = JSON.stringify(sp);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-lime-accent" />
          <span className="eyebrow text-xs text-muted-foreground">
            Todo el catálogo
          </span>
        </div>
        <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Bebidas <span className="text-brand-600 dark:text-brand-400">frías</span>{" "}
          para tu negocio
        </h1>
        <p className="mt-2 text-muted-foreground">
          Encuentra productos por marca, categoría o promoción.
        </p>
      </header>

      <Suspense fallback={<SkeletonGrid count={8} />}>
        <CatalogView key={catalogKey} />
      </Suspense>
    </div>
  );
}
