import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Configuración de Vite para el frontend.
// Los proxies evitan problemas de CORS en desarrollo y permiten consumir las
// APIs desde el navegador usando rutas relativas.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // API Go (procesamiento de matrices)
      '/process': {
        target: process.env.VITE_GO_API_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
      // API Node.js (autenticación y estadísticas)
      '/auth': {
        target: process.env.VITE_NODE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
