# ChordusAM: rules for Claude Code

The project brief is `docs/PLAN.md`. Read it before starting a phase. Phase notes live in `docs/phase-N.md`.

## Rules

- TypeScript strict. No `any` without a comment explaining why.
- No secrets in code or in git. Configuration comes from environment variables only (`.env.example` lists them).
- Every migration in `supabase/migrations/` has a matching rollback in `supabase/rollbacks/` (`<same name>.down.sql`), and the DB tests apply both.
- Business rules live in `lib/rules/` as pure functions (plain data in, plain data out). Every rule function has unit tests.
- Company policy (amounts, days, limits) is data edited in the UI, never hardcoded.
- Permissions are enforced on the server: `lib/auth/guards.ts` in pages and API routes, and Row Level Security in the database. Hiding a menu item is never the only protection.
- Every new table enables RLS and gets RLS tests in `tests/db/`. Sensitive tables attach the `public.audit_row_change()` trigger; other sensitive actions call `writeAudit()`.
- Roles come from `public.profiles`, never from auth metadata (users can edit their own metadata).
- Ask before changing the data model in `docs/PLAN.md` section 9.
- One phase per branch. At the end of a phase run `npm run check`, `npm run test:db` and `npm run test:e2e`, then commit.
- Timezone Asia/Colombo for display; store timestamps in UTC. Base currency LKR.

## Commands

- `npm run dev`: app on http://localhost:3000
- `npm run check`: lint, typecheck, format check, unit tests
- `npm run test:db`: RLS tests (needs `DATABASE_URL_TEST`; that database's `public` and `auth` schemas are dropped)
- `npm run test:e2e`: Playwright in demo mode
