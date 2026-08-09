# Roshn REIT

Localized real-estate marketing and administration application built with Next.js, Prisma, PostgreSQL, Better Auth, and Supabase Storage.

## Development

```bash
bun install
bun run dev
```

Copy `.env.example` to `.env` and provide the required database, authentication, email, analytics, and storage credentials.

## Quality gates

```bash
bun test
bun run typecheck
bun run lint
bun run build
```

## Operational commands

```bash
bun run seed
bun run setup-storage
```

`setup-storage` idempotently creates or updates the canonical image, video, and file buckets. It requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

Deploy migrations through the guarded command:

```bash
bun run db:deploy
```

It refuses to run the baseline over an existing untracked schema. For a database that predates Prisma migration tracking, first back it up, apply `scripts/adopt-legacy-database.sql` with your PostgreSQL client, then record the one-time adoption:

```bash
bunx prisma migrate resolve --applied 20260809000000_baseline
bun run db:deploy
```

Fresh databases can run `bun run db:deploy` directly. Deployment automation must use this command instead of calling `prisma migrate deploy` directly.

## Architecture

Domain terminology and module ownership live in [`CONTEXT.md`](./CONTEXT.md). Route handlers and server actions are adapters; business rules belong to the Property, Authorization, Site Content, Inquiry, Publishing, and Media Storage modules under `lib/`.
