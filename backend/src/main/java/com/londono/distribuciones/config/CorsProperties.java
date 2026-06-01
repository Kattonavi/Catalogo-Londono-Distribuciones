package com.londono.distribuciones.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Propiedades de CORS (prefijo app.cors). El origen permitido es el frontend
 * configurado via variable de entorno FRONTEND_URL.
 */
@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(
        String frontendUrl
) {
}
