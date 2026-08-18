import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";

import { router } from "@/router";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorDialogProvider } from "@/context/ErrorDialogContext";
import "@/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ErrorDialogProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-center" />
      </ErrorDialogProvider>
    </AuthProvider>
  </StrictMode>,
);
