package com.londono.distribuciones;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Punto de entrada de la API de Londono Distribuciones.
 *
 * <p>Backend de la Fase 1: base del proyecto (seguridad, JWT, JPA, Flyway y Cloudinary).
 * No contiene aun el CRUD completo del catalogo; expone la infraestructura sobre la cual
 * se construiran las fases siguientes.</p>
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class DistribucionesApplication {

    public static void main(String[] args) {
        SpringApplication.run(DistribucionesApplication.class, args);
    }
}
