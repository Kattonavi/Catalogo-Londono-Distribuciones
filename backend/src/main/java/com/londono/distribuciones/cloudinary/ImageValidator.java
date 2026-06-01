package com.londono.distribuciones.cloudinary;

import com.londono.distribuciones.common.exception.BadRequestException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

/**
 * Valida las imagenes subidas (formato y tamano) de forma autoritativa en el
 * backend. No se confia en la validacion del cliente.
 */
@Component
public class ImageValidator {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp"
    );

    private final CloudinaryProperties properties;

    public ImageValidator(CloudinaryProperties properties) {
        this.properties = properties;
    }

    /** Lanza {@link BadRequestException} si el archivo no es una imagen valida. */
    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("La imagen es obligatoria y no puede estar vacia");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Formato no permitido. Use jpg, jpeg, png o webp");
        }

        String extension = extractExtension(file.getOriginalFilename());
        if (extension == null || !ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Extension no permitida. Use jpg, jpeg, png o webp");
        }

        long maxBytes = (long) properties.maxFileSizeMb() * 1024L * 1024L;
        if (file.getSize() > maxBytes) {
            throw new BadRequestException(
                    "La imagen supera el tamano maximo de " + properties.maxFileSizeMb() + " MB");
        }
    }

    private String extractExtension(String filename) {
        if (filename == null) {
            return null;
        }
        int dot = filename.lastIndexOf('.');
        if (dot < 0 || dot == filename.length() - 1) {
            return null;
        }
        return filename.substring(dot + 1).toLowerCase();
    }
}
