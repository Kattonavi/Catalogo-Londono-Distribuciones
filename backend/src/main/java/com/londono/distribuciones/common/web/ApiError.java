package com.londono.distribuciones.common.web;

import java.time.Instant;

/**
 * Cuerpo de error JSON consistente para toda la API.
 * Coincide con el formato documentado en docs/api-contract.md.
 */
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path
) {
    public static ApiError of(int status, String error, String message, String path) {
        return new ApiError(Instant.now(), status, error, message, path);
    }
}
