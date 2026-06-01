package com.londono.distribuciones.common.web;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Respuesta paginada con el formato documentado en docs/api-contract.md.
 * Evita exponer la serializacion interna de {@link Page}.
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}
