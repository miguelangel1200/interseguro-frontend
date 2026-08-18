import { apiFetch, setToken } from "./http-client";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
}

/**
 * Autentica contra la API Node.js y guarda el token JWT.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>(
    "node",
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
    false,
  );
  setToken(response.token);
  return response;
}