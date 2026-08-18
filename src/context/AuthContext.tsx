import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { login as apiLogin } from "@/api/auth";
import { clearToken, getToken } from "@/api/http-client";
import { AUTH_UNAUTHORIZED_EVENT } from "@/lib/constants";

interface AuthContextValue {
  /** Token JWT actual, o null si no hay sesión. */
  token: string | null;
  /** Timestamp (ms) de expiración de la sesión, o null. */
  expiresAt: number | null;
  /** Indica si existe una sesión iniciada. */
  isAuthenticated: boolean;
  /** Autentica contra la API y guarda el token. */
  login: (username: string, password: string) => Promise<void>;
  /** Cierra la sesión y elimina el token. */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Decodifica el campo `exp` de un JWT y devuelve el timestamp en ms. */
function decodeExpiresAt(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * Provee el estado de autenticación a toda la aplicación.
 * Centraliza el token JWT y reacciona ante sesiones expiradas (401).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const expiresAt = useMemo(() => (token ? decodeExpiresAt(token) : null), [token]);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await apiLogin({ username, password });
    setTokenState(response.token);
  }, []);

  // Cierra la sesión automáticamente ante un 401 (token expirado/inválido).
  useEffect(() => {
    function handleUnauthorized() {
      logout();
    }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      expiresAt,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, expiresAt, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook de acceso al contexto de autenticación. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
