package com.londono.distribuciones.brand;

import com.londono.distribuciones.brand.dto.BrandRequest;
import com.londono.distribuciones.brand.dto.BrandResponse;
import com.londono.distribuciones.brand.dto.BrandSummaryResponse;
import com.londono.distribuciones.common.SlugUtils;
import com.londono.distribuciones.common.exception.ConflictException;
import com.londono.distribuciones.common.exception.ResourceNotFoundException;
import com.londono.distribuciones.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/** Logica de negocio de marcas (publico + admin). */
@Service
public class BrandService {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;

    public BrandService(BrandRepository brandRepository, ProductRepository productRepository) {
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
    }

    // ---------------------------------------------------------------- publico
    @Transactional(readOnly = true)
    public List<BrandSummaryResponse> listPublic() {
        return brandRepository.findByActiveTrueOrderBySortOrderAscNameAsc().stream()
                .map(BrandSummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BrandResponse getPublicBySlug(String slug) {
        Brand brand = brandRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada: " + slug));
        return BrandResponse.from(brand);
    }

    // ------------------------------------------------------------------ admin
    @Transactional(readOnly = true)
    public List<BrandResponse> listAdmin() {
        return brandRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(BrandResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BrandResponse getAdmin(Long id) {
        return BrandResponse.from(findById(id));
    }

    @Transactional
    public BrandResponse create(BrandRequest request) {
        if (brandRepository.existsByName(request.name())) {
            throw new ConflictException("Ya existe una marca con el nombre: " + request.name());
        }
        Brand brand = new Brand();
        brand.setName(request.name());
        brand.setDescription(request.description());
        brand.setActive(request.active() == null || request.active());
        brand.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
        brand.setSlug(resolveSlug(request.slug(), request.name(), null));
        return BrandResponse.from(brandRepository.save(brand));
    }

    @Transactional
    public BrandResponse update(Long id, BrandRequest request) {
        Brand brand = findById(id);
        if (brandRepository.existsByNameAndIdNot(request.name(), id)) {
            throw new ConflictException("Ya existe una marca con el nombre: " + request.name());
        }
        brand.setName(request.name());
        brand.setDescription(request.description());
        if (request.active() != null) {
            brand.setActive(request.active());
        }
        if (request.sortOrder() != null) {
            brand.setSortOrder(request.sortOrder());
        }
        if (StringUtils.hasText(request.slug())) {
            brand.setSlug(resolveSlug(request.slug(), request.name(), id));
        }
        return BrandResponse.from(brand);
    }

    @Transactional
    public BrandResponse toggleActive(Long id) {
        Brand brand = findById(id);
        brand.setActive(!brand.isActive());
        return BrandResponse.from(brand);
    }

    @Transactional
    public void delete(Long id) {
        Brand brand = findById(id);
        if (productRepository.existsByBrandId(id)) {
            throw new ConflictException(
                    "No se puede eliminar la marca porque tiene productos asociados. "
                            + "Desactivela en su lugar.");
        }
        brandRepository.delete(brand);
    }

    // --------------------------------------------------------------- helpers
    private Brand findById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada: " + id));
    }

    private String resolveSlug(String requestedSlug, String name, Long currentId) {
        String base = StringUtils.hasText(requestedSlug) ? requestedSlug : name;
        return SlugUtils.uniqueSlug(base, candidate ->
                currentId == null
                        ? brandRepository.existsBySlug(candidate)
                        : brandRepository.existsBySlugAndIdNot(candidate, currentId));
    }
}
