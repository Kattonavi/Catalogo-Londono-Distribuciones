package com.londono.distribuciones.common;

import java.text.Normalizer;
import java.util.Locale;
import java.util.function.Predicate;

/**
 * Utilidades para generar slugs amigables y unicos a partir de texto.
 *
 * <p>Ejemplo: "Coca-Cola 400 ml" -> "coca-cola-400-ml".
 * Si el slug ya existe, agrega un sufijo numerico: -2, -3, ...</p>
 */
public final class SlugUtils {

    private SlugUtils() {
        // Clase de utilidades.
    }

    /**
     * Convierte texto a slug: minusculas, sin tildes, espacios y caracteres no
     * validos reemplazados por guiones, sin guiones duplicados ni en los extremos.
     */
    public static String slugify(String input) {
        if (input == null) {
            return "";
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");          // quita tildes/diacriticos
        String lower = normalized.toLowerCase(Locale.ROOT);
        String replaced = lower.replaceAll("[^a-z0-9]+", "-"); // no validos -> guion
        String collapsed = replaced.replaceAll("-{2,}", "-");  // guiones duplicados
        return collapsed.replaceAll("^-+|-+$", "");            // trim de guiones
    }

    /**
     * Genera un slug unico a partir de {@code base}. Si el slug ya existe (segun
     * el predicado), agrega sufijos -2, -3, ... hasta encontrar uno libre.
     *
     * @param base       texto base (nombre del recurso)
     * @param slugExists predicado que indica si un slug ya esta tomado
     */
    public static String uniqueSlug(String base, Predicate<String> slugExists) {
        String root = slugify(base);
        if (root.isEmpty()) {
            root = "item";
        }
        if (!slugExists.test(root)) {
            return root;
        }
        int suffix = 2;
        String candidate = root + "-" + suffix;
        while (slugExists.test(candidate)) {
            suffix++;
            candidate = root + "-" + suffix;
        }
        return candidate;
    }
}
