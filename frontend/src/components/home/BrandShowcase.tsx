import Link from "next/link";
import Image from "next/image";
import type { BrandSummary } from "@/types/brand";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Strip de marcas; cada una enlaza al catálogo filtrado por esa marca. */
export function BrandShowcase({ brands }: { brands: BrandSummary[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Nuestras marcas" subtitle="Trabajamos con marcas que ya conoces" />
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/catalogo?marca=${brand.slug}`}
            className="flex min-w-[8.5rem] shrink-0 flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-400/70 hover:shadow-[0_20px_44px_-24px_rgba(45,91,255,0.45)]"
          >
            {brand.logoUrl ? (
              <span className="relative size-14 overflow-hidden rounded-full bg-muted">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </span>
            ) : (
              <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-xl font-black text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                {brand.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-center text-sm font-semibold text-foreground">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
