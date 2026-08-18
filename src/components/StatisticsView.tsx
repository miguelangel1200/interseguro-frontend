import { Card } from "@/components/ui/card";
import type { GlobalStatistics, MatrixStatistics, QRStatistics, Statistics } from "@/types";

interface StatisticsViewProps {
  statistics?: Statistics;
}

/** Muestra las estadísticas calculadas por la API Node.js. */
export function StatisticsView({ statistics }: StatisticsViewProps) {
  if (!statistics) {
    return (
      <Card className="p-4">
        <h3 className="text-sm font-semibold">Estadísticas</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          No se obtuvieron estadísticas (¿API Node disponible?).
        </p>
      </Card>
    );
  }

  const s = statistics.statistics;

  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold">Estadísticas</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock title="Matriz original" stats={s.original} />
        <StatBlock title="Matriz rotada" stats={s.rotated} />
        <StatBlock title="Matriz Q" stats={s.q} />
        <StatBlock title="Matriz R" stats={s.r} />

        <QRBlock title="Factorización QR" stats={s.qr} />
        <OrthogonalityBlock error={s.orthogonalityError} />
        <DiagonalBlock diagonal={s.diagonal} />
        <GlobalBlock global={s.global} />
      </div>
    </Card>
  );
}

function StatBlock({ title, stats }: { title: string; stats: MatrixStatistics | null }) {
  if (!stats) {
    return (
      <div className="rounded-lg border bg-muted/40 p-3">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 text-xs">N/D</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <ul className="mt-1 space-y-0.5 text-xs">
        <Row k="Máx" v={stats.max} />
        <Row k="Mín" v={stats.min} />
        <Row k="Promedio" v={stats.mean} />
        <Row k="Suma" v={stats.sum} />
        <li>
          Diagonal: <b>{stats.isDiagonal ? "Sí" : "No"}</b>
        </li>
        <li>
          Norma F: <b>{stats.frobeniusNorm}</b>
        </li>
      </ul>
    </div>
  );
}

function QRBlock({ title, stats }: { title: string; stats: QRStatistics }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <ul className="mt-1 space-y-0.5 text-xs">
        <li>
          Q: <b>{stats.qRows}×{stats.qCols}</b>
        </li>
        <li>
          R: <b>{stats.rRows}×{stats.rCols}</b>
        </li>
        <li>
          det(R): <b>{stats.determinantOfR ?? "—"}</b>
        </li>
        <li>
          R diagonal: <b>{stats.isDiagonal ? "Sí" : "No"}</b>
        </li>
        <li>
          ‖R‖F: <b>{stats.rFrobeniusNorm}</b>
        </li>
      </ul>
    </div>
  );
}

function OrthogonalityBlock({ error }: { error: number }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs font-medium text-muted-foreground">Ortogonalidad</p>
      <ul className="mt-1 space-y-0.5 text-xs">
        <li>
          Error QᵀQ≈I: <b>{error}</b>
        </li>
      </ul>
    </div>
  );
}

function DiagonalBlock({ diagonal }: { diagonal: { any: boolean; matrices: string[] } }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs font-medium text-muted-foreground">Matriz diagonal</p>
      <ul className="mt-1 space-y-0.5 text-xs">
        <li>
          ¿Alguna?: <b>{diagonal.any ? "Sí" : "No"}</b>
        </li>
        <li>Matrices: {diagonal.matrices.length ? diagonal.matrices.join(", ") : "Ninguna"}</li>
      </ul>
    </div>
  );
}

function GlobalBlock({ global }: { global: GlobalStatistics }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs font-medium text-muted-foreground">Global (todas)</p>
      <ul className="mt-1 space-y-0.5 text-xs">
        <Row k="Máx" v={global.max} />
        <Row k="Mín" v={global.min} />
        <Row k="Promedio" v={global.mean} />
        <Row k="Suma total" v={global.sum} />
      </ul>
    </div>
  );
}

function Row({ k, v }: { k: string; v: number | null }) {
  return (
    <li>
      {k}: <b>{v === null ? "—" : v}</b>
    </li>
  );
}
