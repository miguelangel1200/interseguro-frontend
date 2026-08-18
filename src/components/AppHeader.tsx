import { Clock, LayoutGrid, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formatClock } from "@/lib/format";

/** Cabecera de la app: marca, estado de sesión y cierre de sesión. */
export function AppHeader() {
  const { expiresAt, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Interseguro</p>
            <p className="text-xs text-muted-foreground">Reto · Procesador de matrices</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {expiresAt !== null && (
            <p className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Sesión hasta las {formatClock(expiresAt)}
            </p>
          )}
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
