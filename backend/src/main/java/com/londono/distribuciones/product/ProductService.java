package com.londono.distribuciones.product;

import com.londono.distribuciones.brand.Brand;
import com.londono.distribuciones.brand.BrandRepository;
import com.londono.distribuciones.category.Category;
import com.londono.distribuciones.category.CategoryRepository;
import com.londono.distribuciones.cloudinary.CloudinaryService;
import com.londono.distribuciones.cloudinary.UploadedImage;
import com.londono.distribuciones.common.SlugUtils;
import com.londono.distribuciones.common.exception.BadRequestException;
import com.londono.distribuciones.common.exception.ResourceNotFoundException;
import com.londono.distribuciones.product.dto.ProductCardResponse;
import com.londono.distribuciones.product.dto.ProductCreateRequest;
import com.londono.distribuciones.product.dto.ProductDetailResponse;
import com.londono.distribuciones.product.dto.ProductImageResponse;
import com.londono.distribuciones.product.dto.ProductResponse;
import com.londono.distribuciones.product.dto.ProductUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** Logica de negocio de productos: catalogo publico, gestion admin e imagenes. */
@Service
public class ProductService {

    private static final int DEFAULT_SIZE = 12;
    private static final int MAX_SIZE = 100;
    private static final int CURATED_LIMIT = 12;

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    public ProductService(ProductRepository productRepository,
                          BrandRepository brandRepository,
                          CategoryRepository categoryRepository,
                          CloudinaryService cloudinaryService) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // --------------------------------------------------------------- publico
    @Transactional(readOnly = true)
    public Page<ProductCardResponse> listPublic(ProductQuery query, int page, int size, String sort) {
        ProductQuery publicQuery = forcePublicFlags(query);
        Page<Product> result = productRepository.findAll(
                ProductSpecifications.from(publicQuery), pageable(page, size, sort));
        return result.map(ProductCardResponse::from);
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getPublicBySlug(String slug) {
        Product product = productRepository.findBySlugAndActiveTrueAndVisibleTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + slug));
        return ProductDetailResponse.from(product);
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> featured(int limit) {
        return productRepository
                .findByActiveTrueAndVisibleTrueAndFeaturedTrue(curatedPageable(limit))
                .stream().map(ProductCardResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> newest(int limit) {
        return productRepository
                .findByActiveTrueAndVisibleTrueAndIsNewTrue(curatedPageable(limit))
                .stream().map(ProductCardResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> promotions(int limit) {
        return productRepository
                .findByActiveTrueAndVisibleTrueAndOnPromotionTrue(curatedPageable(limit))
                .stream().map(ProductCardResponse::from).toList();
    }

    // ----------------------------------------------------------------- admin
    @Transactional(readOnly = true)
    public Page<ProductResponse> listAdmin(ProductQuery query, int page, int size, String sort) {
        Page<Product> result = productRepository.findAll(
                ProductSpecifications.from(query), pageable(page, size, sort));
        return result.map(ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public ProductResponse getAdmin(Long id) {
        return ProductResponse.from(findById(id));
    }

    @Transactional
    public ProductResponse create(ProductCreateRequest req) {
        Product product = new Product();
        product.setBrand(resolveBrand(req.brandId()));
        product.setCategory(resolveCategory(req.categoryId()));
        product.setName(req.name());
        product.setSlug(resolveSlug(req.slug(), req.name(), null));
        product.setFlavor(req.flavor());
        product.setPresentation(req.presentation());
        product.setContainerType(req.containerType());
        product.setShortDescription(req.shortDescription());
        product.setDescription(req.description());
        product.setCurrentPrice(req.currentPrice());
        product.setPreviousPrice(req.oldPrice());
        product.setCurrency(StringUtils.hasText(req.currency()) ? req.currency() : "COP");
        product.setFeatured(Boolean.TRUE.equals(req.isFeatured()));
        product.setNew(Boolean.TRUE.equals(req.isNew()));
        product.setOnPromotion(Boolean.TRUE.equals(req.isPromo()));
        product.setVisible(req.isVisible() == null || req.isVisible());
        product.setActive(req.active() == null || req.active());
        product.setSortOrder(req.sortOrder() == null ? 0 : req.sortOrder());
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductUpdateRequest req) {
        Product product = findById(id);
        product.setBrand(resolveBrand(req.brandId()));
        product.setCategory(resolveCategory(req.categoryId()));
        product.setName(req.name());
        if (StringUtils.hasText(req.slug())) {
            product.setSlug(resolveSlug(req.slug(), req.name(), id));
        }
        product.setFlavor(req.flavor());
        product.setPresentation(req.presentation());
        product.setContainerType(req.containerType());
        product.setShortDescription(req.shortDescription());
        product.setDescription(req.description());
        product.setCurrentPrice(req.currentPrice());
        product.setPreviousPrice(req.oldPrice());
        if (StringUtils.hasText(req.currency())) {
            product.setCurrency(req.currency());
        }
        if (req.isFeatured() != null) {
            product.setFeatured(req.isFeatured());
        }
        if (req.isNew() != null) {
            product.setNew(req.isNew());
        }
        if (req.isPromo() != null) {
            product.setOnPromotion(req.isPromo());
        }
        if (req.isVisible() != null) {
            product.setVisible(req.isVisible());
        }
        if (req.active() != null) {
            product.setActive(req.active());
        }
        if (req.sortOrder() != null) {
            product.setSortOrder(req.sortOrder());
        }
        return ProductResponse.from(product);
    }

    @Transactional
    public ProductResponse toggleVisible(Long id) {
        Product p = findById(id);
        p.setVisible(!p.isVisible());
        return ProductResponse.from(p);
    }

    @Transactional
    public ProductResponse toggleActive(Long id) {
        Product p = findById(id);
        p.setActive(!p.isActive());
        return ProductResponse.from(p);
    }

    @Transactional
    public ProductResponse toggleFeatured(Long id) {
        Product p = findById(id);
        p.setFeatured(!p.isFeatured());
        return ProductResponse.from(p);
    }

    @Transactional
    public ProductResponse toggleNew(Long id) {
        Product p = findById(id);
        p.setNew(!p.isNew());
        return ProductResponse.from(p);
    }

    @Transactional
    public ProductResponse togglePromo(Long id) {
        Product p = findById(id);
        p.setOnPromotion(!p.isOnPromotion());
        return ProductResponse.from(p);
    }

    /** Soft delete (MVP): oculta y desactiva el producto sin borrar imagen ni registro. */
    @Transactional
    public void softDelete(Long id) {
        Product p = findById(id);
        p.setActive(false);
        p.setVisible(false);
    }

    // ----------------------------------------------------------- imagenes
    @Transactional
    public ProductImageResponse uploadImage(Long id, MultipartFile file) {
        Product product = findById(id);
        if (StringUtils.hasText(product.getImagePublicId())) {
            throw new BadRequestException(
                    "El producto ya tiene imagen. Use PUT /image para reemplazarla.");
        }
        UploadedImage uploaded = cloudinaryService.uploadImage(file);
        product.setImageUrl(uploaded.imageUrl());
        product.setImagePublicId(uploaded.imagePublicId());
        return ProductImageResponse.from(product);
    }

    @Transactional
    public ProductImageResponse replaceImage(Long id, MultipartFile file) {
        Product product = findById(id);
        UploadedImage uploaded = cloudinaryService.replaceImage(file, product.getImagePublicId());
        product.setImageUrl(uploaded.imageUrl());
        product.setImagePublicId(uploaded.imagePublicId());
        return ProductImageResponse.from(product);
    }

    @Transactional
    public void deleteImage(Long id) {
        Product product = findById(id);
        if (!StringUtils.hasText(product.getImagePublicId())) {
            throw new ResourceNotFoundException("El producto no tiene imagen para eliminar");
        }
        // Si Cloudinary falla, lanza ImageUploadException (502) y la BD no se toca.
        cloudinaryService.deleteImage(product.getImagePublicId());
        product.setImageUrl(null);
        product.setImagePublicId(null);
    }

    // --------------------------------------------------------------- helpers
    private Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
    }

    private Brand resolveBrand(Long brandId) {
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new BadRequestException("La marca indicada no existe: " + brandId));
    }

    private Category resolveCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BadRequestException("La categoria indicada no existe: " + categoryId));
    }

    private String resolveSlug(String requestedSlug, String name, Long currentId) {
        String base = StringUtils.hasText(requestedSlug) ? requestedSlug : name;
        return SlugUtils.uniqueSlug(base, candidate ->
                currentId == null
                        ? productRepository.existsBySlug(candidate)
                        : productRepository.existsBySlugAndIdNot(candidate, currentId));
    }

    private ProductQuery forcePublicFlags(ProductQuery q) {
        return new ProductQuery(
                q.search(), q.brandSlug(), q.categorySlug(),
                null, null,                       // brandId/categoryId no se usan en publico
                q.isFeatured(), q.isNew(), q.isPromo(),
                Boolean.TRUE, Boolean.TRUE,       // visible + active forzados
                q.minPrice(), q.maxPrice());
    }

    private Pageable pageable(int page, int size, String sort) {
        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
        return PageRequest.of(safePage, safeSize, resolveSort(sort));
    }

    private Pageable curatedPageable(int limit) {
        int safeLimit = limit <= 0 ? CURATED_LIMIT : Math.min(limit, MAX_SIZE);
        return PageRequest.of(0, safeLimit,
                Sort.by(Sort.Order.asc("sortOrder"), Sort.Order.desc("createdAt")));
    }

    private static Sort resolveSort(String sort) {
        if (sort == null) {
            return Sort.by(Sort.Order.asc("sortOrder"), Sort.Order.desc("createdAt"));
        }
        return switch (sort) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "currentPrice");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "currentPrice");
            case "name" -> Sort.by(Sort.Direction.ASC, "name");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Order.asc("sortOrder"), Sort.Order.desc("createdAt"));
        };
    }
}
