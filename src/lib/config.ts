/**
 * Configuración de las URLs base de las APIs.
 *
 * En desarrollo se usan rutas relativas (proxy de Vite). En producción
 * (Cloudflare Pages) se inyectan las URLs públicas de Cloud Run mediante
 * variables de entorno de build: VITE_GO_API_URL y VITE_NODE_API_URL.
 */

const goApiUrl = (import.meta.env.VITE_GO_API_URL as string | undefined) ?? "";
const nodeApiUrl = (import.meta.env.VITE_NODE_API_URL as string | undefined) ?? "";

export const API_URLS = {
  /** API Go: procesamiento de matrices. */
  go: goApiUrl,
  /** API Node.js: autenticación y estadísticas. */
  node: nodeApiUrl,
} as const;
