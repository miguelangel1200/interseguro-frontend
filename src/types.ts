/** Matriz de números: Matriz[fila][columna]. */
export type Matrix = number[][];

/** Respuesta de autenticación. */
export interface AuthResponse {
  token: string;
  expiresIn: number;
}

/** Resultado del procesamiento de una matriz (respuesta de la API Go). */
export interface ProcessResult {
  original: Matrix;
  rotated: Matrix;
  Q: Matrix;
  R: Matrix;
}

/** Estadísticas sobre una matriz. */
export interface MatrixStatistics {
  rows: number;
  cols: number;
  sum: number;
  mean: number | null;
  max: number | null;
  min: number | null;
  isDiagonal: boolean;
  frobeniusNorm: number;
}

/** Estadísticas sobre la factorización QR. */
export interface QRStatistics {
  qRows: number;
  qCols: number;
  rRows: number;
  rCols: number;
  rFrobeniusNorm: number;
  determinantOfR: number | null;
  isSquare: boolean;
  isDiagonal: boolean;
}

/** Estadísticas globales sobre todas las matrices recibidas. */
export interface GlobalStatistics {
  max: number | null;
  min: number | null;
  mean: number | null;
  sum: number;
  matricesCount: number;
}

/** Estadísticas completas devueltas por la API Node.js (envueltas por Go). */
export interface Statistics {
  id: string;
  statistics: {
    original: MatrixStatistics | null;
    rotated: MatrixStatistics | null;
    q: MatrixStatistics;
    r: MatrixStatistics;
    qr: QRStatistics;
    orthogonalityError: number;
    global: GlobalStatistics;
    diagonal: {
      any: boolean;
      matrices: string[];
    };
  };
}

/** Respuesta completa de POST /process. */
export interface ProcessResponse {
  message: string;
  result: ProcessResult;
  statistics?: Statistics;
  error?: { error: string; code: string };
}

/** Error normalizado de las APIs. */
export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}
