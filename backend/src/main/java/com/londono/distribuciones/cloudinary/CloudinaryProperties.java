package com.londono.distribuciones.cloudinary;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Propiedades de Cloudinary (prefijo app.cloudinary). El api-secret NUNCA se
 * expone al frontend; solo vive en el backend via variable de entorno.
 */
@ConfigurationProperties(prefix = "app.cloudinary")
public record CloudinaryProperties(
        String cloudName,
        String apiKey,
        String apiSecret,
        String uploadFolder,
        int maxFileSizeMb
) {
}
