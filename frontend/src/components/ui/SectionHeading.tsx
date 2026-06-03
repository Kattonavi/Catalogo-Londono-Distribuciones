import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Encabezado de sección con título, subtítulo y enlace opcional "ver todo". */
export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel = "Ver todo",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-lime-accent" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Londoño
          </span>
        </div>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand-400/70 hover:text-brand-600 dark:hover:text-brand-400"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
