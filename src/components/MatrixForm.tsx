import { type FormEvent, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LoaderCircle, Play } from "lucide-react";

import { processMatrix } from "@/api/matrix";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MatrixEditor } from "@/components/MatrixEditor";
import { MatrixView } from "@/components/MatrixView";
import { StatisticsView } from "@/components/StatisticsView";
import { QRVerification } from "@/components/QRVerification";
import { useErrorDialog } from "@/context/ErrorDialogContext";
import { isUnauthorizedError, translateApiError } from "@/lib/errors";
import type { Matrix, ProcessResponse } from "@/types";

const DEFAULT_MATRIX: Matrix = [
  [1, 2],
  [3, 4],
];

/** Pantalla principal: ingreso de matriz, procesamiento y resultados. */
export function MatrixForm() {
  const navigate = useNavigate();
  const { showError } = useErrorDialog();

  const [matrix, setMatrix] = useState<Matrix>(DEFAULT_MATRIX);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessResponse | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (matrix.length === 0 || matrix[0].length === 0) {
        throw new Error("La matriz no puede estar vacía.");
      }
      const response = await processMatrix(matrix);
      if (response.error) {
        setResult(null);
        // Traduce el error devuelto por la API al español.
        showError({ title: "Error al procesar", message: translateApiError(response.error) });
        return;
      }
      setResult(response);
    } catch (err) {
      setResult(null);
      if (isUnauthorizedError(err)) {
        // Sesión expirada: avisar y regresar al login al confirmar.
        showError({
          title: "Tu sesión ha expirado",
          message:
            "Tu sesión ya no es válida o expiró. Inicia sesión nuevamente para continuar.",
          confirmLabel: "Ir a iniciar sesión",
          onConfirm: () => navigate({ to: "/login" }),
        });
      } else {
        showError({ title: "Error al procesar", message: translateApiError(err) });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <MatrixEditor value={matrix} onChange={setMatrix} />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
            {loading ? "Procesando…" : "Procesar matriz"}
          </Button>
        </form>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <MatrixView title="Matriz original" matrix={result.result.original} />
            <MatrixView title="Matriz rotada 90°" matrix={result.result.rotated} />
            <MatrixView title="Matriz Q" matrix={result.result.Q} highlightDiagonal />
            <MatrixView title="Matriz R" matrix={result.result.R} highlightDiagonal />
          </div>

          <QRVerification
            original={result.result.original}
            Q={result.result.Q}
            R={result.result.R}
          />

          <StatisticsView statistics={result.statistics} />
        </div>
      )}
    </div>
  );
}
