package com.londono.distribuciones.common.exception;

/** Solicitud invalida por reglas de negocio o validacion. Se mapea a HTTP 400. */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
