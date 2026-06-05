import Link from "next/link";
import { Truck, Clock, ShieldCheck } from "lucide-react";

const perks = [
  { icon: ShieldCheck, label: "Marcas confiables" },
  { icon: Clock, label: "Respuesta rápida" },
  { icon: Truck, label: "Entrega local" },
];

export function Footer() {
  const year = 2026;
  return (
    <footer className="relative mt-20 border-t border-border bg-card">
      {/* Cinta soda: remate de marca. */}
      <div className="bg-soda absolute inset-x-0 top-0 h-0.5" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-lg font-black text-white">
                L
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-lime-accent ring-2 ring-card" />
              </span>
              <span className="font-display text-lg font-black tracking-tight text-foreground">
                Londoño Distribuciones
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Distribuidora de gaseosas y bebidas para tu negocio. Marcas
              confiables, precios claros y atención directa por WhatsApp.
            </p>
          </div>

          <div>
            <h3 className="eyebrow text-xs text-foreground">Navegación</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo"
                  className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/promociones"
                  className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                >
                  Promociones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-xs text-foreground">Por qué elegirnos</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {perks.map((perk) => (
                <span
                  key={perk.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  <perk.icon className="size-4 text-brand-500" />
                  {perk.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {year} Londoño Distribuciones. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
