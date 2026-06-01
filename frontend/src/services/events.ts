import { API_URL, hasApi } from "./api";

export type ProductEventType = "view" | "whatsapp-click" | "promotion-click";

/**
 * Registra un evento de producto. Fire-and-forget: nunca bloquea la navegación
 * (p. ej. abrir WhatsApp) ni lanza errores. Si no hay backend, no hace nada.
 */
export function registerProductEvent(
  slug: string,
  type: ProductEventType,
): void {
  if (!hasApi || !slug) return;
  try {
    void fetch(
      `${API_URL}/api/public/products/${encodeURIComponent(slug)}/events/${type}`,
      { method: "POST", keepalive: true },
    ).catch(() => {
      /* ignorar: la analítica no debe afectar la experiencia */
    });
  } catch {
    /* ignorar */
  }
}
