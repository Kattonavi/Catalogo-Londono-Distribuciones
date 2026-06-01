import { Hero } from "@/components/home/Hero";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { TrustContact } from "@/components/home/TrustContact";
import {
  getFeaturedProducts,
  getNewProducts,
  getPromotionProducts,
} from "@/services/products";
import { getBrands } from "@/services/brands";
import { getCategories } from "@/services/categories";

export default async function HomePage() {
  const [featured, news, promotions, brands, categories] = await Promise.all([
    getFeaturedProducts(8),
    getNewProducts(8),
    getPromotionProducts(8),
    getBrands(),
    getCategories(),
  ]);

  return (
    <>
      <Hero />
      <CategoryShowcase categories={categories} />
      <ProductSection
        title="Promociones"
        subtitle="Aprovecha los mejores precios"
        href="/promociones"
        products={promotions}
        whatsappEvent="promotion-click"
      />
      <ProductSection
        title="Productos destacados"
        subtitle="Lo que más recomendamos"
        href="/catalogo?destacado=true"
        products={featured}
      />
      <ProductSection
        title="Nuevos ingresos"
        subtitle="Lo último que llegó"
        href="/catalogo?nuevo=true"
        products={news}
      />
      <BrandShowcase brands={brands} />
      <TrustContact />
    </>
  );
}
