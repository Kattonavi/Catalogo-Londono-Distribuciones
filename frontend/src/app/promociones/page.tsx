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
      <section className="bg-gradient-to-br from-promo to-rose-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
            <Flame className="size-4" /> Ofertas activas
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Promociones
          </h1>
          <p className="mt-3 max-w-xl text-lg text-rose-50">
            Los mejores precios del catálogo, en un solo lugar. Pide rápido por
            WhatsApp antes de que se agoten.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {promotions.length > 0 ? (
          <ProductGrid products={promotions} whatsappEvent="promotion-click" />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-slate-100 text-slate-400">
              <PackageOpen className="size-7" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No hay promociones activas
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
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

        <div className="mt-12 flex flex-col items-center gap-4 rounded-card bg-slate-900 px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-extrabold tracking-tight">
            ¿Quieres pedir alguna promoción?
          </h2>
          <p className="max-w-md text-slate-300">
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
