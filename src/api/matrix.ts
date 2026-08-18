import { apiFetch } from "./http-client";
import type { Matrix, ProcessResponse } from "@/types";

/**
 * Envía una matriz a la API Go para su procesamiento (rotación + QR + stats).
 */
export async function processMatrix(matrix: Matrix): Promise<ProcessResponse> {
  return apiFetch<ProcessResponse>("go", "/process", {
    method: "POST",
    body: JSON.stringify({ matrix }),
  });
}