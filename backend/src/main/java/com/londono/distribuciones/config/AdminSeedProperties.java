package com.londono.distribuciones.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Propiedades del seed del administrador inicial (prefijo app.admin-seed).
 * Solo se crea un admin si la tabla users esta vacia. La contrasena llega via
 * variable de entorno (ADMIN_SEED_PASSWORD) y debe cambiarse en produccion.
 */
@ConfigurationProperties(prefix = "app.admin-seed")
public record AdminSeedProperties(
        boolean enabled,
        String name,
        String email,
        String password
) {
}
