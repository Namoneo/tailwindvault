# TailwindVault

TailwindVault is an MVP marketplace for premium Tailwind CSS components. The repo ships an Angular 19 storefront, a NestJS API, SQLite-backed commerce data, and an automation layer for GitHub issue triage and repository reporting.

## Features

- Angular 19 standalone storefront with landing, catalog, product detail, cart, checkout, auth, dashboard, and admin flows
- NestJS 10 API with Swagger docs, JWT auth, products, orders, licenses, downloads, and mocked Stripe webhook handling
- SQLite-backed MVP persistence with Prisma schema and seed data for realistic Tailwind component products
- Cloudflare Pages-ready static storefront build output
- OpenClaw-friendly automation scripts and GitHub workflows for daily analysis, repo health, and issue triage

## Tech Stack

- Frontend: Angular 19, standalone components, Tailwind CSS, RxJS
- Backend: NestJS 10, TypeORM, Prisma schema + seed, SQLite, Passport JWT
- Tooling: pnpm 9 workspace, Node 20, GitHub Actions, Wrangler, gh CLI

## Architecture

```text
packages/storefront (Angular 19)
  |  routes: landing, catalog, product, cart, checkout, auth, dashboard, admin
  v
packages/api (NestJS 10, /api)
  |  auth, products, orders, licenses, downloads, webhooks
  v
SQLite (packages/api/prisma/dev.db)
  |  schema.prisma + seed.ts
  v
Cloudflare Pages static output
  packages/storefront/dist/storefront/browser
```

## Quick Start

```bash
git clone https://github.com/Namoneo/tailwindvault.git
cd tailwindvault
./scripts/bootstrap.sh
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

The default local URLs are:

- Storefront: `http://localhost:4200`
- API: `http://localhost:3000/api`
- Swagger docs: `http://localhost:3000/api/docs`

## Useful Commands

```bash
pnpm build
pnpm build:storefront
pnpm build:api
pnpm analyze
pnpm issue:sync
pnpm report -- --no-telegram
```

## Deployment Notes

- Use Node 20 and `pnpm@9.0.0`.
- The storefront is built as a static Angular app for Cloudflare Pages.
- Set the Cloudflare build command to `pnpm --filter @tailwindvault/storefront build:production`.
- Set the Pages output directory to `packages/storefront/dist/storefront/browser`.

## API Surface

Core endpoints exposed by the MVP:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/licenses`
- `POST /api/licenses/validate`
- `GET /api/downloads/:licenseId/:productSlug`
- `POST /api/webhooks/stripe`

## Automation Layer

The repository includes:

- `scripts/bootstrap.sh` to seed local `.env` files and issue draft folders
- `scripts/analyze.sh` to generate markdown repo analysis from git history and TODO scans
- `scripts/issue-sync.sh` to publish `issues/drafts/*.md` files to GitHub issues
- `scripts/report.sh` to generate a weekly GitHub activity report and optionally send it to Telegram
- GitHub workflows for repo health, daily AI analysis, and first-pass issue triage

## Contributing

Contribution guidance lives in [CONTRIBUTING.md](CONTRIBUTING.md). The short version:

1. Use Node 20 with pnpm 9.
2. Run `./scripts/bootstrap.sh`.
3. Verify changes with `pnpm --filter @tailwindvault/storefront build:production` and `pnpm --filter @tailwindvault/api build`.
4. Keep pull requests scoped and include the commands you ran.
