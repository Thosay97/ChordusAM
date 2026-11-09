# 22a: Foundation feasibility spike (tenancy, permissions, numbering, money, approvals, outbox, RLS performance)

**Date:** 9 November 2026. **Author:** Developer, discovery team. **Status:** spike done; nothing in `app/`, `lib/`, `supabase/` or `tests/` was changed.

**Summary.** We built draft versions of the six foundation migrations in `docs/discovery/20-solution-design.md` §10.3 and ran them against a local PostgreSQL 16.15. They sit on top of the Phase 0 migration and the `tests/db/supabase-stub.sql` stub. Five of the six items work as designed. The sixth, RLS performance, works only with a policy form that differs from the one in §7.3. **Phase 0's 18 RLS tests pass unchanged on the new permission model.** Numbering stayed gapless with 20 concurrent connections. The approval engine blocked self-approval and double decisions under a race. The outbox lost no event and sent no duplicate side effect when workers crashed. The spike found four things the design must change: (1) **the RLS helper pattern in §7.3 is per-row, and 50 times slower** than a per-statement array form; (2) the tenant helper must not filter on `active`; (3) the any-one partial unique index in §6.4 breaks n-of-m steps; (4) number assignment must happen in a trigger at issue time, and nothing exposed to users may call it. **Money: keep ADR-15 (`bigint` minor units).**

## 1. Verdicts

| #   | Item                                                                      | Verdict                | One-line reason                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| a   | `tenant_id` + `entity_id`, per-entity permissions, `has_role()` kept      | **Works with caveats** | Phase 0 suite 18/18 green. Cross-entity, cross-tenant, composite-FK and immediate-revocation checks pass. Needs a sync trigger from `profiles.role`, a tenant helper without `active`, and a chained rollback test |
| b   | Gapless numbering per entity, type and fiscal year under concurrency      | **Works with caveats** | 20 connections, 2,000 attempts, 20% rollbacks: 1,610 numbers, 0 gaps, 0 duplicates. A transaction holding a number blocks its counter until commit                                                                 |
| c   | Money: `bigint` minor units vs `numeric(18,4)`                            | **Works (bigint)**     | Exact and smaller (84 vs 99 MB per 2M rows). Sums are 2.5 times faster (35 vs 88 ms). Document lines always add up. `numeric(18,4)` gave a total 0.01 off its lines                                                |
| d   | Approval engine: no self-approval, any one of a group, limits, delegation | **Works**              | Every rule held, including a direct insert that bypassed the function. 50/50 races produced exactly one decision, with or without a row lock                                                                       |
| e   | Transactional outbox + `FOR UPDATE SKIP LOCKED` claim                     | **Works with caveats** | 10,000 business transactions, 8 workers, 2 simulated crashes: every committed event processed exactly once, 0 events from rollbacks. pgmq itself was not tested (not installed locally)                            |
| f   | RLS performance at 200k rows                                              | **Works with caveats** | With the array form: 7 ms list and 28 ms count. With the §7.3 form: 159 ms list and 1,494 ms count                                                                                                                 |

## 2. Set-up

| Item         | Value                                                                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server       | PostgreSQL 16.15, local, 4 vCPU, 16 GB. Databases `chordus_spike` and `chordus_spike_p0`, dropped at the end                                                                                          |
| Applied      | `supabase-stub.sql` → Phase 0 migration → `02_tenancy_access.sql` → `03_numbering.sql` → `04_money.sql` → `05_approvals.sql` → `06_outbox.sql` (scratch files, excerpts in the appendix)              |
| Seed         | Tenant A (AMPL) with entities LK (fiscal year starts 1 April) and SG (starts 1 January). Tenant B with one entity. Users: two Admins, Finance LK, Finance SG, HR and an employee in A; one Admin in B |
| Concurrency  | Node 22 scripts using the repo's `pg` 8.23.1. Each transaction follows the `withUserTx` shape: `begin; set local role authenticated; set_config('request.jwt.claims', …, true)`                       |
| Not in scope | Supavisor (SPK-01), pgmq, `pg_cron` and `pg_net` (SPK-10), PostgREST itself, `aal2` (SPK-09)                                                                                                          |

