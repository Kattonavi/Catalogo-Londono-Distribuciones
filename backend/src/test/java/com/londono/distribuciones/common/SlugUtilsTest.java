package com.londono.distribuciones.common;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** Verifica la generacion de slugs y la unicidad por sufijo (sin BD). */
class SlugUtilsTest {

    @Test
    void slugifyBasic() {
        assertEquals("coca-cola-400-ml", SlugUtils.slugify("Coca-Cola 400 ml"));
    }

    @Test
    void slugifyRemovesAccentsAndSymbols() {
        assertEquals("cafe-con-leche", SlugUtils.slugify("Café   con Leche!!"));
        assertEquals("nono-agil", SlugUtils.slugify("Ñoño Ágil"));
    }

    @Test
    void slugifyTrimsHyphens() {
        assertEquals("hola", SlugUtils.slugify("  --Hola--  "));
    }

    @Test
    void slugifyNullIsEmpty() {
        assertEquals("", SlugUtils.slugify(null));
    }

    @Test
    void uniqueSlugReturnsBaseWhenFree() {
        assertEquals("coca-cola", SlugUtils.uniqueSlug("Coca Cola", s -> false));
    }

    @Test
    void uniqueSlugAddsSuffixWhenTaken() {
        Set<String> taken = Set.of("coca-cola", "coca-cola-2");
        assertEquals("coca-cola-3", SlugUtils.uniqueSlug("Coca Cola", taken::contains));
    }

    @Test
    void uniqueSlugFallsBackToItemForEmptyBase() {
        assertEquals("item", SlugUtils.uniqueSlug("!!!", s -> false));
    }
}
