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


FROM node:${NODE_VERSION} AS runner
WORKDIR /app

# Copy the output from the build stage
COPY --from=build /workspace/dist/apps/web ./

# Expose the port the app runs on
EXPOSE 4000

# Serve the app
CMD ["node", "server/server.mjs"]
