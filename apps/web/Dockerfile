# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS build
WORKDIR /workspace

# Install deps at workspace root for Nx/Angular build
COPY package*.json ./
RUN npm ci

# Copy repo and build web app
COPY . .
RUN npx nx build web


FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default content and copy built browser assets
RUN rm -rf ./*
COPY --from=build /workspace/dist/apps/web/browser ./

# Add SPA-friendly nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
