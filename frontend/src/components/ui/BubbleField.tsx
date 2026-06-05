"use client";

import { useMemo, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type BubbleAccent = "lime" | "rose";

const accentClass: Record<BubbleAccent, string> = {
  lime: "bubble--lime",
  rose: "bubble--rose",
};

/** PRNG determinista (LCG) para que SSR y cliente generen lo mismo. */
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/**
 * Columna de Burbujas de CO2: capa decorativa para superficies oscuras y
 * placeholders. Usa el keyframe único `.bubble` (globals.css), solo anima
 * transform/opacity y se congela con prefers-reduced-motion.
 *
 * Solo debe vivir sobre superficies oscuras (slabs midnight) o dentro del
 * envase del placeholder — nunca flotando sobre fondo blanco.
 */
export function BubbleField({
  count = 14,
  seed = 7,
  accent = "lime",
  className,
}: {
  count?: number;
  /** Semilla del patrón (cambia la disposición sin perder determinismo). */
  seed?: number;
  /** Color de las 1-2 burbujas chispa de acento. */
  accent?: BubbleAccent;
  className?: string;
}) {
  const bubbles = useMemo(() => {
    const rand = seeded(seed);
    const total = Math.min(Math.max(count, 1), 22);
    const accentEvery = Math.max(7, Math.floor(total / 2));
    return Array.from({ length: total }, (_, i) => ({
      x: Math.round(rand() * 100),
      size: Math.round(3 + rand() * 19),
      dur: Number((7 + rand() * 7).toFixed(2)),
      delay: Number((rand() * 10).toFixed(2)),
      accent: i % accentEvery === accentEvery - 1,
    }));
  }, [count, seed]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {bubbles.map((b, i) => (
        <span
          key={i}
          className={cn("bubble", b.accent && accentClass[accent])}
          style={
            {
              "--x": `${b.x}%`,
              "--s": `${b.size}px`,
              "--dur": `${b.dur}s`,
              "--d": `${b.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
