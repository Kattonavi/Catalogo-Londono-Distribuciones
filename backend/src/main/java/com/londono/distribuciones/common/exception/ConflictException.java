package com.londono.distribuciones.common.exception;

/**
 * Conflicto con el estado actual del recurso (slug/nombre duplicado, o borrado
 * bloqueado por integridad referencial). Se mapea a HTTP 409.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
