package com.londono.distribuciones.auth.dto;

/**
 * Respuesta de autenticacion: tokens emitidos + datos basicos del usuario.
 */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        UserSummary user
) {
    /** Datos minimos del usuario autenticado expuestos al frontend. */
    public record UserSummary(Long id, String name, String email, String role) {
    }
}
