"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ProductCard, ProductDetail as ProductDetailType } from "@/types/product";
import { productMessage } from "@/lib/whatsapp";
import { registerProductEvent } from "@/services/events";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductBadges } from "@/components/ui/ProductBadges";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
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
  // Registra la vista (fire-and-forget; no bloquea nada).
  useEffect(() => {
    registerProductEvent(product.slug, "view");
  }, [product.slug]);

  const attributes = [
    { label: "Marca", value: product.brand?.name },
    { label: "Categoría", value: product.category?.name },
    { label: "Sabor", value: product.flavor },
    { label: "Presentación", value: product.presentation },
    { label: "Envase", value: product.containerType },
  ].filter((a) => Boolean(a.value));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-brand-700"
      >
        <ChevronLeft className="size-4" /> Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative aspect-square overflow-hidden rounded-card border border-slate-100 bg-white">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <ProductBadges
            product={product}
            max={3}
            className="absolute left-4 top-4 flex flex-col items-start gap-2"
          />
          {product.discountPercentage != null && (
            <Badge
              variant="discount"
              className="absolute right-4 top-4 text-base shadow"
            >
              -{product.discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Información */}
        <div className="flex flex-col">
          {product.brand && (
            <Link
              href={`/catalogo?marca=${product.brand.slug}`}
              className="text-sm font-bold uppercase tracking-wide text-brand-600 hover:text-brand-800"
            >
              {product.brand.name}
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {product.name}
          </h1>
          {product.shortDescription && (
            <p className="mt-3 text-lg text-slate-500">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6">
            <Price
              currentPrice={product.currentPrice}
              oldPrice={product.oldPrice}
              currency={product.currency}
              size="lg"
            />
            {product.discountPercentage != null && product.oldPrice != null && (
              <p className="mt-1 text-sm font-semibold text-promo">
                Ahorras{" "}
                {Math.round(product.oldPrice - product.currentPrice).toLocaleString(
                  "es-CO",
                )}{" "}
                ({product.discountPercentage}%)
              </p>
            )}
          </div>

          <div className="mt-7">
            <WhatsAppButton
              message={productMessage(product.name)}
              label="Pedir por WhatsApp"
              productSlug={product.slug}
              eventType="whatsapp-click"
              size="lg"
              fullWidth
            />
          </div>

          {attributes.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-card border border-slate-100 bg-white p-5">
              {attributes.map((attr) => (
                <div key={attr.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {attr.label}
                  </dt>
                  <dd className="mt-0.5 font-semibold text-slate-800">
                    {attr.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {product.description && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">Descripción</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHeading title="También te puede interesar" />
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
