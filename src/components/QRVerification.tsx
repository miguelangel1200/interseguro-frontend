import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Matrix } from "@/types";

interface QRVerificationProps {
  original: Matrix;
  Q: Matrix;
  R: Matrix;
}

/** Multiplica Q·R y devuelve la matriz reconstruida (A'). */
function multiplyMatrices(Q: Matrix, R: Matrix): Matrix {
  const m = Q.length;
  const n = R[0]?.length ?? 0;
  const k = R.length;

  const result: Matrix = Array.from({ length: m }, () => Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let t = 0; t < k; t++) {
        sum += Q[i][t] * R[t][j];
      }
      result[i][j] = Number(sum.toFixed(6));
    }
  }
  return result;
}

/** Calcula el error máximo por celda entre A y la reconstrucción A'. */
function maxError(A: Matrix, reconstructed: Matrix): number {
  let err = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      err = Math.max(err, Math.abs(A[i][j] - reconstructed[i]?.[j]));
    }
  }
  return err;
}

/**
 * Verificación visual de la factorización: muestra Q, R, la reconstrucción
 * Q·R y la compara con la matriz original A. Si A ≈ Q·R (error < umbral),
 * la factorización es correcta.
 */
export function QRVerification({ original, Q, R }: QRVerificationProps) {
  const reconstructed = multiplyMatrices(Q, R);
  const error = maxError(original, reconstructed);
  const threshold = 1e-4;
  const isCorrect = error < threshold;

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold">Verificación A = Q·R</h3>
        {isCorrect ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Correcta (Q·R ≈ A)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
            <XCircle className="h-4 w-4" aria-hidden="true" />
            No coincide
          </span>
        )}
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        Reconstruimos <span className="font-mono">A′ = Q × R</span> y comparamos con la matriz
        original. Error máximo por celda: <span className="font-mono">{error.toExponential(2)}</span>{" "}
        (umbral: <span className="font-mono">{threshold}</span>).
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="overflow-x-auto rounded-md border bg-matrix-cell p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Reconstrucción Q·R</p>
          <MatrixTable matrix={reconstructed} />
        </div>
        <div className="overflow-x-auto rounded-md border bg-matrix-cell p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Original (A)</p>
          <MatrixTable matrix={original} />
        </div>
      </div>
    </Card>
  );
}

/** Tabla simple de una matriz para la verificación. */
function MatrixTable({ matrix }: { matrix: Matrix }) {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {matrix.map((row, r) => (
          <tr key={r}>
            {row.map((value, c) => (
              <td key={c} className="border border-border px-2 py-1 text-center font-mono text-xs">
                {Number(value.toFixed(4))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
