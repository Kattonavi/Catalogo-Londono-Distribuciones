package com.londono.distribuciones.category.dto;

import com.londono.distribuciones.category.Category;

/** Resumen de categoria para listados publicos y para embeber en productos. */
public record CategorySummaryResponse(
        Long id,
        String name,
        String slug
) {
    public static CategorySummaryResponse from(Category category) {
        if (category == null) {
            return null;
        }
        return new CategorySummaryResponse(
                category.getId(),
                category.getName(),
                category.getSlug()
        );
    }
}
