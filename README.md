# interseguro-frontend

Frontend React (Vite + TanStack Router + Tailwind) del Reto Interseguro.
Consume `interseguro-go-api` (procesamiento de matrices) e
`interseguro-node-api` (login y estadísticas).

## Variables de entorno (build)

| Variable            | Descripción                       | Uso                            |
|---------------------|-----------------------------------|--------------------------------|
| `VITE_GO_API_URL`   | URL base de la API Go (Cloud Run).| Vacía → rutas relativas (dev). |
| `VITE_NODE_API_URL` | URL base de la API Node (Cloud Run). | Vacía → rutas relativas (dev).|

En desarrollo, si no se definen, el proxy de Vite (`vite.config.ts`) resuelve
las llamadas a las APIs locales.

## Scripts

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # typecheck + build a dist/
npm run preview   # sirve el build localmente
```

## Despliegue (Cloudflare Pages)

El workflow de GitHub Actions (`Deploy to Cloudflare Pages`) instala, compila
con las `VITE_*` y publica `dist/` con Wrangler (Direct Upload).

Secrets necesarios en el repositorio:

| Secret                  | Descripción                              |
|-------------------------|------------------------------------------|
| `CLOUDFLARE_API_TOKEN`  | Token de API con permiso `Cloudflare Pages:Edit`. |
| `CLOUDFLARE_ACCOUNT_ID` | ID de cuenta de Cloudflare.              |
| `VITE_GO_API_URL`       | URL de la API Go en producción.          |
| `VITE_NODE_API_URL`     | URL de la API Node en producción.        |

Incluye `public/_redirects` (`/* /index.html 200`) para el fallback SPA de
TanStack Router en Pages.
