/** Formatea un precio en la moneda dada (por defecto COP, sin decimales). */
export function formatPrice(
  value: number | null | undefined,
  currency: string = "COP",
): string {
  if (value === null || value === undefined) {
    return "";
  }
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    // Si la moneda no es válida para Intl, fallback simple.
    return `$${Math.round(value).toLocaleString("es-CO")}`;
  }
}
