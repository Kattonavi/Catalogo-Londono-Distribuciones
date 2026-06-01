package com.londono.distribuciones.product;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Construye una {@link Specification} dinamica de productos a partir de un
 * {@link ProductQuery}. Solo aplica predicados para los campos no nulos.
 */
public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> from(ProductQuery q) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(q.search())) {
                String like = "%" + q.search().trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(cb.coalesce(root.get("shortDescription"), "")), like),
                        cb.like(cb.lower(cb.coalesce(root.get("description"), "")), like),
                        cb.like(cb.lower(cb.coalesce(root.get("flavor"), "")), like),
                        cb.like(cb.lower(cb.coalesce(root.get("presentation"), "")), like)
                ));
            }

            if (StringUtils.hasText(q.brandSlug())) {
                predicates.add(cb.equal(root.get("brand").get("slug"), q.brandSlug()));
            }
            if (q.brandId() != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), q.brandId()));
            }
            if (StringUtils.hasText(q.categorySlug())) {
                predicates.add(cb.equal(root.get("category").get("slug"), q.categorySlug()));
            }
            if (q.categoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), q.categoryId()));
            }

            if (q.isFeatured() != null) {
                predicates.add(cb.equal(root.get("featured"), q.isFeatured()));
            }
            if (q.isNew() != null) {
                predicates.add(cb.equal(root.get("isNew"), q.isNew()));
            }
            if (q.isPromo() != null) {
                predicates.add(cb.equal(root.get("onPromotion"), q.isPromo()));
            }
            if (q.isVisible() != null) {
                predicates.add(cb.equal(root.get("visible"), q.isVisible()));
            }
            if (q.active() != null) {
                predicates.add(cb.equal(root.get("active"), q.active()));
            }

            if (q.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("currentPrice"), q.minPrice()));
            }
            if (q.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("currentPrice"), q.maxPrice()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
