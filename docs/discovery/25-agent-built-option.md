# Option F: build ChordusAM with Claude agents

Date: 10 November 2026. Status: draft for owner review. Requested by the owner after the discovery pack was complete.

**Summary.** Option F is a fourth delivery model. In it, Claude Code agents write all the code, migrations, tests and documentation, and people only decide, review and accept. The model already produced this discovery pack: one lead session ran role agents in waves, each wrote to its own file, and a reviewer checked the result. It can build the product the same way.

The scope, order and quality gates do not change. Release 0 first, then Increments 1 to 3, with every check in `22-delivery-plan.md` and `23-test-strategy.md`. What changes is who types and what limits the pace: Claude usage limits and human review time, not engineer headcount.

Nobody can honestly convert the Tech Lead's 274 ideal engineer-days into agent time without measuring it. So Option F starts with a **two-week pilot on Release 0's first epic**, and the plan is re-based on the measured numbers.

## 1. Where it sits next to the other options

`22-delivery-plan.md` §3.10 defines Options A, B and C (team shapes). The letter D is already used for in-house payroll and E for the payroll SaaS route, so this is F.

| Option                      | Who writes the code                | People needed                                                           | R0 + MVP end                                                 | R0 + MVP cost (LKR)                                                          |
| --------------------------- | ---------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| B (Tech Lead's recommended) | Three engineers using AI tools     | TL 1.0, two developers 1.0, tester 0.5, designer 0.2, OPS 0.1           | 2 July 2027                                                  | about 12m (10 to 15)                                                         |
| C (hold the cap)            | As A or B                          | As A or B                                                               | Increment 1 only (22 March 2027)                             | 6.0m                                                                         |
| **F (agent-built)**         | Claude agents, one epic per branch | Owner, accountant, and a **part-time technical reviewer (recommended)** | **Hypothesis: about 3 to 5 months after the pilot (see §5)** | **Hypothesis: reviewer time + Claude usage + sign-off; set after the pilot** |

## 2. How an epic is built

The same pattern as the discovery work, applied to code. The lead session (the orchestrator) runs one epic at a time, in its own branch, for example `ep-01-tenancy`.

| Step | Agent role                            | Output                                                                                                                                               | Human gate                                                              |
| ---- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1    | Tech Lead agent                       | Epic plan in `docs/phase-ep-NN.md`: tables, migrations, screens, tests, open questions. Reads `20`, the epic's stories in `21` §5, and tests in `23` | **Reviewer approves the plan** (short; cheap to change)                 |
| 2    | QA agent                              | Test cases first for `lib/rules/**` and RLS, taken from the BRULE catalogue and golden files                                                         | **Accountant or Finance signs** golden files for payroll, tax and money |
| 3    | Developer agents (1 to 2)             | Migrations with rollbacks, RLS policies, server code, UI. Small PRs inside the epic branch, under about 400 lines each                               | None; CI must pass                                                      |
| 4    | Reviewer agent                        | Review against CLAUDE.md, the epic's stories and the security controls in `15` (the `code-review` skill)                                             | None; findings go back to step 3                                        |
| 5    | Security agent (Restricted data only) | Threat check for tables holding salary, NIC, bank details or consents                                                                                | Reviewer reads the findings                                             |
| 6    | Lead session                          | Phase note, PR description, demo steps, preview link                                                                                                 | **Reviewer approves the PR; owner merges.** Agents never merge          |
| 7    | Owner and staff                       | UAT on staging against the epic's acceptance criteria                                                                                                | **Owner accepts the epic**                                              |

The rules in `22-delivery-plan.md` §4.3 apply as written. Plan before code, tests first for rules, small PRs, a second agent reviews, no edits to merged migrations, and no secrets in prompts.

## 3. What agents cannot do (people must)

| Task                                                                                                                           | Who                                         |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| The 14 owner decisions in `30-review-log.md` §3, including data model approval and funding                                     | Owner                                       |
| Confirm statutory values (APIT tables, WHT categories, EPF base, VAT and SSCL) and sign golden files                           | Accountant                                  |
| Create and hold accounts and secrets: Supabase, Vercel, PayHere, WhatsApp BSP, email, domain. Agents never see production keys | Owner or reviewer                           |
| Approve and merge pull requests, and approve production releases (the `release` branch flow in `24-devops-plan.md`)            | Reviewer, owner                             |
| Hardware: fingerprint device setup, thermal printers, POS tablets, test payments at the till                                   | Front desk or ops, guided by agent runbooks |
| UAT with real users (HR, Finance, producers, front desk) and the two-month payroll parallel run                                | Staff, owner                                |
| Talk to vendors (payroll SaaS, accountant's package, PayHere onboarding)                                                       | Owner                                       |

## 4. Why a human technical reviewer is still recommended

A fully agent-only path is possible: the owner approves plans and merges on the strength of CI and the reviewer agent. We do not recommend it for this product, because the riskiest code is exactly what agents get wrong most quietly:

- RLS policies that look right and leak across entities (the spike in `22a` found a pattern that worked but was 50 times slower).
- Payroll, WHT and VAT arithmetic, where a rounding mode is a legal question.
- Migrations that cannot be rolled back once real data exists.

A part-time senior engineer, about **0.2 to 0.4 FTE**, reviewing plans, migrations, RLS and money code, removes most of that risk at a fraction of Option B's cost. At the TL rate in `14-business-case.md` §3.1 (LKR 550,000 a month for 1.0 FTE), 0.3 FTE is about LKR 165,000 a month. The reviewer can be a contractor.

## 5. Capacity, usage limits and the pilot

**The real constraint is usage, not typing speed.** During discovery, the account hit its 5-hour usage limit twice while 3 to 5 agents ran in parallel. Building needs more agent time than writing documents, because of test runs, CI fixes and rework. Ways to raise capacity, to be priced at the time (Anthropic's prices change, so none are quoted here):

1. A higher Claude plan for interactive sessions.
2. An **Anthropic API key** for long or unattended runs. It is billed per token with no 5-hour window, and suits overnight epic builds and CI review bots.
3. Fewer parallel agents (one or two at a time), which keeps sessions inside the limit at the cost of calendar time.

**Pilot (two weeks, first step of Option F).** Build EP-01, the tenant, entity and brand keys migration with RLS and its tests, fully with agents, using the steps in §2. Measure:

| Measure                                   | Why                                 |
| ----------------------------------------- | ----------------------------------- |
| Agent sessions and usage consumed         | Converts to cost and calendar time  |
| Reviewer hours per merged PR              | The real human cost of Option F     |
| CI pass rate on first push; rework cycles | Quality of agent output             |
| Defects found in review vs after merge    | Whether review catches what matters |
| Calendar days from plan to merged epic    | Basis for the timeline              |

**Planning hypothesis, to be replaced by the pilot's numbers.** If agents plus a 0.3 FTE reviewer clear about 2 to 4 times the ideal engineer-days per calendar week that one engineer would, Release 0 + MVP (274 ideal days, range 200 to 390) takes about **3 to 5 months of calendar time** after the pilot. The cost is then the reviewer's time, Claude usage, the LKR 0.6m sign-off and the accountant. That is likely well under Option B's LKR 12m, but this is a hypothesis and not an estimate until the pilot measures it.

## 6. Risks and mitigations

| Risk                                                            | Mitigation                                                                                                                        |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Usage limits stall work mid-epic                                | Agents commit after each step (as in discovery); API key for long runs; one or two agents at a time                               |
| Plausible but wrong RLS, tax or payroll code                    | Tests first from signed golden files; RLS matrix tests per table; human reviewer on migrations and money; payroll parallel run    |
| Inconsistency across epics (each agent starts cold)             | CLAUDE.md rules (`22` §4.3), phase notes per epic, the reviewer agent checks against CLAUDE.md, ADRs in `20` as the single source |
| Nobody understands the code when something breaks in production | Phase notes and ADRs per epic; reviewer holds the technical overview; runbooks in `24`; agents can be asked to explain any module |
| Owner time becomes the bottleneck (decisions, UAT, merges)      | Decisions have defaults and dates; UAT batched per increment; reviewer approves PRs so the owner only merges and accepts          |
| Over-reliance on one vendor                                     | Code, docs and tests live in the repo in standard Next.js, TypeScript and SQL; any engineer or another tool can continue the work |

## 7. Decision for the owner

Decision 3 in `30-review-log.md` §3 (funding option and delivery model) now has three choices: **B**, **C** or **F**. If F is chosen:

1. Name the part-time reviewer, or accept the agent-only risk in writing.
2. Choose how usage is funded: plan upgrade, API key, or both.
3. Approve the two-week pilot on EP-01. Decisions 1, 2 and 4 (data model, money type, region and sign-in) are still needed before it starts, because the first migration depends on them.
4. Gate after the pilot: continue with F, switch to B, or mix them (agents build, engineers review).
