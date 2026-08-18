# ---- Etapa de build (compila React + TypeScript) ----
FROM node:24-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Etapa de runtime (nginx sirve el build y hace proxy a las APIs) ----
FROM nginx:1.27-alpine

# Configuración de nginx: proxy a la API Go (/process) y Node (/auth).
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
