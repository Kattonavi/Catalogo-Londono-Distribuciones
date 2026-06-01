package com.londono.distribuciones.product;

import java.math.BigDecimal;

/**
 * Criterio de filtrado de productos (todos los campos opcionales / nullables).
 * Lo usan tanto el catalogo publico como el listado admin; los campos no nulos
 * se traducen a predicados en {@link ProductSpecifications}.
 */
public record ProductQuery(
        String search,
        String brandSlug,
        String categorySlug,
        Long brandId,
        Long categoryId,
        Boolean isFeatured,
        Boolean isNew,
        Boolean isPromo,
        Boolean isVisible,
        Boolean active,
        BigDecimal minPrice,
        BigDecimal maxPrice
) {
}