## 3. Results per item

### 3a. Tenancy and per-entity permissions

**Pattern that worked.** Grants (`user_entity_roles`) are flattened by triggers into `user_effective_permissions (user_id, entity_id, permission)`. Phase 0's `has_role()` keeps its source unchanged. Only `current_app_role()` changed: it now reads the user's **primary grant**. A trigger on `profiles` rewrites that grant whenever `profiles.role` or `primary_entity_id` changes. That trigger is the reason Phase 0 code and tests, which still write `profiles.role`, keep working.

Measured:

| Check                                                                 | Result                                                                                                                |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Phase 0 `tests/db/rls.test.ts`, run as-is on Phase 0 + draft          | **18/18 pass**, after two fixes (below)                                                                               |
| Rows visible to adminA / finLK / finSG / empA / adminB                | LK+SG / LK / SG / own LK rows / tenant B only                                                                         |
| Employee inserts in an entity without a grant; or spoofs tenant B     | Rejected by RLS `with check`                                                                                          |
| Employee links a tenant-B party by its UUID                           | Rejected by the composite FK `(tenant_id, payee_party_id)`. **The control, a single-column FK, accepted it silently** |
| Changing `tenant_id` on a row (even as owner)                         | Rejected by the immutability trigger                                                                                  |
| Finance demoted to employee, then queries again in the same session   | Sees 0 rows straight away (no JWT staleness)                                                                          |
| Audit redaction through trigger arguments (`audit_row_change('nic')`) | `{"redacted": true, "changed": true}` stored; the raw NIC never reaches `audit_log` (G-01)                            |

**Problems found.**

1. **The tenant helper must not check `active`.** At first, `app.current_tenant_id()` filtered on `p.active`. The restrictive tenant policy then hid an inactive user's own profile, which failed Phase 0's "inactive users lose their role" test. Tenant scope is not a privilege. `has_perm()` and `current_app_role()` check `active`; the tenant helper must not.
2. **The rollback test breaks once a second migration exists.** The Phase 0 down script fails with `cannot drop table profiles because other objects depend on it`. The harness must run every down script in reverse order. With `02…down.sql` first, the round trip passes.
3. **Claims set at session level leak.** One test helper set `request.jwt.claims` with `is_local = false`. After `reset role`, the owner connection still had `auth.uid()` = the employee, and Phase 0's guard refused an owner update because of it. On a pooled connection this is exactly the SPK-01 risk. `withUserTx` must only ever use `set_config(…, true)`, and SPK-01 should test for this leak.
4. **`= any ((select f()))` is a syntax trap.** Postgres reads it as the subquery form of `ANY` and fails with `uuid = uuid[]`. Write `= any ((select app.perm_entities('x'))::uuid[])`.
5. **New sign-ups need a tenant.** `handle_new_user()` runs as the service role, where `auth.uid()` is null, so the default from `current_tenant_id()` is null. The spike falls back to the default tenant. The real version should take the tenant from `raw_app_meta_data`, which only the service role can write, and record that choice next to CLAUDE.md's rule against trusting auth metadata.

### 3b. Gapless numbering

**Pattern that worked:** a counter row per `(entity, doc_type, fiscal_year)`, updated through `insert … on conflict do update set next_value = next_value + 1 returning`. It is called **only from a `BEFORE INSERT OR UPDATE` trigger** that numbers a document when its status becomes `issued`. `app.next_number()` has `EXECUTE` revoked from `authenticated`. Delete and renumber triggers block changes to issued documents (voids only).

