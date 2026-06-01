const PHONE = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ?? "").replace(
  /[^\d]/g,
  "",
);

/** Construye una URL de WhatsApp con mensaje prellenado (wa.me). */
export function whatsappUrl(message: string): string {
  const text = encodeURIComponent(message);
  return PHONE
    ? `https://wa.me/${PHONE}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

/** Mensaje prellenado para un producto específico. */
export function productMessage(productName: string): string {
  return `Hola, quiero más información sobre ${productName} de Londoño Distribuciones.`;
}

/** Mensaje general (CTA de pedido). */
export const GENERAL_MESSAGE =
  "Hola, vi el catálogo de Londoño Distribuciones y quiero hacer un pedido.";
