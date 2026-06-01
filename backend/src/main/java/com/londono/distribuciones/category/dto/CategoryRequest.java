package com.londono.distribuciones.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Datos de entrada para crear/editar una categoria.
 * El slug es opcional: si no se envia, se genera desde el nombre.
 */
public record CategoryRequest(
        @NotBlank @Size(max = 120) String name,
        @Size(max = 140) String slug,
        String description,
        Boolean active,
        Integer sortOrder
) {
}
