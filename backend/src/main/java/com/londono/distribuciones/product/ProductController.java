package com.londono.distribuciones.product;

import com.londono.distribuciones.common.web.PageResponse;
import com.londono.distribuciones.product.dto.ProductCardResponse;
import com.londono.distribuciones.product.dto.ProductCreateRequest;
import com.londono.distribuciones.product.dto.ProductDetailResponse;
import com.londono.distribuciones.product.dto.ProductImageResponse;
import com.londono.distribuciones.product.dto.ProductResponse;
import com.londono.distribuciones.product.dto.ProductUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

/** Endpoints de productos: catalogo publico y gestion admin (incl. imagenes). */
@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ============================ PUBLICO ============================
    @GetMapping("/api/public/products")
    public PageResponse<ProductCardResponse> listPublic(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String brandSlug,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) Boolean isPromo,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        ProductQuery query = new ProductQuery(
                search, brandSlug, categorySlug, null, null,
                isFeatured, isNew, isPromo, null, null, minPrice, maxPrice);
        return PageResponse.from(productService.listPublic(query, page, size, sort));
    }

    @GetMapping("/api/public/products/featured")
    public List<ProductCardResponse> featured(@RequestParam(defaultValue = "12") int limit) {
        return productService.featured(limit);
    }

    @GetMapping("/api/public/products/new")
    public List<ProductCardResponse> newest(@RequestParam(defaultValue = "12") int limit) {
        return productService.newest(limit);
    }

    @GetMapping("/api/public/products/promotions")
    public List<ProductCardResponse> promotions(@RequestParam(defaultValue = "12") int limit) {
        return productService.promotions(limit);
    }

    @GetMapping("/api/public/products/{slug}")
    public ProductDetailResponse getPublic(@PathVariable String slug) {
        return productService.getPublicBySlug(slug);
    }

    // ============================= ADMIN =============================
    @GetMapping("/api/admin/products")
    public PageResponse<ProductResponse> listAdmin(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Boolean isVisible,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) Boolean isPromo,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        ProductQuery query = new ProductQuery(
                search, null, null, brandId, categoryId,
                isFeatured, isNew, isPromo, isVisible, active, null, null);
        return PageResponse.from(productService.listAdmin(query, page, size, sort));
    }

    @GetMapping("/api/admin/products/{id}")
    public ProductResponse getAdmin(@PathVariable Long id) {
        return productService.getAdmin(id);
    }

    @PostMapping("/api/admin/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductCreateRequest request) {
        return productService.create(request);
    }

    @PutMapping("/api/admin/products/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductUpdateRequest request) {
        return productService.update(id, request);
    }

    @PatchMapping("/api/admin/products/{id}/toggle-visible")
    public ProductResponse toggleVisible(@PathVariable Long id) {
        return productService.toggleVisible(id);
    }

    @PatchMapping("/api/admin/products/{id}/toggle-active")
    public ProductResponse toggleActive(@PathVariable Long id) {
        return productService.toggleActive(id);
    }

    @PatchMapping("/api/admin/products/{id}/toggle-featured")
    public ProductResponse toggleFeatured(@PathVariable Long id) {
        return productService.toggleFeatured(id);
    }

    @PatchMapping("/api/admin/products/{id}/toggle-new")
    public ProductResponse toggleNew(@PathVariable Long id) {
        return productService.toggleNew(id);
    }

    @PatchMapping("/api/admin/products/{id}/toggle-promo")
    public ProductResponse togglePromo(@PathVariable Long id) {
        return productService.togglePromo(id);
    }

    /** Soft delete: oculta y desactiva (no borra registro ni imagen). */
    @DeleteMapping("/api/admin/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    // ========================= IMAGENES =========================
    @PostMapping("/api/admin/products/{id}/image")
    public ProductImageResponse uploadImage(@PathVariable Long id,
                                            @RequestParam("file") MultipartFile file) {
        return productService.uploadImage(id, file);
    }

    @PutMapping("/api/admin/products/{id}/image")
    public ProductImageResponse replaceImage(@PathVariable Long id,
                                             @RequestParam("file") MultipartFile file) {
        return productService.replaceImage(id, file);
    }

    @DeleteMapping("/api/admin/products/{id}/image")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        productService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}
