# 23: Test strategy and quality gates for ChordusAM

**Date:** 9 November 2026 · **Author:** QA Lead (discovery team) · **Status:** Draft for review

**Upstream read:** `docs/discovery/00-brief.md`, `docs/PLAN.md` (sections 4, 10, 12 to 15), `docs/phase-0.md`, the Phase 0 test code (`tests/unit/*.test.ts`, `tests/db/rls.test.ts`, `tests/db/supabase-stub.sql`, `tests/e2e/roles.spec.ts`, `vitest.config.ts`, `playwright.config.ts`, `.github/workflows/ci.yml`, `package.json`), `docs/discovery/10-brd.md` (sections 8, 9, 12, 13), `13-ux-design.md` (journeys J-01 to J-10, section 1.3 and section 8), `14-business-case.md` (sections 2.6 and 6), `15-compliance-security.md` (sections 5 to 8), `20-solution-design.md` (ADRs, sections 6, 7, 10 and 11) and research file R2. `21-mvp-roadmap.md` and `22-delivery-plan.md` did not exist when I wrote this. Release and phase names below follow PLAN.md section 13 and the SEC gates G0 to G7 (`15-compliance-security.md` §8.1) until the PO's roadmap places the new modules.

**Summary.** ChordusAM will pay people, deduct tax, issue numbered tax documents and take cash at a counter. So the test strategy is built around one question: would we trust it with AMPL's payroll and till? Phase 0 gives a good base: a fast Vitest suite, real Row Level Security (RLS) tests on Postgres 16 that were checked against a deliberately broken migration, and Playwright on desktop and Pixel 7. This document grows that base into a risk-weighted pyramid. Business rules in `lib/rules/` get example tests, property-based tests (fast-check) and **golden-file tests built from spreadsheets that Finance maintains**. Every table gets an RLS matrix test per role, entity and tenant. Commands get transaction-level tests. Playwright covers the ten journeys in `13-ux-design.md`, offline POS, accessibility (axe) and visual snapshots of receipts and payslips. k6, OWASP ZAP baseline and dependency scanning cover performance and security. I trace all 160 Must requirements and all 71 business rules (BRULE) to test types and example cases. Payroll goes live only after **two months of parallel running** against today's spreadsheet with zero unexplained differences. Three findings matter most. (1) The Phase 0 e2e suite runs only in demo mode, with no database, so it cannot prove any business journey or RLS rule end to end; a second e2e tier on a local Supabase stack is needed before Phase 1 ships. (2) CI runs with `TZ=Asia/Colombo`, but Vercel functions run in UTC, so date bugs in payroll months, overnight punches and booking boundaries could pass CI and fail in production; the unit suite should run in both time zones. (3) Several statutory values are still "(unverified)" (APIT tables for 2026/27, WHT for non-residents and rent, SSCL liable share, stamp duty), so tests must encode the **rule data version that the accountant signed**, not the law as we guess it.

> **How to read IDs.** `BR-*`, `NFR-*`, `BRULE-*` and `OQ-*` come from `docs/discovery/10-brd.md`. `J-nn` and `S-nn` come from `13-ux-design.md`. `G-nn` (Phase 0 gaps) and the STRIDE threats come from `15-compliance-security.md`. `ADR-nn`, `SPK-nn` and `TR-nn` come from `20-solution-design.md`. New IDs in this document: `TC-<MODULE>-NNN` (test cases), `GOLD-<AREA>-NNN` (golden cases), `QG-nn` (quality gates), `RQ-nn` (QA risks) and `QQ-nn` (QA open questions).

## Contents

