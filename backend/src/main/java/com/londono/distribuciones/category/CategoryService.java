package com.londono.distribuciones.category;

import com.londono.distribuciones.category.dto.CategoryRequest;
import com.londono.distribuciones.category.dto.CategoryResponse;
import com.londono.distribuciones.category.dto.CategorySummaryResponse;
import com.londono.distribuciones.common.SlugUtils;
import com.londono.distribuciones.common.exception.ConflictException;
import com.londono.distribuciones.common.exception.ResourceNotFoundException;
import com.londono.distribuciones.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/** Logica de negocio de categorias (publico + admin). */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    // ---------------------------------------------------------------- publico
    @Transactional(readOnly = true)
    public List<CategorySummaryResponse> listPublic() {
        return categoryRepository.findByActiveTrueOrderBySortOrderAscNameAsc().stream()
                .map(CategorySummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getPublicBySlug(String slug) {
        Category category = categoryRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada: " + slug));
        return CategoryResponse.from(category);
    }

    // ------------------------------------------------------------------ admin
    @Transactional(readOnly = true)
    public List<CategoryResponse> listAdmin() {
        return categoryRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getAdmin(Long id) {
        return CategoryResponse.from(findById(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new ConflictException("Ya existe una categoria con el nombre: " + request.name());
        }
        Category category = new Category();
        category.setName(request.name());
        category.setDescription(request.description());
        category.setActive(request.active() == null || request.active());
        category.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
        category.setSlug(resolveSlug(request.slug(), request.name(), null));
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findById(id);
        if (categoryRepository.existsByNameAndIdNot(request.name(), id)) {
            throw new ConflictException("Ya existe una categoria con el nombre: " + request.name());
        }
        category.setName(request.name());
        category.setDescription(request.description());
        if (request.active() != null) {
            category.setActive(request.active());
        }
        if (request.sortOrder() != null) {
            category.setSortOrder(request.sortOrder());
        }
        if (StringUtils.hasText(request.slug())) {
            category.setSlug(resolveSlug(request.slug(), request.name(), id));
        }
        return CategoryResponse.from(category);
    }

    @Transactional
    public CategoryResponse toggleActive(Long id) {
        Category category = findById(id);
        category.setActive(!category.isActive());
        return CategoryResponse.from(category);
    }

    @Transactional
    public void delete(Long id) {
        Category category = findById(id);
        if (productRepository.existsByCategoryId(id)) {
            throw new ConflictException(
                    "No se puede eliminar la categoria porque tiene productos asociados. "
                            + "Desactivela en su lugar.");
        }
        categoryRepository.delete(category);
    }

    // --------------------------------------------------------------- helpers
    private Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada: " + id));
    }

    private String resolveSlug(String requestedSlug, String name, Long currentId) {
        String base = StringUtils.hasText(requestedSlug) ? requestedSlug : name;
        return SlugUtils.uniqueSlug(base, candidate ->
                currentId == null
                        ? categoryRepository.existsBySlug(candidate)
                        : categoryRepository.existsBySlugAndIdNot(candidate, currentId));
    }
}
