import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import type { Matrix } from "@/types";

interface MatrixEditorProps {
  value: Matrix;
  onChange: (matrix: Matrix) => void;
}

const MAX_SIZE = 6;
const MIN_SIZE = 1;

/** Editor de matriz como rejilla editable de celdas, con control de dimensiones. */
export function MatrixEditor({ value, onChange }: MatrixEditorProps) {
  const [rows, setRows] = useState(value.length);
  const [cols, setCols] = useState(value[0]?.length ?? 2);

  function resize(nextRows: number, nextCols: number) {
    const safeRows = Math.max(MIN_SIZE, Math.min(MAX_SIZE, nextRows));
    const safeCols = Math.max(MIN_SIZE, Math.min(MAX_SIZE, nextCols));

    const next: Matrix = Array.from({ length: safeRows }, (_, r) =>
      Array.from({ length: safeCols }, (_, c) => value[r]?.[c] ?? 0),
    );

    setRows(safeRows);
    setCols(safeCols);
    onChange(next);
  }

  function updateCell(r: number, c: number, raw: string) {
    const parsed = Number(raw);
    const next = value.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? (Number.isNaN(parsed) ? 0 : parsed) : cell)),
    );
    onChange(next);
  }

  function stepRows(delta: number) {
    resize(rows + delta, cols);
  }

  function stepCols(delta: number) {
    resize(rows, cols + delta);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rows">Filas</Label>
          <div className="flex items-center gap-1">
            <Button type="button" variant="outline" size="icon" onClick={() => stepRows(-1)} disabled={rows <= MIN_SIZE} aria-label="Quitar fila">
              <Minus className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Input id="rows" type="number" min={MIN_SIZE} max={MAX_SIZE} value={rows} onChange={(e) => resize(Number(e.target.value), cols)} className="w-16 text-center" />
            <Button type="button" variant="outline" size="icon" onClick={() => stepRows(1)} disabled={rows >= MAX_SIZE} aria-label="Agregar fila">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cols">Columnas</Label>
          <div className="flex items-center gap-1">
            <Button type="button" variant="outline" size="icon" onClick={() => stepCols(-1)} disabled={cols <= MIN_SIZE} aria-label="Quitar columna">
              <Minus className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Input id="cols" type="number" min={MIN_SIZE} max={MAX_SIZE} value={cols} onChange={(e) => resize(rows, Number(e.target.value))} className="w-16 text-center" />
            <Button type="button" variant="outline" size="icon" onClick={() => stepCols(1)} disabled={cols >= MAX_SIZE} aria-label="Agregar columna">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      <div className="inline-block rounded-lg border bg-card p-3" role="group" aria-label="Editor de matriz">
        {value.map((row, r) => (
          <div className="flex gap-1.5 py-0.5" key={r}>
            {row.map((cell, c) => (
              <Input
                key={c}
                className="w-16 text-center font-mono"
                type="number"
                step="any"
                value={cell}
                aria-label={`fila ${r + 1}, columna ${c + 1}`}
                onChange={(e) => updateCell(r, c, e.target.value)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