1. [Summary and quality goals](#1-summary-and-quality-goals)
2. [Test pyramid and tooling](#2-test-pyramid-and-tooling)
3. [Requirements-based coverage](#3-requirements-based-coverage)
4. [Test data strategy](#4-test-data-strategy)
5. [Environments and quality gates](#5-environments-and-quality-gates)
6. [UAT, parallel run and cutover](#6-uat-parallel-run-and-cutover)
7. [Defect management and release readiness](#7-defect-management-and-release-readiness)
8. [Risks and open questions](#8-risks-and-open-questions)

---

## 1. Summary and quality goals

### 1.1 What "good enough to run AMPL's payroll and till on" means

AMPL is small: 10 to 30 staff, three Admins and one Finance person (`00-brief.md` §2). Nobody has time to check the system's sums by hand every month. So "good enough" is concrete, and every item below has a test or a measured check behind it.

| #     | Quality goal                                                   | Measure (pass line)                                                                                                                                                                                   | How we prove it                                                      |
| ----- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| QG-01 | **Money is right to the cent**                                 | Every payroll line, EPF, ETF, APIT, WHT, VAT and ledger figure matches the Finance golden file exactly, in minor units (cents). Ledger postings always balance                                        | Golden-file tests, property tests, DB balance constraint             |
| QG-02 | **Payroll matches reality before it replaces the spreadsheet** | Two consecutive months of parallel run with zero unexplained differences; the accountant signs the statutory totals                                                                                   | Parallel run (section 6.3)                                           |
| QG-03 | **Nobody sees what they should not**                           | 100% pass on the authorisation matrix (every route and every table, for every permission set, entity and tenant); zero Restricted values (NIC, bank, salary) in the audit log, notifications or logs  | RLS matrix tests, route matrix tests, redaction tests, ZAP baseline  |
| QG-04 | **No one approves their own money**                            | Database rejects self-approval, second decisions and requester = approver = payer, in every document type                                                                                             | DB tests on the approval engine (BRULE-002, 007, 008, 009)           |
| QG-05 | **The till never loses or doubles a sale**                     | 500 offline sales on one device sync to exactly 500 server sales and 500 ledger postings; replayed syncs change nothing; shift variance is explained in 100% of shifts                                | Offline POS e2e and soak tests (NFR-AVAIL-002, BRULE-022, BRULE-058) |
| QG-06 | **Document numbers have no unexplained gaps**                  | 50 concurrent issues produce numbers 1 to 50 with no gap and no duplicate; voids are kept                                                                                                             | DB concurrency tests (BRULE-032, NFR-AUD-012)                        |
| QG-07 | **Imports are safe to repeat**                                 | Uploading the same or an overlapping fingerprint file twice creates zero duplicate punches and never overwrites approved leave, manual attendance or Admin corrections                                | DB and property tests (BRULE-012, BRULE-013)                         |
| QG-08 | **Policy changes need no deploy**                              | Finance changes a rate, threshold or table as effective-dated data in under 1 hour and the next calculation uses it                                                                                   | Unit tests with versioned rule data, UAT task (NFR-COST-003)         |
| QG-09 | **We can recover**                                             | A quarterly restore into a scratch project passes the full RLS suite; RPO and RTO per NFR-AVAIL-003                                                                                                   | Restore drill (NFR-SEC-016)                                          |
| QG-10 | **Staff can use it on a phone**                                | Zero axe critical or serious issues on MVP screens; TalkBack completes J-09 and J-05; 360 px width with no sideways scroll; task times in `13-ux-design.md` §8.2 (for example a walk-in sale in 60 s) | axe in Playwright, manual TalkBack pass, timed UAT tasks             |
| QG-11 | **It is fast enough on a mid-range Android phone over 4G**     | NFR-PERF-001 to 004 thresholds                                                                                                                                                                        | Lighthouse CI on key pages, k6 on APIs                               |
| QG-12 | **The tests themselves can be trusted**                        | Mutation score at least 80% on `lib/rules/pay`, `vp`, `sal` and `fin`; flaky tests fixed or removed within 5 working days                                                                             | StrykerJS nightly, flake report                                      |

### 1.2 Principles

1. **Test the risk, not the line count.** Money, statutory figures, access control and the offline till get the deepest testing. Screens that only list data get a smoke test and an axe scan.
2. **Push every rule down the pyramid.** PLAN.md section 4.1 and CLAUDE.md already put business rules in pure functions in `lib/rules/`. That makes the most important logic testable in milliseconds. A rule that can only be tested through the browser is a design smell; I will raise it in review.
3. **The database is a security boundary, so it gets its own tests.** RLS, triggers, exclusion constraints and gapless sequences are tested against real Postgres, never mocked. Phase 0 already does this well (`tests/db/rls.test.ts`).
4. **Follow the existing patterns.** Phase 0 has a clear style: table-driven matrix tests (`tests/unit/api-routes.test.ts`), an `as(who, fn)` helper that runs each check in a rolled-back transaction, and negative tests that assert the exact error. New tests extend these patterns rather than add a second framework. For that reason I recommend staying with the Vitest plus `pg` harness for RLS tests rather than moving to pgTAP and [basejump's Supabase test helpers](https://github.com/usebasejump/supabase-test-helpers) (which [Supabase documents](https://supabase.com/docs/guides/database/postgres/testing-row-level-security) as one option). The harness we have works, runs in CI and is typed.
5. **Rules are data, so tests pin the data version.** Every statutory rate and threshold is effective-dated data (BR-ADM-004). Tests load a named fixture version, for example `apit-tables/2025-26.json`, and assert against it. When the IRD publishes a new table, Finance adds a new data version and a new golden case; old cases stay to prove old months still compute the same (NFR-AUD-011).
6. **Every money defect leaves a test behind.** No S1 or S2 defect closes without a regression test, and every payroll or tax defect also adds a golden case.

---

## 2. Test pyramid and tooling

### 2.1 What exists today (Phase 0)

| Layer               | Today                                                                                                                          | Gap for the new scope                                                                                                                                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit (Vitest)       | 43 tests: access matrix, `authorize()`, every API route × every role (`tests/unit/`)                                           | No rule functions yet (`lib/rules/README.md`). No property-based or golden-file tests. No coverage thresholds (`vitest.config.ts` reports coverage on `lib/**` but gates nothing)                                                                                   |
| DB and RLS (Vitest) | 18 tests on `profiles` and `audit_log` against Postgres 16, using `tests/db/supabase-stub.sql`                                 | The stub has no `aal` claim (G-02, SPK-09), no Storage policies and no real Supabase Auth (G-19). The rollback test is hard-coded to one migration file. The harness drops only `public` and `auth`, so `internal`, `pgmq` and `cron` objects would persist (TR-12) |
| E2E (Playwright)    | 20 tests (10 × desktop and Pixel 7) in **demo mode** with Supabase variables blanked (`playwright.config.ts`)                  | Demo mode has no database, so no journey that writes data or relies on RLS can be tested end to end. No tablet viewport (the POS runs on a counter tablet). No axe, no visual snapshots, no offline tests                                                           |
| CI                  | One sequential job: lint, typecheck, format, unit and RLS tests, build, Playwright; plus gitleaks (`.github/workflows/ci.yml`) | `TZ=Asia/Colombo` only, while Vercel functions run in UTC. No dependency audit, CodeQL, `permissions:` block or SHA-pinned actions (G-15, NFR-SEC-018). One job means slow feedback as the suite grows                                                              |

### 2.2 The pyramid for this stack

The shape is a pyramid with a wide base of rule tests and a thick "database" band, because in a Supabase app much of the logic and all of the access control lives in Postgres.

```text
                     ┌───────────────────┐   manual: exploratory, TalkBack, counter tablet + printer, UAT
                   ┌─┴───────────────────┴─┐ non-functional: k6, Lighthouse, ZAP baseline, restore drill (nightly or pre-release)
                 ┌─┴───────────────────────┴─┐ E2E (Playwright): 10 journeys, offline POS, axe, visual  (~60 to 120 tests)
               ┌─┴───────────────────────────┴─┐ component (Vitest + Testing Library): forms, POS cart, calendar, inbox (~150)
             ┌─┴───────────────────────────────┴─┐ API, route and command tests (Vitest; commands against Postgres) (~400)
           ┌─┴───────────────────────────────────┴─┐ DB and RLS (Vitest + pg): matrix per table × role × op × entity × AAL (~1,500, generated)
         ┌─┴───────────────────────────────────────┴─┐ rules (lib/rules): examples + property-based (fast-check) + golden files (~1,000)
         └───────────────────────────────────────────┘
```

| Layer                           | Owns (what this layer must catch)                                                                                                                                                                                                                                              | Tooling                                                                                                                                                                                                                                                                                                                                 | Where                                                                                       | Speed budget                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **1. Rules**                    | Every calculation and decision: payroll, EPF, ETF, APIT, gross-up, gratuity, leave accrual and day counting, attendance derivation, WHT, VAT and SSCL, FX, POS totals and rounding, booking overlap and price, deposits and cancellation fees, approval routing, AI allocation | Vitest; [fast-check](https://fast-check.dev/docs/tutorials/setting-up-your-test-environment/property-based-testing-with-vitest/) for properties; golden-file runner over CSV/JSON exported from Finance's spreadsheets; [StrykerJS Vitest runner](https://stryker-mutator.io/docs/stryker-js/vitest-runner/) nightly for mutation score | `lib/rules/<code>/*.test.ts` (next to the code, per `lib/rules/README.md`); `tests/golden/` | Under 10 s for the whole layer              |
| **2. DB and RLS**               | RLS per table, role, operation, entity, tenant and AAL; triggers (append-only, lock-on-approve, self-approval, redaction); exclusion constraints (bookings, contract versions); gapless numbering under concurrency; balanced postings; migration up and down                  | Vitest + `pg`, extending `tests/db/rls.test.ts`; `tests/db/supabase-stub.sql` extended with `auth.jwt()` and `aal`                                                                                                                                                                                                                      | `tests/db/<module>/*.test.ts`, `tests/db/matrix/*.ts`, `tests/db/meta.test.ts`              | Under 2 min                                 |
| **3. API, routes and commands** | Guards (`requireModule`, `guardApi`, permission + entity + AAL), input validation (Zod), status codes (401, 403, 404, 409, 422), idempotency keys, webhook signatures, command transactions under `withUserTx` (ADR-05)                                                        | Vitest; route handlers called directly as in `tests/unit/api-routes.test.ts`; commands run against Postgres with the caller's claims; adapter contract tests with fakes                                                                                                                                                                 | `tests/api/`, `tests/db/commands/`, `tests/contracts/`                                      | Under 2 min                                 |
| **4. Component**                | Form behaviour and validation messages, money and date formatting (NFR-I18N-004), POS cart maths display, calendar keyboard path (WCAG 2.5.7), approval card confirm and undo, status chips with text labels (NFR-A11Y-003)                                                    | Vitest in `jsdom` with Testing Library; `vitest-axe`-style checks optional; the formatting module tested per locale                                                                                                                                                                                                                     | `tests/component/` or next to components                                                    | Under 1 min                                 |
| **5. E2E**                      | The ten journeys J-01 to J-10, role menus, 404 for hidden pages, offline POS, PWA install, security headers                                                                                                                                                                    | Playwright (existing config), projects: desktop, Pixel 7 and a new counter-tablet project; **two tiers**: demo-mode smoke (as today) and flows against a local Supabase stack seeded with synthetic data                                                                                                                                | `tests/e2e/smoke`, `tests/e2e/flows`, `tests/e2e/offline`                                   | Per PR under 10 min (sharded); full nightly |
| **6. Visual regression**        | Receipt (80 mm), Z-report, tax invoice, payment voucher, payslip, WHT certificate, Home per role, contrast tokens (`13-ux-design.md` §1.3)                                                                                                                                     | Playwright `toHaveScreenshot` in the pinned Playwright Docker image (fonts are self-hosted via `@fontsource`, which keeps renders stable); PDFs checked by extracted text per PR and by rendered image nightly                                                                                                                          | `tests/e2e/visual`                                                                          | Nightly; per PR for changed templates       |
| **7. Accessibility**            | WCAG 2.2 AA on every MVP screen (NFR-A11Y-001 to 003, NFR-MOB-003)                                                                                                                                                                                                             | [`@axe-core/playwright`](https://www.npmjs.com/package/@axe-core/playwright) with tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`; manual TalkBack, keyboard-only and 200% zoom per release (`13-ux-design.md` §8.2 round R4)                                                                                                          | `tests/e2e/a11y`                                                                            | Per PR on touched pages                     |
| **8. Performance and load**     | NFR-PERF-001 to 004, NFR-AVAIL-002, NFR-SCALE-004                                                                                                                                                                                                                              | [Grafana k6](https://grafana.com/docs/k6/latest/using-k6/thresholds/) with thresholds (`p(95)`) against staging; Lighthouse CI with mobile throttling for page interactivity                                                                                                                                                            | `tests/load/`                                                                               | Nightly smoke; full before release          |
| **9. Security**                 | OWASP baseline issues, headers (NFR-SEC-010), authorisation bypass (IDOR), webhook forgery, token brute force, secrets, vulnerable dependencies                                                                                                                                | Authz matrix tests (layers 2 and 3); [ZAP baseline action](https://www.zaproxy.org/blog/2020-04-09-automate-security-testing-with-zap-and-github-actions/) (passive scan) against preview and staging; `npm audit` and Dependabot; CodeQL; gitleaks (existing)                                                                          | `tests/security/`, `.zap/rules.tsv`                                                         | Per PR for matrix and deps; nightly ZAP     |

### 2.3 Layer 1: rule functions in `lib/rules/`

Every rule function takes plain data in and returns plain data out, including an **explanation** that the UI shows ("how this was calculated", BR-PAY-002, `13-ux-design.md` §5.7). Each function gets three kinds of test.

| Kind               | Purpose                                                                                        | Example                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Example tests**  | Readable cases at every boundary, named after the rule ID                                      | `[BRULE-041] payee at exactly LKR 100,000 this month pays no WHT`                                      |
| **Property tests** | Invariants that must hold for any input, found with random generation and shrinking            | "WHT is never negative and never more than the gross"; "allocations always add up to the cost exactly" |
| **Golden files**   | Whole-month results computed by Finance in a spreadsheet, compared line by line in minor units | `GOLD-PAY-003`: November with a mid-month joiner, a contract change and a net-pay contract             |

**Rule modules and their main properties** (folder names follow `20-solution-design.md` §3.2):

| Folder                 | Functions (proposed names)                                                                                                   | Key properties (fast-check)                                                                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/rules/pay`        | `computePayroll`, `computeEpfEtf`, `computeApit`, `grossUpNet`, `computeAbsence`, `computeGratuity`, `prorate`               | Day segments of a month add up to its calendar days; `net(grossUpNet(n)) = n`; APIT is non-decreasing in taxable pay; EPF base never includes overtime or bonus; changing an unrelated employee never changes a line |
| `lib/rules/lv`         | `accrueLeave`, `countLeaveDays`, `leaveBalanceAsOf`                                                                          | Balance is non-decreasing with no usage; counted days ≤ calendar days; holidays and weekends never counted; cancel then re-request gives the same balance                                                            |
| `lib/rules/att`        | `deriveDay`, `matchDeviceId`, `checkOfficeDays`, `mergePunches`                                                              | Minutes worked between 0 and 1,440 per day; importing A then A∪B gives the same punches as B then A (order independence); re-import is a no-op                                                                       |
| `lib/rules/vp`         | `routePaymentRequest`, `computeWht`, `detectSplitRequests`, `fxDifference`                                                   | Routing is monotonic in amount (more money never needs fewer approvals); WHT in [0, gross]; split detection flags any group whose sum exceeds the limit inside the window                                            |
| `lib/rules/sal`, `fin` | `computeInvoiceTotals`, `taxLine`, `ageReceivable`, `allocateReceipt`, `checkThresholds`, `recogniseRevenue`, `buildPosting` | Every posting balances; receipt allocations plus credit equal the receipt; tax computed with the rate in force on the document date; ageing bucket is a function of whole Colombo days                               |
| `lib/rules/pos`        | `cartTotals`, `splitPayments`, `shiftVariance`, `reserveReceiptBlock`                                                        | Split payments add up to the total exactly; totals do not depend on line order; variance = counted − expected per method                                                                                             |
| `lib/rules/bkg`        | `overlaps`, `priceBooking`, `cancellationFee`, `depositDue`                                                                  | `overlaps` is symmetric; a booking never overlaps itself shifted by its own length plus buffer; price is never negative; fee is non-increasing with notice                                                           |
| `lib/rules/apr`        | `routeApproval`, `resolveCandidates`, `canAct`, `applyAction`, `escalate` (`20-solution-design.md` §6.3)                     | The requester is never a candidate; an `any_one` step finishes after exactly one decision; escalation is idempotent                                                                                                  |
| `lib/rules/ai`         | `allocateAiCost`                                                                                                             | Allocations plus "AI capacity unused" equal the period cost exactly (largest-remainder rounding)                                                                                                                     |
| `lib/kernel/money`     | `add`, `multiplyRate`, `round`, `convert`, `allocate`                                                                        | Minor units are `bigint` (ADR-15), so no float drift; `allocate(total, weights)` conserves the total; rounding mode comes from currency data                                                                         |

**Example property test** (WHT). The test pins the rule data version, uses minor units, and states the invariant in plain words:

```ts
// lib/rules/vp/computeWht.test.ts
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { computeWht } from "./computeWht";
import whtRules from "@/tests/fixtures/rules/wht/2026-06.json"; // signed off by the accountant

const LKR = (rupees: number) => BigInt(Math.round(rupees * 100)); // minor units

describe("[BR-VP-012][BRULE-041] WHT on resident individuals", () => {
  it("is zero at exactly LKR 100,000 this month and 5% of the full amount above it", () => {
    const base = {
      payee: { resident: true, kind: "individual" },
      category: "performer",
      rules: whtRules,
    } as const;
    expect(computeWht({ ...base, monthToDate: LKR(0), amount: LKR(100_000) }).wht).toBe(0n);
    expect(computeWht({ ...base, monthToDate: LKR(0), amount: LKR(135_000) }).wht).toBe(LKR(6_750)); // J-04
  });

  it("is never negative and never more than the gross", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 0n, max: LKR(5_000_000) }),
        fc.bigInt({ min: 1n, max: LKR(2_000_000) }),
        (mtd, amount) => {
          const { wht } = computeWht({
            payee: { resident: true, kind: "individual" },
            category: "performer",
            monthToDate: mtd,
            amount,
            rules: whtRules,
          });
          return wht >= 0n && wht <= amount;
        },
      ),
      { numRuns: Number(process.env.FC_RUNS ?? 200) }, // 10,000 nightly
    );
  });
});
```

Property tests run with a fixed seed and 200 runs per PR (fast and repeatable), and with a random seed and 10,000 runs nightly. A nightly failure prints its seed and the shrunk counter-example; the fix adds that case as an example test.

**Golden-file tests.** Finance (Janaka) and HR (Abilasini) keep hand-built spreadsheets for chosen months and scenarios. Each case lives in `tests/golden/<area>/<GOLD-ID>/`:

```text
tests/golden/payroll/GOLD-PAY-003/
  README.md        scenario in words, who built it, who signed it, rule data versions used
  source.xlsx      Finance's spreadsheet (synthetic people only, section 4)
  input.json       employees, contract versions, attendance days, leave, adjustments (exported by a script)
  expected.csv     one row per employee per component, in minor units
```

A single runner (`tests/golden/golden.test.ts`) loads each case, runs the rule function, and diffs per line. A failure prints a table of differences such as `E-007 APIT expected 18,500.00 got 18,499.99`. Changes to `tests/golden/**` need a CODEOWNERS review by the Tech Lead and a recorded acknowledgement from Finance in the pull request. The spreadsheet is the source and the CSV is generated, so a reviewer can see both.

### 2.4 Layer 2: database and RLS tests

The Phase 0 harness is the pattern: reset the schema, apply all migrations in order, seed as the migration owner, then run each check `as(who)` inside a transaction that always rolls back. I recommend four changes.

1. **Extract the helper** into `tests/db/helpers.ts` with `as(principal, fn)`, where a principal has a user, a tenant, an entity and an AAL (`aal1` or `aal2`). Add `auth.jwt()` to the stub so `aal` claims work (SPK-09, G-02). Reset `internal`, `pgmq` and `cron` too (TR-12, SPK-14).
2. **Declare the matrix, generate the tests.** One small spec file per table says who may do what. The generator writes an allow test and a deny test for every cell, plus cross-entity and cross-tenant tests. A new table cannot be merged without its spec, because the meta-test below fails.

   ```ts
   // tests/db/matrix/payment_requests.ts
   export default defineMatrix("payment_requests", {
     select: { requester: "own", finance: "entity", admin: "entity", hr: "own", employee: "none" },
     insert: { requester: "own", finance: "none", admin: "own", employee: "none" },
     update: { requester: "own_when:draft,returned", finance: "none", admin: "none" },
     delete: { "*": "none" },
     restrictedColumns: [], // bank details live in party_bank_accounts (own matrix, aal2 only)
     crossEntity: "deny",
     crossTenant: "deny",
   });
   ```

3. **Meta-tests over the catalogue** (`tests/db/meta.test.ts`). Query `pg_catalog` and fail when any table in `public` has RLS off, lacks the restrictive tenant policy, has no matrix spec, has an unindexed policy column, or is listed as sensitive but has no `audit_row_change()` trigger (CLAUDE.md, TR-04, NFR-AUD-001). This turns CLAUDE.md's rules into a check that cannot be forgotten.
4. **Migration round trip for every migration** (`tests/db/migrations.test.ts`). Today's test hard-codes `20261105000000_phase0_foundation`. The new test applies all ups, snapshots the catalogue, then walks the rollbacks in reverse. After each down it compares the catalogue to the snapshot taken before that up, then re-applies. It also checks that every file in `supabase/migrations/` has a matching `supabase/rollbacks/<name>.down.sql` (CLAUDE.md).

The DB layer also owns: exclusion constraints (bookings with buffers, BRULE-055; contract versions that must not overlap), append-only tables (`audit_log`, `approval_actions`, approval and consent events), lock-on-approve triggers (BRULE-028), the self-approval trigger (BRULE-002), unique posting per source (BRULE-033), the balanced-posting check (BRULE-035), the closed-period check (BRULE-036), and **gapless numbering under concurrency**: 50 parallel connections issue invoices at once and the test asserts numbers 1 to 50 with no gaps or duplicates, and that a rolled-back transaction does not burn a number (BRULE-032, SPK-12).

A copy of this suite also runs against a **restored backup** in the quarterly restore drill, and against a Supabase staging branch before each release, to catch differences between the stub and real Supabase Auth (G-19, SPK-01).

### 2.5 Layer 3: API, route and command tests

- **Route matrix.** Extend `tests/unit/api-routes.test.ts` from "module × role" to "route × permission set × entity × AAL", generated from the same source of truth as the guards (`lib/auth/roles.ts`, later the permission sets of ADR-04). Expect 401 signed out, 403 for a wrong permission, 404 for pages outside your modules (Phase 0 behaviour), and 403 for `aal1` on MFA-required actions (NFR-SEC-001).
- **IDOR tests.** For every route that takes an ID, request another entity's or tenant's record and expect 404, not 403, so existence is not revealed.
- **Commands under `withUserTx`.** Commands that write several rows (approve, mark paid, post, issue a number) run against Postgres with the caller's claims. Tests check the whole transaction: status change, posting, audit row and outbox event appear together or not at all.
- **Idempotency.** Every command with an idempotency key (POS sync, mark paid, webhook) is called twice; the second call returns the first result and writes nothing.
- **Adapter contract tests** (NFR-SCALE-005). Each port (payment provider, accounting export, payroll provider, email, WhatsApp, attendance source) has one shared contract suite. It runs against the fake in every PR and against the real sandbox (for example PayHere sandbox, SPK-06) before release.
- **Webhooks** (NFR-SEC-013, NFR-SEC-022). A PayHere notification with a wrong `md5sig`, a wrong amount or currency, or a replayed order is rejected, audited as a system actor, and changes no booking.

### 2.6 Layers 4 to 7: components, e2e, visual and accessibility

**E2E tiers.** Keep the demo-mode tier for fast smoke tests of navigation and role menus. Add a **flows tier** that runs against a local Supabase stack (Supabase CLI in Docker) seeded with the synthetic AMPL month (section 4). This is the only way to test a journey like "HR submits payroll, an Admin approves, Finance marks it paid, and the run locks" through the real RLS. Whether the stack fits inside GitHub Actions time is QQ-08; the fallback is a dedicated CI Supabase project reset per run.

**Journey coverage** (`13-ux-design.md` §4):

| Journey                      | E2E test (flows tier unless noted)                                                                                                            | Projects         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| J-01 Walk-in sale by LankaQR | Room tile → engineer add-on → LankaQR reference → numbered receipt; tap count ≤ 5 and time < 60 s measured; offline variant (2.7)             | tablet, Pixel 7  |
| J-02 Booking with deposit    | Hold → PayHere sandbox stub notifies → confirmed; hold expiry with an injected clock; gear check-out and check-in; balance at POS             | desktop, tablet  |
| J-03 Quote to invoice        | Quote with options → token acceptance → project with stages and budget → vendor request from a budget line → approval → balance invoice draft | desktop          |
| J-04 Freelancer with WHT     | Engagement → payment request preview shows LKR 135,000 → WHT 6,750 → net 128,250 → Finance pays → certificate PDF                             | desktop, Pixel 7 |
| J-05 Client approves a cut   | Token page approve v2; old v1 token refused; round 3 needs the charge tick; expired link message                                              | Pixel 7          |
| J-06 Fingerprint import      | Upload `attlog.dat` fixture → mapper → preview blocks on unmatched ID → resolve → commit → re-upload gives "0 new"                            | desktop          |
| J-07 Month-end payroll       | Pre-flight → draft → adjustment with reason → submit → Admin approve (own line routed to another Admin) → Finance mark paid → lock            | desktop          |
| J-08 Owner morning check     | Inbox of 7 items cleared; money approval confirm repeats amount and payee; 8-second undo                                                      | Pixel 7          |
| J-09 Leave from a phone      | Range across a Poya day shows "2 working days"; probation warning; offline draft queued then re-checked by the server                         | Pixel 7          |
| J-10 Shift close             | Close blocked while sales are unsynced; blind count; variance over LKR 500 needs a non-cashier sign-off; Z-report                             | tablet           |

**Accessibility.** Every e2e page visit in the a11y suite runs axe with the WCAG 2.x A and AA tags and fails on any critical or serious violation (NFR-A11Y-001). Contrast tokens from `13-ux-design.md` §1.3 get a unit test that computes the WCAG ratio for each token pair, so a palette change that breaks 4.5:1 fails in CI (NFR-A11Y-002). Automated scans cannot find everything, so each release also gets a manual pass: TalkBack on Android for J-09 and J-05, keyboard only, 200% zoom, light and dark.

**Visual regression.** Snapshots cover the documents that leave the building (receipt, Z-report, tax invoice, voucher, payslip, WHT certificate) and each role's Home. They include a Sinhala and a Tamil name, because shaping in PDFs is unverified (SPK-02, TR-02). Snapshots run in a pinned Docker image so fonts and anti-aliasing do not drift. A visual change needs a reviewer to accept the new snapshot in the PR.

### 2.7 Offline POS tests

The till must keep selling when the internet drops (BR-POS-006, NFR-AVAIL-002, ADR-08). Playwright can switch a browser context offline with `context.setOffline(true)` and keeps IndexedDB across reloads, which is enough for most cases.

| ID         | Test                                                                                                      | Expect                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| TC-POS-101 | Go offline; record 3 sales (cash, card with approval code, LankaQR reference); reload the page; go online | Queue survives reload; exactly 3 server sales and 3 postings; receipts use the device block |
| TC-POS-102 | Replay the same sync batch twice (network retry)                                                          | Second call writes nothing (client-generated sale IDs, server idempotency)                  |
| TC-POS-103 | Offline: try to apply a deposit, redeem a voucher or package, refund, create a credit client              | All blocked in the UI; the sync endpoint also refuses these command types (BR-POS-007)      |
| TC-POS-104 | Close the shift with unsynced sales                                                                       | Blocked: "3 sales waiting to sync" (BRULE-058)                                              |
| TC-POS-105 | Edit a queued sale's price in IndexedDB before sync                                                       | Server re-prices from the signed catalogue and flags the difference (STRIDE 5.1 "T")        |
| TC-POS-106 | Two devices offline, each with its own receipt block; both sync                                           | No number collision; unused numbers voided with a reason at shift close (BRULE-022)         |
| TC-POS-107 | Offline walk-in room use that clashes with a booking made online meanwhile                                | Synced as "unconfirmed walk-in", conflict alert to the desk (J-01)                          |
| TC-POS-108 | **Soak (nightly):** 500 queued sales over a simulated 8 hours, then sync                                  | 500 sales, 500 postings, 0 duplicates, sync under the k6 threshold (NFR-AVAIL-002)          |
| TC-POS-109 | Unregistered browser opens the POS; revoked device tries to sync                                          | Cannot open a shift; sync refused and audited (NFR-SEC-014)                                 |

Browser emulation does not reproduce Android storage eviction or a real thermal printer. So each release that touches POS also runs a **manual device script** on AMPL's counter tablet and printer: airplane mode for 30 minutes, 20 sales, print, reconnect, close shift (SPK-03, SPK-04, OQ-49).

### 2.8 Performance and load

AMPL's load is small (NFR-SCALE-004: about 50 employees, 20,000 POS sales and 250,000 punches a year), so the aim is to catch slow queries and RLS cost, not to stress test.

| Scenario (k6 unless noted)                                                     | Threshold                                                     | Source        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------- | ------------- |
| Home, list and form pages on mid-range Android over 4G (Lighthouse CI, mobile) | Interactive within 2.5 s at p75                               | NFR-PERF-001  |
| POS add item and cash payment API                                              | p95 under 1 s                                                 | NFR-PERF-002  |
| 12-month P&L with drill-down; month attendance grid for 30 people              | Under 5 s                                                     | NFR-PERF-003  |
| Attendance file of 10,000 rows to preview                                      | Under 30 s                                                    | NFR-PERF-004  |
| POS sync burst: 2 devices × 500 queued sales                                   | All accepted, p95 per batch under 5 s (proposed), zero errors | NFR-AVAIL-002 |
| Payroll draft for 50 employees                                                 | Under 30 s (proposed)                                         | NFR-SCALE-004 |
| Approvals inbox, 20 concurrent users                                           | p95 under 800 ms (proposed); `http_req_failed` rate under 1%  | BR-APR-007    |
| Outbox: 10,000 events, worker killed mid-batch                                 | No loss, no double send (SPK-10)                              | ADR-06        |

The data volume for load tests is the synthetic dataset scaled to five years (NFR-SCALE-004), so RLS policies are tested against realistic row counts.

### 2.9 Security tests

| Area                  | Tests                                                                                                                                                                                                      | Controls                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Authorisation         | Route and RLS matrices (2.4, 2.5); IDOR; expired permission grants; deactivated user loses access at once (extends the Phase 0 "inactive users lose their role" test)                                      | NFR-SEC-004, 005; BR-ADM-001, 002              |
| MFA                   | `aal1` session cannot read Restricted tables or approve money; `aal2` can                                                                                                                                  | NFR-SEC-001, G-02                              |
| Restricted data       | NIC and bank stored as ciphertext; blind-index duplicate checks work; audit log stores `{"changed": true}` not the value; reveal writes `read.reveal`; notifications contain no salary, NIC or bank digits | NFR-SEC-006, NFR-AUD-001, 002, G-01, BRULE-071 |
| Headers and transport | CSP, HSTS, `frame-ancestors`, `Referrer-Policy: no-referrer` on token pages, `Permissions-Policy` camera only on scan pages (Playwright response checks)                                                   | NFR-SEC-010, NFR-MOB-002                       |
| Tokens and portals    | Token is single use, version-scoped, expires, is revoked by a new version; brute force is rate limited; a token never creates a session                                                                    | NFR-SEC-012, 017                               |
| Webhooks              | Bad signature, amount mismatch, replay (2.5)                                                                                                                                                               | NFR-SEC-013, 022                               |
| Card data             | A Luhn detector blocks card numbers typed into free-text fields                                                                                                                                            | NFR-SEC-013                                    |
| Environment safety    | Demo mode is off when Supabase is configured or `VERCEL_ENV=production` (G-16); the seed script refuses a production project (G-03, NFR-SEC-019)                                                           | NFR-SEC-019, 020                               |
| Dynamic scan          | ZAP baseline (passive) nightly on preview and before release on staging; findings tuned in `.zap/rules.tsv`; High and Medium fail the build unless accepted with a reason                                  | OWASP baseline                                 |
| Supply chain          | `npm audit --audit-level=high` per PR, Dependabot, CodeQL, gitleaks (existing), SHA-pinned actions, `permissions: contents: read`                                                                          | NFR-SEC-008, 018, G-15                         |
| Pen test              | Light external test before real money flows through POS or PayHere (recommended even though NFR-SEC-023 is "Could")                                                                                        | NFR-SEC-023                                    |

**Threat model to tests** (`15-compliance-security.md` §5, the threats with the highest likelihood or impact):

| Threat                                                      | Test                                                                                           |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Cashier voids a cash sale after the customer leaves (5.1 T) | Void needs a supervisor who is not the cashier; void is a reversing entry; variance alert      |
| Fake PayHere notification marks a deposit paid (5.1 S)      | Webhook signature and amount tests                                                             |
| Bank-detail change fraud (5.2 S)                            | Dual approval, call-back recorded, payment to the new account blocked for 72 h (clock test)    |
| Fake vendor who is really the requester (5.2 S)             | Blind-index match of vendor NIC or bank against employees warns and routes to an Admin         |
| Split requests under LKR 15,000 (5.2 T)                     | `detectSplitRequests` examples and properties (BRULE-061)                                      |
| Request edited after approval (5.2 T)                       | Approval binds to `subject_hash`; an edit invalidates the approval                             |
| Ghost employee (5.3 S)                                      | New employee needs HR create plus Admin approve; duplicate bank account across employees warns |
| Salary raised before the run, then reverted (5.3 T)         | Run-to-run variance report flags it; compensation change needs an Admin who is not the subject |
| Run changed after approval (5.3 T)                          | Update on locked lines rejected by trigger (BRULE-028)                                         |
| Bank file edited before upload (5.3 T)                      | Bank file hash and control total shown and checked                                             |
| Forwarded or replayed client approval link (5.4 S, T)       | Token tests; approval stores contact, version hash, IP and channel                             |
| Attendance export edited in Excel (5.5 T)                   | Checksum stored; per-employee row counts in preview; anomaly flags                             |
| Device ID reassigned (5.5 T)                                | Effective-dated mapping test; reassignment alert                                               |
| HR or Finance browses salaries (5.6 I)                      | Masked by default; reveal needs a reason and is logged; monthly "who viewed" report            |
| Insider grants themselves `salary_viewer` (5.6 E)           | Grant needs a second Admin; alert raised                                                       |

---

## 3. Requirements-based coverage

### 3.1 How traceability works in code

Every test title carries the requirement or rule IDs it proves, in square brackets, for example `it("[BR-PAY-004][BRULE-023] EPF base excludes overtime and bonus")`. A small script (`scripts/trace-report.ts`, proposed) reads the Vitest and Playwright JSON reports and the Must list in `10-brd.md` section 8. It prints, per release scope, which Must IDs have passing tests and which have none. It starts as a report and becomes a required check (QG-13 in section 5.3) once the PO's roadmap fixes the scope of each release.

**Layer codes** used in the tables: **U** rule unit, **P** property, **G** golden file, **D** DB and RLS, **A** API, route or command, **C** component, **E** e2e, **O** offline POS, **V** visual, **X** accessibility, **L** performance, **S** security. Every BR with a table also gets its RLS matrix (**D**) even where the table does not repeat it.

### 3.2 Must requirements by module (160)

#### CRM (6 Must)

| BR         | Layers  | Example test cases                                                                                                                                                                           |
| ---------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-CRM-001 | U D C   | Duplicate warning on name plus BRN, TIN, email or phone; TIN must be 9 digits (NFR-DATA-002); an SG-entity user sees no LK clients                                                           |
| BR-CRM-003 | U P C E | Line, discount and tax totals; total does not change when lines are reordered (P); discount above the producer's limit needs an override (BRULE-059); validity = issue + 14 days (BRULE-067) |
| BR-CRM-004 | D A     | Update of a sent version rejected by trigger; editing creates v+1; accepted version flagged                                                                                                  |
| BR-CRM-006 | D A S   | Acceptance is append-only with name, time, channel, quote and terms version, IP; reused token returns "already used"                                                                         |
| BR-CRM-007 | A D E   | Converting creates one project whose budget lines add up to the quote; double click converts once (idempotency)                                                                              |
| BR-CRM-008 | D V     | Quote number per entity and year, gapless under concurrency; PDF snapshot with a Sinhala client name                                                                                         |

#### PRJ (5 Must)

| BR         | Layers | Example test cases                                                                                                                                                    |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-PRJ-001 | D C    | Project requires entity, brand and service line; ClickUp link optional and validated as a URL                                                                         |
| BR-PRJ-003 | U D    | Music video template seeded with stages in the right order; editing a template does not change open projects                                                          |
| BR-PRJ-004 | U C E  | "Skipped" needs a reason; illegal transitions rejected; producer marks a stage done on Pixel 7                                                                        |
| BR-PRJ-005 | U D    | Budget lines by cost type and stage add up to the project budget                                                                                                      |
| BR-PRJ-006 | U G D  | Actual = vendor payments + AI allocation + internal bookings + time + direct expenses; committed = approved but unpaid; `GOLD-FIN-004` checks 15 music video projects |

#### BKG (12 Must)

| BR         | Layers  | Example test cases                                                                                                                                                                                                                                                                                              |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-BKG-001 | D       | Inactive resource cannot be booked; resource carries entity and `location_id` (NFR-SCALE-003)                                                                                                                                                                                                                   |
| BR-BKG-002 | D U     | QR code unique; rented-in item needs a vendor; status transitions (out → in repair allowed, retired → out refused)                                                                                                                                                                                              |
| BR-BKG-003 | C E V L | Day and week views; agenda view by default at 360 px (NFR-MOB-001); week view of 30 resources renders under budget                                                                                                                                                                                              |
| BR-BKG-004 | U P D A | **Differential property test:** random bookings with buffers, pure `overlaps()` agrees with the Postgres exclusion constraint on 1,000 cases; back-to-back at the exact buffer edge is allowed (`[)` ranges); two concurrent inserts of the same slot, exactly one succeeds; a kit books all its items (SPK-11) |
| BR-BKG-005 | U P     | Weekend, time-of-day and client-group rules; most specific rule wins; price never negative; each applied rule listed on the line                                                                                                                                                                                |
| BR-BKG-006 | U D     | Warning when the engineer is on approved leave or already booked                                                                                                                                                                                                                                                |
| BR-BKG-007 | U D     | Status machine; tentative hold released by the sweep at expiry (injected clock), not one minute early                                                                                                                                                                                                           |
| BR-BKG-008 | U D     | Internal booking posts project cost at the internal rate once; external booking becomes revenue through POS or an invoice once                                                                                                                                                                                  |
| BR-BKG-009 | U A     | Deposit 50% (BRULE-050); confirmed only when paid or waived by an Admin with a reason; requester cannot waive                                                                                                                                                                                                   |
| BR-BKG-010 | U P C   | Fees at exactly 72 h, 71 h 59 m, 24 h, 23 h 59 m and no-show (BRULE-052); fee non-increasing with notice (P); fee shown before confirm                                                                                                                                                                          |
| BR-BKG-012 | E C     | Check-out and check-in by QR (Playwright fake camera stream, with a typed-code fallback); who, when, booking and condition photo stored in a private bucket                                                                                                                                                     |
| BR-BKG-014 | U D A   | Keep part of a deposit only with a reason; cannot keep more than is held; damage charge appears as an invoice line                                                                                                                                                                                              |

#### POS (9 Must)

| BR         | Layers  | Example test cases                                                                                                                                                 |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| BR-POS-001 | E X L V | Sale on tablet and Pixel 7; 5 taps and under 60 s (NFR-PERF-002); axe clean                                                                                        |
| BR-POS-002 | U P A   | Split payments add up exactly (P); card needs last 4 digits and approval code; LankaQR needs a reference; cash over-tender gives change                            |
| BR-POS-003 | U D     | Deposit reduces the booking balance; receipt shows the remaining balance                                                                                           |
| BR-POS-004 | U D V   | Every sale numbered; VAT-registered entity prints tax invoice fields (BRULE-048); 80 mm layout snapshot; PDF and link variants                                     |
| BR-POS-005 | U D E   | Blind count; variance = counted − expected per method; over LKR 500 needs a sign-off by someone who is not the cashier; Z-report totals = sum of sales (BRULE-058) |
| BR-POS-006 | O E     | TC-POS-101, 102, 106, 108 (section 2.7)                                                                                                                            |
| BR-POS-007 | O U A   | TC-POS-103                                                                                                                                                         |
| BR-POS-010 | U D S   | Refund needs a reason and a supervisor who is not the cashier; recorded as a reversing entry; original sale unchanged (BRULE-060)                                  |
| BR-POS-013 | D U     | One posting per sale, even after a replayed sync; dimensions category, brand, entity, location, booking and method present                                         |

#### SAL (11 Must)

| BR         | Layers | Example test cases                                                                                                                                                   |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-SAL-001 | A V    | Invoice from a quote, a milestone, a booking, a retainer period and manual lines; entity details on the PDF                                                          |
| BR-SAL-002 | D P    | 50 concurrent issues give 1 to 50; a draft has no number; a rolled-back issue burns no number; the number column cannot be updated                                   |
| BR-SAL-003 | U V    | Required IRD fields present (BRULE-048); a VAT-registered buyer without a TIN blocks issue; line-level VAT shown                                                     |
| BR-SAL-004 | U P    | Rate in force on the invoice date (invoice before and after a rate change); standard, zero-rated, exempt, out of scope; SSCL as a component; rounding rule per QQ-01 |
| BR-SAL-005 | U D    | Draft created once per trigger (date, stage done, approval event); 50/50 default (BRULE-068)                                                                         |
| BR-SAL-006 | U P D  | Part payment, allocation across invoices, overpayment to client credit; allocations plus credit = receipt (P)                                                        |
| BR-SAL-007 | U G D  | Deposit register is a liability; forfeit on no-show posts to income (BRULE-053); register equals the ledger liability balance (`GOLD-FIN-002`)                       |
| BR-SAL-008 | D      | Update or delete on an issued invoice refused; credit note restores the balance                                                                                      |
| BR-SAL-009 | U      | Buckets at 0, 1, 14, 15, 30, 31, 60 and 61 days, counted in Colombo dates; over 14 days escalates (BRULE-037)                                                        |
| BR-SAL-011 | U G    | USD 1,000 booked at 330.00 = LKR 330,000; received at 335.00 → FX gain LKR 5,000; SGD invoice case                                                                   |
| BR-SAL-014 | U G    | Rolling 12-month and quarterly turnover, split by activity; alerts at 80% (VAT LKR 48m a year or 12m a quarter; SSCL LKR 28.8m or 7.2m) (BRULE-045 to 047)           |

#### VP (16 Must)

| BR        | Layers  | Example test cases                                                                                                                                                                    |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-VP-001 | D U S   | NIC (old and new formats) and TIN validation; NIC stored encrypted; masked display; a requester's query cannot select bank columns                                                    |
| BR-VP-002 | U D     | Duplicate vendor by blind index; vendor bank = an employee's bank warns; duplicate bill on vendor + invoice number + amount                                                           |
| BR-VP-003 | U D A E | Bank change is a separate request; Finance and an Admin who is not the requester approve; call-back recorded; payment at 71 h 59 m blocked, at 72 h allowed (BRULE-062)               |
| BR-VP-004 | C A     | Required fields; attachment to a private bucket; currency and optional breakdown lines                                                                                                |
| BR-VP-005 | D A     | No `vp.request.create` permission → 403; requester sees only their own requests; never bank details (BRULE-070)                                                                       |
| BR-VP-006 | U P     | LKR 14,999.99 and 15,000.00 go straight to Finance; 15,000.01 goes to an Admin (BRULE-001); routing monotonic (P); USD request converted at the request-date rate for the limit check |
| BR-VP-007 | U D     | Illegal transitions refused (paid → draft); Finance return needs a comment                                                                                                            |
| BR-VP-008 | U D     | Part payments never exceed net payable; the last part flips the request to paid                                                                                                       |
| BR-VP-009 | U G     | Advance held as a prepayment and cleared against the final bill; ledger balances                                                                                                      |
| BR-VP-010 | D       | Locked after full payment; exactly one expense posted; a replayed "mark paid" posts nothing                                                                                           |
| BR-VP-011 | D V     | `AMPL-PV-2026-0001` style numbering, gapless; PDF hash stored; re-issue creates a new version                                                                                         |
| BR-VP-012 | U P G   | Section 3.4 WHT cases                                                                                                                                                                 |
| BR-VP-013 | U D V   | One certificate per deduction, free; monthly schedule total = sum of WHT lines                                                                                                        |
| BR-VP-015 | U       | USD 500 requested at 330.00 and paid at 334.00 → FX loss LKR 2,000                                                                                                                    |
| BR-VP-016 | D       | Delete on a paid request refused; reversal with reason; ledger nets to zero (BRULE-034)                                                                                               |
| BR-VP-017 | E A     | Requester, Finance queue and Admin views show the right rows per role; filters by vendor, project, status and due date                                                                |

#### FIN (15 Must)

| BR         | Layers | Example test cases                                                                                                                 |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| BR-FIN-001 | C D    | Expense with receipt upload and the foreign VAT field (CFO-23)                                                                     |
| BR-FIN-002 | D P    | Unique (source type, source ID) on postings; each source type posts once; source locked after posting (BRULE-033)                  |
| BR-FIN-003 | U D    | Recurring draft on schedule; a template on the 31st in February; the sweep is idempotent                                           |
| BR-FIN-004 | D      | Seeded categories exist; only Admins edit                                                                                          |
| BR-FIN-005 | U D    | Rate defaults from the table for the Colombo transaction date; override needs a reason; missing rate blocks save (BRULE-038)       |
| BR-FIN-006 | G U L  | P&L for the synthetic November equals `GOLD-FIN-001`; drill-down sums equal the line; 12-month P&L under 5 s                       |
| BR-FIN-007 | G U    | Profitability for 15 music videos equals `GOLD-FIN-004`; AI cost per video in USD and LKR                                          |
| BR-FIN-008 | D U    | Entity and brand are NOT NULL on every entry; P&L by brand adds up to the total                                                    |
| BR-FIN-009 | U      | Cash view and 30-day forecast from due dates                                                                                       |
| BR-FIN-013 | D      | Payments and receipts append-only; correction only by reversal                                                                     |
| BR-FIN-014 | U D E  | Each checklist item blocks close; a soft-closed month rejects new entries in the database; Admin reopen needs a reason (BRULE-036) |
| BR-FIN-015 | U G    | Journal export matches the CoA mapping; an unmapped category blocks export; XLSX columns snapshot; pre-flight balanced (SPK-07)    |
| BR-FIN-016 | P D    | Unbalanced posting rejected by a deferred constraint; every posting built by any rule balances (P) (BRULE-035)                     |
| BR-FIN-017 | U G    | Retainer recognised monthly; milestone recognised on the approval event; deferred revenue report (BRULE-039)                       |
| BR-FIN-018 | U D    | WIP ageing; completed booking with no invoice after 48 h raises an alert (injected clock)                                          |

#### HR (8 Must)

| BR        | Layers | Example test cases                                                                                                           |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| BR-HR-001 | D C    | Employee CRUD; change history via the audit trigger; device user ID unique per date                                          |
| BR-HR-002 | D S    | NIC and bank stored as ciphertext; NIC never appears in `audit_log` (G-01); reveal logged (NFR-AUD-002); `aal1` cannot read  |
| BR-HR-003 | U D    | Contract type JSON validated by the Zod schema (valid and invalid fixtures); three seeded types present                      |
| BR-HR-004 | U D    | Versions cannot overlap (exclusion constraint); change from a date keeps history; `activeContractOn(date)` on the change day |
| BR-HR-005 | U D    | Holiday fixture includes Poya days; adding an ad hoc closure recalculates drafts but not approved runs                       |
| BR-HR-006 | D S    | Private bucket; signed URL expires; reminder before document expiry                                                          |
| BR-HR-009 | U      | Alerts at 60 and 30 days; probation ending on 29 February or a month end                                                     |
| BR-HR-010 | U      | Warning for a contractor with fixed office days, fingerprint punches or more than 6 months (BRULE-030)                       |

#### ATT (10 Must)

| BR         | Layers | Example test cases                                                                                                                                       |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-ATT-001 | U A S  | Parsers for CSV, XLSX and headerless `attlog.dat` fixtures; checksum stored; oversize or malformed file rejected; template or photo columns dropped      |
| BR-ATT-002 | U      | Profiles with `dd/MM/yyyy` versus `MM/dd/yyyy`; status-code mapping; first-and-last-punch option                                                         |
| BR-ATT-003 | U D    | Reassigned device ID maps to the right person by date; unmatched IDs block commit                                                                        |
| BR-ATT-004 | U      | Preview counts; odd rows: single punch, more than 16 hours, future dates                                                                                 |
| BR-ATT-005 | D P    | Same file twice → 0 new rows; overlapping week merges; import order independence (P) (BRULE-013)                                                         |
| BR-ATT-006 | D A    | Admin rollback removes the batch's punches and recomputes days; the batch record stays; HR cannot roll back                                              |
| BR-ATT-007 | U P    | Late = first punch after start + grace (BRULE-014); half day; missing punch; overnight punch after midnight; multiple punches; minutes in [0, 1,440] (P) |
| BR-ATT-008 | D U    | Re-import never overwrites approved leave, manual attendance or Admin corrections (BRULE-012)                                                            |
| BR-ATT-009 | U      | Exceptions list; hybrid week below N office days, including an ISO week that spans two months (BRULE-015)                                                |
| BR-ATT-010 | U D E  | Blocked on an approved-leave date (BRULE-011); punch plus manual both kept and flagged; self-approval refused                                            |

#### LV (9 Must)

| BR        | Layers | Example test cases                                                                                                                                      |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-LV-001 | D C    | "Documents required" types need an upload; maternity type present                                                                                       |
| BR-LV-002 | U P G  | Section 3.4 leave cases; balance as of any date is the ledger sum (BRULE-018); `GOLD-LV-001` to `003` for three contract types (PLAN Phase 4 done-when) |
| BR-LV-003 | U      | Paid leave refused during probation, allowed from the first day after (BRULE-016)                                                                       |
| BR-LV-004 | U P    | Mon to Fri with a Poya Wednesday counts 4; half day at either end; counted ≤ calendar days (P) (BRULE-017)                                              |
| BR-LV-005 | U D E  | HR `approve` on a recommend-only step refused; Admin decides after 2 days without HR (BRULE-005, 006); HR cannot recommend their own leave              |
| BR-LV-006 | U      | Overlap warning; team-off threshold; person on a confirmed shoot or booking                                                                             |
| BR-LV-007 | U D    | Employee cancels pending; Admin cancels approved and the ledger reverses                                                                                |
| BR-LV-009 | U      | Warning below 14 annual, 7 casual, 84 or 42 maternity days (BRULE-019)                                                                                  |
| BR-LV-010 | C E    | Team calendar marks Poya days; agenda view on phones                                                                                                    |

#### PAY (17 Must)

| BR         | Layers | Example test cases                                                                                                                                                    |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-PAY-001 | U P G  | Section 3.4 pro rata cases; day segments add up to calendar days (P); `GOLD-PAY-001` to `006`                                                                         |
| BR-PAY-002 | U G    | LKR 4,000 × unapproved absent days (BRULE-020); unpaid leave per contract; the explanation lists every input                                                          |
| BR-PAY-003 | U      | EPF base includes basic, cost-of-living allowance and commission; excludes overtime, bonus and reimbursement (R2 B.1)                                                 |
| BR-PAY-004 | U P G  | Section 3.4 EPF and ETF cases; statutory flag off → no lines; rate change effective-dated mid-year                                                                    |
| BR-PAY-005 | U G    | Section 3.4 APIT cases; table version stored on the line                                                                                                              |
| BR-PAY-006 | U P    | `net(grossUpNet(85,000)) = 85,000`; employer-borne APIT shown on the line and payslip                                                                                 |
| BR-PAY-008 | D      | Adjustment without a reason refused; audit row written with before and after                                                                                          |
| BR-PAY-009 | U      | Missing contract, missing EPF number or TIN, negative net, unapproved overtime each block submit unless acknowledged                                                  |
| BR-PAY-010 | U      | Full-month pay of LKR 29,999 warns (BRULE-025); a part-month joiner does not warn                                                                                     |
| BR-PAY-011 | D E    | Submit → any one Admin → Finance → paid; lines locked on approve (BRULE-028); Admin's own line goes to another Admin (BRULE-008); payer ≠ approver (BRULE-007)        |
| BR-PAY-012 | V D S  | Payslip content checklist (R2-25); hash stored; employee sees only their own; signed URL expires; no amounts in the notification                                      |
| BR-PAY-013 | U G    | Summary totals = sum of lines; bank list control total and hash                                                                                                       |
| BR-PAY-014 | D      | One Payroll expense per run with employer EPF and ETF as separate cost lines; replay posts nothing                                                                    |
| BR-PAY-015 | U G    | EPF Form C data, ETF return and APIT schedule totals equal the paid run (`GOLD-PAY-007`)                                                                              |
| BR-PAY-017 | U      | Reminders before each deadline (BRULE-029); a deadline on a weekend or Poya day reminds earlier (proposed)                                                            |
| BR-PAY-018 | U G    | Threshold: 15 workmen on any day in the preceding 12 months; 5 completed years → 2.5 months' salary; 4 years 11 months → 0; monthly provision (BRULE-027, unverified) |
| BR-PAY-020 | U G A  | Provider export file matches the provider's sample (SPK-13); imported journal reconciles headcount and gross, or approval is blocked                                  |

#### TAL (7 Must)

| BR         | Layers | Example test cases                                                                                                                                                                                                |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-TAL-001 | D      | Talent profile linked to exactly one payee; producers can read, cannot see bank details                                                                                                                           |
| BR-TAL-003 | D U    | Engagement links to a project and its payment requests                                                                                                                                                            |
| BR-TAL-004 | D U V  | Contract from a template version; click-acceptance stores the version hash (NFR-AUD-008)                                                                                                                          |
| BR-TAL-005 | D      | Release record has purpose, media, territory, term and withdrawal route; linked to deliverables                                                                                                                   |
| BR-TAL-006 | U D    | Consent scope face, voice or both; "any AMPL project" versus named projects; expired term treated as no consent                                                                                                   |
| BR-TAL-007 | U D E  | Withdrawal flags every deliverable and open engagement that relies on it and notifies the producer; publish blocked afterwards                                                                                    |
| BR-TAL-008 | U D    | Minor needs guardian identity and consent; AI likeness of a minor blocked without guardian consent and Admin approval (BRULE-065); age computed on the engagement date, including the day before an 18th birthday |

#### AST (7 Must)

| BR         | Layers | Example test cases                                                                                                        |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| BR-AST-001 | D C    | Deliverable register fields; link to the file in Drive                                                                    |
| BR-AST-002 | D      | Version numbers increase; status transitions                                                                              |
| BR-AST-003 | D A S  | Approval events append-only; token single use and version-scoped; approving v1 after v2 was sent is refused               |
| BR-AST-004 | U      | Round 3 with 2 free rounds is billable and needs the client's tick; invoice line offered (BRULE-040)                      |
| BR-AST-005 | D      | Content ID allowed only when ownership fields are filled                                                                  |
| BR-AST-007 | U      | Alert 30 days before the rights end date (BRULE-064)                                                                      |
| BR-AST-008 | U D E  | "Published" refused without a disclosure decision or a valid consent for each likeness; allowed when complete (BRULE-063) |

#### AI (3 Must)

| BR        | Layers | Example test cases                                                                                                                                             |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-AI-001 | D      | Register fields; renewal date; login holder                                                                                                                    |
| BR-AI-002 | U D    | Renewal creates a USD expense draft with the day's rate                                                                                                        |
| BR-AI-003 | U P G  | Section 3.4 AI allocation cases; allocations plus unused capacity equal the cost (P); re-runnable until the period locks; posts a balanced journal (BRULE-066) |

#### APR (7 Must)

| BR         | Layers | Example test cases                                                                                                              |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| BR-APR-001 | U D    | Each starter policy in `20-solution-design.md` §6.6 routes as written; policies are data                                        |
| BR-APR-002 | D P    | Two Admins approve at the same moment: one succeeds, the other sees "Already approved by …" (partial unique index, BRULE-009)   |
| BR-APR-003 | D A    | Self-approval refused by trigger; a delegate of the requester refused; the step routes to another eligible approver (BRULE-002) |
| BR-APR-004 | D U    | Requester ≠ approver ≠ payer on payments and payroll; refund supervisor ≠ cashier (BRULE-007, 060)                              |
| BR-APR-005 | U D    | SLA escalation with an injected clock; the sweep is idempotent                                                                  |
| BR-APR-007 | E X C  | One-tap approve on Pixel 7; money approvals repeat amount and payee; reject and return need a comment; 8-second undo; axe clean |
| BR-APR-008 | D      | Every decision has actor, time, step, comment, before and after, and `subject_hash` in the audit log                            |

#### NOT (2 Must)

| BR         | Layers | Example test cases                                                                                                                                  |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-NOT-001 | U D    | Table-driven test over the PLAN §11 event list: each event produces the right recipients once, through the outbox, to a sink adapter                |
| BR-NOT-005 | U P S  | For generated payloads, rendered text never matches NIC patterns, bank account digits or salary amounts (P); snapshot of every template (BRULE-071) |

#### RPT (7 Must)

| BR         | Layers | Example test cases                                                                                         |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| BR-RPT-001 | E      | Each of the six roles lands on its own Home                                                                |
| BR-RPT-002 | U D    | Today strip counts match the seeded day (in, on leave, absent, late, approvals, bookings, gear due back)   |
| BR-RPT-003 | E V L  | 30 people × month under 5 s; drill-down to punches and audit trail; status shown by text as well as colour |
| BR-RPT-004 | U      | Current month status, total, exceptions and the last 12 months                                             |
| BR-RPT-005 | U      | Projected year-end balance equals `accrueLeave` at 31 December                                             |
| BR-RPT-007 | G D    | Snapshot equals `GOLD-FIN-001` figures; visible only to Admin and Finance                                  |
| BR-RPT-010 | U A    | XLSX and PDF export for every list; exports logged and watermarked (NFR-AUD-002)                           |

#### ADM (8 Must)

| BR         | Layers | Example test cases                                                                                                                                       |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-ADM-001 | D A E  | No self sign-up; deactivation removes access at once (extends the Phase 0 test); a self-assigned role in signup metadata is ignored (existing test kept) |
| BR-ADM-002 | D A    | Grants per entity with validity dates; an expired grant denies; sensitive grants need a second Admin                                                     |
| BR-ADM-004 | U D    | Every policy value effective-dated and audited; a change applies from its date; the NFR-COST-003 timed task in UAT                                       |
| BR-ADM-005 | D      | Entity settings drive document prefixes and tax status                                                                                                   |
| BR-ADM-007 | E D    | Filters by actor, entity, record, action and date; viewing is logged; a non-Admin gets 404                                                               |
| BR-ADM-008 | U A    | Opening-data XLSX preview rejects bad NICs and unknown contract types; commit is idempotent; opening leave balances post as ledger entries               |
| BR-ADM-009 | D      | Catalogue used by quotes, bookings and POS; price change effective-dated                                                                                 |
| BR-ADM-010 | D E    | A new privacy notice version needs a fresh acknowledgement from each person                                                                              |

#### INT (1 Must)

| BR         | Layers | Example test cases                                                                                         |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| BR-INT-003 | U A    | Email adapter contract test; non-production uses a sink; SPF and DKIM checked in the pre-release checklist |

### 3.3 Business rule (BRULE) test catalogue (71)

Every rule has a function in `lib/rules/` (or a database guarantee where marked **DB**), example tests at each boundary, and the property or golden test shown.

| BRULE | Function or guarantee                                         | Tests | Boundary and key cases                                                                                              |
| ----- | ------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------- |
| 001   | `vp/routePaymentRequest`                                      | U P   | 14,999.99, 15,000.00, 15,000.01; limit read from policy data; monotonic                                             |
| 002   | **DB** trigger on `approval_actions`; `apr/resolveCandidates` | U D   | Requester, delegate acting for the requester, subject of the request (own leave, own payroll line)                  |
| 003   | `apr/routeApproval`                                           | U D   | Leave, manual attendance, payroll and above-limit payments each need one Admin                                      |
| 004   | `apr/routeApproval`                                           | U D   | LKR 250,000.00 versus 250,000.01 (proposed band); any bank-detail change needs two different people                 |
| 005   | **DB** recommend-only step                                    | D     | HR `approve` refused; `recommend_approve`, `recommend_reject` and `return` accepted                                 |
| 006   | `apr/escalate`                                                | U D   | 1 day 23 h 59 m: Admin cannot skip HR; 2 days: Admin can decide directly (injected clock)                           |
| 007   | **DB** payer check                                            | D     | Requester marks paid refused; final approver marks paid refused when policy says so                                 |
| 008   | `apr/resolveCandidates`                                       | U D   | All three Admins in the run: one scoped task per Admin, each decided by a different Admin                           |
| 009   | **DB** partial unique index                                   | D P   | Concurrent second decision refused                                                                                  |
| 010   | `apr/canAct` with delegations                                 | U     | Delegation outside its date range refused; delegated approvals listed for owner review within 5 working days        |
| 011   | `att/canRequestManual`                                        | U D   | Approved leave blocks; pending leave warns only (proposed)                                                          |
| 012   | `att/mergePunches` + **DB**                                   | U D   | Re-import over an approved manual day, an approved leave day and an Admin correction                                |
| 013   | **DB** unique key on raw punches                              | D P   | Same punch from the same source twice; same timestamp from a different source kept                                  |
| 014   | `att/deriveDay`                                               | U     | 09:15:00 on time, 09:15:01 late with 15 minutes' grace (to confirm whether grace is inclusive)                      |
| 015   | `att/checkOfficeDays`                                         | U     | Flag only; no payroll effect unless policy changes; ISO week across months                                          |
| 016   | `lv/canUseType`                                               | U     | Last day of probation versus the day after                                                                          |
| 017   | `lv/countLeaveDays`                                           | U P   | Poya day, weekend, ad hoc closure inside a range; half days at the ends                                             |
| 018   | `lv/leaveBalanceAsOf`                                         | U P G | Balance equals the ledger sum on any date; no stored mutable balance                                                |
| 019   | `lv/checkStatutoryFloors`                                     | U     | 13 annual warns, 14 does not; maternity 84 and 42                                                                   |
| 020   | `pay/computeAbsence`                                          | U G   | 0, 1 and 3 unapproved days at LKR 4,000; legality note shown (PLAN §10)                                             |
| 021   | `pay/prorate`                                                 | U P G | 28, 29, 30 and 31-day months; join on the 1st, 16th and last day                                                    |
| 022   | `pos/reserveReceiptBlock`                                     | U D O | Block of 50; 51st offline sale asks for a new block or blocks; unused numbers voided with a reason at close         |
| 023   | `pay/computeEpfEtf`                                           | U P G | Section 3.4                                                                                                         |
| 024   | `pay/computeApit`, `pay/grossUpNet`                           | U P G | Section 3.4; the table version used is stored on the line                                                           |
| 025   | `pay/checkMinimumWage`                                        | U     | 29,999 warns, 30,000 does not; daily 1,200; part months excluded                                                    |
| 026   | `pay/computeOvertime`                                         | U     | 1.5×; weekly 12 h cap warning; holiday work at double or a lieu day (unverified values held as data)                |
| 027   | `pay/computeGratuity`, `pay/gratuityThreshold`                | U G   | 14 versus 15 workmen on any day in 12 months; 4 y 11 m versus 5 y; ½ month per completed year                       |
| 028   | **DB** lock trigger                                           | D     | Update after approval refused; reopen only through APR with a reason                                                |
| 029   | `pay/statutoryDeadlines`                                      | U     | APIT 15th; EPF and ETF month end; ETF Form II 31 August and 28 February; annual 30 April                            |
| 030   | `hr/classificationWarnings`                                   | U     | 6 months exactly versus 6 months and 1 day; fixed office days; fingerprint punches                                  |
| 031   | `hr/contractAlerts`                                           | U     | 60 and 30 days before; end date on a month end                                                                      |
| 032   | **DB** `next_number()`                                        | D P   | Concurrency; per entity, type and year; year roll-over at Colombo midnight on 1 January                             |
| 033   | **DB** unique posting per source                              | D P   | Replay of every source type                                                                                         |
| 034   | `fin/buildReversal` + **DB**                                  | U D   | Reversal mirrors every line; original untouched; reason required                                                    |
| 035   | `fin/buildPosting` + **DB** deferred check                    | U P D | Any rule-built posting balances; a hand-built unbalanced posting is refused                                         |
| 036   | **DB** period check                                           | D     | Entry dated in a soft-closed month refused; reopen with reason; locked-period change posts in the open period       |
| 037   | `sal/ageReceivable`                                           | U     | 14 versus 15 days overdue in Colombo dates                                                                          |
| 038   | `fin/defaultRate`                                             | U     | CBSL rate for the date; weekend or holiday uses the last published rate (proposed, QQ-02); override needs a reason  |
| 039   | `fin/recogniseRevenue`                                        | U G   | Retainer over the service period; milestone on approval; quota-based retainer                                       |
| 040   | `ast/revisionRound`                                           | U     | Round 2 free, round 3 billable                                                                                      |
| 041   | `vp/computeWht`                                               | U P G | Section 3.4                                                                                                         |
| 042   | `vp/computeWht`                                               | U     | Non-resident 14% (unverified, data)                                                                                 |
| 043   | `vp/computeWht`                                               | U     | Rent 10% above LKR 100,000 a month (unverified, data)                                                               |
| 044   | `vp/whtCertificate`                                           | U D   | One certificate per deduction, no fee line                                                                          |
| 045   | `sal/taxLine`, `fin/checkThresholds`                          | U G   | 18% on the invoice date; threshold LKR 60m a year or 15m a quarter                                                  |
| 046   | `sal/taxLine`, `fin/checkThresholds`                          | U G   | SSCL 2.5% on the liable share by activity; LKR 36m or 9m                                                            |
| 047   | `fin/checkThresholds`                                         | U     | 79.99% no alert, 80% alert                                                                                          |
| 048   | `sal/validateTaxInvoice`                                      | U V   | Each required field missing in turn blocks issue (field list to confirm, SPK-08)                                    |
| 049   | `sal/stampDutyFlag`                                           | U     | LKR 24,999.99 no flag, 25,000 flag (unverified for 2026, data)                                                      |
| 050   | `bkg/depositDue`                                              | U     | 50% of booking value; fixed amount per resource or package                                                          |
| 051   | `bkg/holdExpiry`                                              | U D   | Released at 24 h, not at 23 h 59 m                                                                                  |
| 052   | `bkg/cancellationFee`                                         | U P   | Section 3.2 BR-BKG-010                                                                                              |
| 053   | `sal/forfeitDeposit`                                          | U G   | No-show and late cancellation post the forfeit to income                                                            |
| 054   | `bkg/overlaps` buffers                                        | U P   | 15 min rooms, 30 min photo studio                                                                                   |
| 055   | **DB** exclusion constraint                                   | P D   | Differential test with `overlaps()`                                                                                 |
| 056   | `bkg/lateReturnFee`                                           | U     | 30 min grace; suggested, never charged automatically (J-02)                                                         |
| 057   | `bkg/keepDeposit`                                             | U D   | Only with recorded damage and a reason; never more than held                                                        |
| 058   | `pos/shiftVariance` + **DB**                                  | U D O | LKR 500.00 within, 500.01 needs sign-off; close blocked while unsynced                                              |
| 059   | `crm/discountLimit`, `pos/discountLimit`                      | U     | Cashier 5%, producer 10%; override with reason                                                                      |
| 060   | `apr/canAct` + **DB**                                         | U D   | Supervisor who is also the cashier on that sale refused                                                             |
| 061   | `vp/detectSplitRequests`                                      | U P   | Three requests of LKR 6,000 to one vendor and project within 7 days flagged; same requests 8 days apart not flagged |
| 062   | `vp/canPayToAccount`                                          | U     | 71 h 59 m blocked, 72 h allowed                                                                                     |
| 063   | `ast/canPublish`                                              | U D   | Missing disclosure decision; one of two likeness consents missing; Content ID without ownership                     |
| 064   | `ast/rightsAlerts`                                            | U     | 30 days before the end date                                                                                         |
| 065   | `tal/canUseLikeness`                                          | U D   | Minor without guardian consent; with consent but no Admin approval; both present                                    |
| 066   | `ai/allocateAiCost`                                           | U P G | Section 3.4                                                                                                         |
| 067   | `crm/quoteValidity`                                           | U     | 14 days from issue, in Colombo dates                                                                                |
| 068   | `sal/billingSchedule`                                         | U     | 50% advance and 50% on final approval; totals equal the quote to the cent                                           |
| 069   | `prj/turnaround`                                              | U     | 48 hours to first cut; clock pauses while "waiting on client" (proposed)                                            |
| 070   | **DB** RLS                                                    | D     | Requester's own rows only; bank columns only for Finance and Admins                                                 |
| 071   | `not/render` + property                                       | U P   | Section 3.2 BR-NOT-005                                                                                              |

### 3.4 Sri Lanka specifics: worked test cases

All figures are in LKR unless stated, computed in minor units. Where a value is marked unverified in `10-brd.md` section 12, the test asserts the **data version**, not the law; the accountant signs each version (QQ-03).

| Case ID    | Area                      | Scenario                                                                                                          | Expected                                                                                                      |
| ---------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| TC-PAY-001 | Mid-month joiner          | Joins 16 November 2026 (30-day month) on LKR 85,000 a month                                                       | 85,000 × 15/30 = **42,500.00** (BRULE-021)                                                                    |
| TC-PAY-002 | Mid-month contract change | 85,000 to 95,000 from 21 November                                                                                 | 85,000 × 20/30 + 95,000 × 10/30 = **88,333.33** under round-half-up to the cent; result depends on QQ-01      |
| TC-PAY-003 | Leaver                    | Last day 10 November                                                                                              | 10/30 of base; gratuity check; final settlement inputs listed                                                 |
| TC-PAY-004 | Probation ends mid-month  | Probation ends 14 November; leave on 13 and 17 November                                                           | 13 November unpaid (paid type blocked), 17 November paid                                                      |
| TC-PAY-010 | EPF base                  | Basic 100,000 + cost-of-living allowance 10,000 + overtime 15,000 + bonus 20,000                                  | Base **110,000**; EPF employee **8,800**, employer **13,200**; ETF **3,300** (R2 B.1, BRULE-023)              |
| TC-PAY-011 | EPF flag off              | Contractor on the Part-time Contractor type                                                                       | No EPF or ETF lines; legal-classification note shown (PLAN §10)                                               |
| TC-PAY-020 | APIT at relief            | APIT-liable monthly pay 150,000                                                                                   | **0**                                                                                                         |
| TC-PAY-021 | APIT first band           | 200,000                                                                                                           | (200,000 − 150,000) × 6% = **3,000**                                                                          |
| TC-PAY-022 | APIT three bands          | 300,000                                                                                                           | 5,000 + 7,500 + 6,000 = **18,500** (annual bands ÷ 12, R2 B.2)                                                |
| TC-PAY-023 | APIT band edges           | 233,333.33; 275,000; 316,666.67; 358,333.33 (monthly equivalents of the annual band edges) and 1 cent either side | Tax steps at each edge; **the IRD Table 01 value governs where it differs from the formula by rounding**      |
| TC-PAY-024 | APIT worked examples      | Every worked example in the IRD's published APIT tables for the year                                              | Exact match (BR-PAY-005)                                                                                      |
| TC-PAY-025 | Net contract gross-up     | Net 85,000, EPF on                                                                                                | Gross G such that G − EPF 8% − APIT(G) = 85,000.00; employer-borne APIT shown (BR-PAY-006)                    |
| TC-PAY-026 | Tax year boundary         | March 2027 and April 2027 runs                                                                                    | March uses the 2026/27 table version; April uses the next version once loaded; missing version blocks the run |
| TC-PAY-030 | Gratuity                  | 5 completed years on last salary 120,000                                                                          | ½ × 120,000 × 5 = **300,000**; 4 years 11 months → 0 (BRULE-027, unverified)                                  |
| TC-LV-001  | Poya day in a range       | Annual leave Monday to Friday with a Poya day on Wednesday                                                        | **4** days                                                                                                    |
| TC-LV-002  | Mid-year joiner accrual   | Annual 14 days accrued monthly, joined 1 July 2026, balance on 31 December                                        | 14 × 6/12 = **7.0** days                                                                                      |
| TC-LV-003  | Mid-month joiner accrual  | Joined 16 July                                                                                                    | Depends on policy (full month, half month or none); each policy option has a case                             |
| TC-LV-004  | Ad hoc closure            | Government declares a closure after leave was approved                                                            | Day no longer counted; balance restored; draft payroll recalculated, approved runs untouched (BR-HR-005)      |
| TC-ATT-001 | Punch after midnight      | Late shift 18:00 to 01:30                                                                                         | One day record, 450 minutes, attributed per the shift rule; stored in UTC, shown in Colombo time              |
| TC-VP-001  | WHT at threshold          | Resident individual vocalist, month to date 0, request 100,000                                                    | **0** ("exceeds" means above, BRULE-041)                                                                      |
| TC-VP-002  | WHT above threshold       | Month total 135,000                                                                                               | 5% on the full amount = **6,750**; net 128,250 (J-04)                                                         |
| TC-VP-003  | WHT crossing mid-month    | First request 80,000 (no WHT), second request 40,000 the same month                                               | Expected value **depends on QQ-04**: either 2,000 on the second only, or 6,000 catch-up on the full 120,000   |
| TC-VP-004  | WHT out of scope          | Equipment hire from a company                                                                                     | 0; the reason names the rule                                                                                  |
| TC-SAL-001 | VAT and SSCL thresholds   | Rolling 12-month taxable supplies reach 48m (VAT) or 28.8m (SSCL); a quarter reaches 12m or 7.2m                  | Alert at 80% (BRULE-047); split by services and retail                                                        |
| TC-SAL-002 | VAT rate change           | Invoice dated the day before and the day of a rate change                                                         | Each uses the rate in force on its date                                                                       |
| TC-FX-001  | USD AI bill               | Claude subscription USD 100 booked at 330.00 (LKR 33,000); the bank debits LKR 33,480                             | Implied rate 334.80; LKR 480 shown as FX difference or bank fee per CFO-08                                    |
| TC-FX-002  | Rate on a holiday         | Bill dated on a Poya day with no CBSL rate                                                                        | Last published rate used (proposed) or entry blocked, per QQ-02                                               |
| TC-AI-001  | AI allocation, equal      | Monthly AI pool LKR 331,500 over 15 active music video projects                                                   | **22,100** each, sum 331,500                                                                                  |
| TC-AI-002  | AI allocation, remainder  | LKR 10,000.00 over 3 projects                                                                                     | 3,333.34 + 3,333.33 + 3,333.33 (largest remainder); sum exactly 10,000.00                                     |
| TC-AI-003  | AI allocation, credits    | 1,000 credits bought, 700 used across projects                                                                    | 70% to projects by credits, 30% to "AI capacity unused" (BRULE-066)                                           |
| TC-POS-001 | LKR rounding at the till  | Cart 8,499.50 paid in cash                                                                                        | Behaviour per the currency rounding data (QQ-01); receipt, Z-report and ledger agree to the cent              |
| TC-POS-002 | Split payment             | 8,500 as 5,000 cash + 3,500 LankaQR                                                                               | Two payment lines, sum 8,500; each method in the Z-report                                                     |
| TC-FMT-001 | Number and date formats   | 1234567.5 LKR in `en-LK`, `si-LK`, `ta-LK`; 1 December 2026 09:00 UTC                                             | Agreed grouping per locale and the code shown (NFR-I18N-004); 14:30 in Colombo                                |
| TC-ID-001  | NIC validation            | `881234567V`, `881234567X`, `198812345678`, 10 and 11 digits, letters in the new format                           | First three valid, the rest refused (NFR-DATA-002)                                                            |

### 3.5 PLAN.md section 15 edge cases

| Edge case (PLAN §15)                                  | Test ID         | Layers | Expected                                                                                  |
| ----------------------------------------------------- | --------------- | ------ | ----------------------------------------------------------------------------------------- |
| One punch only in a day                               | TC-ATT-010      | U      | Day flagged "missing punch", in the exceptions list, not counted as present automatically |
| Multiple punches (breaks)                             | TC-ATT-011      | U      | First in and last out; break time per contract rule                                       |
| Punch just after midnight for a late shift            | TC-ATT-001      | U      | Section 3.4                                                                               |
| Employee joins or leaves mid-month                    | TC-PAY-001, 003 | U G    | Section 3.4                                                                               |
| Contract changes mid-month                            | TC-PAY-002      | U G    | Section 3.4                                                                               |
| Probation ends mid-month                              | TC-PAY-004      | U      | Section 3.4                                                                               |
| Leave spanning a holiday or weekend                   | TC-LV-001       | U P    | Section 3.4                                                                               |
| Half day on either side of a range                    | TC-LV-005       | U      | 0.5 + full days + 0.5                                                                     |
| Leave cancelled after approval                        | TC-LV-006       | U D    | Admin only; ledger reversed; payroll draft recalculated                                   |
| Manual attendance on a day with a device punch        | TC-ATT-012      | D      | Both kept, conflict flagged                                                               |
| Re-import after an approved correction                | TC-ATT-013      | D      | Approved data untouched (BRULE-012)                                                       |
| Device ID reassigned to a new person                  | TC-ATT-014      | U D    | Punches map by effective date; alert on reassignment                                      |
| Two employees with similar names                      | TC-ATT-015      | U      | Matching by device ID only, never by name; preview shows both                             |
| An Admin who is also the requester                    | TC-APR-010      | D      | Routed to another Admin                                                                   |
| All three Admins away                                 | TC-APR-011      | U D    | Time-boxed delegation; delegate cannot approve the delegator's own request                |
| Poya days and ad hoc closures                         | TC-LV-004       | U D    | Section 3.4                                                                               |
| Vendor paid in parts                                  | TC-VP-010       | U D    | Advance as prepayment, balance clears it (BR-VP-008, 009)                                 |
| Request edited after Finance has seen it              | TC-VP-011       | D      | Approval invalidated by `subject_hash`; resubmitted                                       |
| Vendor paid in USD at a different rate on payment day | TC-VP-012       | U      | FX difference posted (BR-VP-015)                                                          |
| The same invoice entered twice                        | TC-VP-013       | U D    | Duplicate bill warning blocks submit until acknowledged                                   |
| Vendor payment cancelled after Paid                   | TC-VP-014       | D      | Reversing entry, no deletion                                                              |
| Client invoice paid in two instalments or overpaid    | TC-SAL-010      | U D    | Balance and ageing right after each; overpayment to credit                                |
| Requester is the only Admin available                 | TC-APR-012      | D      | Request waits or uses delegation; never self-approved                                     |
| Spending split into small requests                    | TC-VP-015       | U P    | Flagged and routed to an Admin (BRULE-061)                                                |

### 3.6 Non-functional requirements

| NFR group            | How it is tested                                                                                                                                              | Gate                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| NFR-SEC-001 to 025   | Section 2.9; MFA and AAL in DB tests; headers in e2e; ZAP; backups by the restore drill                                                                       | Per PR, pre-release  |
| NFR-PRIV-001 to 017  | Consent, notice and retention as DB tests; erasure path tested on synthetic people including files and exports; DSR workflow in UAT                           | Per PR, G1, G5       |
| NFR-AUD-001 to 012   | Redaction, read logging, system actors, hash chain verify action, append-only evidence, rule versions on runs                                                 | Per PR               |
| NFR-PERF-001 to 004  | Section 2.8                                                                                                                                                   | Nightly, pre-release |
| NFR-AVAIL-001 to 004 | Offline POS (2.7); restore drill; uptime from monitoring after go-live (`24-devops-plan.md`)                                                                  | Nightly, quarterly   |
| NFR-MOB-001 to 003   | Pixel 7 and 360 px projects; touch-target size check in component tests; camera permission only on scan pages                                                 | Per PR               |
| NFR-A11Y-001 to 003  | axe, contrast unit test, manual TalkBack                                                                                                                      | Per PR, release      |
| NFR-I18N-001 to 004  | Lint rule: no string literals in new module UI; formatting module unit tests per locale; Sinhala and Tamil PDFs (visual)                                      | Per PR               |
| NFR-SCALE-001 to 005 | Meta-test: every business table has `entity_id` and `tenant_id`; cross-entity and cross-tenant RLS tests; adapter contract tests                              | Per PR               |
| NFR-COST-003         | Timed UAT task: Finance loads a new rate version and reruns a draft                                                                                           | UAT                  |
| NFR-DATA-001 to 004  | Retention job on synthetic data; NIC, TIN and phone validators; export of all entity data; meta-test that no money column is float or `numeric` without scale | Per PR               |

---

## 4. Test data strategy

### 4.1 Rules

1. **Synthetic only outside production** (NFR-SEC-020, `15-compliance-security.md` §5.6). No real NIC, bank account, salary, phone number, face or voice in any test file, fixture, screenshot, staging database or issue.
2. **Format-valid but impossible identifiers.** Synthetic NICs pass the format check but cannot belong to a real person. Proposal: new-format NICs use a day-of-year field between 367 and 499, which no real birth date produces; old-format NICs use the same idea. The NIC validator checks format only (NFR-DATA-002), so tests still exercise it (QQ-09). Bank accounts use a bank code that a seed-time check confirms is not on the LankaClear member list. Emails use `example.test`. Phone numbers are never messaged, because non-production messaging and email adapters write to a sink.
3. **Deterministic.** A seeded generator (`scripts/seed-synthetic.ts`, proposed) builds the same dataset from the same seed, so a failing e2e test can be replayed. It refuses to run against production (G-03, NFR-SEC-019).
4. **Names reflect AMPL's people, not real people.** Sinhala, Tamil and English names in all three scripts, so search, sorting and PDFs are tested with real shaping (NFR-I18N-002).

### 4.2 The synthetic "AMPL month" (November 2026)

One dataset serves the flows e2e tier, staging, UAT and load tests (scaled up for load).

| Area             | Synthetic content                                                                                                                                       | Edge cases built in                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Tenancy          | Tenant "AMPL" with entity AMPL Sri Lanka (LKR) and entity "SG test" (SGD); a second tenant "Other Studio"                                               | Cross-entity and cross-tenant RLS checks                                                                                      |
| People           | 18 employees on the three seeded contract types, 2 retainer contractors, 3 Admins, 1 HR, 1 Finance, 2 producers, 1 front-desk cashier, 1 POS supervisor | 1 mid-month joiner, 1 leaver, 1 contract change, 1 probation ending mid-month, 1 net-pay contract, 1 Admin in the payroll run |
| Attendance       | About 1,500 punches as `attlog.dat`, CSV and XLSX                                                                                                       | Single punch, multiple punches, after-midnight punch, reassigned device ID, two similar names, an edited duplicate row        |
| Leave            | Requests in every status, including a range across the month's Poya day and a cancellation after approval                                               | Probation block, team-off threshold                                                                                           |
| Holidays         | The month's public and Poya holidays from a fixture calendar, plus one ad hoc closure                                                                   | Leave and payroll recalculation                                                                                               |
| Freelancers      | 40 talent records: vocalists, musicians, editors, AI artists, videographers; 1 non-resident; 1 minor with a guardian                                    | 3 payees cross the WHT threshold, 1 crosses it mid-month (TC-VP-003)                                                          |
| Projects         | **15 AI-hybrid music videos** (Sinhala and Tamil) at different stages, 3 photo shoots, 2 ads, 2 SMM retainers                                           | One over budget, one with round 3 billable, one blocked at publish for a missing consent                                      |
| Studio           | 4 rooms, 30 equipment items in 4 kits, about 60 bookings                                                                                                | Conflict attempts, holds that expire, no-show, cancellations at each notice tier, late gear return, damage                    |
| POS              | About 300 sales over 20 shifts: cash, card, LankaQR, PayHere link, split payments, deposits applied, 3 refunds, 1 void                                  | One offline batch, one shift with a variance over tolerance                                                                   |
| Vendor payments  | About 80 requests: below, at and above LKR 15,000, partial payments, one USD vendor, one bank-detail change                                             | A split-request pattern, a duplicate bill, a payment cancelled after Paid                                                     |
| AI subscriptions | Higgsfield, Suno, ClickUp, Claude and GPU rental, billed in USD, with CBSL-style daily rates and bank-debited LKR amounts                               | Unused credits; a renewal on a Poya day                                                                                       |
| Finance          | Client invoices and receipts in LKR and USD, a deposit register, recurring expenses, a VAT-registered and a non-registered buyer                        | Overpayment, instalments, FX gain and loss                                                                                    |

Amounts are realistic for AMPL's size (for example the J-07 card: 18 people, net about LKR 2.14m) but invented. Prices for studio and gear use AMPL's own rate card once the owner supplies it; until then they are placeholders marked as such.

### 4.3 Golden spreadsheets maintained by Finance

| Golden set              | Owner                              | Content                                                                                                                          | Review                                                                             |
| ----------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `GOLD-PAY-001` to `010` | Janaka, with inputs from Abilasini | One sheet per scenario: three contract types, joiner, leaver, change, net contract, absence, overtime, gratuity, APIT band edges | The accountant signs statutory columns; re-signed when a rule data version changes |
| `GOLD-PAY-007`          | Janaka                             | Statutory outputs (EPF Form C data, ETF return, APIT schedule) for the synthetic month                                           | Accountant                                                                         |
| `GOLD-LV-001` to `003`  | Abilasini                          | Leave balances for three contract types across a year with a mid-year joiner (PLAN Phase 4 done-when)                            | HR and an Admin                                                                    |
| `GOLD-FIN-001`          | Janaka                             | P&L for the synthetic November by category, brand and entity (PLAN Phase 6 done-when)                                            | Accountant                                                                         |
| `GOLD-FIN-002`          | Janaka                             | Deposit register and its ledger balance                                                                                          | Janaka                                                                             |
| `GOLD-FIN-003`          | Janaka                             | WHT schedule and certificates for the month                                                                                      | Accountant                                                                         |
| `GOLD-FIN-004`          | Janaka, with a producer            | Profitability of the 15 music videos, including AI allocation and FX                                                             | Janaka and an Admin                                                                |
| `GOLD-SAL-001`          | Janaka                             | VAT and SSCL threshold turnover over 12 months                                                                                   | Accountant                                                                         |

Spreadsheets hold only synthetic people, so they can live in the repository. Each has a README naming the rule data versions it assumes. A converter script exports `input.json` and `expected.csv`; CI checks that the exported files match the spreadsheet so they cannot drift.

---

## 5. Environments and quality gates

### 5.1 Environments

Hosting, projects and cost are the DevOps lead's call in `docs/discovery/24-devops-plan.md`. From a test point of view we need:

| Environment    | Data                                                                                            | Used for                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Local          | Demo mode, or a local Supabase stack with the synthetic seed                                    | Development; `npm run check`, `npm run test:db`, `npm run test:e2e`                              |
| CI (ephemeral) | Postgres 16 service (unit and DB); local Supabase stack (flows e2e)                             | Every PR and every push to `main`                                                                |
| Preview        | Vercel preview per PR plus a shared preview Supabase project, synthetic                         | Manual review, nightly ZAP baseline                                                              |
| Staging        | Separate Supabase project in Singapore (NFR-SEC-020), the synthetic AMPL month, PayHere sandbox | Pre-release regression, k6, ZAP, golden suite, UAT, adapter contract tests against sandboxes     |
| Production     | Real data                                                                                       | Read-only smoke tests after deploy (no test records written); payroll parallel run (section 6.3) |

### 5.2 Pipeline

```text
per PR (target ≤ 15 min, parallel jobs)              nightly on main                         pre-release (staging)               release (production)
───────────────────────────────────────             ───────────────────────                 ─────────────────────               ────────────────────
lint · typecheck · format                            full e2e: desktop, Pixel 7, tablet      full regression + golden suite       backup / PITR checkpoint
unit + property (fixed seed), TZ=UTC                 property tests, random seed, 10k runs   k6 load to NFR thresholds            migrations applied by pipeline
unit + property (fixed seed), TZ=Asia/Colombo        mutation tests (StrykerJS)              ZAP baseline on staging              post-deploy smoke (read-only)
coverage thresholds on lib/rules and lib/kernel      visual regression (full)                adapter contracts vs sandboxes       watch alerts for 24 h
DB: RLS matrix, meta-tests, migration round trip     offline POS soak (500 sales)            manual device script (POS tablet)    release notes, user guide
API and route matrix                                 ZAP baseline on preview                 manual a11y pass (TalkBack)
build                                                k6 smoke on staging                     exploratory session per module
e2e smoke (demo) + e2e flows (sharded) + axe         dependency scan                         UAT sign-off (section 6)
gitleaks · npm audit (high) · CodeQL                 trace report                            release readiness checklist (7.3)
trace report (report-only until scope is fixed)
```

### 5.3 Quality gates

| Gate        | Check                                                                                                                                                                                | When                                   | Blocks merge or release? |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------------------ |
| QG-01 to 12 | Section 1.1 goals                                                                                                                                                                    | Per row                                | Yes for release          |
| QG-13       | Every Must BR in the release scope has at least one passing tagged test (trace report)                                                                                               | Per PR (after scope is fixed), release | Yes                      |
| QG-14       | Coverage on `lib/rules/**`: 95% lines and 90% branches; `lib/kernel/**`: 90% and 85%; `lib/auth/**`: 100% of the matrix cells. No global threshold (it rewards testing trivial code) | Per PR                                 | Yes                      |
| QG-15       | Mutation score ≥ 80% on `lib/rules/pay`, `vp`, `sal`, `fin`, `pos`                                                                                                                   | Nightly; release                       | Release only             |
| QG-16       | Migration round trip passes for every migration; every migration has its rollback; meta-tests pass                                                                                   | Per PR                                 | Yes                      |
| QG-17       | Golden suite passes with the Finance-signed data versions                                                                                                                            | Per PR (fast), release                 | Yes                      |
| QG-18       | Zero axe critical or serious issues on touched pages (all pages at release)                                                                                                          | Per PR, release                        | Yes                      |
| QG-19       | No `npm audit` high or critical without a recorded exception; no unaccepted ZAP High or Medium                                                                                       | Per PR, nightly, release               | Yes                      |
| QG-20       | Visual snapshot changes reviewed and accepted                                                                                                                                        | Per PR                                 | Yes                      |
| QG-21       | Performance thresholds in section 2.8                                                                                                                                                | Pre-release                            | Yes                      |
| QG-22       | No open S1 or S2 defect in scope                                                                                                                                                     | Release                                | Yes                      |

**Required status checks on `main`** (branch protection, NFR-SEC-018): `lint`, `typecheck`, `format`, `unit-utc`, `unit-colombo`, `coverage`, `db`, `api`, `build`, `e2e-smoke`, `e2e-flows`, `secret-scan`, `deps`, `codeql`. One approving review. **CODEOWNERS** on `lib/rules/pay/**`, `lib/rules/vp/**`, `lib/rules/sal/**`, `tests/golden/**`, `supabase/migrations/**`, `supabase/rollbacks/**` and `lib/auth/**`.

**Flaky tests.** Playwright retries once in CI today (`playwright.config.ts`). That hides flakiness, so the CI job reports every test that passed only on retry. A flaky test is fixed or quarantined (tagged, still run, not blocking) within 5 working days, with an issue. A quarantined test on a money or access path blocks the next release.

**Clock and time zone.** Rules take `asOf` as an argument and never read the system clock. Database functions read time through one `app.now()` function that the test harness can pin. The unit suite runs twice, in `TZ=UTC` (what Vercel uses) and `TZ=Asia/Colombo` (what CI uses today), and both must pass.

---

## 6. UAT, parallel run and cutover

### 6.1 UAT approach

UAT runs on staging with the synthetic AMPL month, before each release that reaches real users. Staff do the tasks on their own phones and on the counter tablet, timed against the targets in `13-ux-design.md` §8.2. The QA Lead writes the scripts; each role owner signs off. Schedule sessions away from month end, when HR and Finance are busiest (RQ-09).

| Role and people                                   | UAT scripts (journeys)                                                                                                                                                                                                                        | Sign-off owner  |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| HR and Ops: **Abilasini**                         | J-06 import of a synthetic file in the real device format; exceptions follow-up; contract type create, assign and change from a date; leave HR step (J-09 from the HR side); J-07 payroll draft, adjustment, submit                           | Abilasini       |
| Finance: **Janaka**                               | J-07 Finance step (bank list, mark paid); J-04 pay a freelancer with WHT and issue the certificate; J-10 shift reconciliation; month close checklist; P&L against `GOLD-FIN-001`; accountant export; NFR-COST-003 rate change in under 1 hour | Janaka          |
| Admins: **Thoshan, Fazlur, Gurpreet**             | J-08 morning inbox; approve above-limit payment; payroll approval with an Admin's own line routed to another Admin; second-Admin role grant; period reopen; delegation while away                                                             | Thoshan (owner) |
| Producers: **Chathurika** and one other           | J-03 quote to job; J-04 engagement; J-05 send a cut for review and record the approval; publish checklist blocking on a missing consent                                                                                                       | Chathurika      |
| Front desk (whoever runs the counter)             | J-01 walk-in sale, J-02 booking with deposit and gear check-out and check-in, J-10 shift close, offline sale in airplane mode, refund with a supervisor                                                                                       | Front-desk lead |
| Employees (3, one Sinhala-first, one Tamil-first) | J-09 leave on their phone; manual attendance request; view own payslip                                                                                                                                                                        | HR              |
| Freelancers and clients (2 to 3 friendly)         | Token pages: quote acceptance and cut approval; WHT note understood                                                                                                                                                                           | Producer        |

**Entry criteria:** release scope feature-complete; all per-PR and nightly gates green; no open S1 or S2; staging loaded with the synthetic month; scripts and a 30-minute walkthrough per role done.

**Exit criteria:** every script passed or its deviation accepted by the sign-off owner; zero open S1 or S2; at most 5 open S3, each with a workaround; task-time targets met by most participants (the UX targets in `13-ux-design.md` §8.2); SUS of 70 or more after the first live month (round R5).

### 6.2 Cutover by module

| Module           | Strategy                                                                          | Acceptance to switch off the old way                                                                               |
| ---------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Attendance       | Two weekly imports in parallel with HR's spreadsheet                              | Same exceptions list both ways; differences explained                                                              |
| Leave            | Opening balances imported (BR-ADM-008); new requests in ChordusAM from a set date | Every employee confirms their opening balance; Abilasini signs the balance report                                  |
| Vendor payments  | New requests in ChordusAM from a set date; open old requests finish the old way   | Two weeks with no request outside ChordusAM; numbering starts at 0001 for the year or continues per the accountant |
| Finance (P&L)    | One month close in parallel with the current spreadsheet P&L                      | Totals by category agree, or each difference is explained and signed by Janaka                                     |
| POS and bookings | A pilot week at the counter, Finance reconciling every shift the same day         | Every shift variance explained; zero lost offline sales; the front desk prefers it to paper                        |
| Payroll          | Two months of parallel run (6.3)                                                  | Section 6.3 exit criteria                                                                                          |

### 6.3 Payroll parallel run

Payroll is the highest-trust process, and the one place the usability research expects people to fall back to the spreadsheet (UR-10). So ChordusAM runs beside the spreadsheet for **two consecutive months** before it becomes the system of record.

**How it works.**

1. The spreadsheet stays the system of record and pays people as today.
2. In **production** (the only place real pay data may live), HR runs the same month in ChordusAM from the same attendance, leave and contract data. The run is marked as a parallel run: no payslips are released, nothing is posted to the ledger, and the run is closed without being paid. The product needs this mode (QQ-06).
3. A comparison report, per employee and per component, lists gross, each earning, absence and unpaid-leave deductions, EPF 8% and 12%, ETF 3%, APIT, other deductions, net, employer cost, and the statutory totals and bank list totals. The report stays inside ChordusAM (Restricted tier), never in email, GitHub or WhatsApp.
4. Every difference is classified: **ChordusAM defect**, **spreadsheet error**, **policy decision needed**, or **data entry difference**. Defects are fixed with a regression test and a new golden case. Spreadsheet errors are reported to Janaka. Policy decisions go to the owner.
5. If the business case's Option E is chosen (`14-business-case.md` §2.6, ADR-17, OQ-42), the parallel run compares three things: the spreadsheet, the payroll provider's results, and ChordusAM's exported inputs (days worked, leave, overtime, adjustments). The provider journal import must reconcile headcount and gross.

**Month choice.** At least one of the two months should naturally include a joiner, a leaver or a contract change. If neither does, the golden cases cover those scenarios and the owner accepts that. Avoid making April (the start of the tax year and a likely new APIT table) the first parallel month unless the new table version is loaded and signed.

**Exit criteria (all must be true).**

| #   | Criterion                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Two consecutive months with **zero unexplained differences**; every statutory figure (EPF, ETF, APIT) equal to the cent, or the difference traced to a spreadsheet error |
| 2   | Statutory outputs (EPF Form C data, ETF return data, APIT schedule) total to the run and are accepted by the accountant                                                  |
| 3   | Abilasini can explain three randomly chosen lines from the "how this was calculated" view without the spreadsheet                                                        |
| 4   | Admin approval and Finance "mark paid" flows done in the parallel month, including an Admin's own line routed to another Admin                                           |
| 5   | PITR on and a restore drill passed (gate G4, NFR-SEC-016)                                                                                                                |
| 6   | Owner signs the cutover; the spreadsheet is kept as a checker for one more month                                                                                         |

### 6.4 Cutover acceptance (go-live of a release)

- Opening data imported with the validation preview and reconciled: employees, contracts, leave balances, vendors, clients, open invoices, deposits held and assets (BR-ADM-008). Each reconciliation report signed by its owner.
- Users created by an Admin, roles and grants checked against an access list the owner approved; MFA enrolled for Admin, HR and Finance (NFR-SEC-001).
- Privacy notices published and acknowledged (BR-ADM-010, gate G1).
- Rollback plan written: application rollback on Vercel, and for the database either a tested down migration or a written forward-fix plan with a backup taken minutes before.
- Support for the first two weeks: a named person each day, a WhatsApp-free route for reporting issues (an in-app "report a problem" form or a GitHub issue raised by the support person, without personal data).

---

## 7. Defect management and release readiness

### 7.1 Severity

| Severity        | Definition (AMPL examples)                                                                                                                                                                                                                                                                                                                             | Response                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **S1 Critical** | A wrong money or statutory figure that was or would be paid, filed or posted (payroll line, EPF, APIT, WHT, tax invoice, ledger); data visible to the wrong role, entity or tenant; Restricted data in logs or notifications; a lost or duplicated sale, punch or payment; self-approval possible; the till cannot sell; system down in business hours | Triage within 4 business hours; fix or roll back within 1 business day; blocks release; root-cause note and regression test |
| **S2 Major**    | A core journey blocked with no workaround; a wrong figure in a report used for decisions (not paid or filed); an axe critical or serious issue on a core task; offline sync stalls without loss; a gap in document numbering that is not explained                                                                                                     | Fix in the current release; blocks release                                                                                  |
| **S3 Minor**    | Wrong behaviour with a reasonable workaround; a confusing message; an axe moderate issue                                                                                                                                                                                                                                                               | Planned in the backlog; at most 5 open at release                                                                           |
| **S4 Trivial**  | Cosmetic: alignment, wording, spacing                                                                                                                                                                                                                                                                                                                  | When convenient                                                                                                             |

**Money rule.** Any defect in a money or statutory calculation is at least S2, whatever the amount. A one-rupee rounding error repeated across 18 payslips and 12 months is still a wrong statutory return. It becomes S1 once it reaches a payment, a filing or the ledger.

### 7.2 Workflow

- Defects are GitHub issues with labels `sev:1` to `sev:4`, `area:<module code>`, `found-in:<environment>`, and the BR or BRULE ID in the body.
- The issue template warns: **no real names, NICs, salaries, bank details or screenshots of real data.** Use the synthetic employee code or the record ID only.
- Triage twice a week by the QA Lead and Tech Lead; S1 triage immediately.
- Closing an S1 or S2 needs a linked regression test; money defects also need a golden case.
- Metrics per release: escaped defects (found in production), reopen rate, time to fix S1, flaky test count, mutation score trend.

### 7.3 Release readiness checklist

- [ ] All required checks green on the release commit; nightly suite green for the last 3 nights.
- [ ] Trace report: every Must BR in scope has a passing test (QG-13).
- [ ] Golden suite green with the current Finance-signed data versions; any changed rule re-signed.
- [ ] Statutory and tax data versions checked by the accountant (APIT table year, WHT scope, VAT and SSCL rates, minimum wage).
- [ ] Migrations: round trip passes; applied to staging from a copy of the production schema; rollbacks present; destructive-rollback guard on (G-08).
- [ ] Backup taken; PITR on from the payroll release (G4); restore drill done within the quarter.
- [ ] Security: ZAP baseline clean or accepted; `npm audit` clean; CodeQL clean; headers checked; pen test done before the first POS or PayHere release.
- [ ] Accessibility: axe clean on all MVP pages; manual TalkBack pass on J-09 and J-05.
- [ ] Visual snapshots reviewed; receipts and payslips checked on the real printer and in Sinhala and Tamil.
- [ ] Performance thresholds met on staging.
- [ ] UAT signed by each role owner; for payroll, the parallel-run exit criteria met.
- [ ] SEC gate items for this release (G0 to G7) ticked in `15-compliance-security.md` §8.1.
- [ ] No open S1 or S2; S3 list agreed.
- [ ] Release notes and the one-page role guides updated; staff told what changes and when.
- [ ] Rollback plan and on-duty person for the first two weeks named.

---

## 8. Risks and open questions

### 8.1 Risks

| ID    | Risk                                                                                                                        | Likelihood | Impact | Mitigation                                                                                                                                          |
| ----- | --------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| RQ-01 | **Golden spreadsheets are wrong or stale**, so tests confirm a wrong answer                                                 | Medium     | High   | Two owners (Finance builds, accountant signs statutory columns); version control; re-sign on every rule data change; parallel run as a second check |
| RQ-02 | **Statutory values are unverified** (APIT 2026/27, WHT for non-residents and rent, SSCL share, stamp duty, gratuity detail) | High       | High   | Tests assert signed data versions; accountant sign-off gate before each payroll or tax release; TR-08                                               |
| RQ-03 | **Demo-mode e2e gives false confidence** about journeys and RLS                                                             | High       | High   | Flows tier on a local Supabase stack before Phase 1 ships; demo tier kept for smoke only                                                            |
| RQ-04 | **The test stub diverges from real Supabase** (Auth claims, AAL, Storage policies, pooler behaviour)                        | Medium     | High   | Run the DB suite against a Supabase staging branch before release and in the restore drill; SPK-01, SPK-09; G-19                                    |
| RQ-05 | **Offline POS behaves differently on the real tablet** (storage eviction, printer, camera)                                  | Medium     | High   | Manual device script per POS release; SPK-03, SPK-04                                                                                                |
| RQ-06 | **Suite gets slow or flaky** and the team stops trusting it                                                                 | Medium     | Medium | Pyramid budget per layer; parallel CI jobs and sharding; flake policy; e2e only for journeys                                                        |
| RQ-07 | **Time-zone bugs** hidden because CI runs in Colombo time and production in UTC                                             | High       | High   | Run unit tests in both zones; `asOf` arguments; `app.now()`; `[)` ranges                                                                            |
| RQ-08 | **Real pay data leaks into test material** during the parallel run                                                          | Medium     | High   | Comparison only inside production ChordusAM; issue template rule; synthetic-only fixtures                                                           |
| RQ-09 | **UAT people are not available** (HR and Finance are busiest at month end)                                                  | High       | Medium | Book UAT mid-month; keep scripts under 45 minutes; record sessions only with consent                                                                |
| RQ-10 | **Scope is large** (160 Must requirements, about 120 tables per TR-10), so test effort is large                             | High       | Medium | Generated RLS matrices; risk tiers; test the kernel once and reuse it (money, numbering, approvals, posting)                                        |
| RQ-11 | **Sinhala and Tamil rendering** varies across fonts and engines, making visual tests noisy                                  | Medium     | Low    | Pinned Docker image and self-hosted fonts; text-extraction checks per PR, image checks nightly                                                      |

### 8.2 Open questions

| ID    | Question                                                                                                                                                                                    | For                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| QQ-01 | **Rounding rules.** Are payslip figures, receipts and cash rounded to the cent or the whole rupee? Is VAT rounded per line or per invoice? Which rounding mode? (TC-PAY-002, TC-POS-001)    | Janaka, accountant |
| QQ-02 | Which CBSL rate applies on weekends and Poya days when none is published: the last published rate, or block the entry? (TC-FX-002)                                                          | Janaka, accountant |
| QQ-03 | Who supplies the official IRD APIT tables and worked examples for 2026/27, and who signs each statutory data version?                                                                       | Accountant         |
| QQ-04 | **WHT when the threshold is crossed mid-month:** is the 5% due on the whole month's total from the payment that crosses it (catch-up), or only on later payments? (TC-VP-003)               | Accountant         |
| QQ-05 | How much time can Janaka and Abilasini give to building and maintaining golden spreadsheets (estimate: 2 to 3 days at first, then about half a day per rule change)? (estimate, unverified) | Owner              |
| QQ-06 | Can the product support a **parallel payroll run** that never releases payslips or posts to the ledger? This is a design request to the SA and Tech Lead                                    | SA, Tech Lead      |
| QQ-07 | Payroll mode at go-live: internal engine or provider (Option E, OQ-42)? It changes what the parallel run compares                                                                           | Owner              |
| QQ-08 | Can the Supabase CLI stack run inside GitHub Actions within the 15-minute PR budget, or do we need a dedicated CI Supabase project?                                                         | Tech Lead, DevOps  |
| QQ-09 | Is the "impossible day-of-year" convention for synthetic NICs acceptable, or should the validator recognise a test-only marker?                                                             | SEC, Tech Lead     |
| QQ-10 | Which counter tablet and receipt printer will AMPL use (OQ-49)? The device test script depends on it                                                                                        | Owner              |
| QQ-11 | Is there budget for a light external pen test before POS and PayHere go live (`15-compliance-security.md` §8.4 question 9)?                                                                 | Owner, CFO         |
| QQ-12 | Is grace time inclusive (a first punch at exactly start + 15 minutes is on time)? (BRULE-014)                                                                                               | Abilasini          |
| QQ-13 | Mid-month joiner leave accrual: full month, half month or none for the joining month? (TC-LV-003)                                                                                           | Abilasini, owner   |
