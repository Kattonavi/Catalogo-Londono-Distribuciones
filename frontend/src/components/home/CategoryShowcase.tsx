import Link from "next/link";
import { Tag } from "lucide-react";
import type { CategorySummary } from "@/types/category";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Chips de categorías que enlazan al catálogo filtrado. */
export function CategoryShowcase({
  categories,
}: {
  categories: CategorySummary[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        title="Explora por categoría"
        subtitle="Encuentra justo lo que buscas"
      />
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/catalogo?categoria=${category.slug}`}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-brand-400/70 hover:bg-brand-500 hover:text-white"
          >
            <Tag className="size-4 text-brand-500 transition-colors group-hover:text-lime-accent" />
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
