import Link from "next/link";
import { MapPin, Clock, ShieldCheck } from "lucide-react";

export function Footer() {
  const year = 2026;
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-brand-600 font-black text-white">
                L
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Londoño Distribuciones
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Distribuidora de productos para tu negocio. Marcas confiables,
              precios claros y atención directa por WhatsApp.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Navegación
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-brand-700">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-brand-700">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/promociones" className="hover:text-brand-700">
                  Promociones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Por qué elegirnos
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-600" /> Marcas
                confiables
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-brand-600" /> Respuesta rápida
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-brand-600" /> Atención local
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {year} Londoño Distribuciones. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
