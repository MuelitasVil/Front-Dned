# syntax=docker/dockerfile:1
# Colocar en system/Front-Dned/organizacional-front/Dockerfile.
# Ejecutar docker build desde system/Front-Dned/organizacional-front.
# Se asume una SPA de Vite publicada en / y con salida en dist/.

FROM node:24-bookworm-slim AS build

WORKDIR /app

# Instalar tambien devDependencies: TypeScript y Vite compilan el proyecto.
# npm ci requiere un package-lock.json sincronizado con package.json.
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copiar los archivos de la estructura indicada, relativos al contexto de build.
COPY index.html vite.config.ts eslint.config.js tsconfig*.json ./
COPY src/ ./src/
COPY public/ ./public/

# URL publica accesible desde el navegador; se incorpora durante el build.
# El codigo del frontend debe leer import.meta.env.VITE_API_URL.
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Ejecuta el script existente: tsc -b && vite build.
RUN npm run build

FROM nginx:stable-alpine AS runtime

# Solo los archivos compilados pasan a la imagen final.
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Configuracion incluida para no depender de un nginx.conf adicional.
# Las rutas del frontend vuelven a index.html al refrescar el navegador.
COPY <<'NGINX' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;
    server_tokens off;

    location = /index.html {
        add_header Cache-Control "no-cache" always;
    }

    location /assets/ {
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

RUN nginx -t

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
