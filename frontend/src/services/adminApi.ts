import { API_URL } from "./api";
import type { AdminUser } from "@/types/admin";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/adminAuth";

/** Error de API con código y mensaje legible (del cuerpo ApiError del backend). */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Sesión inválida/expirada: dispara redirección a /admin/login. */
export class AuthError extends Error {
  constructor() {
    super("Sesión expirada");
    this.name = "AuthError";
  }
}

function rawFetch(
  path: string,
  init: RequestInit,
  token: string | null,
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  // Content-Type JSON solo si el body es texto (no FormData).
  if (
    init.body &&
    typeof init.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
}

let refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  })();
  const result = await refreshing;
  refreshing = null;
  return result;
}

async function toApiError(res: Response): Promise<ApiError> {
  let message = `Error ${res.status}`;
  try {
    const body = await res.json();
    if (body && typeof body.message === "string") message = body.message;
  } catch {
    /* sin cuerpo JSON */
  }
  return new ApiError(res.status, message);
}

/** Fetch autenticado: añade el Bearer, intenta refresh ante 401 y redirige al login si falla. */
export async function adminFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  if (!API_URL) {
    throw new ApiError(0, "API no configurada (NEXT_PUBLIC_API_URL).");
  }
  let res = await rawFetch(path, init, getAccessToken());
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await rawFetch(path, init, getAccessToken());
    }
  }
  if (res.status === 401 || res.status === 403) {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.assign("/admin/login");
    }
    throw new AuthError();
  }
  return res;
}

export async function adminGet<T>(path: string): Promise<T> {
  const res = await adminFetch(path);
  if (!res.ok) throw await toApiError(res);
  return res.json() as Promise<T>;
}

export async function adminSend<T>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T | null> {
  const res = await adminFetch(path, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw await toApiError(res);
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : null;
}

export async function adminUpload<T>(
  method: "POST" | "PUT",
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await adminFetch(path, { method, body: formData });
  if (!res.ok) throw await toApiError(res);
  return res.json() as Promise<T>;
}

// ----------------------------------------------------------------- auth
export async function login(
  email: string,
  password: string,
): Promise<AdminUser> {
  if (!API_URL) {
    throw new ApiError(0, "API no configurada (NEXT_PUBLIC_API_URL).");
  }
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new ApiError(
      res.status,
      res.status === 401
        ? "Credenciales inválidas"
        : "No se pudo iniciar sesión",
    );
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.user as AdminUser;
}

export function me(): Promise<AdminUser> {
  return adminGet<AdminUser>("/api/auth/me");
}

export async function logout(): Promise<void> {
  const token = getAccessToken();
  try {
    if (token) {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch {
    /* logout best-effort */
  } finally {
    clearTokens();
  }
}
