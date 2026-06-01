package com.londono.distribuciones.brand.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Datos de entrada para crear/editar una marca.
 * El slug es opcional: si no se envia, se genera desde el nombre.
 * La gestion de logo (Cloudinary) queda fuera de la Fase 2.
 */
public record BrandRequest(
        @NotBlank @Size(max = 120) String name,
        @Size(max = 140) String slug,
        String description,
        Boolean active,
        Integer sortOrder
) {
}
