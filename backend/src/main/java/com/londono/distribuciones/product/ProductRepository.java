package com.londono.distribuciones.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    Optional<Product> findBySlugAndVisibleTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsByBrandId(Long brandId);

    boolean existsByCategoryId(Long categoryId);

    long countByVisibleTrue();

    long countByOnPromotionTrue();

    long countByFeaturedTrue();

    long countByIsNewTrue();
}
