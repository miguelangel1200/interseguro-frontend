import type { Matrix } from "@/types";

interface MatrixViewProps {
  title: string;
  matrix: Matrix | null;
  /** Colorea la celda si es un elemento de la diagonal principal. */
  highlightDiagonal?: boolean;
}

/** Renderiza una matriz como tabla. */
export function MatrixView({ title, matrix, highlightDiagonal = false }: MatrixViewProps) {
  if (!matrix) {
    return (
      <Card className="p-4">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">Sin datos.</p>
      </Card>
    );
  }

  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b bg-matrix-head px-4 py-2">
        <p className="text-sm font-medium">{title}</p>
        <span className="text-xs text-muted-foreground">
          {rows}×{cols}
        </span>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse">
          <tbody>
            {matrix.map((row, r) => (
              <tr key={r}>
                {row.map((value, c) => (
                  <td
                    key={c}
                    className={
                      "border border-border px-3 py-1.5 text-center font-mono text-sm " +
                      (highlightDiagonal && r === c
                        ? "bg-highlight text-highlight-foreground"
                        : "bg-matrix-cell")
                    }
                  >
                    {Number(value.toFixed(4))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
