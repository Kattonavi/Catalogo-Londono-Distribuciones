package com.londono.distribuciones.analytics;

import com.londono.distribuciones.analytics.dto.AnalyticsSummaryResponse;
import com.londono.distribuciones.analytics.dto.ProductMetricItem;
import com.londono.distribuciones.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Metricas simples del catalogo para el dashboard admin. */
@Service
public class AnalyticsService {

    private final ProductRepository productRepository;

    public AnalyticsService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse summary() {
        List<ProductMetricItem> mostViewed = productRepository.findTop5ByOrderByViewCountDesc()
                .stream().map(ProductMetricItem::ofViews).toList();

        List<ProductMetricItem> mostWhatsapp = productRepository.findTop5ByOrderByWhatsappClickCountDesc()
                .stream().map(ProductMetricItem::ofWhatsappClicks).toList();

        return new AnalyticsSummaryResponse(
                productRepository.count(),
                productRepository.countByVisibleTrue(),
                productRepository.countByActiveTrue(),
                productRepository.countByFeaturedTrue(),
                productRepository.countByIsNewTrue(),
                productRepository.countByOnPromotionTrue(),
                productRepository.sumViewCount(),
                productRepository.sumWhatsappClickCount(),
                mostViewed,
                mostWhatsapp
        );
    }
}
