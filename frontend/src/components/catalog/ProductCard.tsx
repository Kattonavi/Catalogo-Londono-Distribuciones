"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ProductCard as ProductCardType } from "@/types/product";
import { productMessage } from "@/lib/whatsapp";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductBadges } from "@/components/ui/ProductBadges";
import { ProductChips } from "@/components/ui/ProductChips";
import { PriceMarquee } from "@/components/ui/PriceMarquee";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function ProductCard({
  product,
  whatsappEvent = "whatsapp-click",
  priority = false,
}: {
  product: ProductCardType;
  whatsappEvent?: "whatsapp-click" | "promotion-click";
  priority?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-card border border-border bg-card shadow-editorial transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/70 hover:shadow-cold"
    >
      <Link
        href={`/productos/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          brand={product.brand?.name}
          container={product.containerType}
          presentation={product.presentation}
          priority={priority}
          bubbles={false}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Banda de escarcha: funde la imagen con el cuerpo de la tarjeta. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card via-card/55 to-transparent" />

        <ProductBadges
          product={product}
          className="absolute left-3 top-3 flex flex-col items-start gap-1.5"
        />

        {/* Sello circular de descuento (sustituye el rectángulo). */}
        {product.discountPercentage != null && (
          <span className="absolute right-3 top-3 grid size-12 -rotate-6 place-items-center rounded-full bg-promo text-center font-display text-sm font-black leading-none text-[#0a1024] shadow-[0_10px_24px_-8px_rgba(255,61,110,0.7)]">
            -{product.discountPercentage}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && (
          <span className="eyebrow text-[11px] text-brand-600 dark:text-brand-400">
            {product.brand.name}
          </span>
        )}

        <Link href={`/productos/${product.slug}`} className="group/title">
          <h3 className="line-clamp-2 font-display text-[17px] font-bold leading-snug text-foreground transition-colors group-hover/title:text-brand-600 dark:group-hover/title:text-brand-400">
            {product.name}
          </h3>
        </Link>

        <ProductChips product={product} />

        <div className="mt-auto flex flex-col gap-3 pt-3">
          <div className="border-t border-border pt-3">
            <div className="price-tag pl-2.5">
              <PriceMarquee
                currentPrice={product.currentPrice}
                oldPrice={product.oldPrice}
                currency={product.currency}
                promo={product.isPromo || product.discountPercentage != null}
              />
            </div>
          </div>
          <WhatsAppButton
            message={productMessage(product.name)}
            label="WhatsApp"
            productSlug={product.slug}
            eventType={whatsappEvent}
            size="sm"
            fullWidth
            className="justify-center"
          />
        </div>
      </div>
    </motion.article>
  );
}
