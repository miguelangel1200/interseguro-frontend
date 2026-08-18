import { createRootRoute, createRoute, createRouter, redirect, useRouter } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { LoginForm } from "@/components/Login";
import { MatrixForm } from "@/components/MatrixForm";
import { getToken } from "@/api/http-client";

// --- Ruta raíz (layout) ---
const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppHeader />
      <Outlet />
    </>
  ),
});

// --- Ruta de login ---
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    // Si ya hay sesión, ir al dashboard.
    if (getToken()) {
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <LoginForm redirectTo="/" />
    </main>
  ),
});

// --- Ruta del dashboard (protegida) ---
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <main className="mx-auto max-w-7xl space-y-6 p-4">
      <MatrixForm />
    </main>
  ),
});

const routeTree = rootRoute.addChildren([loginRoute, indexRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/** Hook conveniente para acceder al router dentro de la app. */
export function useAppRouter() {
  return useRouter();
}
