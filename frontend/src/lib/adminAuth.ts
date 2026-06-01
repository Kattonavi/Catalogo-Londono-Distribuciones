/**
 * Almacenamiento de tokens del admin (MVP: localStorage).
 *
 * Nota de seguridad: localStorage es práctico para un MVP pero queda expuesto a
 * XSS. Para producción conviene migrar a cookies httpOnly emitidas por el backend.
 */
const ACCESS_KEY = "ld_admin_access_token";
const REFRESH_KEY = "ld_admin_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, accessToken);
  window.localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

export function hasSession(): boolean {
  return Boolean(getAccessToken());
}
