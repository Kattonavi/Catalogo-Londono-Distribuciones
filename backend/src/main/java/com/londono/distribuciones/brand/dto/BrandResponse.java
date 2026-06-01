package com.londono.distribuciones.brand.dto;

import com.londono.distribuciones.brand.Brand;

import java.time.Instant;

/** Representacion completa de una marca (uso admin y detalle publico). */
public record BrandResponse(
        Long id,
        String name,
        String slug,
        String description,
        String logoUrl,
        String logoPublicId,
        boolean active,
        int sortOrder,
        Instant createdAt,
        Instant updatedAt
) {
    public static BrandResponse from(Brand brand) {
        return new BrandResponse(
                brand.getId(),
                brand.getName(),
                brand.getSlug(),
                brand.getDescription(),
                brand.getLogoUrl(),
                brand.getLogoPublicId(),
                brand.isActive(),
                brand.getSortOrder(),
                brand.getCreatedAt(),
                brand.getUpdatedAt()
        );
    }
}
