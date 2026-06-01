package com.londono.distribuciones.brand;

import com.londono.distribuciones.brand.dto.BrandRequest;
import com.londono.distribuciones.brand.dto.BrandResponse;
import com.londono.distribuciones.brand.dto.BrandSummaryResponse;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Endpoints de marcas: publicos (solo activas) y admin (todas). */
@RestController
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    // ---------------------------------------------------------------- publico
    @GetMapping("/api/public/brands")
    public List<BrandSummaryResponse> listPublic() {
        return brandService.listPublic();
    }

    @GetMapping("/api/public/brands/{slug}")
    public BrandResponse getPublic(@PathVariable String slug) {
        return brandService.getPublicBySlug(slug);
    }

    // ------------------------------------------------------------------ admin
    @GetMapping("/api/admin/brands")
    public List<BrandResponse> listAdmin() {
        return brandService.listAdmin();
    }

    @GetMapping("/api/admin/brands/{id}")
    public BrandResponse getAdmin(@PathVariable Long id) {
        return brandService.getAdmin(id);
    }

    @PostMapping("/api/admin/brands")
    @ResponseStatus(HttpStatus.CREATED)
    public BrandResponse create(@Valid @RequestBody BrandRequest request) {
        return brandService.create(request);
    }

    @PutMapping("/api/admin/brands/{id}")
    public BrandResponse update(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        return brandService.update(id, request);
    }

    @PatchMapping("/api/admin/brands/{id}/toggle-active")
    public BrandResponse toggleActive(@PathVariable Long id) {
        return brandService.toggleActive(id);
    }

    @DeleteMapping("/api/admin/brands/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        brandService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