| Test                                                                                   | Result                                                                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 20 connections × 100 issues, random 20% rollback, dates on both fiscal-year boundaries | 1,604 committed + 396 rolled back; **0 errors, 0 gaps, 0 duplicates** across 4 counters    |
| Throughput and latency (whole transaction)                                             | 892 commits/s; p50 6.8 ms, p95 63.9 ms, max 239 ms                                         |
| First number of a new year, created by 20 connections at once                          | `on conflict` handled the race: one row, no error                                          |
| Fiscal year                                                                            | LK 31 March 2027 → `LK-PV-2026-0001`; 1 April 2027 → FY 2027. SG follows the calendar year |
| A transaction holds the counter for 2 s                                                | 4 other LK issues waited 2,005 to 2,012 ms; an SG issue waited 6 ms                        |
| `authenticated` calls `app.next_number()`                                              | `permission denied`                                                                        |
| Delete or renumber an issued voucher                                                   | Rejected                                                                                   |
| Offline device blocks from the same counter                                            | `[1,51)` and `[51,101)` for two devices                                                    |

**Caveats.** (1) A number locks its counter until commit. Number the document **last** in the command transaction, and never number it while an external call is in flight. At AMPL's volumes this is fine. (2) If any user-callable path could take a number and commit without a row, it would leave a gap. That is why numbering lives in a trigger and the function is not exposed. (3) A command that numbers two document types must lock them in a fixed order (alphabetical by doc type), or two such commands can deadlock. This was not tested.

### 3c. Money type

Worked examples. The FX rates are illustrative, and **the APIT bands are illustrative, not the IRD table**; the real table must be loaded as data.

| Example                                    | Result                                                                                                                                                                                                                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Three USD 10.00 lines at 299.4563 LKR/USD  | `numeric(18,4)`: the lines show 2,994.56 × 3 = **8,983.68**, but the stored total shows **8,983.69**. `bigint` rounded per line: lines and total both 8,983.68. The 0.01 difference from converting the USD total once belongs in an explicit FX-rounding line             |
| EPF/ETF on gross LKR 123,456.78            | Exact 9,876.5424 / 14,814.8136 / 3,703.7034 → 9,876.54 / 14,814.81 / 3,703.70. Rounding to the rupee would give 9,877 / 14,815 / 3,704                                                                                                                                     |
| ETF 3% on gross LKR 75,001.50              | Exact 2,250.045. **Half-up 2,250.05, half-even 2,250.04.** The rounding mode changes the result, so it must be policy data                                                                                                                                                 |
| Note on EPF                                | 8% and 12% of a whole number of cents can never end in exactly half a cent (8g ≡ 50 mod 100 has no integer solution); 3% can                                                                                                                                               |
| Progressive (APIT-style) on LKR 350,123.45 | Exact 28,029.7080 → 28,029.71. Rounding once and rounding per band agreed here, but the rule must still be fixed as data                                                                                                                                                   |
| USD 20.00 split over 3 projects            | Largest remainder: 6.67 + 6.67 + 6.66 = 20.00. Plain rounding gives 6.67 × 3 = 20.01                                                                                                                                                                                       |
| Rounding traps                             | `round(2.5::float8)` = 2 but `round(2.5::numeric)` = 3. JS `Math.round(-2.5)` = −2. `(1.005).toFixed(2)` = "1.00". `0.1 + 0.2` ≠ 0.3 in floats                                                                                                                             |
| Storage, 2M rows                           | `bigint` 84 MB (8.0 bytes/value); `numeric(18,4)` 99 MB (8.9)                                                                                                                                                                                                              |
| `sum()` over 2M rows (best of 3)           | `bigint` 34.8 ms; `numeric` 88.3 ms                                                                                                                                                                                                                                        |
| Over the wire                              | node-pg returns **both** `int8` and `numeric` as strings. `sum(bigint)` returns `numeric`. JSON (PostgREST) carries both as numbers: `14969.8404 * 100` = 1496984.0399999998 in JS, while minor units stay exact up to 2^53 (LKR 90 trillion). `JSON.stringify(1n)` throws |

