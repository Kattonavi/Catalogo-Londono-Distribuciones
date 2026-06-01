package com.londono.distribuciones.product.dto;

import com.londono.distribuciones.brand.dto.BrandSummaryResponse;
import com.londono.distribuciones.category.dto.CategorySummaryResponse;
import com.londono.distribuciones.product.Product;

import java.math.BigDecimal;
import java.time.Instant;

/** Representacion completa de un producto para el panel admin. */
public record ProductResponse(
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
        String imagePublicId,
        boolean isFeatured,
        boolean isNew,
        boolean isPromo,
        boolean isVisible,
        boolean active,
        int sortOrder,
        long viewCount,
        long whatsappClickCount,
        Instant createdAt,
        Instant updatedAt
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
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
                p.getImagePublicId(),
                p.isFeatured(),
                p.isNew(),
                p.isOnPromotion(),
                p.isVisible(),
                p.isActive(),
                p.getSortOrder(),
                p.getViewCount(),
                p.getWhatsappClickCount(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
