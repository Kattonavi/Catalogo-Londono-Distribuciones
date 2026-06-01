package com.londono.distribuciones.analytics.dto;

import com.londono.distribuciones.product.Product;

/** Item de ranking de productos por una metrica (vistas o clicks a WhatsApp). */
public record ProductMetricItem(
        Long id,
        String name,
        String slug,
        String imageUrl,
        long count
) {
    public static ProductMetricItem ofViews(Product p) {
        return new ProductMetricItem(p.getId(), p.getName(), p.getSlug(), p.getImageUrl(), p.getViewCount());
    }

    public static ProductMetricItem ofWhatsappClicks(Product p) {
        return new ProductMetricItem(
                p.getId(), p.getName(), p.getSlug(), p.getImageUrl(), p.getWhatsappClickCount());
    }
}