**Decision: keep ADR-15 (b).** `<name>_minor bigint` + `currency char(3)`; rates as `numeric(20,10)`. Compute in exact `numeric` (in Postgres) or in integer/decimal maths (in TypeScript), then **round once, per line, with a named mode** (`half_up` by default, set per rule in policy data). Allocations use largest remainder. Cast sums back with `::bigint`. Add a `pg` type parser for `int8` and a Zod `Money` schema that rejects unsafe integers. Never use `Number()` on rates.

### 3d. Approval engine

The pattern was the tables from §6.2 plus `app.approval_submit()` and `app.approval_act()` (security definer, task row locked `FOR UPDATE`). A `BEFORE INSERT` guard trigger on `approval_actions` re-checks every rule, however the row arrives.

| Scenario (LK `vendor_payment`: ≤ LKR 15,000 none; up to 250,000 any one Admin; above that, 2 Admins) | Result                                                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Employee, LKR 10,000                                                                                 | Auto-approved, no task                                                                                                          |
| Admin approves their own LKR 50,000                                                                  | "Not an approver" (removed from candidates)                                                                                     |
| Owner inserts that approval directly, bypassing the function                                         | Guard trigger: "No self-approval"                                                                                               |
| Approver acts on a stale snapshot hash                                                               | "Subject changed since submission"                                                                                              |
| Second Admin approves an already-decided any-one task                                                | "Already decided"                                                                                                               |
| Admin raises LKR 300,000, and only one other Admin exists                                            | Submit refused: "Step 2 needs 2 approver(s) other than the requester; 1 eligible"                                               |
| 2-of-n step: the same Admin approves twice                                                           | Unique index "one decision per person"; a different Admin completes it                                                          |
| Delegate acts on behalf of the requester                                                             | Refused                                                                                                                         |
| HR "approves" a recommend-only leave step                                                            | Refused; `recommend` advances to the Admin step                                                                                 |
| Update an action; employee inserts an action                                                         | Append-only trigger; RLS default deny                                                                                           |
| **Race:** two Admins approve the same any-one task at once, 50 rounds                                | With `FOR UPDATE`: 50/50 one decision. **Without the lock**: still 50/50, caught by the `(task_id, decision_slot)` unique index |

**Design change.** §6.4's `unique (task_id) where action in ('approve','reject')` cannot express 2-of-n steps (the LKR 250,000 rule). Use a **`decision_slot`** instead: approvals take slots 1 to `quorum_n` and a reject takes slot 0, with `unique (task_id, decision_slot)`. Add `unique (task_id, coalesce(on_behalf_of, actor_id))` for one decision per person.

**Caveat.** The candidate check at submit time showed something the policy must handle: a two-Admin rule with only three Admins fails whenever an Admin raises the request and one other is away. The SLA or escalation step (§6.5), or a policy fallback, must cover it. Owner decision OQ-43.

### 3e. Outbox and worker claim

The spike used a plain table with pgmq's semantics, because pgmq and `pg_cron` are not installed locally. `app.emit()` inserts into `internal.domain_events` in the business transaction. A trigger fans each event out to `internal.queue` per subscription. `internal.read(consumer, vt, n)` claims messages through `update … where msg_id in (select … for update skip locked)` and sets a visibility timeout. The worker writes `consumer_inbox` (with `on conflict do nothing`), does its side effect, and deletes the message.

| Measure                                                                                       | Result                                                                                                        |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 10 producers × 1,000 transactions, 10% rolled back                                            | 9,037 committed; 9,037 events; **0 events from rollbacks**                                                    |
| 8 workers, 2 subscribers (`notify`, `search`)                                                 | Every event queued once per subscriber                                                                        |
| Worker 0 crashed after claiming 50 messages; worker 1 crashed after processing, before delete | Messages reappeared after the 2 s timeout; **9,037 side effects, 1 duplicate delivery absorbed by the inbox** |
| Time                                                                                          | Queue drained 50 ms after the last commit (produce 6.3 s, drain 6.3 s)                                        |

