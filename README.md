# Kubermatic Assessment

This project is a full-stack application built with Angular and NestJS, using a PostgreSQL database. It's designed to be
run with Docker, but can also be run locally.

## Project Structure

The project is a monorepo managed by Nx. The main applications are:

- `apps/api`: The NestJS backend application.
- `apps/web`: The Angular frontend application, configured for Server-Side Rendering (SSR).
- `libs/db`: A shared library for database-related code, using Prisma as the ORM.

## Features

- **Authentication:** Users can log in to the application and receive a token. The API validates this token to protect
  its endpoints.
- **Project Management:** Users can list and search for projects.
- **Cluster Management:** Users can create, list, update, and delete clusters within a project, with options for sorting
  and filtering.

## Technologies Used

- **Frontend:** Angular 20, with PrimeNG for UI components.
- **Backend:** NestJS 11, with Prisma for database access.
- **Database:** PostgreSQL.
- **Build Tool:** Nx.
- **Containerization:** Docker.

## Running the Project

### With Docker (Recommended)

This is the easiest way to get the project running, as it sets up the database, API, and web application in one go.

**Prerequisites:**

- Docker
- Docker Compose

**Steps:**

1. **Create a `.env` file:**
   Copy the `.env.example` file to a new file named `.env`. You can leave the default values for a local setup.

2. **Build and run the containers:**
   ```bash
   docker-compose up --build
   ```

3. **Access the applications:**
    - **Web App:** `http://localhost:8080`
    - **API:** `http://localhost:3000`
    - **API Docs:** `http://localhost:3000/api`

### Without Docker (Local Development)

This approach requires you to set up the database and run the API and web applications separately.

**Prerequisites:**

- Node.js 20
- PostgreSQL

**Steps:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
    - Make sure you have a PostgreSQL server running.
    - Create a `.env` file by copying `.env.example`.
    - Update the `DATABASE_URL` in your `.env` file to point to your local PostgreSQL instance.
    - Run the database migrations:
      ```bash
      npx prisma migrate dev
      ```
    - (Optional) Seed the database with initial data:
      ```bash
      npx prisma db seed
      ```

3. **Run the applications:**
    - **API:**
      ```bash
      npx nx serve api
      ```
      The API will be available at `http://localhost:3000`.

    - **Web App:**
      ```bash
      npx nx serve web
      ```
      The web app will be available at `http://localhost:4200`.

## Running Tests

This project uses Jest for testing. You can run the tests for each application separately.

- **API Tests:**
  ```bash
  npx nx test api
  ```

- **Web App Tests:**
  ```bash
  npx nx test web
  ```

You can also run all tests in the project with the following command:

```bash
npx nx run-many --target=test
```

## Current Status

The project is set up with a working Docker and local development environment. The web application is configured for
Server-Side Rendering (SSR). The database is managed with Prisma, and includes migrations and a seeding script.

## Cluster Wizard

I've decided to implement both edit and create cluster wizards as a dialog
using the same component for simplicity. It led to a little bit more complex component,
but reduced development time for this particular project's session.

The wizard could also have been split into smaller component, but this would lead
to potential props drilling and challenging component communication. Since time was short
I've decided to keep the implementation in a single component as well to avoid the
potential usage of state management libraries/patterns. In a real world application,
it would be composed by a set of modular applications.

## Real time date

Whenever required, real-time data updates/management were achieved by combining signals (and any
derived classes of it) and observables. With that, it was achieved real-time updated on the UI with
minimum effort. RxJS Observables are a powerful tool.

## Data modeling

In a real world application, domain models, DTO, and entities would live separately. The first would not be
framework dependent and the second and last would. It would also be a separate project to achieve maximim
reusability between web and api (and any other applications).

## Prisma usage

Although PrismaORM really speeds up development, it binds the project too much into it's own opinionated way
of working with data. One good approach in larger apps is to use a query builder or raw sql statements for
interacting with database, improving performance and reusability.

## Server side API routes

I could have decided to go with Angular Server Routes for simpler development, but I've decided
to implement a minimum NestJS api to show some examples of my backend work.

## Authentication

Authentication, session, and cookie handling was made the in the most simple way possible to ensure a fast
development cycle. A different storage method for sessions and further token validations and handling on
both frontend and api would be done in a real-world application. Better redirects and roles validation are
an example.
