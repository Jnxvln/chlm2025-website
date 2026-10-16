# C&H Landscape Materials — Website

The public website for C&H Landscape Materials in Texarkana, TX: materials catalog, cubic-yard calculator, help center, contact info, and live store status/closure notices.

Built with [Qwik City](https://qwik.dev/) (SSR, Express adapter), Tailwind CSS 4, and Prisma 6. Deployed on Railway.

## Shared database — read this first

The site reads store settings and notices from the **CHLM Dashboard's** PostgreSQL database. The dashboard owns that database and all of its migrations.

- `prisma/schema.prisma` here declares only the tables the website reads (`Settings`, `StoreNotice`).
- **Never run `prisma db push` or `prisma migrate` from this repo.** Prisma would treat every dashboard table missing from this schema as something to drop.
- New tables are created through the dashboard repo's migrations, then copied into this schema read-only.
- In production, `DATABASE_URL` should use a read-only role with `SELECT` on just the tables the site reads.

## Where content lives

| Content | Source |
|---|---|
| Store open/closed, closure messages, operating hours | `Settings` table (managed in the dashboard) |
| Homepage notices | `StoreNotice` table (managed in the dashboard) |
| Materials catalog | `src/data/materials.json` (images in `public/images/materials/`) |
| Help Center FAQs and coverage tables | `src/data/help.json` |
| Eagle Carports styles | `src/components/landing/eagle-carports/EagleCarports.tsx` |
| Phone, address, site URL | `src/lib/site.ts` |
| Pages listed in the sitemap | `src/routes/sitemap.xml/index.ts` |

## Setup

Requires Node (version in `package.json` `engines`) and pnpm.

```bash
pnpm install
echo "DATABASE_URL=postgresql://..." > .env
pnpm prisma:generate
pnpm dev               # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string for the dashboard DB (read-only role) |
| `PORT` | Production server port (defaults to 3000; Railway sets this) |
| `PUBLIC_SITE_ORIGIN` | Public URL used for canonical tags, Open Graph, `robots.txt`, and `sitemap.xml` (no trailing slash). **Build-time**: changing it requires a redeploy. Defaults to the Railway URL. |

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Vite dev server with SSR |
| `pnpm build` | `prisma generate`, then full Qwik build (type check, client, server) |
| `pnpm start` | Run the production Express server from `server/` |
| `pnpm build.types` | Type check only |
| `pnpm lint` / `pnpm fmt` | ESLint / Prettier |

## Deployment (Railway)

Build command `pnpm build`, start command `pnpm start`. The Express server serves `dist/` (hashed assets cached for a year) and SSR pages via Qwik City.

### Custom domain

`PUBLIC_SITE_ORIGIN` is the single switch for the public domain. When it's set to a custom domain, `src/entry.express.tsx` 301-redirects the `www.`/non-`www` twin and the `*.up.railway.app` URL to it. While it's unset or still the Railway URL, nothing redirects.

Order matters: get the custom domain serving the site in Railway first, then set `PUBLIC_SITE_ORIGIN` and redeploy. Setting it first would redirect visitors to a domain that doesn't resolve yet.

