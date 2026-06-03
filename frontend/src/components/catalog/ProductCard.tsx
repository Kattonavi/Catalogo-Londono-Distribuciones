"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ProductCard as ProductCardType } from "@/types/product";
import { productMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductBadges } from "@/components/ui/ProductBadges";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
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
  const subtitle = [product.flavor, product.presentation]
    .filter(Boolean)
    .join(" · ");

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-card border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300/60 hover:shadow-xl hover:shadow-brand-900/5 dark:hover:border-brand-500/40 dark:hover:shadow-black/40"
    >
      <Link
        href={`/productos/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <ProductBadges
          product={product}
          className="absolute left-3 top-3 flex flex-col items-start gap-1.5"
        />
        {product.discountPercentage != null && (
          <Badge
            variant="discount"
            className="absolute right-3 top-3 text-sm shadow"
          >
            -{product.discountPercentage}%
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && (
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            {product.brand.name}
          </span>
        )}
        <Link href={`/productos/${product.slug}`} className="group/title">
          <h3 className="line-clamp-2 font-bold leading-snug text-foreground transition-colors group-hover/title:text-brand-600 dark:group-hover/title:text-brand-400">
            {product.name}
          </h3>
        </Link>
        {subtitle && (
          <p className="line-clamp-1 text-sm text-muted-foreground">{subtitle}</p>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <Price
            currentPrice={product.currentPrice}
            oldPrice={product.oldPrice}
            currency={product.currency}
          />
          <WhatsAppButton
            message={productMessage(product.name)}
            label="WhatsApp"
            productSlug={product.slug}
            eventType={whatsappEvent}
            size="sm"
            fullWidth
            className={cn("justify-center")}
          />
        </div>
      </div>
    </motion.article>
  );
}
