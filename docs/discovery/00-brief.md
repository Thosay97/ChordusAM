# Discovery brief: ChordusAM as a Media & Studio ERP (with POS and HRIS)

Shared brief for every agent on the discovery team. Read it fully before you start, and read the files it points to.

## 1. The ask (from the owner, 9 November 2026)

> Keep the work already done. Research other studio- and media-specific ERP and HR systems, write a proper BRD with gap analysis, benchmark with USPs, and plan a real solution design with suggested features and enhancements as an MVP, but as a scalable, well-rounded Media and Studio ERP with POS and HRIS.

So the output is a set of discovery documents in `docs/discovery/`. **No application code changes in this exercise.** The Phase 0 code that exists stays as the foundation.

## 2. The company

**Alliance Media Company (Private) Limited (AMPL)**, Colombo, Sri Lanka. Website: alliancemedia.lk. Owner of this project: Thoshan Rathnayake (Fractional COO). Admins: Thoshan, Fazlur, Gurpreet. Operations Manager (HR): Abilasini. Finance: Janaka. Producers and coordinators (for example Chathurika) raise vendor payments.

What AMPL sells, according to its website:

1. **Music video production.** AI-hybrid Sinhala and Tamil music videos at scale, 12 to 15 productions a month, concept to published in days.
2. **Photography.** Brand, product and portrait, in a fully equipped studio in Colombo 05.
3. **Videography and ads.** Advertisement production, corporate video, event coverage.
4. **Studio and song production.** Song production, dubbing, podcast recording.
5. **Social media marketing.**
6. **SEO and content strategy.**

- **Brands named on the site:** The Studio LK, Media Digital SG, Varnam TV, Varna TV. This implies several brands and channels, and possibly a Singapore entity ("SG").
- **Stats on the site:** 25+ projects, 3 active business tracks, 2 markets served, 48h average turnaround.
- **Spending and payroll context:** they pay external talent (vocalists, musicians, editors, AI artists, videographers), rent equipment and studios, and subscribe to AI tools billed in USD (Higgsfield, Suno, ClickUp, Claude, GPU rental).
- **Tools today:** spreadsheets, WhatsApp and ClickUp. Staff attendance comes from a fingerprint machine export.

## 3. What exists already (read these)

- `docs/PLAN.md`: the v2.0 project brief. It covers HR (attendance import, leave, manual attendance, contract types, payroll), Vendor Payments (requests, approvals, numbered vouchers), Finance (management ledger, income, expenses, AR, P&L, project profitability), Admin, Employee self-service, and the data model (section 9). Its open questions are in section 16.
- `docs/phase-0.md`: what Phase 0 delivered. It covers roles (employee, hr, admin, finance), the server-side access matrix, Supabase auth, profiles and an append-only audit log with RLS, CI, demo mode and the AMPL website look and feel.
- **Code:** Next.js 15 (App Router) with TypeScript, Supabase (Postgres, RLS, Auth), Tailwind, Vitest and Playwright. Key files are `lib/auth/roles.ts` and `supabase/migrations/`.

**Important:** PLAN.md is HR, vendor payments and finance only. It has **no POS, no studio and equipment booking, no client or CRM side, no production or project pipeline, no asset or rights management**, and only "light" projects. The new scope is a **Media and Studio ERP with POS and HRIS**, so the gap is large. That gap is exactly what this discovery exercise must close on paper.

## 4. Context you must respect

- **Country:** Sri Lanka first.
  - Currency LKR, with USD and SGD where needed. Timezone Asia/Colombo.
  - Statutory: EPF (8% employee, 12% employer), ETF (3%), APIT/PAYE, Shop and Office Employees Act, Wages Boards, Personal Data Protection Act No. 9 of 2022, IRD VAT and SSCL, withholding tax, stamp duty.
  - Local payments: LankaQR, PayHere, bank transfers, cards.
  - Mobile-first: most staff use phones. Internet can drop, which matters for POS and attendance.
- **Second market:** Singapore is likely (Media Digital SG). Design for multi-entity and multi-currency even if the MVP is one entity.
- **Team size:** small (roughly 10 to 30 people plus a pool of freelancers). Must be cheap to run.
- **Stack:** the current one (Next.js, Supabase, Vercel) unless there is a strong, argued reason to change. Recommend, don't rewrite.
- **Possible future:** the owner says "scalable, well rounded". Treat "could become a SaaS for other studios in Sri Lanka and South-East Asia" as a credible option to design for (multi-tenant readiness), but AMPL's own needs come first.

## 5. Rules for every agent

1. **Research is real.** Use web search and fetch. Cite sources inline as markdown links. Never invent product features, prices or laws. If you can't verify something, write "(unverified)". If a price isn't public, say so.
2. **Write to your file only** (the path is given in your task). Use markdown, start with an H1 title, a one-paragraph summary and the date (9 November 2026). Use tables where they help.
3. **Read the upstream files** your task lists before writing. Refer to other documents by path, and to requirement IDs (for example `BR-HR-003`) where they exist.
4. **Write plainly.** Short sentences, no jargon without a gloss, no marketing fluff.
5. **Be specific to AMPL:** music videos, AI-hybrid production, studio bookings, freelancers, Sri Lankan statutory rules.
6. **Your final reply to the lead** is at most 150 words: what you wrote, where, your 3 most important findings, and open questions. All detail goes in the file.

## 6. Team and outputs

| # | Role | Output file |
|---|---|---|
| R1 | Market researcher: media and production management, studio ERPs | `docs/discovery/research/R1-media-production-erp.md` |
| R2 | People Ops SME: HRIS, payroll, Sri Lanka statutory, attendance devices | `docs/discovery/research/R2-hris-payroll-sri-lanka.md` |
| R3 | Market researcher: POS, rental and booking, finance, SL payments and tax | `docs/discovery/research/R3-pos-booking-finance.md` |
| R4 | Market researcher: creative ops (review/approval, DAM, rights and royalties, channel revenue, AI production) | `docs/discovery/research/R4-creative-ops-rights.md` |
| BA | Business Analyst: BRD | `docs/discovery/10-brd.md` |
| BA | Business Analyst: gap analysis | `docs/discovery/11-gap-analysis.md` |
| PMM | Product Marketing Manager: benchmark and USPs | `docs/discovery/12-benchmark-usp.md` |
| PD | Product Designer: UX, information architecture, journeys | `docs/discovery/13-ux-design.md` |
| CFO | CFO: business case, TCO, build vs buy, finance requirements | `docs/discovery/14-business-case.md` |
| SEC | Compliance and security | `docs/discovery/15-compliance-security.md` |
| SA | Solution Architect: solution design | `docs/discovery/20-solution-design.md` |
| PO | Product Owner: MVP scope, roadmap, epics | `docs/discovery/21-mvp-roadmap.md` |
| TL+DEV | Tech Lead and Developers: delivery plan, data model, estimates | `docs/discovery/22-delivery-plan.md` |
| QA | QA lead: test strategy and quality gates | `docs/discovery/23-test-strategy.md` |
| OPS | DevOps: environments, CI/CD, hosting, cost | `docs/discovery/24-devops-plan.md` |
| REV | Review loop: cross-document review findings | `docs/discovery/30-review-log.md` |
