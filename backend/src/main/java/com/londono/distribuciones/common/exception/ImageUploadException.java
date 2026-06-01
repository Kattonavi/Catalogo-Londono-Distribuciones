package com.londono.distribuciones.common.exception;

/**
 * Fallo al subir o eliminar una imagen en Cloudinary (problema del proveedor,
 * no del cliente). Se mapea a HTTP 502.
 */
public class ImageUploadException extends RuntimeException {

    public ImageUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
