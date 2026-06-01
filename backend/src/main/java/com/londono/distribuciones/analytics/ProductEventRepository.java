package com.londono.distribuciones.analytics;

import com.londono.distribuciones.common.domain.EventType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductEventRepository extends JpaRepository<ProductEvent, Long> {

    long countByEventType(EventType eventType);

    long countByProductIdAndEventType(Long productId, EventType eventType);
}
