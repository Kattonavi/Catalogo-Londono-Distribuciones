package com.londono.distribuciones.analytics;

import com.londono.distribuciones.common.domain.EventType;
import com.londono.distribuciones.common.exception.ResourceNotFoundException;
import com.londono.distribuciones.product.Product;
import com.londono.distribuciones.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Registro de eventos publicos de producto (vista, click WhatsApp, click promo).
 * Solo se registra el evento si el producto existe, esta activo y es visible.
 */
@Service
public class ProductEventService {

    private final ProductRepository productRepository;
    private final ProductEventRepository productEventRepository;

    public ProductEventService(ProductRepository productRepository,
                               ProductEventRepository productEventRepository) {
        this.productRepository = productRepository;
        this.productEventRepository = productEventRepository;
    }

    @Transactional
    public void record(String slug, EventType eventType) {
        Product product = productRepository.findBySlugAndActiveTrueAndVisibleTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + slug));

        productEventRepository.save(new ProductEvent(product, eventType));

        switch (eventType) {
            case VIEW -> productRepository.incrementViewCount(product.getId());
            case WHATSAPP_CLICK -> productRepository.incrementWhatsappClickCount(product.getId());
            case PROMOTION_CLICK -> { /* solo se registra el evento, sin contador denormalizado */ }
        }
    }
}
