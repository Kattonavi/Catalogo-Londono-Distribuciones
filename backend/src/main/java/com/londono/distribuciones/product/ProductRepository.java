package com.londono.distribuciones.product;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    Optional<Product> findBySlugAndActiveTrueAndVisibleTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsByBrandId(Long brandId);

    boolean existsByCategoryId(Long categoryId);

    // --- Listados publicos curados (solo activos y visibles) ---
    List<Product> findByActiveTrueAndVisibleTrueAndFeaturedTrue(Pageable pageable);

    List<Product> findByActiveTrueAndVisibleTrueAndIsNewTrue(Pageable pageable);

    List<Product> findByActiveTrueAndVisibleTrueAndOnPromotionTrue(Pageable pageable);

    // --- Conteos para el dashboard ---
    long countByVisibleTrue();

    long countByActiveTrue();

    long countByOnPromotionTrue();

    long countByFeaturedTrue();

    long countByIsNewTrue();

    @Query("select coalesce(sum(p.viewCount), 0) from Product p")
    long sumViewCount();

    @Query("select coalesce(sum(p.whatsappClickCount), 0) from Product p")
    long sumWhatsappClickCount();

    List<Product> findTop5ByOrderByViewCountDesc();

    List<Product> findTop5ByOrderByWhatsappClickCountDesc();

    // --- Contadores denormalizados (incremento atomico) ---
    @Modifying
    @Query("update Product p set p.viewCount = p.viewCount + 1 where p.id = :id")
    void incrementViewCount(@Param("id") Long id);

    @Modifying
    @Query("update Product p set p.whatsappClickCount = p.whatsappClickCount + 1 where p.id = :id")
    void incrementWhatsappClickCount(@Param("id") Long id);
}
