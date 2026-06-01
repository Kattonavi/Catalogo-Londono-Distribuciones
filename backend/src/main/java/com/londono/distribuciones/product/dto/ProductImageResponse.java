package com.londono.distribuciones.product.dto;

import com.londono.distribuciones.product.Product;

/** Resultado de las operaciones de imagen de producto. */
public record ProductImageResponse(
        Long productId,
        String imageUrl,
        String imagePublicId
) {
    public static ProductImageResponse from(Product p) {
        return new ProductImageResponse(p.getId(), p.getImageUrl(), p.getImagePublicId());
    }
}
