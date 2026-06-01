package com.londono.distribuciones.product.dto;

import com.londono.distribuciones.brand.dto.BrandSummaryResponse;
import com.londono.distribuciones.category.dto.CategorySummaryResponse;
import com.londono.distribuciones.product.Product;

import java.math.BigDecimal;

/** Detalle publico de un producto (pagina individual). Incluye la descripcion completa. */
public record ProductDetailResponse(
        Long id,
        String name,
        String slug,
        BrandSummaryResponse brand,
        CategorySummaryResponse category,
        String flavor,
        String presentation,
        String containerType,
        String shortDescription,
        String description,
        BigDecimal currentPrice,
        BigDecimal oldPrice,
        Integer discountPercentage,
        String currency,
        String imageUrl,
        boolean isFeatured,
        boolean isNew,
        boolean isPromo
) {
    public static ProductDetailResponse from(Product p) {
        return new ProductDetailResponse(
                p.getId(),
                p.getName(),
                p.getSlug(),
                BrandSummaryResponse.from(p.getBrand()),
                CategorySummaryResponse.from(p.getCategory()),
                p.getFlavor(),
                p.getPresentation(),
                p.getContainerType(),
                p.getShortDescription(),
                p.getDescription(),
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
