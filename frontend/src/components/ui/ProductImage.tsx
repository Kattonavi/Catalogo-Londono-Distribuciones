import Image from "next/image";
import { cn } from "@/lib/utils";
import { BeverageGlyph } from "./BeverageGlyph";

/**
 * Imagen de producto. Usa next/image cuando hay `src` (Cloudinary);
 * si no, muestra el placeholder de bebida <BeverageGlyph> (SVG, sin red).
 * El contenedor padre debe ser `relative` con una relación de aspecto.
 */
export function ProductImage({
  src,
  alt,
  sizes = "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
  fit = "cover",
  brand,
  container,
  presentation,
  bubbles = true,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  brand?: string | null;
  container?: string | null;
  presentation?: string | null;
  bubbles?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <BeverageGlyph
        name={alt}
        brand={brand}
        container={container}
        presentation={presentation}
        bubbles={bubbles}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn(fit === "contain" ? "object-contain" : "object-cover", className)}
    />
  );
}
