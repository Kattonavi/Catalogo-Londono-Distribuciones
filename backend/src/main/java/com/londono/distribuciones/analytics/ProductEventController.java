package com.londono.distribuciones.analytics;

import com.londono.distribuciones.common.domain.EventType;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Eventos publicos de producto (analitica basica). Fire-and-forget: responden 202.
 * Solo registran si el producto existe, esta activo y es visible.
 */
@RestController
public class ProductEventController {

    private final ProductEventService productEventService;

    public ProductEventController(ProductEventService productEventService) {
        this.productEventService = productEventService;
    }

    @PostMapping("/api/public/products/{slug}/events/view")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void view(@PathVariable String slug) {
        productEventService.record(slug, EventType.VIEW);
    }

    @PostMapping("/api/public/products/{slug}/events/whatsapp-click")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void whatsappClick(@PathVariable String slug) {
        productEventService.record(slug, EventType.WHATSAPP_CLICK);
    }

    @PostMapping("/api/public/products/{slug}/events/promotion-click")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void promotionClick(@PathVariable String slug) {
        productEventService.record(slug, EventType.PROMOTION_CLICK);
    }
}
