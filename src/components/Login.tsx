/**
 * Formulario de inicio de sesión con validación y manejo de errores.
 * Presentación pura: la lógica de autenticación vive en AuthContext.
 */
import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CircleAlert, LoaderCircle, Lock, LogIn, User } from "lucide-react";
import { toast } from "sonner";

import { ApiError } from "@/api/http-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  /** Ruta interna a la que volver tras autenticarse. */
  redirectTo: string;
}

interface FieldErrors {
  username?: string;
  password?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: FieldErrors = {};
    if (!username.trim()) errors.username = "Ingresa tu usuario.";
    if (!password) errors.password = "Ingresa tu contraseña.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await login(username.trim(), password);
      toast.success("Sesión iniciada correctamente");
      await navigate({ to: redirectTo });
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "Ocurrió un error inesperado. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Iniciar sesión</CardTitle>
        <CardDescription>Accede con tus credenciales para procesar matrices.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Usuario</Label>
            <div className="relative">
              <User
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="username"
                autoComplete="username"
                placeholder="usuario"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                aria-invalid={Boolean(fieldErrors.username)}
                aria-describedby={fieldErrors.username ? "username-error" : undefined}
                className="pl-9"
              />
            </div>
            {fieldErrors.username && (
              <p id="username-error" className="text-xs text-destructive">
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
                className="pl-9"
              />
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="text-xs text-destructive">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {submitError && (
            <Alert variant="destructive">
              <CircleAlert className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>No se pudo iniciar sesión</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="h-4 w-4" aria-hidden="true" />
            )}
            {isSubmitting ? "Verificando…" : "Ingresar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
