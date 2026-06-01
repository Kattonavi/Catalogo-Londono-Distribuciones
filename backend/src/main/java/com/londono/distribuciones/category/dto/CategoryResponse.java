package com.londono.distribuciones.category.dto;

import com.londono.distribuciones.category.Category;

import java.time.Instant;

/** Representacion completa de una categoria (uso admin y detalle publico). */
public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String description,
        boolean active,
        int sortOrder,
        Instant createdAt,
        Instant updatedAt
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.isActive(),
                category.getSortOrder(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
