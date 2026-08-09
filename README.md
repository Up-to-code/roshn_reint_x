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

For an existing database that predates Prisma migration tracking, back it up, run `scripts/adopt-legacy-database.sql`, then mark `20260809000000_baseline` as applied. Fresh databases should use `prisma migrate deploy`.

## Architecture

Domain terminology and module ownership live in [`CONTEXT.md`](./CONTEXT.md). Route handlers and server actions are adapters; business rules belong to the Property, Authorization, Site Content, Inquiry, Publishing, and Media Storage modules under `lib/`.
