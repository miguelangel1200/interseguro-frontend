import { AUTH_UNAUTHORIZED_EVENT } from "@/lib/constants";
import { API_URLS } from "@/lib/config";

/** Error normalizado de las APIs con código y estado HTTP. */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** API de destino de una petición. */
export type ApiTarget = "go" | "node";

// Token JWT en memoria (no persistente). Evita que un XSS exfiltre el token
// desde localStorage. Al recargar la página se pierde la sesión y se debe
// iniciar sesión de nuevo. (Una sesión httpOnly-cookie completa requeriría un
// BFF/gateway por la arquitectura multi-origen frontend → go → node.)
let sessionToken: string | null = null;

export function getToken(): string | null {
  return sessionToken;
}

export function setToken(token: string): void {
  sessionToken = token;
}

export function clearToken(): void {
  sessionToken = null;
}

/** Resuelve la URL absoluta de una petición según la API destino. */
function resolveUrl(target: ApiTarget, path: string): string {
  const base = API_URLS[target];
  if (!base) return path; // Desarrollo: ruta relativa (proxy de Vite).
  return `${base.replace(/\/$/, "")}${path}`;
}

/**
 * Realiza una petición a una API inyectando el token Bearer cuando
 * corresponde y normalizando los errores como ApiError.
 */
export async function apiFetch<T>(
  target: ApiTarget,
  path: string,
  init: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (authenticated) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(resolveUrl(target, path), { ...init, headers });

  if (!response.ok) {
    let body: { error?: string; code?: string };
    try {
      body = await response.json();
    } catch {
      body = {};
    }

    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    throw new ApiError(body.error || response.statusText, body.code || "HTTP_ERROR", response.status);
  }

  return response.json() as Promise<T>;
}