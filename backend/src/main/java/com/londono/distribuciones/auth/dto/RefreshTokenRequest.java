package com.londono.distribuciones.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** Solicitud para renovar el access token a partir de un refresh token vigente. */
public record RefreshTokenRequest(
        @NotBlank String refreshToken
) {
}
