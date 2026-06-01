package com.londono.distribuciones.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Credenciales de inicio de sesion. El login es por email. */
public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {
}
