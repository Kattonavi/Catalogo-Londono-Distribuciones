package com.londono.distribuciones.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.londono.distribuciones.common.exception.ImageUploadException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Servicio de imagenes sobre Cloudinary. Toda subida pasa por el backend.
 *
 * <p>Metodos preparados para las fases siguientes (CRUD con imagenes):
 * {@link #uploadImage}, {@link #replaceImage} y {@link #deleteImage}.</p>
 */
@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);

    private final Cloudinary cloudinary;
    private final ImageValidator imageValidator;
    private final CloudinaryProperties properties;

    public CloudinaryService(Cloudinary cloudinary,
                             ImageValidator imageValidator,
                             CloudinaryProperties properties) {
        this.cloudinary = cloudinary;
        this.imageValidator = imageValidator;
        this.properties = properties;
    }

    /**
     * Valida y sube una imagen a Cloudinary.
     *
     * @return URL segura y public_id para persistir en BD.
     * @throws com.londono.distribuciones.common.exception.BadRequestException si la imagen es invalida
     * @throws ImageUploadException si falla la comunicacion con Cloudinary
     */
    @SuppressWarnings("unchecked")
    public UploadedImage uploadImage(MultipartFile file) {
        imageValidator.validate(file);
        try {
            Map<String, Object> options = ObjectUtils.asMap(
                    "folder", properties.uploadFolder(),
                    "resource_type", "image",
                    "overwrite", true,
                    "quality", "auto",
                    "fetch_format", "auto"
            );
            Map<String, Object> result =
                    (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), options);

            String secureUrl = (String) result.get("secure_url");
            String publicId = (String) result.get("public_id");
            return new UploadedImage(secureUrl, publicId);
        } catch (IOException ex) {
            throw new ImageUploadException("No se pudo subir la imagen a Cloudinary", ex);
        }
    }

    /**
     * Sube la nueva imagen y, solo si la subida fue exitosa, elimina la anterior
     * (best-effort). Si el borrado de la anterior falla, no rompe el flujo: la
     * imagen vieja queda como huerfana y se registra para limpieza posterior.
     */
    public UploadedImage replaceImage(MultipartFile file, String oldPublicId) {
        UploadedImage uploaded = uploadImage(file);
        if (StringUtils.hasText(oldPublicId) && !oldPublicId.equals(uploaded.imagePublicId())) {
            try {
                deleteImage(oldPublicId);
            } catch (RuntimeException ex) {
                log.warn("No se pudo eliminar la imagen anterior '{}' en Cloudinary. "
                        + "Queda huerfana para limpieza posterior.", oldPublicId, ex);
            }
        }
        return uploaded;
    }

    /**
     * Elimina una imagen de Cloudinary por su public_id. Si el recurso ya no
     * existe (resultado "not found"), se considera exito idempotente.
     *
     * @throws ImageUploadException si falla la comunicacion con Cloudinary
     */
    @SuppressWarnings("unchecked")
    public void deleteImage(String publicId) {
        if (!StringUtils.hasText(publicId)) {
            return;
        }
        try {
            Map<String, Object> result =
                    (Map<String, Object>) cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String outcome = String.valueOf(result.get("result"));
            if (!"ok".equals(outcome) && !"not found".equals(outcome)) {
                throw new ImageUploadException(
                        "Cloudinary no pudo eliminar la imagen (resultado: " + outcome + ")", null);
            }
        } catch (IOException ex) {
            throw new ImageUploadException("No se pudo eliminar la imagen en Cloudinary", ex);
        }
    }
}
