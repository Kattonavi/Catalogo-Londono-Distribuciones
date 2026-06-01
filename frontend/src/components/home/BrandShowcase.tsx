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
            className="flex min-w-[8.5rem] shrink-0 flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {brand.logoUrl ? (
              <span className="relative size-14 overflow-hidden rounded-full bg-slate-50">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </span>
            ) : (
              <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-xl font-black text-brand-600">
                {brand.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-center text-sm font-semibold text-slate-700">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
