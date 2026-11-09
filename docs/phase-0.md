# Phase 0: project setup

Status: done, waiting for review. Branch: `claude/lucid-cannon-tzya3o`.

## What was built

| Area                                                                                      | Where                                                      |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Next.js 15 + TypeScript strict, Tailwind, ESLint, Prettier                                | repo root                                                  |
| Brand theme matched to alliancemedia.lk (see "Look and feel" below)                       | `app/globals.css`, `components/logo.tsx`                   |
| Roles, modules and the access matrix (single source of truth)                             | `lib/auth/roles.ts`                                        |
| Pure `authorize()` (401 vs 403)                                                           | `lib/auth/authorize.ts`                                    |
| Server guards for pages (`requireModule`) and API routes (`guardApi`)                     | `lib/auth/guards.ts`                                       |
| Session: Supabase user + role read from `profiles`                                        | `lib/auth/session.ts`                                      |
| Login: magic link, password (for seeded users), demo mode                                 | `app/login/`                                               |
| Layout with module switcher filtered by role                                              | `app/(app)/layout.tsx`, `components/module-nav.tsx`        |
| Module landing pages (HR, Vendor Payments, Finance, Admin, My Workspace)                  | `app/(app)/*/page.tsx`                                     |
| Protected API routes, one per module                                                      | `app/api/*/status/route.ts`                                |
| Database foundation: `app_role`, `profiles`, `audit_log`, role helpers, RLS               | `supabase/migrations/20261105000000_phase0_foundation.sql` |
| Rollback script                                                                           | `supabase/rollbacks/`                                      |
| Seed four demo users in Supabase                                                          | `scripts/seed-demo-users.ts` (`npm run seed:users`)        |
| CI: lint, typecheck, format, unit + RLS tests on Postgres 16, build, Playwright, gitleaks | `.github/workflows/ci.yml`                                 |

### Who sees which module

| Module          | Employee                         | HR  | Finance | Admin |
| --------------- | -------------------------------- | --- | ------- | ----- |
| My Workspace    | yes                              | yes | yes     | yes   |
| HR              |                                  | yes |         | yes   |
| Vendor Payments | only with "can request payments" | yes | yes     | yes   |
| Finance         |                                  |     | yes     | yes   |
| Admin           |                                  |     |         | yes   |

A page outside your modules returns 404 (it does not reveal that the page exists). An API route returns 401 when signed out and 403 for the wrong role.

### Database decisions

- **Shared foundation.** `profiles` (users and roles) and `audit_log` are shared by HR, Vendor Payments and Finance. `projects` and `clients` arrive in Phase 5, as the plan orders them, and will be referenced by income, expenses and payment requests.
- **Role comes from `profiles.role`**, not from auth metadata, because users can edit their own metadata. New sign-ups always start as `employee`; a test proves that a self-assigned `admin` in signup metadata is ignored.
- **Only Admins** can change a profile's role, active flag, payment permission or email (trigger `guard_profile_privileged_columns`). Users can change their own name.
- **RLS on profiles:** you see your own row; HR, Finance and Admins see all rows. Inactive users lose their role immediately.
- **Audit log is append only.** No one can update, delete or truncate it, including the table owner. Rows come from `write_audit()` (actor is always the caller) or from the generic `audit_row_change()` trigger, which is already on `profiles`. Only Admins can read it.
- `audit_log.actor_id` has no foreign key on purpose, so deleting a user never edits the log.

### One addition to the PLAN.md data model

`profiles.can_request_payments boolean` (default false). Section 2 describes this permission, but section 9 had no column for it. Tell me if you would rather model it differently (for example a separate permissions table).

## Look and feel (updated 9 November 2026)

Restyled to match the AMPL website (alliancemedia.lk):

- **Palette:** ink `#14060B` background with wine `#6B1F35` and accent `#3A1020` glows; gold `#F5A623` (with deep gold `#E8941A` and soft gold `#FFD166`); cream text; rose `#C2185B` in gradients. These replace the PLAN.md section 3 values where they differ (gold and ink), because the website is the newer brand reference.
- **Type:** Cormorant Garamond for headings (uppercase, with a gold italic word), Inter for text, JetBrains Mono for small tracked labels. Self-hosted through `@fontsource`, so the app makes no requests to Google.
- **Components:** liquid-glass panels (`.glass`), gold and glass pill buttons (`.btn-gold`, `.btn-glass`), mono "eyebrow" labels, website-style form fields (`.field-label`, `.field-input`) and status messages (`.msg-ok`, `.msg-err`).
- **Layout:** a floating glass header with the AMPL mark, like the website's nav. On a phone the module pills scroll sideways under the brand row.
- **Left out on purpose:** WebGL backgrounds, the custom cursor, scroll-pinned sections and SVG refraction. This is a daily work tool, so it stays fast and readable. Entrance animations are short and switch off when the device asks for reduced motion.
- **Logo and icons:** taken from the website file (`public/ampl-mark.png`, `app/icon.png`, `app/apple-icon.png`).

## Test results (5 November 2026)

| Suite                                                                               | Result    |
| ----------------------------------------------------------------------------------- | --------- |
| `npm run lint`, `npm run typecheck`, `npm run format:check`                         | clean     |
| Unit tests (`npm test`): access matrix, `authorize()`, every API route × every role | 43 passed |
| RLS tests (`npm run test:db`, Postgres 16)                                          | 18 passed |
| Playwright (`npm run test:e2e`), desktop and Pixel 7                                | 20 passed |
| `npm run build`                                                                     | passed    |

The RLS tests were also checked against a deliberately broken migration (policy loosened, role guard removed): 4 tests failed as they should.

Phase 0 acceptance:

- [x] Login works (magic link and password with Supabase; demo users in demo mode).
- [x] Each role sees only its own menu and modules (unit tests + Playwright for all four roles).
- [x] A protected API route returns 403 for the wrong role (every module route × every role tested).

## Assumptions

1. **Sign-in:** email magic link for staff, plus email and password so the seeded demo users can sign in. Self sign-up is off; accounts are created by an Admin. Google sign-in can be added later (open question 7).
2. **Finance sees Vendor Payments** (its payables queue) and **My Workspace** (Janaka is staff too). Finance never sees HR.
3. **HR sees Vendor Payments** because HR raises vendor requests (section 2).
4. **HR, Finance and Admins can read all profiles** (name, email, role). Salary, NIC and bank details will live in other tables with stricter RLS.
5. **Demo mode** is for looking around without Supabase. It switches on only when `CHORDUS_DEMO_MODE=true`, no Supabase project is configured, and it is not a Vercel production deployment.
6. **shadcn/ui** is not installed yet. Phase 0 has no forms beyond login, so I will add it in Phase 1 with the employee and contract forms.
7. **Dark theme only**, matching the website. A light theme can come later if people want it for long data-entry sessions.
8. **Hosted Supabase** for real use, with the Supabase CLI optional for local work.

## What I need from you

1. **A sample fingerprint report** (names and IDs masked is fine). The Phase 2 importer is built around it.
2. Answers to the open questions in `docs/PLAN.md` section 16, in particular: which contract types each person is on (2), net or gross and EPF/ETF per person (4), sign-in method (7), and who can raise vendor payment requests (9).
3. A Supabase project (URL and anon key in Vercel and `.env.local`; the service role key only on your machine) and a Vercel project when you want a hosted preview.
4. If the GitHub account is an organization, the gitleaks secret-scan job needs a free gitleaks licence key (`GITLEAKS_LICENSE` secret), or I can swap it for GitHub's own secret scanning.
