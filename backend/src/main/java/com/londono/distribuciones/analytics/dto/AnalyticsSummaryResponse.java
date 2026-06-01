package com.londono.distribuciones.analytics.dto;

import java.util.List;

/** Resumen simple de metricas del catalogo para el dashboard admin. */
public record AnalyticsSummaryResponse(
        long totalProducts,
        long visibleProducts,
        long activeProducts,
        long featuredProducts,
        long newProducts,
        long promoProducts,
        long totalViews,
        long totalWhatsappClicks,
        List<ProductMetricItem> mostViewedProducts,
        List<ProductMetricItem> mostWhatsappClickedProducts
) {
}
