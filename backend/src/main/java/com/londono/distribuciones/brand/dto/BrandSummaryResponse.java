package com.londono.distribuciones.brand.dto;

import com.londono.distribuciones.brand.Brand;

/** Resumen de marca para listados publicos y para embeber en productos. */
public record BrandSummaryResponse(
        Long id,
        String name,
        String slug,
        String logoUrl
) {
    public static BrandSummaryResponse from(Brand brand) {
        if (brand == null) {
            return null;
        }
        return new BrandSummaryResponse(
                brand.getId(),
                brand.getName(),
                brand.getSlug(),
                brand.getLogoUrl()
        );
    }
}
