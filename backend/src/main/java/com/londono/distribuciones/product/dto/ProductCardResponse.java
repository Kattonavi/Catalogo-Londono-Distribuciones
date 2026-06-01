package com.londono.distribuciones.product.dto;

import com.londono.distribuciones.brand.dto.BrandSummaryResponse;
import com.londono.distribuciones.category.dto.CategorySummaryResponse;
import com.londono.distribuciones.product.Product;

import java.math.BigDecimal;

/** Tarjeta de producto para los listados publicos (catalogo, home, promociones). */
public record ProductCardResponse(
        Long id,
        String name,
        String slug,
        BrandSummaryResponse brand,
        CategorySummaryResponse category,
        String flavor,
        String presentation,
        String containerType,
        String shortDescription,
        BigDecimal currentPrice,
        BigDecimal oldPrice,
        Integer discountPercentage,
        String currency,
        String imageUrl,
        boolean isFeatured,
        boolean isNew,
        boolean isPromo
) {
    public static ProductCardResponse from(Product p) {
        return new ProductCardResponse(
                p.getId(),
                p.getName(),
                p.getSlug(),
                BrandSummaryResponse.from(p.getBrand()),
                CategorySummaryResponse.from(p.getCategory()),
                p.getFlavor(),
                p.getPresentation(),
                p.getContainerType(),
                p.getShortDescription(),
                p.getCurrentPrice(),
                p.getPreviousPrice(),
                p.getDiscountPercentage(),
                p.getCurrency(),
                p.getImageUrl(),
                p.isFeatured(),
                p.isNew(),
                p.isOnPromotion()
        );
    }
}
