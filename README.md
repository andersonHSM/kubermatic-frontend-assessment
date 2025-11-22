Kubermatic Assessment — Nx Monorepo (API + Web) with Docker Compose

This repository contains an Nx workspace with:
- API: NestJS application (served at `/api`)
- Web: Angular SPA served by Nginx
- Database: Postgres (latest)
 - DB Project: Prisma-based migrations and seeds under `apps/db`

Docker Compose is provided to build and run the entire stack locally. All configurable and sensitive settings have been moved to a `.env` file at the project root.

Prerequisites
- Docker Desktop or Docker Engine 20+
- Docker Compose v2 (comes with recent Docker Desktop)

Quick start
1) Create your environment file from the example:
```
cp .env.example .env
```
Adjust values if needed (ports, DB credentials, etc.). Defaults are fine for local use.

2) Build images (first time or after changes):
```
docker compose build
```

3) Start the stack:
```
docker compose up -d
```

4) Access services:
- Web (Angular via Nginx): http://localhost:8080
- API (NestJS): http://localhost:3000/api
  - Swagger docs: http://localhost:3000/api/docs
- Postgres: localhost:5432

5) View logs:
```
docker compose logs -f
```

Environment variables
All values are read from the `.env` file at the repository root. See `.env.example` for a complete list and defaults.

Notes about `.env` loading by Docker Compose:
- Docker Compose automatically loads `.env` from the same directory as `docker-compose.yml` when you run commands from that directory.
- If you invoke Compose from another directory (e.g., via CI or a script), pass the env file explicitly:
  ```
  docker compose --env-file /path/to/project/.env -f /path/to/project/docker-compose.yml up -d
  ```
  or `cd` to the project root first.

Key variables:
- POSTGRES_DB — database name (default `appdb`)
- POSTGRES_USER — database user (default `appuser`)
- POSTGRES_PASSWORD — database password (default `applocalpw`)
- POSTGRES_HOST — hostname used by the API to reach Postgres inside the compose network (default `postgres`)
- POSTGRES_PORT — host port to expose Postgres (default `5432`)
- API_PORT — host port to expose the API container (default `3000`)
- WEB_PORT — host port to expose the Web container (default `8080`)
- NODE_ENV — node environment for the API container (default `production`)
- DATABASE_URL — full Postgres connection string used by the API. If you change DB credentials/host/port, update this too.

Note: `.env` is not committed. See `.env.example` for reference.

How it works
- Web image builds the Angular app with Nx and serves `dist/apps/web/browser` via Nginx.
- API image builds the NestJS app with Nx/webpack. The runtime image installs production dependencies from the root manifest to ensure NestJS packages are available at runtime.
- Postgres runs the official `postgres:latest` image with a persistent volume (`postgres_data`). A healthcheck ensures the API waits until the database is ready.

DB project (Prisma) — migrations and seeds
The repository includes a dedicated Nx project `db` to manage database schema and seed data using Prisma.

Files/structure:
- Prisma schema: `apps/db/prisma/schema.prisma`
- Seed script: `apps/db/src/seed.ts` (TypeScript, uses `@prisma/client`)

Nx targets (run from project root):
- Generate Prisma client (also runs on `npm install`):
  ```
  npx nx run db:generate
  ```
- Create/apply dev migration (prompts for a name if needed, updates DB and generates client):
  ```
  npx nx run db:migrate-dev
  ```
- Apply existing migrations in production-like mode:
  ```
  npx nx run db:migrate-deploy
  ```
- Reset database (DANGEROUS: drops DB):
  ```
  npx nx run db:migrate-reset
  ```
- Open Prisma Studio:
  ```
  npx nx run db:studio
  ```
- Run seed script:
  ```
  npx nx run db:seed
  ```

Database connection
- All Prisma commands use `DATABASE_URL` from your `.env`. Ensure the Postgres service is running and accessible.
- With Docker Compose up, the DB is available at `postgres://appuser:applocalpw@localhost:${POSTGRES_PORT}/appdb` on your host. The `.env.example` already provides a matching `DATABASE_URL`.

Typical workflow
1) Start database (and rest of stack):
   ```
   docker compose up -d postgres
   # or bring up full stack
   docker compose up -d
   ```
2) Evolve the schema in `apps/db/prisma/schema.prisma`.
3) Create/apply a dev migration:
   ```
   npx nx run db:migrate-dev
   ```
4) Seed data:
   ```
   npx nx run db:seed
   ```
5) Commit the generated migration files under `apps/db/prisma/migrations/`.

Common operations
- Rebuild without cache (useful after dependency changes):
```
docker compose build --no-cache
```

- Restart the stack:
```
docker compose up -d --build
```

- Stop and remove containers (preserving database volume):
```
docker compose down
```

- Reset database volume (DANGEROUS: deletes data):
```
docker compose down -v
```

Troubleshooting
- Nx cache or project graph errors:
  - Clear Nx cache locally before building:
    ```
    npx nx reset
    ```
  - Ensure `.nxignore` and `.dockerignore` are present so build caches are not included in images.

- API dependency resolution errors (e.g., `Cannot find module '@nestjs/common'`):
  - Rebuild the API image without cache:
    ```
    docker compose build --no-cache api
    ```

- Port collisions:
  - Change `API_PORT`, `WEB_PORT`, and/or `POSTGRES_PORT` in `.env` to free ports and restart with `docker compose up -d`.

- Prisma/DB:
  - If Prisma cannot connect, confirm the `DATABASE_URL` in your `.env` points to the correct host/port. For local host access to Compose’s Postgres, use `localhost:${POSTGRES_PORT}`.
  - If `@prisma/client` is missing after pulling changes, run `npm install` (which triggers `prisma generate`) or run `npx nx run db:generate` manually.

Development notes
- The API uses a global prefix `api`, set in `apps/api/src/main.ts`. The compose stack exposes the API at `http://localhost:${API_PORT}/api`.
- If you want the Web container to proxy API requests under the same origin, uncomment the proxy block in `apps/web/nginx.conf` and update the target if needed.

API documentation (Swagger)
- Swagger UI is enabled for the NestJS API and available at:
  - Local/dev: `http://localhost:3000/api/docs`
  - Docker Compose: `http://localhost:${API_PORT}/api/docs` (default `${API_PORT}` is 3000)
- Configuration lives in `apps/api/src/main.ts` using `@nestjs/swagger` with a Bearer auth scheme preset. Add DTOs and decorators (e.g., `@ApiTags()`, `@ApiProperty()`, `@ApiBearerAuth('bearer')`) in your controllers/services to enrich the generated OpenAPI spec.

License
This project is for assessment purposes. See repository terms if provided.
