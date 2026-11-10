# ChordusAM

Internal mini ERP for Alliance Media Company (Private) Limited: HR (attendance, leave, contracts, payroll), vendor payments and finance in one web app.

- Project brief: [`docs/PLAN.md`](docs/PLAN.md)
- Current phase notes: [`docs/phase-0.md`](docs/phase-0.md)
- Rules for contributors and Claude Code: [`CLAUDE.md`](CLAUDE.md)

Stack: Next.js 15 (App Router) + TypeScript, Supabase (Postgres, Auth, RLS), Tailwind CSS, Zod, Vitest, Playwright.

## Run it

Requires Node 20 or newer.

```bash
npm install
```

### Option A: demo mode (no database)

Pick one of four demo users on the login page. Nothing is saved.

```bash
CHORDUS_DEMO_MODE=true npm run dev
```

Open http://localhost:3000.

### Option B: with Supabase

1. Create a Supabase project (or run `supabase start` locally with the Supabase CLI).
2. Apply the migrations in `supabase/migrations/` (`supabase db push`, or paste them into the SQL editor in order).
3. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and `DEMO_USER_PASSWORD`.
4. Create the four demo users:

```bash
npm run seed:users
```

5. Start the app and sign in with `employee@chordusam.test`, `hr@chordusam.test`, `admin@chordusam.test` or `finance@chordusam.test` and your `DEMO_USER_PASSWORD` ("Sign in with a password instead").

```bash
npm run dev
```

## Tests

```bash
npm run check
```

Row Level Security tests against a real Postgres (the `public` and `auth` schemas of that database are dropped and recreated):

```bash
DATABASE_URL_TEST=postgres://user:pass@localhost:5432/chordus_test npm run test:db
```

End-to-end tests (starts the app in demo mode):

```bash
npx playwright install chromium
```

```bash
npm run test:e2e
```

## Rolling back a migration

Each migration has a matching script in `supabase/rollbacks/`. Take a backup, then run the `.down.sql` for the newest migration first.
