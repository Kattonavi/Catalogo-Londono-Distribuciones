package com.londono.distribuciones.brand;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    Optional<Brand> findBySlug(String slug);

    List<Brand> findByActiveTrueOrderByNameAsc();

    boolean existsByName(String name);

    boolean existsBySlug(String slug);
}
