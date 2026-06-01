package com.londono.distribuciones.common.domain;

/**
 * Tipos de evento de interaccion sobre un producto, usados para metricas.
 * Debe mantenerse en sincronia con el CHECK de la tabla product_events.
 */
public enum EventType {
    /** Visita a la pagina de detalle del producto. */
    VIEW,
    /** Click al boton de WhatsApp del producto. */
    WHATSAPP_CLICK,
    /** Click sobre la promocion del producto. */
    PROMOTION_CLICK
}
