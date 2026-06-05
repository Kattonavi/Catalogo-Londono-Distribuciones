import { cn } from "@/lib/utils";
import { BubbleField } from "./BubbleField";

/** Decide la silueta a partir del envase/presentación. */
function shapeOf(container?: string | null, presentation?: string | null) {
  const t = `${container ?? ""} ${presentation ?? ""}`.toLowerCase();
  if (t.includes("lata") || t.includes("can")) return "can" as const;
  return "bottle" as const;
}

/** Semilla estable a partir del nombre (variedad sin Math.random). */
function hashSeed(value: string): number {
  let h = 7;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h % 100000;
}

/**
 * Placeholder de bebida para productos sin imagen. SVG + CSS puro (sin red):
 * envase (botella/lata) con gradiente soda, reflejo, etiqueta tipográfica con
 * la marca, burbujas internas (BubbleField clipado), condensación y menisco.
 * Pensado para verse comercial y "de marca", nunca un icono gris roto.
 */
export function BeverageGlyph({
  name,
  brand,
  container,
  presentation,
  className,
  bubbles = true,
}: {
  name: string;
  brand?: string | null;
  container?: string | null;
  presentation?: string | null;
  className?: string;
  bubbles?: boolean;
}) {
  const shape = shapeOf(container, presentation);
  const seed = hashSeed(`${brand ?? ""}${name}`);

  const rawLabel = (brand?.trim() || name.trim() || "LD").toUpperCase();
  const label = rawLabel.length <= 11 ? rawLabel : rawLabel.charAt(0);
  const labelSize = label.length <= 3 ? 26 : label.length <= 7 ? 16 : 12;

  return (
    <div
      aria-hidden
      className={cn(
        "surface-frost relative h-full w-full overflow-hidden",
        className,
      )}
    >
      {/* Aire frío: wash radial cyan arriba. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_-10%,rgba(25,211,230,0.16),transparent_60%)]" />

      {/* Burbujas internas (sobre el cuerpo del envase, encima del relleno). */}
      {bubbles && (
        <BubbleField
          count={6}
          seed={seed}
          className="left-[37%] right-[37%] bottom-[44%] top-[20%]"
        />
      )}

      <svg
        viewBox="0 0 200 250"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="soda" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a39c0" />
            <stop offset="52%" stopColor="#2d5bff" />
            <stop offset="100%" stopColor="#5c82ff" />
          </linearGradient>
          <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dce6ff" />
            <stop offset="100%" stopColor="#8fabff" />
          </linearGradient>
        </defs>

        {/* Sombra de asiento. */}
        <ellipse cx="100" cy="240" rx="46" ry="7" fill="rgba(10,16,36,0.18)" />

        {/* Condensación dispersa en el fondo. */}
        <g fill="#ffffff" opacity="0.45">
          <circle cx="46" cy="70" r="3" />
          <circle cx="52" cy="120" r="2" />
          <circle cx="150" cy="92" r="2.5" />
          <circle cx="158" cy="150" r="2" />
          <circle cx="44" cy="180" r="2.5" />
        </g>

        {shape === "can" ? (
          <g>
            {/* Tapa. */}
            <ellipse cx="100" cy="46" rx="34" ry="8" fill="url(#cap)" />
            {/* Cuerpo. */}
            <rect
              x="66"
              y="46"
              width="68"
              height="186"
              rx="18"
              fill="url(#soda)"
              opacity="0.92"
              stroke="rgba(143,171,255,0.45)"
              strokeWidth="1.5"
            />
            <ellipse cx="100" cy="232" rx="34" ry="7" fill="#1a39c0" opacity="0.5" />
            {/* Reflejo. */}
            <rect x="74" y="60" width="9" height="150" rx="4.5" fill="#ffffff" opacity="0.26" />
            {/* Etiqueta. */}
            <rect x="68" y="112" width="64" height="80" rx="10" fill="#ffffff" opacity="0.94" />
          </g>
        ) : (
          <g>
            {/* Tapa. */}
            <rect x="86" y="22" width="28" height="18" rx="5" fill="url(#cap)" />
            <rect x="84" y="38" width="32" height="5" rx="2.5" fill="#8fabff" />
            {/* Cuerpo. */}
            <path
              d="M88 40 C88 64 66 70 66 98 L66 210 Q66 234 90 234 L110 234 Q134 234 134 210 L134 98 C134 70 112 64 112 40 Z"
              fill="url(#soda)"
              opacity="0.92"
              stroke="rgba(143,171,255,0.45)"
              strokeWidth="1.5"
            />
            {/* Reflejo. */}
            <rect x="74" y="104" width="9" height="104" rx="4.5" fill="#ffffff" opacity="0.28" />
            {/* Etiqueta. */}
            <rect x="68" y="134" width="64" height="58" rx="7" fill="#ffffff" opacity="0.94" />
          </g>
        )}

        {/* Texto de marca/inicial sobre la etiqueta (toque editorial). */}
        <text
          x="100"
          y={shape === "can" ? 158 : 167}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#1a2e78"
          style={{
            fontFamily: "var(--font-bricolage), sans-serif",
            fontWeight: 800,
            letterSpacing: label.length <= 3 ? "0.02em" : "0.06em",
          }}
          fontSize={labelSize}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
