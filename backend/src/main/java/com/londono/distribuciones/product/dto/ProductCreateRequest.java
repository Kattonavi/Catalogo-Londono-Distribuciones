package com.londono.distribuciones.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Datos para crear un producto. El slug es opcional (se genera desde el nombre).
 * El descuento NO se recibe: se calcula en el backend a partir de los precios.
 */
public record ProductCreateRequest(
        @NotBlank @Size(max = 180) String name,
        @Size(max = 200) String slug,
        @NotNull Long brandId,
        @NotNull Long categoryId,
        @Size(max = 120) String flavor,
        @Size(max = 120) String presentation,
        @Size(max = 60) String containerType,
        @Size(max = 300) String shortDescription,
        String description,
        @NotNull @PositiveOrZero BigDecimal currentPrice,
        @PositiveOrZero BigDecimal oldPrice,
        @Size(max = 3) String currency,
        Boolean isFeatured,
        Boolean isNew,
        Boolean isPromo,
        Boolean isVisible,
        Boolean active,
        Integer sortOrder
) {
}
