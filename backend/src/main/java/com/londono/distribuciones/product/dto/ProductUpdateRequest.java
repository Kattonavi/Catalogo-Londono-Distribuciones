package com.londono.distribuciones.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Datos para actualizar un producto (reemplazo completo). El descuento se
 * recalcula en el backend; nunca se recibe desde el cliente.
 */
public record ProductUpdateRequest(
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
