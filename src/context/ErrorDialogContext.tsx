import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ErrorDialogOptions {
  /** Título del modal (por defecto "Error"). */
  title?: string;
  /** Mensaje a mostrar, ya traducido al español. */
  message: string;
  /** Acción al confirmar (opcional). */
  onConfirm?: () => void;
  /** Texto del botón de confirmación. */
  confirmLabel?: string;
}

interface ErrorDialogContextValue {
  showError: (options: ErrorDialogOptions) => void;
}

const ErrorDialogContext = createContext<ErrorDialogContextValue | undefined>(undefined);

/**
 * Provee un modal global de errores. Cualquier parte de la app puede llamar a
 * `showError` para mostrar un AlertDialog con el mensaje en español.
 */
export function ErrorDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ErrorDialogOptions | null>(null);

  const showError = useCallback((options: ErrorDialogOptions) => {
    setState(options);
  }, []);

  const handleClose = useCallback(() => {
    state?.onConfirm?.();
    setState(null);
  }, [state]);

  return (
    <ErrorDialogContext.Provider value={{ showError }}>
      {children}
      <AlertDialog open={state !== null} onOpenChange={(open) => !open && handleClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state?.title ?? "Error"}</AlertDialogTitle>
            <AlertDialogDescription>{state?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleClose}>
              {state?.confirmLabel ?? "Aceptar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ErrorDialogContext.Provider>
  );
}

/** Hook de acceso al modal global de errores. */
export function useErrorDialog(): ErrorDialogContextValue {
  const ctx = useContext(ErrorDialogContext);
  if (!ctx) {
    throw new Error("useErrorDialog debe usarse dentro de <ErrorDialogProvider>");
  }
  return ctx;
}
