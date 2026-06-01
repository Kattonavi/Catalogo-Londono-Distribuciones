"use client";

import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import {
  registerProductEvent,
  type ProductEventType,
} from "@/services/events";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Size = "sm" | "md" | "lg";
type Variant = "solid" | "outline";

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-13 px-6 text-base gap-2.5",
};

const variantStyles: Record<Variant, string> = {
  solid: "bg-wa text-white hover:bg-wa-dark shadow-sm",
  outline: "border-2 border-wa text-wa-dark hover:bg-wa/10 bg-white",
};

export function WhatsAppButton({
  message,
  label = "Pedir por WhatsApp",
  productSlug,
  eventType,
  size = "md",
  variant = "solid",
  fullWidth = false,
  className,
}: {
  message: string;
  label?: string;
  productSlug?: string;
  eventType?: ProductEventType;
  size?: Size;
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
}) {
  function handleClick() {
    // Fire-and-forget: nunca bloquea la apertura de WhatsApp.
    if (productSlug && eventType) {
      registerProductEvent(productSlug, eventType);
    }
  }

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wa-dark",
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className,
      )}
    >
      <WhatsAppIcon className="size-5 shrink-0" />
      <span>{label}</span>
    </a>
  );
}
