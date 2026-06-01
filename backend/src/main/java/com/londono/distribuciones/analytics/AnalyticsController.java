package com.londono.distribuciones.analytics;

import com.londono.distribuciones.analytics.dto.AnalyticsSummaryResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Resumen de metricas del catalogo para el panel admin. */
@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/api/admin/products/analytics/summary")
    public AnalyticsSummaryResponse summary() {
        return analyticsService.summary();
    }
}
