"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type {
  ProductCard,
  ProductDetail as ProductDetailType,
} from "@/types/product";
import { productMessage } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import { registerProductEvent } from "@/services/events";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductBadges } from "@/components/ui/ProductBadges";
import { PriceMarquee } from "@/components/ui/PriceMarquee";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export function ProductDetail({
  product,
  related,
}: {
  product: ProductDetailType;
  related: ProductCard[];
}) {
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [showBar, setShowBar] = useState(false);

  // Registra la vista (fire-and-forget; no bloquea nada).
  useEffect(() => {
    registerProductEvent(product.slug, "view");
  }, [product.slug]);

  // Muestra la barra de pedido sticky (móvil) cuando el CTA inline sale de vista.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { rootMargin: "0px 0px -40% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hasDiscount =
    product.oldPrice != null && product.oldPrice > product.currentPrice;
  const isPromo = product.isPromo || product.discountPercentage != null;

  const attributes = [
    { label: "Marca", value: product.brand?.name },
    { label: "Categoría", value: product.category?.name },
    { label: "Sabor", value: product.flavor },
    { label: "Presentación", value: product.presentation },
    { label: "Envase", value: product.containerType },
  ].filter((a) => Boolean(a.value));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-8">
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-400"
      >
        <ChevronLeft className="size-4" /> Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        {/* Vitrina helada. */}
        <div className="ring-frost relative aspect-square overflow-hidden rounded-card border border-border bg-card shadow-editorial">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            brand={product.brand?.name}
            container={product.containerType}
            presentation={product.presentation}
            sizes="(max-width: 1024px) 100vw, 50vw"
            fit="contain"
            priority
          />
          {/* Piso de reflejo sutil para imágenes con fondo. */}
          {product.imageUrl && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-muted/60 to-transparent" />
          )}
          <ProductBadges
            product={product}
            max={3}
            className="absolute left-4 top-4 flex flex-col items-start gap-2"
          />
          {product.discountPercentage != null && (
            <span className="absolute right-4 top-4 grid size-14 -rotate-6 place-items-center rounded-full bg-promo text-center font-display text-base font-black leading-none text-[#0a1024] shadow-[0_12px_28px_-8px_rgba(255,61,110,0.7)]">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Ficha comercial. */}
        <div className="flex flex-col">
          {/* Breadcrumb. */}
          <nav className="eyebrow flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Link href="/catalogo" className="transition-colors hover:text-brand-600">
              Catálogo
            </Link>
            {product.category && (
              <>
                <span className="text-muted-foreground/50">/</span>
                <Link
                  href={`/catalogo?categoria=${product.category.slug}`}
                  className="transition-colors hover:text-brand-600"
                >
                  {product.category.name}
                </Link>
              </>
            )}
          </nav>

          {product.brand && (
            <Link
              href={`/catalogo?marca=${product.brand.slug}`}
              className="mt-4 inline-flex items-center gap-2"
            >
              <span className="h-3.5 w-1 rounded-full bg-lime-accent" />
              <span className="eyebrow text-[12px] text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                {product.brand.name}
              </span>
            </Link>
          )}

          <h1 className="mt-3 font-display text-[clamp(2.25rem,7vw,4rem)] font-black leading-[0.9] tracking-tight text-foreground">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6">
            <div className="price-tag pl-3">
              <PriceMarquee
                currentPrice={product.currentPrice}
                oldPrice={product.oldPrice}
                currency={product.currency}
                size="xl"
                promo={isPromo}
              />
            </div>
            {hasDiscount && product.discountPercentage != null && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-promo/10 px-3 py-1 text-sm font-bold text-promo ring-1 ring-promo/20">
                Ahorras{" "}
                {formatPrice(
                  (product.oldPrice ?? 0) - product.currentPrice,
                  product.currency,
                )}{" "}
                · -{product.discountPercentage}%
              </span>
            )}
          </div>

          <div ref={ctaRef} className="mt-7">
            <WhatsAppButton
              message={productMessage(product.name)}
              label="Pedir por WhatsApp"
              productSlug={product.slug}
              eventType="whatsapp-click"
              size="lg"
              fullWidth
            />
            <p className="mt-2 text-center text-xs text-muted-foreground sm:text-left">
              Respuesta rápida en horario comercial.
            </p>
          </div>

          {/* Ficha técnica tabular. */}
          {attributes.length > 0 && (
            <dl className="mt-8 overflow-hidden rounded-card border border-border bg-card">
              {attributes.map((attr, i) => (
                <div
                  key={attr.label}
                  className={cn(
                    "flex items-center justify-between gap-4 px-5 py-3",
                    i > 0 && "border-t border-border",
                  )}
                >
                  <dt className="eyebrow text-[11px] text-muted-foreground">
                    {attr.label}
                  </dt>
                  <dd className="font-display font-semibold text-foreground">
                    {attr.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {product.description && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-foreground">
                Detalle
              </h2>
              <span className="mt-2 block h-[3px] w-10 rounded-full bg-lime-accent" />
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHeading title="Del mismo estante" />
          <ProductGrid products={related} />
        </div>
      )}

      {/* Barra de pedido sticky (móvil). */}
      <div
        className={cn(
          "glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-border px-4 py-3 transition-transform duration-300 lg:hidden",
          "pb-[calc(0.75rem_+_env(safe-area-inset-bottom))]",
          showBar ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {product.name}
          </p>
          <span className="font-display text-xl font-black tracking-tight text-foreground">
            {formatPrice(product.currentPrice, product.currency)}
          </span>
        </div>
        <WhatsAppButton
          message={productMessage(product.name)}
          label="Pedir"
          productSlug={product.slug}
          eventType="whatsapp-click"
          size="md"
        />
      </div>
    </div>
  );
}
