import type { Metadata } from "next";
import Link from "next/link";
import { Flame } from "lucide-react";
import { getPromotionProducts } from "@/services/products";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BubbleField } from "@/components/ui/BubbleField";
import { BeverageGlyph } from "@/components/ui/BeverageGlyph";
import { buttonClasses } from "@/components/ui/Button";
import { GENERAL_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Promociones",
  description:
    "Productos en promoción de Londoño Distribuciones. Aprovecha los descuentos y pide por WhatsApp.",
};

const PROMO_MESSAGE =
  "Hola, quiero conocer las promociones de Londoño Distribuciones.";

export default async function PromocionesPage() {
  const promotions = await getPromotionProducts(48);
  const count = promotions.length;

  return (
    <div>
      {/* Hero corto. */}
      <section className="grain relative isolate overflow-hidden bg-[#05070f] text-white">
        <div className="bg-grid-onlight grid-fade pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-20 -top-24 size-96 rounded-full bg-promo/30 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-1/2 size-80 rounded-full bg-brand-600/30 blur-[120px]" />
        <BubbleField count={14} accent="rose" className="opacity-70" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-promo/60 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200 backdrop-blur">
              <Flame className="size-3.5 text-promo" /> Ofertas activas
            </span>
            <h1 className="mt-6 font-display text-5xl font-black leading-[0.92] tracking-tight sm:text-7xl">
              <span className="text-frost">Precios</span> de{" "}
              <span className="underline-draw">mayorista</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Los mejores precios del catálogo, en un solo lugar. Pide rápido por
              WhatsApp antes de que se agoten.
            </p>
          </div>

          {count > 0 && (
            <div className="hidden shrink-0 text-right lg:block">
              <div className="font-display text-7xl font-black leading-none text-white">
                {count}
              </div>
              <div className="eyebrow mt-2 text-[11px] text-slate-400">
                {count === 1 ? "oferta viva hoy" : "ofertas vivas hoy"}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {count > 0 ? (
          <ProductGrid products={promotions} whatsappEvent="promotion-click" eager />
        ) : (
          <div className="glass relative flex flex-col items-center justify-center overflow-hidden rounded-card px-6 py-14 text-center">
            <div className="relative size-32 overflow-hidden rounded-card">
              <BeverageGlyph name="Ofertas" brand="Pronto" container="lata" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-black tracking-tight text-foreground">
              Aún no hay ofertas… pero siempre las hay primero por WhatsApp
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Escríbenos y armamos un precio especial para tu pedido. Te
              avisamos apenas salga una promoción.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton
                message={PROMO_MESSAGE}
                label="Pregunta por ofertas"
                size="lg"
              />
              <Link
                href="/catalogo"
                className={buttonClasses("white", "lg")}
              >
                Ver catálogo
              </Link>
            </div>
          </div>
        )}

        {/* Cierre CTA. */}
        <div className="grain relative mt-12 flex flex-col items-center gap-4 overflow-hidden rounded-card bg-[#05070f] px-6 py-12 text-center text-white ring-1 ring-white/10">
          <div className="bg-grid-onlight pointer-events-none absolute inset-0 opacity-70" />
          <BubbleField count={10} className="opacity-50" />
          <div className="pointer-events-none absolute -top-16 left-1/2 size-72 -translate-x-1/2 rounded-full bg-brand-600/30 blur-[110px]" />
          <h2 className="relative font-display text-3xl font-black tracking-tight">
            ¿Quieres pedir alguna promoción?
          </h2>
          <p className="relative max-w-md text-slate-300">
            Escríbenos y te ayudamos a armar tu pedido al instante.
          </p>
          <div className="relative">
            <WhatsAppButton
              message={GENERAL_MESSAGE}
              label="Pedir por WhatsApp"
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
