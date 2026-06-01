package com.londono.distribuciones.brand;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    Optional<Brand> findBySlug(String slug);

    Optional<Brand> findBySlugAndActiveTrue(String slug);

    List<Brand> findByActiveTrueOrderBySortOrderAscNameAsc();

    List<Brand> findAllByOrderBySortOrderAscNameAsc();

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsByNameAndIdNot(String name, Long id);
}