**Caveats.** (1) Delivery is at least once, so every consumer needs the inbox (or an idempotency key at the provider). (2) Parallel `SKIP LOCKED` workers **do not keep per-aggregate order**. Consumers that care (ledger sync, search projection) must compare `domain_events.seq` or the aggregate version, or use one worker per key. This was not measured; each aggregate in the test had a single event. (3) Claim in short transactions, never hold `FOR UPDATE` across an HTTP call, because Supavisor transaction mode and serverless time limits make long transactions fragile. (4) Dead-lettering after N reads is still to build (`dead_letter` table created, not exercised). (5) SPK-10 must still test the real pgmq, `pg_cron` and `pg_net`, and SPK-14 the CI image.

### 3f. RLS performance (200,000 `payment_requests`: A-LK 100k, A-SG 50k, B 50k; 10% `submitted`)

Indexes: `(tenant_id, entity_id, status, created_at desc)`, `(tenant_id, entity_id, created_at desc)`, `(requested_by, created_at desc)`. Each table has a restrictive tenant policy plus "own rows" and "read all in entity" permissive policies. Times are `EXPLAIN ANALYZE` execution times, best of 3.

| Policy form for "read all in entity"                                  | finLK Q1 list | finLK Q2 list + entity filter | finLK Q3 count | adminA Q1 | adminA Q3 |
| --------------------------------------------------------------------- | ------------: | ----------------------------: | -------------: | --------: | --------: |
| V1 `app.has_perm(entity_id, 'p')`                                     |        164 ms |                        1.6 ms |       1,394 ms |    136 ms |  1,642 ms |
| V2 `(select app.has_perm(entity_id, 'p'))` (§7.3 and 15 §4.2 pattern) |        159 ms |                        1.7 ms |       1,494 ms |    171 ms |  1,508 ms |
| **V3 `entity_id = any ((select app.perm_entities('p'))::uuid[])`**    |      **7 ms** |                    **1.1 ms** |      **28 ms** | **11 ms** | **35 ms** |
| Owner, no RLS (baseline, all 200k rows)                               |         11 ms |                             – |              – |         – |         – |

Q1 = 50 newest `submitted`, no entity filter. Q2 = the same with `entity_id = LK`. Q3 = `count(*)` of visible rows.

**Why.** Wrapping a helper in `(select …)` makes Postgres run it once per statement **only when its arguments do not reference the row**. `has_perm(entity_id, …)` references `entity_id`, so the plan shows a correlated `SubPlan` that runs per row (453,717 buffer hits for Q3). V3 is an `InitPlan`: it runs once, and the planner can use the array against the index. Explicit entity filters (Q2) hide the problem, but RLS must still be fast when a query forgets them.

## 4. Recommendations

**For the Architect (changes to `20-solution-design.md`):**

1. **§7.3 and §9.3: replace pattern 2.** Use `entity_id = any ((select app.perm_entities('perm'))::uuid[])` for entity permissions. Keep `app.has_perm(entity, perm)` for single-row checks inside functions. Update `15-compliance-security.md` §4.2 item 3 the same way. Add a CI check that fails on any policy calling a helper with a row column.
2. **§7.1 step 4:** `has_role()` stays as is; `current_app_role()` reads the primary grant; a trigger syncs `profiles.role` to the primary grant. Keep `profiles.role` writable only by Admins (Phase 0 guard).
3. **§3.4 Tenancy:** `current_tenant_id()` ignores `active`. The tenant for new users comes from service-role-only `raw_app_meta_data`, or an invite table. Document that this is not the user-editable metadata.
4. **§6.4:** replace the any-one partial unique index with `decision_slot` + `unique (task_id, decision_slot)` and one decision per person. Refuse a submit when there are fewer eligible approvers than the quorum, and route that case to escalation.
5. **§3.4 Numbering:** number in a `BEFORE` trigger at issue time; `next_number()` not executable by `authenticated` and not in an exposed schema; number last in the transaction; lock several types in a fixed order.
6. **§3.4 Outbox:** add `seq` to the event envelope for per-aggregate ordering, and make the inbox mandatory for every consumer.

