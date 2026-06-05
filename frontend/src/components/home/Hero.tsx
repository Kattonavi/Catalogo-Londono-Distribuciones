"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ProductCard } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ProductImage } from "@/components/ui/ProductImage";
import { BubbleField } from "@/components/ui/BubbleField";
import { GENERAL_MESSAGE } from "@/lib/whatsapp";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { v: "+50", k: "Marcas" },
  { v: "24/7", k: "Pedidos" },
  { v: "1 toque", k: "WhatsApp" },
];

export function Hero({ featured }: { featured?: ProductCard | null }) {
  const reduce = useReducedMotion();

  const lines: ReactNode[] = [
    <>
      Bebidas <span className="text-frost">frías</span>,
    </>,
    <>precios claros,</>,
    <>
      pedido <span className="underline-draw">al toque</span>.
    </>,
  ];

  return (
    <section className="grain relative isolate overflow-hidden bg-[#05070f] text-white">
      {/* Rejilla técnica + difuminado. */}
      <div className="bg-grid-onlight grid-fade pointer-events-none absolute inset-0" />
      {/* Flujo diagonal soda (un único eje, no orbes centrados). */}
      <div className="bg-soda pointer-events-none absolute right-0 top-0 h-full w-2/3 opacity-25 [mask-image:linear-gradient(225deg,#000,transparent_62%)]" />
      {/* Frost glow cyan + glow de marca (atmósfera fría). */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-new/20 blur-[130px]" />
      <div className="pointer-events-none absolute -left-24 bottom-[-8rem] size-[26rem] rounded-full bg-brand-600/30 blur-[120px]" />
      {/* Columna de Burbujas. */}
      <BubbleField count={16} className="opacity-70" />
      {/* Línea superior de acento. */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8">
        <div>
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur"
          >
            <span className="h-3.5 w-1 rounded-full bg-lime-accent" />
            <span className="eyebrow text-[11px] text-brand-200">
              Distribución de gaseosas y bebidas · Tu zona
            </span>
          </motion.span>

          <h1 className="mt-7 font-display text-5xl font-black leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.09 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.42 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300"
          >
            Surtimos a tiendas, restaurantes, negocios y hogares de la zona con
            las mejores marcas. Explora el catálogo y pide al instante por
            WhatsApp.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.5 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/catalogo"
              className="frost-sweep group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-soda px-7 text-base font-semibold text-white shadow-lg shadow-brand-600/40 transition-transform active:scale-[0.98]"
            >
              Ver catálogo
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <WhatsAppButton
              message={GENERAL_MESSAGE}
              label="Pedir por WhatsApp"
              size="lg"
            />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.58 }}
            className="mt-12 flex max-w-md gap-5 border-t border-white/10 pt-6"
          >
            {stats.map((s, i) => (
              <div key={s.k} className={cn(i > 0 && "border-l border-white/10 pl-5")}>
                <div className="font-display text-3xl font-black tracking-tight text-white">
                  {s.v}
                </div>
                <div className="eyebrow mt-1 text-[10px] text-slate-400">{s.k}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Panel-vaso: recorte de revista del producto destacado. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-brand-600/30 to-new/10 blur-2xl" />
          {/* Glass OSCURO fijo (no .glass, que en claro es blanco e invisibiliza el texto blanco). */}
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(124,154,255,0.12),0_18px_40px_-24px_rgba(45,91,255,0.5)] backdrop-blur-md">
            {/* Líquido que sube al cargar + burbujas densas. */}
            <div className="bg-soda liquid-fill pointer-events-none absolute inset-x-0 bottom-0 h-2/5 opacity-25" />
            <BubbleField count={12} seed={23} className="opacity-80" />
            {/* Sello lima. */}
            <span className="absolute right-5 top-5 z-10 -rotate-6 rounded-full bg-lime-accent px-3 py-1 font-display text-xs font-black uppercase tracking-wide text-[#06121a] shadow-lg">
              {featured?.isPromo ? "Oferta" : "Destacado"}
            </span>

            <div className="relative z-10">
              {featured ? (
                <FeaturedPreview product={featured} />
              ) : (
                <DecorativePreview />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedPreview({ product }: { product: ProductCard }) {
  const hasDiscount =
    product.oldPrice != null && product.oldPrice > product.currentPrice;
  return (
    <Link href={`/productos/${product.slug}`} className="block">
      <div className="relative mx-auto aspect-[4/5] w-2/3 overflow-hidden rounded-2xl border border-white/10 bg-[#0c1326]">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          brand={product.brand?.name}
          container={product.containerType}
          presentation={product.presentation}
          sizes="240px"
          priority
        />
      </div>
      <div className="mt-5">
        {product.brand && (
          <span className="eyebrow text-[11px] text-brand-200">
            {product.brand.name}
          </span>
        )}
        <p className="mt-1 line-clamp-2 font-display text-xl font-bold leading-tight text-white">
          {product.name}
        </p>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-3xl font-black tracking-tight text-white">
            {formatPrice(product.currentPrice, product.currency)}
          </span>
          {hasDiscount && (
            <span className="pb-1 text-sm font-medium text-slate-400 line-through">
              {formatPrice(product.oldPrice, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function DecorativePreview() {
  return (
    <div className="py-6">
      <div className="mx-auto aspect-[4/5] w-2/3 overflow-hidden rounded-2xl border border-white/10">
        <ProductImage src={null} alt="Bebida fría" />
      </div>
      <p className="mt-5 font-display text-xl font-bold leading-tight text-white">
        Catálogo fresco,
        <br /> listo para tu negocio.
      </p>
    </div>
  );
}
