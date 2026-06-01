package com.londono.distribuciones.cloudinary;

/**
 * Resultado de una subida a Cloudinary: los dos datos que se persisten en BD.
 */
public record UploadedImage(
        String imageUrl,
        String imagePublicId
) {
}
