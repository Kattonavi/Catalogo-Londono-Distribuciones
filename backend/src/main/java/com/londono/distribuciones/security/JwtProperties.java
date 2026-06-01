package com.londono.distribuciones.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Propiedades del JWT (prefijo app.security.jwt). Valores via variables de entorno:
 * JWT_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION.
 */
@ConfigurationProperties(prefix = "app.security.jwt")
public record JwtProperties(
        String secret,
        long accessExpirationMs,
        long refreshExpirationMs,
        String issuer
) {
}
