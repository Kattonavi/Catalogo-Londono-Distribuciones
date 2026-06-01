package com.londono.distribuciones.product;

import com.londono.distribuciones.brand.Brand;
import com.londono.distribuciones.category.Category;
import com.londono.distribuciones.common.domain.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Producto del catalogo. Nucleo del dominio.
 *
 * <p>El porcentaje de descuento NO se almacena: es derivado de current_price y
 * previous_price (opcion recomendada en docs/database-model.md). Se expone via
 * {@link #getDiscountPercentage()}.</p>
 */
@Entity
@Table(name = "products")
public class Product extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 180)
    private String name;

    @Column(name = "slug", nullable = false, length = 200, unique = true)
    private String slug;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "current_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "previous_price", precision = 12, scale = 2)
    private BigDecimal previousPrice;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "COP";

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "image_public_id", length = 255)
    private String imagePublicId;

    @Column(name = "is_new", nullable = false)
    private boolean isNew = false;

    @Column(name = "is_featured", nullable = false)
    private boolean featured = false;

    @Column(name = "is_on_promotion", nullable = false)
    private boolean onPromotion = false;

    @Column(name = "is_visible", nullable = false)
    private boolean visible = true;

    @Column(name = "view_count", nullable = false)
    private long viewCount = 0L;

    @Column(name = "whatsapp_click_count", nullable = false)
    private long whatsappClickCount = 0L;

    protected Product() {
        // Requerido por JPA.
    }

    /**
     * Porcentaje de descuento derivado. Devuelve null si no aplica
     * (sin precio anterior o precio anterior <= precio actual).
     */
    @Transient
    public Integer getDiscountPercentage() {
        if (previousPrice == null || currentPrice == null) {
            return null;
        }
        if (previousPrice.compareTo(currentPrice) <= 0
                || previousPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }
        BigDecimal diff = previousPrice.subtract(currentPrice);
        return diff.multiply(BigDecimal.valueOf(100))
                .divide(previousPrice, 0, RoundingMode.HALF_UP)
                .intValue();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public BigDecimal getPreviousPrice() {
        return previousPrice;
    }

    public void setPreviousPrice(BigDecimal previousPrice) {
        this.previousPrice = previousPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImagePublicId() {
        return imagePublicId;
    }

    public void setImagePublicId(String imagePublicId) {
        this.imagePublicId = imagePublicId;
    }

    public boolean isNew() {
        return isNew;
    }

    public void setNew(boolean aNew) {
        this.isNew = aNew;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public boolean isOnPromotion() {
        return onPromotion;
    }

    public void setOnPromotion(boolean onPromotion) {
        this.onPromotion = onPromotion;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public long getViewCount() {
        return viewCount;
    }

    public void setViewCount(long viewCount) {
        this.viewCount = viewCount;
    }

    public long getWhatsappClickCount() {
        return whatsappClickCount;
    }

    public void setWhatsappClickCount(long whatsappClickCount) {
        this.whatsappClickCount = whatsappClickCount;
    }
}
