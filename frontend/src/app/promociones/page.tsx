import type { Metadata } from "next";
import Link from "next/link";
import { Flame, PackageOpen } from "lucide-react";
import { getPromotionProducts } from "@/services/products";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { buttonClasses } from "@/components/ui/Button";
import { GENERAL_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Promociones",
  description:
    "Productos en promoción de Londoño Distribuciones. Aprovecha los descuentos y pide por WhatsApp.",
};

export default async function PromocionesPage() {
  const promotions = await getPromotionProducts(48);

  return (
    <div>
      {/* Hero corto */}
      <section className="grain relative isolate overflow-hidden bg-[#05070f] text-white">
        <div className="bg-grid-onlight grid-fade pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-20 -top-24 size-96 rounded-full bg-promo/30 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-1/2 size-80 rounded-full bg-brand-600/30 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-promo/60 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200 backdrop-blur">
            <Flame className="size-3.5 text-promo" /> Ofertas activas
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Promo
            <span className="relative text-promo">
              ciones
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-lime-accent" />
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Los mejores precios del catálogo, en un solo lugar. Pide rápido por
            WhatsApp antes de que se agoten.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {promotions.length > 0 ? (
          <ProductGrid products={promotions} whatsappEvent="promotion-click" />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
              <PackageOpen className="size-7" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-foreground">
              No hay promociones activas
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Vuelve pronto o explora todo el catálogo mientras tanto.
            </p>
            <Link
              href="/catalogo"
              className={buttonClasses("primary", "md", "mt-5")}
            >
              Ver catálogo
            </Link>
          </div>
        )}

        <div className="grain relative mt-12 flex flex-col items-center gap-4 overflow-hidden rounded-card bg-[#05070f] px-6 py-12 text-center text-white ring-1 ring-white/10">
          <div className="bg-grid-onlight pointer-events-none absolute inset-0 opacity-70" />
          <div className="pointer-events-none absolute -top-16 left-1/2 size-72 -translate-x-1/2 rounded-full bg-brand-600/30 blur-[110px]" />
          <h2 className="relative font-display text-3xl font-extrabold tracking-tight">
            ¿Quieres pedir alguna promoción?
          </h2>
          <p className="relative max-w-md text-slate-300">
            Escríbenos y te ayudamos a armar tu pedido al instante.
          </p>
          <WhatsAppButton
            message={GENERAL_MESSAGE}
            label="Pedir por WhatsApp"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}
