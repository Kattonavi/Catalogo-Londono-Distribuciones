package com.londono.distribuciones.product;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

/**
 * Verifica la regla de negocio del descuento derivado (sin BD ni contexto Spring).
 */
class ProductDiscountTest {

    private Product productWithPrices(String current, String previous) {
        Product product = new TestProduct();
        product.setCurrentPrice(new BigDecimal(current));
        product.setPreviousPrice(previous == null ? null : new BigDecimal(previous));
        return product;
    }

    @Test
    void calculatesDiscountWhenPreviousIsHigher() {
        Product product = productWithPrices("50000", "70000");
        assertEquals(29, product.getDiscountPercentage());
    }

    @Test
    void noDiscountWhenPreviousIsNull() {
        Product product = productWithPrices("50000", null);
        assertNull(product.getDiscountPercentage());
    }

    @Test
    void noDiscountWhenPreviousNotGreater() {
        Product product = productWithPrices("70000", "70000");
        assertNull(product.getDiscountPercentage());
    }

    /** Subclase para instanciar Product (constructor protegido por JPA). */
    private static final class TestProduct extends Product {
    }
}
