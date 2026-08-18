import { ApiError } from "@/api/http-client";

/** Mensajes de error traducidos al español según el código de la API. */
const CODE_MESSAGES: Record<string, string> = {
  // Errores de validación de la API Go
  MATRIX_EMPTY: "La matriz no puede estar vacía. Ingresa al menos una fila y una columna.",
  MATRIX_NOT_RECTANGULAR:
    "La matriz debe ser rectangular: todas las filas deben tener la misma cantidad de columnas.",
  MATRIX_LINEARLY_DEPENDENT:
    "No es posible calcular la factorización QR porque las columnas de la matriz son linealmente dependientes. Prueba con otra matriz.",
  BAD_REQUEST: "La petición es inválida. Revisa los datos ingresados e inténtalo nuevamente.",
  // Errores de autenticación
  UNAUTHORIZED: "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.",
  VALIDATION_ERROR: "Los datos enviados no son válidos.",
  NOT_FOUND: "El recurso solicitado no fue encontrado.",
  NODE_API_UNAVAILABLE: "El servicio de estadísticas no está disponible en este momento.",
  // Error genérico
  INTERNAL: "Ocurrió un error inesperado en el servidor.",
  INTERNAL_SERVER_ERROR: "Ocurrió un error inesperado en el servidor.",
  HTTP_ERROR: "Ocurrió un error de comunicación con el servidor.",
};

/** Error plano devuelto por la API en el cuerpo de una respuesta 200. */
interface PlainApiError {
  error?: string;
  code?: string;
}

/** Extrae el código de error de cualquier forma de error conocida. */
function extractCode(error: unknown): string | undefined {
  if (error instanceof ApiError) return error.code;
  if (error && typeof error === "object" && "code" in error) {
    return String((error as PlainApiError).code ?? "");
  }
  return undefined;
}

/** Extrae el mensaje de error de cualquier forma de error conocida. */
function extractMessage(error: unknown): string | undefined {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "error" in error) {
    return (error as PlainApiError).error;
  }
  return undefined;
}

/**
 * Traduce un error de la API a un mensaje en español.
 */
export function translateApiError(error: unknown): string {
  const code = extractCode(error);
  if (code && CODE_MESSAGES[code]) {
    return CODE_MESSAGES[code];
  }
  return extractMessage(error) ?? "Ocurrió un error inesperado.";
}

/** Indica si el error corresponde a una sesión expirada/no autenticada. */
export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.code === "UNAUTHORIZED";
  }
  return extractCode(error) === "UNAUTHORIZED";
}
