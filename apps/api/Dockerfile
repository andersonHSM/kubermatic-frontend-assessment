# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
WORKDIR /workspace

# Install dependencies (use cached layer when package files don't change)
COPY package*.json ./
RUN npm ci

# Copy the rest of the workspace
COPY . .

COPY /libs /

RUN npx prisma generate --schema libs/db/prisma/schema.prisma

# Build API and prepare pruned runtime artifacts
RUN npx nx build api \
 && npx nx run api:copy-workspace-modules --verbose


FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production
WORKDIR /app

# Install production dependencies from workspace manifest to ensure all runtime deps are present
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev


# Copy built output (includes generated package files and any workspace modules)
COPY --from=base /workspace/dist/apps/api/ ./
COPY --from=base /workspace/libs/db/output /app/libs/db/output/

RUN apk update \
	&& apk add --no-cache openssl\
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/cache/apk/* \

EXPOSE 3000
CMD ["node", "main.js"]
