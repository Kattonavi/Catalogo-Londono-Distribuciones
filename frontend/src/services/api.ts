/**
 * Cliente HTTP mínimo hacia el backend.
 *
 * - `API_URL` proviene de NEXT_PUBLIC_API_URL. Si está vacío, el frontend
 *   funciona en "modo sin backend": las funciones devuelven estados vacíos.
 * - `safeGet` NUNCA lanza: ideal para Server Components y para que `next build`
 *   no falle si el backend no está disponible.
 * - `getJson` SÍ lanza ante errores reales (red / status != 2xx): lo usa el
 *   catálogo en cliente para distinguir estado de error de estado vacío.
 */
export const API_URL: string = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/$/,
  "",
);

export const hasApi: boolean = API_URL.length > 0;

type QueryValue = string | number | boolean | null | undefined;

/** Construye un querystring omitiendo valores nulos/vacíos. */
export function buildQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/** GET que nunca lanza; devuelve `fallback` ante cualquier problema. */
export async function safeGet<T>(path: string, fallback: T): Promise<T> {
  if (!hasApi) return fallback;
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** GET que devuelve `empty` si no hay backend, pero lanza ante errores reales. */
export async function getJson<T>(path: string, empty: T): Promise<T> {
  if (!hasApi) return empty;
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Error ${res.status} al consultar ${path}`);
  }
  return (await res.json()) as T;
}
