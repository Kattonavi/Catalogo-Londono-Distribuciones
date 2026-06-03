import Link from "next/link";
import { MapPin, Clock, ShieldCheck } from "lucide-react";

export function Footer() {
  const year = 2026;
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-black text-white">
                L
              </span>
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                Londoño Distribuciones
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Distribuidora de productos para tu negocio. Marcas confiables,
              precios claros y atención directa por WhatsApp.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Navegación
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/promociones" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">
                  Promociones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Por qué elegirnos
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-500" /> Marcas
                confiables
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-brand-500" /> Respuesta rápida
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-brand-500" /> Atención local
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {year} Londoño Distribuciones. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
