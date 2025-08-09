# jERP

Lightweight modular ERP starter built with Encore.ts, PostgreSQL, Prisma, Next.js, Expo, and Tauri.

## Development

- `pnpm i` to install dependencies
- `pnpm dev` to run API, web, and mobile apps concurrently
- `pnpm test` to run tests
- `pnpm db:generate` to generate Prisma client
- `pnpm db:migrate` to run migrations for current tenant schema

## Apps

- `apps/api` – Encore backend services
- `apps/web` – Next.js frontend
- `apps/mobile` – Expo mobile app
- `apps/desktop` – Tauri desktop wrapper

## Packages

Shared configuration, types, utilities, and API client live in `packages/*`.

## Deploy

Docker Compose and Helm chart templates are under `deploy/`.