**For the Tech Lead (`22-delivery-plan.md`):**

1. **Money:** ADR-15 (b) confirmed. Add `pg` type parsers (`int8` → `BigInt` or checked `number`), a `Money` Zod schema, `roundMinor(x, mode)` and `allocateLargestRemainder()` in `lib/rules/money` with unit tests using the examples in §3c. Rounding mode per rule goes in `policy_settings`.
2. **Test harness:** apply all migrations, then all downs in reverse order (the rollback test must loop). Add a test for session-level claim leaks to SPK-01. Tests must put claims and statements in one transaction: autocommit with `set_config(…, true)` silently loses the claims (this happened in the spike).
3. **Per-table test template:** the cross-entity, cross-tenant, composite-FK control and revocation checks from §3a. Add an RLS timing smoke test (Q3-style count over 200k seeded rows under 100 ms) to catch per-row helpers.
4. **Remaining spikes:** SPK-01 (Supavisor), SPK-10 (pgmq, `pg_cron`, `pg_net`), SPK-14 (CI image with those extensions) are still open and not covered here.

## Appendix: key SQL (excerpts from the spike files)

```sql
-- Per-statement permission set (use in policies)
create function app.perm_entities(p_perm text) returns uuid[]
language sql stable security definer set search_path = '' as $$
  select coalesce(array_agg(e.entity_id), '{}')
    from public.user_effective_permissions e
    join public.profiles p on p.id = e.user_id and p.active
   where e.user_id = auth.uid() and e.permission = p_perm
     and (e.valid_to is null or e.valid_to >= current_date) $$;

create policy pr_tenant on public.payment_requests as restrictive for all to authenticated
  using (tenant_id = (select app.current_tenant_id()))
  with check (tenant_id = (select app.current_tenant_id()));
create policy pr_read_all on public.payment_requests for select to authenticated
  using (entity_id = any ((select app.perm_entities('vp.request.read_all'))::uuid[]));
-- composite FKs: foreign key (tenant_id, entity_id) references entities (tenant_id, id)

-- Phase 0 compatibility
create or replace function public.current_app_role() returns public.app_role
language sql stable security definer set search_path = '' as $$
  select s.legacy_role from public.user_entity_roles g
    join public.permission_sets s on s.id = g.permission_set_id
    join public.profiles p on p.id = g.user_id and p.active
   where g.user_id = auth.uid() and g.is_primary
     and g.valid_from <= current_date and (g.valid_to is null or g.valid_to >= current_date) $$;

-- Gapless counter (called only from the issue trigger)
insert into public.doc_sequences as s (tenant_id, entity_id, doc_type, fiscal_year, prefix, next_value)
select e.tenant_id, e.id, p_doc_type, v_fy, e.code || '-' || p_doc_type, 2 from public.entities e where e.id = p_entity
on conflict (entity_id, doc_type, fiscal_year) do update set next_value = s.next_value + 1
returning s.next_value - 1, s.prefix into v_n, v_pfx;

-- Approval decisions
create unique index approval_actions_slot on public.approval_actions (task_id, decision_slot)
  where decision_slot is not null;          -- 1..quorum_n approvals, 0 = reject
create unique index approval_actions_one_per_person on public.approval_actions
  (task_id, coalesce(on_behalf_of, actor_id)) where action in ('approve','reject','recommend');
-- guard trigger: actor_id <> requester and on_behalf_of <> requester; recommend_only blocks approve;
-- subject_hash must match the request's hash.

-- Worker claim (pgmq-style visibility timeout)
update internal.queue q set vt = now() + make_interval(secs => p_vt_seconds), read_ct = q.read_ct + 1
 where q.msg_id in (select msg_id from internal.queue
                     where consumer = p_consumer and vt <= now()
                     order by msg_id limit p_n for update skip locked)
returning q.*;
```

The `withUserTx` shape used by every concurrency script:

```js
await c.query("begin");
await c.query("set local role authenticated");
await c.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub })]);
// ... command ... then commit or rollback
```
