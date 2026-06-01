package com.londono.distribuciones.common.exception;

/** Recurso solicitado no encontrado. Se mapea a HTTP 404. */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
