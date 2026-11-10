# 14: Business case for ChordusAM (build, buy or hybrid)

**Date:** 9 November 2026 · **Author:** CFO (discovery team) · **Upstream read:** `docs/discovery/00-brief.md`, `docs/PLAN.md` (sections 1 to 6, 9, 10, 16), `docs/phase-0.md`, `docs/discovery/research/R1-media-production-erp.md`, `R2-hris-payroll-sri-lanka.md`, `R3-pos-booking-finance.md`, `R4-creative-ops-rights.md`.

**Summary.** This document compares five ways to run AMPL's people, studio and money processes over three years: (A) keep spreadsheets, (B) buy a stack of five tools, (C) buy Odoo with a Sri Lankan partner, (D) build all of ChordusAM, and (E) a hybrid where AMPL builds the studio, production, POS, approvals and finance core and takes statutory payroll from a local HRIS. The hard benefits at AMPL's size are modest: about **LKR 5.4m (USD 16k) a year** in the base case, with a range of LKR 1.9m to 12.1m. They come mostly from billing leakage (unbilled studio time, missed deposits, slow collections, unbilled revision rounds, wasted AI credits), then staff time, then compliance. Against that, **no option pays back within three years in the base case**. Option B (buy a stack) loses the least money in the base case (3-year NPV −LKR 6.0m), but it fits AMPL worst after the spreadsheets (fit score 48/100) and leaves the hard problems in spreadsheets: freelancer withholding tax, AI cost per video and rights. Option E fits best (85/100). It gets close to break-even only with **lean, AI-assisted delivery** (5-year NPV −LKR 3.1m in the mid case, payback in about 4.6 years, and +LKR 2.8m if effort lands at the low end), or if AMPL's revenue is at the upper end of the assumed band. **Recommendation:** choose Option E. Fund it in gates. Gate 0 is now: fix compliance with the accountant and subscribe to a local payroll SaaS. Gate 1 is the Phase 1 MVP, capped at **LKR 6.0m (about USD 18k)** all-in. Gate 2, for Phase 2 (POS, rights, client portal, accounting sync, SG entity), opens only when measured KPIs or a validated SaaS demand say so. Every figure here is a planning estimate with stated assumptions (section 9 lists them), not a quote.

---

## 1. Summary and recommendation

### 1.1 The answer in five lines

1. **Do now, whatever the build decision:** ask the accountant whether AMPL must register for VAT and SSCL. The SSCL threshold fell to LKR 36m a year on 1 July 2026; the VAT threshold stays at LKR 60m ([R3 §6](research/R3-pos-booking-finance.md)). Start the 5% withholding tax (WHT) on qualifying freelancer fees (in force since June 2026, [R2 B.3](research/R2-hris-payroll-sri-lanka.md)), and name a Data Protection Officer before 1 January 2027 ([R2 B.11](research/R2-hris-payroll-sri-lanka.md)). These steps cost little and remove the largest tail risks. No software is needed for them.
2. **Choose Option E (hybrid).** Build the studio, production, vendor-payment, sales, POS and management-finance core in ChordusAM. Take EPF, ETF, APIT and payslips from a local payroll SaaS (for example Humanised, about LKR 25,000 a month, [R2 A.3](research/R2-hris-payroll-sri-lanka.md)). Keep the accountant's package as the books of record.
3. **Deliver it lean.** One senior contract tech lead plus AI coding agents, a part-time developer and a part-time tester, with Thoshan as product owner. That delivery model costs about LKR 7.7m (USD 23k) for both phases. A blended contract team costs about LKR 12.5m, and a local agency LKR 30m or more. With the bigger teams, the build does not pay back on AMPL's own benefits.
4. **Fund in gates.** Gate 1 is capped at LKR 6.0m for Phase 1, money flows first: sales invoices and AR, booking deposits, vendor payments with WHT, project profitability, HR and attendance with the payroll hand-off. Phase 2 (about LKR 2.5m to 4.1m) needs measured benefits or signed interest from other studios.
5. **What the owner is really buying.** On the base-case numbers, E costs about LKR 3m to 5m more in NPV (USD 9k to 16k) than its hard AMPL benefits return over five years. That gap is the price of a strategic option: one system that fits a music-video studio, data AMPL owns (needed for IRD e-invoicing later, [R3 §6](research/R3-pos-booking-finance.md)), and a credible path to a SaaS for other studios. The owner should take the decision knowing that price.

### 1.2 Options at a glance (base case, 3-year view)

Exchange rate assumption: **USD 1 = LKR 333** (section 2.1). NPV is incremental to Option A at an 18% discount rate (section 5.1). "TCO" is the three-year total cost of ownership: year 0 (setup) plus years 1 to 3.

| Option                                     | 3-yr TCO, LKR m (base) | Range, LKR m | 3-yr TCO, USD k (base) | 3-yr NPV vs A, LKR m (base) | Fit score /100 | Delivery and operating risk |
| ------------------------------------------ | ---------------------: | ------------ | ---------------------: | --------------------------: | -------------: | --------------------------- |
| A. Status quo spreadsheets                 |                    0.0 | 0            |                      0 |           0 (by definition) |             18 | High (compliance, leakage)  |
| B. Buy a stack                             |                   13.2 | 9.1 to 18.6  |                   39.7 |                        −6.0 |             48 | Medium                      |
| C. Buy all-in-one (Odoo)                   |                   26.3 | 16.1 to 48.4 |                   78.9 |                       −17.0 |             55 | Medium-high                 |
| D. Build all of ChordusAM                  |                   23.5 | 11.5 to 64.9 |                   70.7 |                       −11.7 |             84 | High (build + statutory)    |
| E. Hybrid (blended team)                   |                   22.2 | 11.0 to 59.6 |                   66.8 |                       −10.5 |             85 | Medium                      |
| **E. Hybrid, lean delivery (recommended)** |               **16.7** | 11.0 to 22.2 |               **50.2** |        **−5.4** (5-yr −3.1) |         **85** | Medium                      |

How to read it: Option A's TCO is zero, but its true cost is the benefit it forgoes, about LKR 5.4m a year (section 4). The TCO ranges are wide because the scope is not yet sized by the Tech Lead (`docs/discovery/22-delivery-plan.md`).

> **Review note (10 November 2026, `30-review-log.md` RV-04 and RV-06).** The Tech Lead has now sized the scope. The **current best estimate** is `22-delivery-plan.md` §1.2 and §3.10: about 274 ideal engineer-days (range 200 to 390) for Release 0 + MVP; with three engineers (Option B) the MVP ends on 2 July 2027 for about **LKR 12m** (range 10 to 15), against the LKR 7.7m this document assumes for both phases and the PO's LKR 5.4m for Release 0 + MVP (`21-mvp-roadmap.md` §3.2). Within the LKR 6.0m Gate 1 cap (Option C) the build covers Release 0 + Increment 1 "Pay right" only. The build costs, TCO, NPV and payback for Option E lean in this document have **not** been recomputed on the Tech Lead's figures; read them as optimistic. Which funding option applies is an owner decision (`21` §8.2 item 3, `22` TL-1). Separately, `24-devops-plan.md` §8 puts the monthly run cost at about USD 412 (about LKR 137,000) from Phase 7, above A-14's USD 262 base, which takes the all-in run cost to about LKR 237,000 a month, about LKR 37,000 over NFR-COST-001 (`24` OPS-Q-03). The CFO should re-base A-14 and the TCO in the next revision.

---

## 2. Options analysis

### 2.1 Common assumptions

| #    | Assumption                                                                                                                                                                                                                                                                                                                                                | Value used                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| A-01 | **USD/LKR.** CBSL rates on 6 November 2026: buying 328.05, selling 337.00 ([Newswire, CBSL rates](https://www.newswire.lk/uv1c), from a search summary). Mid-point rounded                                                                                                                                                                                | **LKR 333 per USD**, dated 6 Nov 2026. Sensitivity at 300 and 370     |
| A-02 | **SGD/LKR.** No November quote found. Mid-market about 260.5 in late July 2026 ([Pluang](https://pluang.com/en/tools/currency-converter/sgd-lkr), [ValutaFX](https://www.valutafx.com/history/sgd-lkr-2026)) **(unverified for November)**                                                                                                                | LKR 260 per SGD (used only for the SG notes)                          |
| A-03 | **INR/USD** (Odoo bills Sri Lanka in INR). Close of 93.89 on 6 November 2026 ([Telangana Today, PTI](https://telanganatoday.com/rupee-rallies-52-paise-to-settle-at-93-89-against-us-dollar))                                                                                                                                                             | INR 93.9 per USD                                                      |
| A-04 | **AMPL size.** About 20 staff (brief: 10 to 30), 12 to 15 music videos a month, roughly 40 active freelancers a year                                                                                                                                                                                                                                      | 20 staff, about 25 system users                                       |
| A-05 | **Revenue band.** Not known (open question 2). The VAT threshold is LKR 60m a year; 12 to 15 videos a month plus photo, ads, studio and retainers suggests a band of LKR 60m to 140m **(CFO estimate, unverified)**                                                                                                                                       | Base **LKR 90m** (USD 270k) a year. Sensitivity at 60m, 150m and 250m |
| A-06 | **Excluded as common to all options:** the accountant's package (Xero, QuickBooks or another, not yet known), PayHere and card fees (any option that takes online payments pays them; see section 3.6), existing Google Workspace, ClickUp and WhatsApp accounts, and AI production tools                                                                 | Not in TCO                                                            |
| A-07 | **Sunk cost.** Phase 0 (auth, roles, audit log, CI, look and feel, `docs/phase-0.md`) is already paid for and ignored in the decision. It does lower the remaining build effort for D and E                                                                                                                                                               | Ignored                                                               |
| A-08 | **Vendor price escalation.** USD SaaS prices rose in 2026 (Xero from 1 November 2026, [Xero](https://www.xero.com/hk/pricing-plans/update); QuickBooks from August 2026, [Intuit](https://quickbooks.intuit.com/r/product-update/quickbooks-price-changes/)), and CCPI inflation was 8.3% in October 2026 ([CBSL](https://www.cbsl.gov.lk/en/node/21123)) | +8% a year on recurring costs (base), 10% conservative, 5% optimistic |
| A-09 | **Internal time value.** Loaded hourly cost: HR about LKR 1,050, Finance about LKR 1,220, producers about LKR 710, Admins and owners LKR 3,500 (opportunity cost). Blended per activity in section 4 **(CFO estimate; salaries not provided)**                                                                                                            | See section 4.2                                                       |

### 2.2 Option A: status quo (spreadsheets, WhatsApp, ClickUp)

| Item                 | 3-year cost                                                                                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Licences per user    | None beyond existing tools                                                                                                                                                                           |
| Implementation       | None                                                                                                                                                                                                 |
| Customisation        | None                                                                                                                                                                                                 |
| Hosting              | None                                                                                                                                                                                                 |
| Support              | None                                                                                                                                                                                                 |
| Internal time        | About **152 admin hours a month** across HR, Finance, producers and Admins on the six processes in section 4.2. Worth about LKR 2.6m a year, but this is today's spend and is not incremental        |
| **Cost of inaction** | The forgone benefits: about **LKR 5.4m a year** in the base case (range 1.9m to 12.1m), plus the tail risks below                                                                                    |
| Risk                 | **High.** No WHT control on freelancer fees since June 2026, no VAT/SSCL threshold monitor, no audit trail on approvals, key-person risk on spreadsheets, no evidence for the "48h turnaround" claim |
| Fit score            | 18/100                                                                                                                                                                                               |

### 2.3 Option B: buy a stack

Itemised for about 20 staff, 12 PSA users (producers, coordinators, Admins, Finance) and 3 power users for gear. Prices are from the research files and are mostly third-party reports.

| Component                               | Product (example)          | Price used                                                                                                                                                                           | Per year, LKR (base) |
| --------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------: |
| HRIS and SL payroll                     | Humanised                  | LKR 25,000 a month up to 50 staff; LKR 10,000 up to 15 ([R2 A.3](research/R2-hris-payroll-sri-lanka.md); [hr.software](https://www.hr.software/reviews/humanised), figures conflict) |              300,000 |
| Agency PSA (quotes, projects, invoices) | Productive.io Professional | USD 25 to 29 per user a month, 3-user minimum ([R1 §2](research/R1-media-production-erp.md)); used USD 27 × 12 users                                                                 |            1,294,700 |
| Studio and room booking                 | Skedda                     | About USD 99 a month for 25 spaces (secondary, may be old, [R3 §3.2](research/R3-pos-booking-finance.md))                                                                            |              395,600 |
| Equipment rental and crew               | Rentman                    | About USD 19 per power user plus USD 39 platform fee ([R3 §3.1](research/R3-pos-booking-finance.md)); 3 power users                                                                  |              383,600 |
| POS for prints and merch                | Loyverse                   | Core free; add-ons about USD 5 per employee or per store ([R3 §2.1](research/R3-pos-booking-finance.md)); used USD 15 a month                                                        |               59,900 |
| Glue between tools                      | Zapier or Make             | **Not researched.** Range USD 20 to 70 a month assumed; used USD 50                                                                                                                  |              199,800 |
| Accounting                              | The accountant's package   | Common to all options (A-06)                                                                                                                                                         |                    – |
| **Licences, year 1**                    |                            |                                                                                                                                                                                      |        **2,633,700** |

| TCO line (3 years) |     LKR m |    USD k | Basis                                                                                               |
| ------------------ | --------: | -------: | --------------------------------------------------------------------------------------------------- |
| Licences           |      8.55 |     25.7 | Table above, +8% a year (A-08). About 87% is USD-priced, so it moves with FX                        |
| Implementation     |      2.00 |      6.0 | Set-up of five tools, data migration, training. **No quote; CFO range LKR 1.2m to 3.5m**            |
| Customisation      |      0.50 |      1.5 | Spreadsheets or scripts for WHT, AI cost allocation, rights. Range 0.3m to 0.8m                     |
| Hosting            |      0.00 |      0.0 | Included in SaaS                                                                                    |
| Support            |      0.75 |      2.3 | Local admin help, LKR 250k a year                                                                   |
| Internal time      |      1.43 |      4.3 | 200 hours set-up, then about 25 hours a month of double entry and reconciliation between five tools |
| **Total**          | **13.23** | **39.7** | **Range LKR 9.1m to 18.6m**                                                                         |

- **Licences per user:** Productive about USD 27 per user a month; Rentman USD 19 per power user; the HRIS and Skedda are flat fees.
- **Risk: medium.** It means five systems and five sets of master data. Western booking tools take deposits through Stripe, Square or PayPal, which do not work for Sri Lankan merchants (Square confirmed, Stripe unverified, [R3 §3.4](research/R3-pos-booking-finance.md)). So deposits stay manual through PayHere links. No tool handles WHT on freelancers, AI cost per video, rights or consents. Licences are priced in USD, so a weaker rupee raises the bill.
- **Fit score:** 48/100 (section 2.7).

### 2.4 Option C: buy an all-in-one (Odoo with Sri Lankan localisation and a partner)

ERPNext is the open-source alternative. Its software is free and Frappe Cloud costs from about USD 5 to 50 per site a month, but no Sri Lankan localisation and no Sri Lankan partner were found ([R1 §4.17](research/R1-media-production-erp.md), [R3 §4.1](research/R3-pos-booking-finance.md)). Statutory payroll and tax would then be custom work, which makes it a build in all but name. Odoo is costed here.

| TCO line (3 years) |     LKR m |    USD k | Basis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | --------: | -------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Licences           |      5.35 |     16.1 | **Custom plan** (it is needed for multi-company and Studio), billed to Sri Lanka in INR: list INR 1,150 per user a month, which is about **LKR 4,080** at A-01 and A-03 ([oec.sh, July 2026](https://oec.sh/odoo-pricing/sri-lanka), secondary). 25 users. Plus about USD 100 a month for Odoo.sh or other hosting, because third-party Sri Lankan modules generally cannot run on Odoo Online **(price and constraint unverified)**. Plus SL modules about USD 250 one-off (payroll USD 79, SVAT USD 69, invoice print, [R1 §4.16](research/R1-media-production-erp.md)) |
| Implementation     |      8.00 |     24.0 | Partner implementation. **No Sri Lankan price is public.** Global benchmarks are USD 15k to 50k for small projects ([Ecosire](https://ecosire.com/blog/odoo-implementation-cost-breakdown-2026), secondary), and implementation often exceeds the licence ([R1 §4.16](research/R1-media-production-erp.md)). Local partners exist (Nisus, Cygnus One, Allion, Subtle: [Odoo partners](https://www.odoo.com/partners/nisus-solutions-pvt-ltd-724254), [ERPResearch](https://erpresearch.com/odoo-partners/cygnus-one-pvt-ltd)). Range LKR 5m to 15m                        |
| Customisation      |      5.00 |     15.0 | The media fit Odoo lacks: PLAN.md §5 voucher flow, freelancer WHT, AI cost allocation, rights and consents, PayHere connector, booking deposits. Range LKR 3m to 9m                                                                                                                                                                                                                                                                                                                                                                                                       |
| Hosting            |      0.00 |      0.0 | In the licence line                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Support            |      6.85 |     20.6 | Partner support at about 15% of implementation plus customisation a year, plus one version upgrade of custom modules in year 3 (LKR 1.0m) **(CFO assumption, industry norm unverified)**                                                                                                                                                                                                                                                                                                                                                                                  |
| Internal time      |      1.07 |      3.2 | 400 hours of process change and training, then 10 hours a month of administration                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Total**          | **26.27** | **78.9** | **Range LKR 16.1m to 48.4m**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

- **Licences per user:** about LKR 4,080 a month on Custom; Standard is about LKR 2,570 but has no multi-company. Every employee who uses leave or attendance self-service needs a user.
- **Risk: medium-high.** The Sri Lankan modules are third-party and unaudited; their vendors tell buyers to check them against IRD guidance ([R1 §4.16](research/R1-media-production-erp.md)). Custom modules must be upgraded with each Odoo version. AMPL would depend on one partner. It is still a generic ERP: no media pipeline, no proofing, no rights.
- **Fit score:** 55/100.

### 2.5 Option D: build all of ChordusAM on the current stack

Next.js, Supabase and Vercel, as in the brief. ChordusAM integrates with the accountant's package (export first, then an API sync) and with PayHere. Payroll statutory rules (EPF, ETF, APIT, gratuity, T10) are built in-house.

| TCO line (3 years, blended team) |     LKR m |    USD k | Basis                                                                                                                                                                                               |
| -------------------------------- | --------: | -------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Licences                         |      0.00 |      0.0 | No per-user licences                                                                                                                                                                                |
| Implementation (the build)       |     13.93 |     41.8 | Phase 1 LKR 9.25m plus Phase 2 LKR 4.08m (section 3), plus LKR 0.6m for accountant and lawyer sign-off of rules and templates                                                                       |
| Customisation                    |      0.00 |      0.0 | Inside the build                                                                                                                                                                                    |
| Hosting and running              |      3.92 |     11.8 | About USD 262 a month (section 3.6), +8% a year                                                                                                                                                     |
| Support and maintenance          |      4.50 |     13.5 | 12 person-weeks a year, including the statutory upkeep each April (APIT tables, gazette holidays) that local payroll vendors do for their clients ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)) |
| Internal time                    |      1.20 |      3.6 | Product owner 0.2 FTE, plus UAT by HR and Finance, then 8 hours a month                                                                                                                             |
| **Total**                        | **23.55** | **70.7** | **Range LKR 11.5m to 64.9m.** Lean delivery: LKR 17.3m (USD 52k)                                                                                                                                    |

- **Licences per user:** none. Hosting is flat, so freelancer logins add almost nothing (this matters, [R1 P13](research/R1-media-production-erp.md)).
- **Risk: high.** Delivery risk on a large scope, plus AMPL owns the legal risk of a payroll calculation error and the yearly statutory update.
- **Fit score:** 84/100.

### 2.6 Option E: hybrid (build the core, take payroll from a local HRIS)

The same as D, except that EPF, ETF, APIT, payslips and statutory files come from a local payroll SaaS. ChordusAM sends the monthly payroll inputs (days worked, unpaid leave, approved adjustments) and imports the payroll journal back for the P&L and project cost. Attendance import, leave, contracts, freelancers and talent stay in ChordusAM, as PLAN.md and R2 D.5 propose.

| TCO line (3 years, blended team) |     LKR m |    USD k | Basis                                                                                                              |
| -------------------------------- | --------: | -------: | ------------------------------------------------------------------------------------------------------------------ |
| Licences                         |      0.90 |      2.7 | Local HRIS, LKR 25,000 a month ([R2 A.3](research/R2-hris-payroll-sri-lanka.md))                                   |
| Implementation (the build)       |     13.08 |     39.3 | Phase 1 LKR 8.41m plus Phase 2 LKR 4.08m, plus LKR 0.6m professional sign-off                                      |
| Customisation                    |      0.00 |      0.0 | Inside the build                                                                                                   |
| Hosting and running              |      3.92 |     11.8 | As D                                                                                                               |
| Support and maintenance          |      3.00 |      9.0 | 8 person-weeks a year; the HRIS vendor carries the statutory upkeep                                                |
| Internal time                    |      1.34 |      4.0 | As D, plus about 3 hours a month for the payroll hand-off                                                          |
| **Total**                        | **22.25** | **66.8** | **Range LKR 11.0m to 59.6m.** **Lean delivery (recommended): LKR 16.7m (USD 50k)**, of which the build is LKR 7.7m |

- **Licences per user:** none for ChordusAM. The HRIS is a flat tier.
- **Risk: medium.** The scope is smaller than D, and the statutory rules are kept by a vendor whose business depends on them. The new risk is the interface: two employee masters, and a CSV hand-off if the HRIS has no API (not checked). It is mitigated by a monthly reconciliation (headcount and gross pay must match).
- **Fit score:** 85/100. It is slightly ahead of D because payroll compliance is more reliable, and slightly behind on "one system".
- **Exit option:** after one full tax year, bring payroll in-house if the HRIS hand-off is painful (R2 D.5). The build cost of that move is the PAY module group in section 3.2 (6 to 10 person-weeks before the AI effect).

### 2.7 Fit score against AMPL needs

Scores run from 0 (none) to 5 (strong). Weighted total out of 100. D and E are scored on their designed scope, not on what exists today; delivery risk is shown separately above.

| Need (weight)                                                                     |      A |      B |      C |      D |      E |
| --------------------------------------------------------------------------------- | -----: | -----: | -----: | -----: | -----: |
| SL statutory payroll: EPF, ETF, APIT, gratuity (10)                               |      1 |      4 |      3 |      3 |      4 |
| SL tax on money flows: WHT on freelancers, VAT/SSCL, stamp duty, IRD invoice (10) |      1 |      1 |      2 |      4 |      4 |
| Freelancers and talent, vouchers, approvals (15)                                  |      1 |      2 |      2 |      5 |      5 |
| Studio, room, gear and crew booking with local deposits (15)                      |      1 |      3 |      3 |      4 |      4 |
| Production pipeline and project profitability, incl. AI cost (15)                 |      1 |      3 |      3 |      5 |      5 |
| Management finance: multi-entity, multi-currency, AR, accountant link (10)        |      1 |      3 |      4 |      4 |      4 |
| Rights, client approvals, consents (10)                                           |      0 |      1 |      1 |      4 |      4 |
| Service-first POS, offline (5)                                                    |      0 |      2 |      4 |      3 |      3 |
| Mobile, WhatsApp, poor connectivity (5)                                           |      2 |      3 |      3 |      4 |      4 |
| One system, low admin, data integrity (5)                                         |      1 |      1 |      4 |      5 |      4 |
| **Weighted score**                                                                | **18** | **48** | **55** | **84** | **85** |

---

## 3. Build cost model for D and E

**Rough order of magnitude (ROM), to be refined by the Tech Lead in `docs/discovery/22-delivery-plan.md`.** Effort is in person-weeks (pw) of a competent full-stack developer working without AI help. The AI effect is applied afterwards.

### 3.1 Team composition (roles from the brief, section 6)

Lean delivery model, about 7 to 9 months for both phases:

| Role (brief)                                     | Who                                       |                     Load | Monthly cost basis (LKR)                                                                                                                                                                                                                                                                         |
| ------------------------------------------------ | ----------------------------------------- | -----------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Product Owner (PO)                               | Thoshan                                   |                  0.2 FTE | Internal time                                                                                                                                                                                                                                                                                    |
| Tech Lead and Solution Architect, lead developer | Senior contract engineer, AI-assisted     |  1.0 FTE, about 7 months | 450,000 to 650,000. Senior market rate LKR 300,000 to 750,000+ a month ([itpro.lk](https://itpro.lk/salary-sri-lanka-it-jobs/)); levels.fyi senior median about LKR 510,000 a month total pay ([levels.fyi](https://www.levels.fyi/en-gb/t/software-engineer/levels/senior/locations/sri-lanka)) |
| Developer                                        | Mid-level contract developer, AI-assisted |  1.0 FTE, about 4 months | 250,000 to 350,000                                                                                                                                                                                                                                                                               |
| QA                                               | Part-time tester                          |  0.4 FTE, about 6 months | 180,000 to 250,000 (full-time equivalent) **(estimate)**                                                                                                                                                                                                                                         |
| Product Designer (PD)                            | Contract                                  | 0.25 FTE, first 3 months | 250,000 to 350,000 **(estimate)**                                                                                                                                                                                                                                                                |
| DevOps (OPS)                                     | Fractional                                |                  0.1 FTE | 400,000 to 500,000 **(estimate)**                                                                                                                                                                                                                                                                |
| Finance and HR SMEs                              | Janaka, Abilasini                         |         UAT and sign-off | Internal time                                                                                                                                                                                                                                                                                    |
| Accountant and lawyer                            | External                                  |                  One-off | LKR 0.4m to 1.0m (base 0.6m): sign-off of tax and payroll rules, the CoA mapping, and the talent, release and AI-likeness templates ([R4 §3](research/R4-creative-ops-rights.md)) **(estimate)**                                                                                                 |
| AI coding tools                                  | Claude Code or similar                    |                          | USD 100 to 200 per developer a month **(estimate)**                                                                                                                                                                                                                                              |

That is about 63 person-weeks of paid capacity for LKR 6.8m, roughly LKR 108,000 per person-week. It matches the "lean" rate used below.

### 3.2 Effort per module group (ROM, person-weeks before the AI effect)

| Module group                                                        | Codes         | Phase |    Low |    High | In D | In E |
| ------------------------------------------------------------------- | ------------- | ----: | -----: | ------: | :--: | :--: |
| Foundation: multi-entity, approvals engine, notifications, settings | ADM, APR, NOT |     1 |      6 |      10 |  Y   |  Y   |
| Core HR, attendance import, leave, self-service                     | HR, ATT, LV   |     1 |      8 |      12 |  Y   |  Y   |
| Payroll and statutory (EPF, ETF, APIT, gratuity, payslips, exports) | PAY           |     1 |      6 |      10 |  Y   |  –   |
| Payroll hand-off to the local HRIS (inputs out, journal back)       | PAY, INT      |     1 |      1 |       2 |  –   |  Y   |
| Vendor and talent payments, vouchers, WHT, talent pool              | VP, TAL       |     1 |      6 |       9 |  Y   |  Y   |
| Management ledger: expenses, cash, FX, P&L, budgets, allocations    | FIN           |     1 |      8 |      12 |  Y   |  Y   |
| Sales invoices, receipts, AR, deposits, PayHere                     | SAL, INT      |     1 |      5 |       8 |  Y   |  Y   |
| Projects and pipeline, budget vs actual, AI cost                    | PRJ, AI       |     1 |      5 |       8 |  Y   |  Y   |
| Studio, room, gear and crew booking, check-out and check-in         | BKG           |     1 |      6 |       9 |  Y   |  Y   |
| Basic dashboards                                                    | RPT           |     1 |      2 |       3 |  Y   |  Y   |
| Phase 1 QA, data migration, UAT, training                           | all           |     1 |      4 |       6 |  Y   |  Y   |
| Offline service POS (PWA), shifts, vouchers                         | POS           |     2 |      4 |       7 |  Y   |  Y   |
| Quotes, retainers, client portal                                    | CRM, SAL      |     2 |      3 |       5 |  Y   |  Y   |
| Deliverables, approvals, rights, consents                           | AST           |     2 |      5 |       8 |  Y   |  Y   |
| Accounting sync adapter, WhatsApp, ClickUp                          | INT, NOT      |     2 |      5 |       8 |  Y   |  Y   |
| Second entity (SG) and full reporting                               | FIN, RPT      |     2 |      3 |       5 |  Y   |  Y   |
| Phase 2 QA and hardening                                            | all           |     2 |      4 |       6 |  Y   |  Y   |
| **Total, D**                                                        |               |       | **80** | **126** |      |      |
| **Total, E** (Phase 1: 51 to 79; Phase 2: 24 to 39)                 |               |       | **75** | **118** |      |      |

The phase split is the CFO's suggestion. The Product Owner sets MVP scope in `docs/discovery/21-mvp-roadmap.md`.

### 3.3 Blended rates (Sri Lankan market)

| Delivery model                              | Rate per person-week (LKR) | About USD per hour | Evidence                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------- | -------------------------: | -----------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lean: in-house contract lead plus AI agents |                    115,000 |                8.6 | Section 3.1 team, about LKR 108k per pw, plus tools                                                                                                                                                                                                                                                                                       |
| Blended contract team (base case)           |                    150,000 |               11.3 | Mix of contract staff and some agency or specialist days **(CFO assumption)**                                                                                                                                                                                                                                                             |
| Local software agency                       |                    300,000 |               22.5 | Agencies quote about USD 20 to 40 an hour; GoodFirms median USD 25 ([GoodFirms](https://www.goodfirms.co/directory/country/top-software-development-companies/sri-lanka), [DesignRush](https://www.designrush.com/agency/software-development/lk)). Freelancers about USD 10 to 35 an hour ([Upwork LK](https://www.upwork.com/hire/lk/)) |

### 3.4 Effect of AI-assisted development

The evidence points both ways:

- In a randomised controlled trial, developers using GitHub Copilot finished a greenfield JavaScript task **55.8% faster** (95% confidence interval 21% to 89%) ([Peng et al., arXiv 2302.06590](https://arxiv.org/abs/2302.06590)).
- METR's July 2025 randomised trial found experienced developers working on large codebases they knew well took **19% longer** with AI tools ([TechCrunch on METR](https://techcrunch.com/2025/07/11/ai-coding-tools-may-not-speed-up-every-developer-study-shows)).

ChordusAM sits closer to the first case: a new codebase, mostly forms, ledgers, rules and tests, with strong conventions in CLAUDE.md. Coding is only part of the effort, though. Design, review, testing against statutory examples, UAT and migration do not speed up as much, and AI-written payroll and tax code needs more review. So:

| Scenario     | Effort reduction applied to total effort | Note                                                 |
| ------------ | ---------------------------------------: | ---------------------------------------------------- |
| Conservative |                                      10% | Gains eaten by review and rework                     |
| Base         |                                      25% | Blended team using AI tools                          |
| Lean         |                                      40% | AI agents do most coding; the lead reviews and tests |

This should be tracked as a forecast-accuracy metric: planned against actual person-weeks per module group, reviewed at each gate.

### 3.5 Build cost results (Option E, both phases, plus 15% contingency; conservative uses 25%)

| Delivery model                     | Effort before AI (pw) | After AI (pw) | Phase 1 (LKR m) | Phase 2 (LKR m) | Total (LKR m) | Total (USD k) |
| ---------------------------------- | --------------------: | ------------: | --------------: | --------------: | ------------: | ------------: |
| Lean, mid effort (**recommended**) |                  96.5 |          57.9 |         **5.2** |         **2.5** |       **7.7** |      **23.0** |
| Lean, low effort (optimistic)      |                  75.0 |          45.0 |             3.9 |             1.8 |           5.7 |          17.1 |
| Blended team (base case)           |                  96.5 |          72.4 |             8.4 |             4.1 |          12.5 |          37.5 |
| Agency, mid effort                 |                  96.5 |          86.9 |               – |               – |          32.6 |          97.8 |
| Agency, high effort (conservative) |                 118.0 |         106.2 |            26.7 |            13.2 |          39.8 |         119.6 |

Option D adds about LKR 0.5m to 0.9m to these figures (the PAY module minus the hand-off). Add the LKR 0.6m professional sign-off to every row.

### 3.6 Running costs at AMPL scale

| Item                                               |      USD a month (base) | Range      | Source and note                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------- | ----------------------: | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase Pro (production) plus staging             |                      40 | 30 to 60   | Pro USD 25 per organisation with a USD 10 compute credit; extra projects billed for compute ([Supabase pricing](https://supabase.com/pricing), [Jetadmin guide](https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/)). Daily backups with 7-day retention reported on Pro (secondary)          |
| Vercel Pro                                         |                      40 | 20 to 40   | USD 20 platform fee including 1 deploying seat and USD 20 usage credit; USD 20 per extra member; viewers free ([Vercel docs](https://vercel.com/docs/plans/pro-plan))                                                                                                                                                                     |
| Email (Resend)                                     |                      20 | 0 to 20    | Free 3,000 a month (100 a day); Pro USD 20 for 50,000 ([Resend](https://www.resend.com/docs/knowledge-base/what-is-resend-pricing.md))                                                                                                                                                                                                    |
| WhatsApp utility messages plus BSP fee             |                      31 | 10 to 60   | About 3,000 utility messages × about USD 0.002 in Sri Lanka from 1 October 2026 = USD 6 ([R4 §5.1](research/R4-creative-ops-rights.md), unverified). BSP fee not public; USD 25 assumed                                                                                                                                                   |
| Error monitoring (Sentry Team)                     |                      26 | 0 to 29    | Free developer tier; Team about USD 26 to 29 ([Capterra](https://www.capterra.com/p/165426/Sentry/pricing/), secondary)                                                                                                                                                                                                                   |
| Off-site backups                                   |                       5 | 5 to 105   | Off-site logical dump to object storage (price assumed). Conservative adds point-in-time recovery: USD 100 a month for 7 days ([Supabase PITR](https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery))                                                                                                       |
| Domain                                             |                       0 | 0          | Use a subdomain of alliancemedia.lk. A new .lk domain is about USD 27 to 90 a year ([domainoffer.net](https://domainoffer.net/tld/lk/regery), secondary)                                                                                                                                                                                  |
| AI coding tools for maintenance                    |                     100 | 60 to 200  | Estimate                                                                                                                                                                                                                                                                                                                                  |
| **Total**                                          |                 **262** | 125 to 514 | **About LKR 87,000 a month, LKR 1.05m a year**                                                                                                                                                                                                                                                                                            |
| PayHere fees (common to B to E, excluded from TCO) |                       – | –          | Lite plan 3.30%, no monthly fee; HelaPay 1.99% ([PayHere fees](https://www.payhere.lk/fees), [R3 §5](research/R3-pos-booking-finance.md)). At an assumed LKR 1.5m a month of online collections: **LKR 49,500 a month** on Lite, LKR 29,850 if all were HelaPay, about LKR 47,840 on a reported Plus plan (LKR 2,990 + 2.99%, unverified) |
| Local HRIS (E only)                                |              LKR 25,000 | 10k to 25k | [R2 A.3](research/R2-hris-payroll-sri-lanka.md)                                                                                                                                                                                                                                                                                           |
| Maintenance (people)                               | 8 pw a year (E), 12 (D) | 6 to 16    | Bug fixes, small changes, yearly rule updates                                                                                                                                                                                                                                                                                             |

### 3.7 Running costs at a 10-studio SaaS scale

Assumptions: 10 small studios, about 300 users in total, a shared multi-tenant database, and each studio using its own PayHere merchant account.

| Item                                 | USD a month | Note                                                                       |
| ------------------------------------ | ----------: | -------------------------------------------------------------------------- |
| Supabase Pro + larger compute + PITR |         195 | Medium compute about USD 60 **(unverified)**, PITR USD 100, staging USD 10 |
| Vercel Pro, 3 seats plus usage       |          80 |                                                                            |
| Email                                |          20 | About 30,000 emails a month, inside Pro                                    |
| WhatsApp, 30,000 utility messages    |         110 | USD 60 Meta plus about USD 50 BSP **(unverified)**                         |
| Sentry Business                      |          80 | Secondary source                                                           |
| Uptime and status page               |          20 | **(unverified)**                                                           |
| Off-site backups                     |          20 |                                                                            |
| Product domain                       |           6 |                                                                            |
| AI coding tools                      |         200 |                                                                            |
| Penetration test, amortised          |         250 | About LKR 1m a year **(unverified)**                                       |
| **Infrastructure total**             |     **981** | **About LKR 327,000 a month, LKR 3.9m a year**                             |
| Support, 0.5 FTE                     | LKR 150,000 | Assumption                                                                 |
| **Fixed cost to serve 10 studios**   |             | **About LKR 5.7m a year**                                                  |

**Unit economics (illustration, not a pricing proposal):** at LKR 50,000 per studio a month (about USD 150, compare a local HRIS alone at LKR 25,000), 10 studios bring in LKR 6.0m a year. That covers the fixed cost with about LKR 0.3m to spare, before sales effort and about LKR 1.0m to 1.5m of one-off multi-tenant hardening. Break-even is about **10 studios at LKR 50,000** or **7 at LKR 75,000**. The marginal cost per extra studio is small (about USD 15 to 30 a month for messages, storage and email, estimate), so the SaaS case only becomes interesting at about 25 or more studios. That needs market validation (`docs/discovery/12-benchmark-usp.md`) before any SaaS-specific spend.

---

## 4. Benefits model

All benefits are annual run-rates in LKR, given as conservative, base and optimistic. They are **CFO estimates to be replaced by a two-week time and leakage study** (open question 3). Time savings are valued at loaded cost (A-09). They are only cash if the time goes into billable work or avoids a hire, and section 4.6 handles that separately.

### 4.1 Baseline drivers (assumptions)

| Driver                                          | Conservative |      Base | Optimistic |
| ----------------------------------------------- | -----------: | --------: | ---------: |
| Revenue (A-05)                                  |      LKR 60m |   LKR 90m |   LKR 140m |
| Studio, room and gear revenue                   |       LKR 8m |   LKR 12m |    LKR 18m |
| Production revenue (music videos, ads)          |      LKR 40m |   LKR 60m |    LKR 90m |
| Bookings a month                                |           40 |        60 |         90 |
| Payroll (gross, EPF/ETF-liable), a month        |     LKR 2.4m |  LKR 2.4m |   LKR 2.4m |
| Freelancer fees within the 5% WHT scope, a year |       LKR 6m |   LKR 12m |    LKR 20m |
| AI tools and GPU spend, a month                 |      USD 800 | USD 1,200 |  USD 2,000 |

### 4.2 Time savings

| Process                                                                                | Hours a month today | Saving (c / b / o) |     Hours saved (base) | LKR per hour |            LKR a year (base) |
| -------------------------------------------------------------------------------------- | ------------------: | ------------------ | ---------------------: | -----------: | ---------------------------: |
| Payroll prep (attendance clean-up, leave, calculation, payslips, EPF/ETF/APIT figures) |                  30 | 45% / 65% / 80%    |                   19.5 |        1,300 |                      304,200 |
| Vendor and talent payments (requests, approvals, vouchers, WHT)                        |                  35 | 35% / 55% / 70%    |                   19.3 |        1,300 |                      300,300 |
| Client invoicing, receipts and AR chasing                                              |                  20 | 35% / 55% / 70%    |                   11.0 |        1,100 |                      145,200 |
| Studio, gear and crew booking admin                                                    |                  25 | 35% / 55% / 70%    |                   13.8 |          800 |                      132,000 |
| Month-end close and accountant pack                                                    |                  30 | 30% / 50% / 65%    |                   15.0 |        1,500 |                      270,000 |
| Owner and Admin reporting and chasing                                                  |                  12 | 30% / 50% / 70%    |                    6.0 |        3,500 |                      252,000 |
| **Total**                                                                              |             **152** |                    | **84.5** (c 54, o 108) |              | **1.40m** (c 0.89m, o 1.81m) |

### 4.3 Revenue leakage avoided

| Leak                                                         | Base logic                                                                                                                                   | Conservative |      Base | Optimistic |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | -----------: | --------: | ---------: |
| Unbilled studio hours and add-ons (overruns, engineer, gear) | Studio revenue 12m × 5% leakage × 60% recovered (BKG to SAL link, [R1 P5](research/R1-media-production-erp.md))                              |      120,000 |   360,000 |    945,000 |
| Gear damage and late fees                                    | LKR 150k a year unrecovered × 60% (check-out photos, fee policy, [R3 §3.4](research/R3-pos-booking-finance.md))                              |       37,500 |    90,000 |    225,000 |
| Missed deposits and no-shows                                 | 60 bookings × 12 × 4% no-show × LKR 25k × 50% deposit × 70% captured (PayHere deposit at booking)                                            |      108,000 |   252,000 |    540,000 |
| AR overdue more than 14 days                                 | DSO (days sales outstanding) down 10 days on LKR 90m = LKR 2.5m less cash tied up, at 14% financing cost, plus bad debt down 0.3% of revenue |      235,000 |   615,000 |  1,505,000 |
| Unbilled extra revision rounds and retainer overage          | 6 extra rounds a month × LKR 15k × 40% now billed ([R4-F03, F15](research/R4-creative-ops-rights.md))                                        |      108,000 |   432,000 |  1,200,000 |
| Wasted AI credits and unused seats                           | USD 1,200 a month × 10% saved through the allowance tracker ([R4-F09, F10](research/R4-creative-ops-rights.md))                              |      159,800 |   479,500 |  1,598,400 |
| **Total**                                                    |                                                                                                                                              |    **0.77m** | **2.23m** |  **6.01m** |

The DSO improvement also releases about LKR 2.5m of cash once, in year 1. It is **not** counted in the NPV, so that the financing benefit is not counted twice. The Treasurer view would add it.

### 4.4 Compliance risk avoided (expected value = exposure × probability × reduction)

| Risk                                   | Exposure logic                                                                                                                                                                                                                                                                                                                  | Conservative |      Base | Optimistic |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------: | --------: | ---------: |
| EPF and ETF late surcharges            | Monthly EPF + ETF = 23% × LKR 2.4m = LKR 552k. Two late months a year at a 10% average surcharge. The statutory scale runs from 5% (up to 10 days late) to 50% (over 12 months) ([R2 B.1](research/R2-hris-payroll-sri-lanka.md), [lawnet](https://lawnet.gov.lk/?p=92975))                                                     |       27,600 |   110,400 |    248,400 |
| Contractor misclassification arrears   | 4 "contractors" × LKR 90k × 23% × 24 months × 1.5 (surcharge) = LKR 3.0m exposure, at a 10% annual chance, halved by the classification checklist ([R2-43](research/R2-hris-payroll-sri-lanka.md)). The lookback period is unverified                                                                                           |       37,300 |   149,000 |    335,300 |
| APIT late or wrong deduction           | Remittance due by the 15th ([R2 B.2](research/R2-hris-payroll-sri-lanka.md)). **The penalty and interest rates were not verified** (Inland Revenue Act ss. 157, 159 and 176 onward, [consolidated Act](https://www.taxadvisor.lk/data/uploads/consolidated_inland_revenue_act_no_24_of_2017_.pdf)). A placeholder range is used |       50,000 |   100,000 |    250,000 |
| 5% WHT on freelancer fees not withheld | 5% × LKR 12m in-scope fees = LKR 600k. AMPL bears the tax it fails to withhold, plus a penalty (assumed 25%, **unverified**), at a 30% chance without a system ([R2 B.3](research/R2-hris-payroll-sri-lanka.md), [R3 §6](research/R3-pos-booking-finance.md))                                                                   |       75,000 |   225,000 |    625,000 |
| **Total**                              |                                                                                                                                                                                                                                                                                                                                 |    **0.19m** | **0.58m** |  **1.46m** |

**Not in the NPV, but the biggest risk on this page:** if AMPL is above the VAT threshold (LKR 60m a year or LKR 15m a quarter) and is not registered, the exposure is up to 18% of taxable supplies, about LKR 16m a year at the base revenue. The same logic applies to SSCL at 2.5% of liable turnover above LKR 36m ([R3 §6](research/R3-pos-booking-finance.md)). That is a matter for the accountant now, not a reason to build software. ChordusAM's threshold monitor (section 6, CFO-17) only gives early warning.

### 4.5 Better pricing from project profitability

Once quotes, costs (talent, AI credits at actual FX, studio time) and margin are visible per music video, ad and retainer, AMPL can reprice its loss-making packages. Assumed margin gain on production revenue: 0.25 / 0.75 / 1.5 percentage points, worth **LKR 0.10m / 0.45m / 1.35m** a year. This is the benefit most likely to grow over time.

### 4.6 Capacity: an avoided admin or accounts hire

Growth at 12 to 15 videos a month plus other tracks would probably need an extra admin or accounts assistant at about LKR 1.5m a year loaded. Weighted by probability: **LKR 0 / 0.75m / 1.5m a year from year 2**, counted in full for D and E and at half for B and C.

### 4.7 Total benefits and how much each option captures

| Benefit (run-rate, LKR m a year) | Conservative |     Base | Optimistic |
| -------------------------------- | -----------: | -------: | ---------: |
| Time savings                     |         0.89 |     1.40 |       1.81 |
| Leakage avoided                  |         0.77 |     2.23 |       6.01 |
| Compliance (expected value)      |         0.19 |     0.58 |       1.46 |
| Pricing                          |         0.10 |     0.45 |       1.35 |
| Capacity (from year 2)           |         0.00 |     0.75 |       1.50 |
| **Total**                        |     **1.95** | **5.42** |  **12.13** |

Share of the full benefit each option captures (time / leakage / compliance / pricing), and the ramp over years 1 to 3:

| Option | Capture                                                                                  | Ramp Y1 / Y2 / Y3 |
| ------ | ---------------------------------------------------------------------------------------- | ----------------- |
| B      | 45% / 45% / 45% / 35%. No WHT, AI cost or rights; manual deposits; double entry          | 70% / 90% / 100%  |
| C      | 65% / 70% / 60% / 70%. Broad, but generic, and SL payroll comes from an unaudited module | 50% / 85% / 100%  |
| D      | 100% across the board (designed for it)                                                  | 50% / 90% / 100%  |
| E      | 95% / 100% / 95% / 100%. The payroll hand-off costs a little time and control            | 55% / 90% / 100%  |

---

## 5. Payback, NPV and sensitivity

### 5.1 Method

- **Cash flows:** incremental to Option A. Year 0 is the setup year (build or implementation, half a year of running cost). Years 1 to 3 are operations. A 5-year view is shown too, because a built system lasts longer than three years and a 3-year horizon favours subscriptions.
- **Discount rate: 18% nominal in LKR.** The 364-day Treasury bill yield was 9.95% in early October 2026 ([Daily FT](https://www.ft.lk/financial-services/T-Bill-rates-surge-over-100bps-after-CBSL-Policy-Rate-hike-auction-undersubscribed/42-792540)), the policy rate is 8.75% after the May 2026 rise ([CBSL](https://www.cbsl.gov.lk/en/news/monetary-policy-review-no-4-of-2026)), and CCPI inflation was 8.3% in October ([Daily FT](https://www.ft.lk/front-page/CCPI-inflation-rises-to-8-3-in-Oct/44-799448)). On top of the risk-free rate the model adds about 8 points for a small private company and project risk **(assumption)**. Sensitivity runs at 14% and 24%.
- **Taxes:** pre-tax. Income tax effects (capital allowances on software, deductibility) are for the accountant and would improve every option a little.

### 5.2 Results

| Option (scenario)                                   | 3-yr NPV, LKR m | 5-yr NPV, LKR m | Payback (years)                  |
| --------------------------------------------------- | --------------: | --------------: | -------------------------------- |
| B, base                                             |            −6.0 |            −7.5 | Never (licences exceed benefits) |
| B, conservative / optimistic                        |    −13.1 / +2.5 |                 | – / 1.3                          |
| C, base                                             |           −17.0 |           −18.8 | Never                            |
| C, conservative / optimistic                        |    −39.6 / −1.1 |                 | – / 2.5                          |
| D, base (blended team)                              |           −11.7 |            −9.7 | More than 5                      |
| D, lean delivery, base benefits                     |            −6.0 |            −3.7 | 4.9                              |
| E, base (blended team)                              |           −10.5 |            −8.4 | More than 5                      |
| **E, lean delivery, base benefits (recommended)**   |        **−5.4** |        **−3.1** | **4.6**                          |
| E, lean delivery, low effort, base benefits         |            −0.7 |            +2.8 | 2.6                              |
| E, Phase 1 only, lean, base benefits                |            −4.5 |            −2.8 | 4.8                              |
| E, conservative (agency, high effort, low benefits) |           −49.5 |                 | Never                            |
| E, optimistic (low effort, high benefits)           |           +10.4 |                 | 1.2                              |

Recommended path, cash flows (E, lean delivery, base benefits, LKR m):

| Year              |        0 |        1 |        2 |        3 |        4 |        5 |
| ----------------- | -------: | -------: | -------: | -------: | -------: | -------: |
| Benefits          |      0.0 |      2.5 |      4.9 |      5.3 |      5.3 |      5.3 |
| Costs             |      7.1 |      4.5 |      2.5 |      2.6 |      2.7 |      2.9 |
| **Net cash flow** | **−7.1** | **−2.0** | **+2.3** | **+2.7** | **+2.6** | **+2.4** |

### 5.3 Sensitivity (E, lean delivery, 5-year NPV; base −LKR 3.1m)

| Driver (low / high)                                         | NPV at low (LKR m) | NPV at high (LKR m) | Swing |
| ----------------------------------------------------------- | -----------------: | ------------------: | ----: |
| Benefits −30% / +30%                                        |               −7.2 |                +1.1 |   8.3 |
| All costs +20% / −20%                                       |               −6.4 |                +0.3 |   6.7 |
| AMPL revenue LKR 60m / 150m (revenue-linked benefits scale) |               −5.1 |                +1.1 |   6.2 |
| Build rate LKR 150k / 100k per pw                           |               −6.0 |                −1.8 |   4.2 |
| AI effect 25% / 50%                                         |               −4.9 |                −1.8 |   3.1 |
| Go-live slips 6 months / on time                            |               −5.8 |                −3.1 |   2.7 |
| Discount rate 24% / 14%                                     |               −3.8 |                −2.4 |   1.4 |
| Phase 2 deferred (Phase 1 only)                             |                    |                −2.8 |   0.3 |

FX barely moves Options D and E, because build and support are in LKR; only about USD 262 a month of running cost is in USD. It matters more for B, where about 87% of licences are USD-priced. At LKR 370 per USD, B's 3-year licences rise by about LKR 0.9m.

**Break-even:** at base benefits and base running costs, E's total build budget (both phases and the professional fees) would have to stay under about **LKR 2.0m for a 3-year break-even** and **LKR 4.2m for 5 years**. The lean plan is LKR 8.3m, so the case rests on three things: lean delivery, AMPL's actual revenue band, and leakage capture. The two biggest levers are **keeping costs down** (run cost plus maintenance is about LKR 2.4m a year, nearly half the benefit) and **turning the leakage controls on early** (deposits, booking-to-invoice, AR chasing).

### 5.4 What this means

1. **On AMPL's own hard benefits, every option loses money over three years in the base case.** AMPL is a small business (base revenue about USD 270k a year), and USD 40k to 80k systems are large against that.
2. **B loses least in the base case, but it is a weak investment too.** It keeps five tools, USD price exposure and the main gaps (WHT, AI cost, rights, deposits). Over five years it gets worse (−7.5m), because its licences grow while D and E's costs fall after the build.
3. **E with lean delivery is the best risk-adjusted choice.** It has the best fit, it beats B by year 5 in the mid case, it is positive with low effort or higher revenue, and it builds an asset with SaaS option value.
4. **The conservative case (an agency, high effort) is very bad** (−LKR 49.5m). The plan must cap spend and keep the scope inside gates.

---

## 6. Finance-module requirements (CFO view)

The BRD (`docs/discovery/10-brd.md`) does not exist yet. Candidate IDs below are **CFO-nn**, each with the module code the BA should number it under (for example BR-FIN-0xx). Upstream references use research IDs and PLAN.md sections, as the brief's section 7 asks. Priority: **M** = must for Phase 1 MVP, **S** = should (Phase 1 if cheap, otherwise Phase 2), **C** = could, later.

**Data-model note:** items marked † add tables or columns to PLAN.md section 9. Under CLAUDE.md the owner must approve them first. The Solution Architect should propose them in `docs/discovery/20-solution-design.md`.

### 6.1 Ledger structure and the accountant's package

| ID     | Module (BR code) | Requirement                                                                                                                                                                                                                                                                                                                                                                            | Priority | Upstream                                                                                   |
| ------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | ------------------------------------------------------------------------------------------ |
| CFO-01 | FIN              | **Journal-shaped management ledger.** Keep PLAN.md's management ledger (not statutory books), but store every posting as balanced lines (account, debit, credit, entity, project, brand or channel, tax code, currency, rate, base amount). Then sync, audit and P&L drill-down all read one structure, and auto-posts (payroll, vendor payments, POS, receipts) cannot unbalance it † |    M     | PLAN §6, §9; [R3 §4.2](research/R3-pos-booking-finance.md)                                 |
| CFO-02 | FIN, INT         | **Chart of accounts (CoA) mapping** per entity: management categories (PLAN §6.2 starter set) map to the accountant's CoA codes and tax codes, effective-dated. An unmapped category blocks export. Tracking dimensions: project, client, brand or channel (The Studio LK, Varnam TV and others) as profit centres, department †                                                       |    M     | PLAN §6.2; [R1 §7.8](research/R1-media-production-erp.md)                                  |
| CFO-03 | INT              | **Accountant export, then sync.** Phase 1: a monthly journal batch export (XLSX/CSV in the package's import format) with a pre-flight check (mapped, balanced, period locked). Phase 2: an API sync adapter that stores the external ID per record and pulls payment status back. First target is whichever package the accountant uses (open question 4)                              |  M / S   | [R1 P12](research/R1-media-production-erp.md), [R3 §8](research/R3-pos-booking-finance.md) |
| CFO-04 | FIN              | **Bank statement import and matching** (CSV), because direct bank feeds for Sri Lankan banks were not confirmed in any package. Match receipts and payments by amount, date and reference                                                                                                                                                                                              |    S     | [R3 §7.3](research/R3-pos-booking-finance.md)                                              |

### 6.2 Multi-entity and multi-currency

| ID     | Module (BR code) | Requirement                                                                                                                                                                                                                                                                                                                        | Priority | Upstream                                                                                      |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | --------------------------------------------------------------------------------------------- |
| CFO-05 | FIN, ADM         | **Entities** (AMPL now, Media Digital SG later): `entity_id` on every money, payroll and document record; per-entity base currency (LKR, SGD), tax profile, document sequences, CoA mapping and accounting tenant. The MVP has one entity, but the column exists from day one †                                                    |    M     | [R2-34](research/R2-hris-payroll-sri-lanka.md), [R3 §4.2](research/R3-pos-booking-finance.md) |
| CFO-06 | FIN              | **Intercompany:** recharges between AMPL and SG (shared staff, AI tools, production work) are recorded on both sides with a shared reference; intercompany balances must net to zero before close; consolidated management P&L in LKR at the period's average rate. Transfer-pricing treatment for the accountant **(unverified)** |    C     | Brief §4                                                                                      |
| CFO-07 | FIN              | **Rates table:** currency, date, rate, **source** (default the CBSL daily rate; the accountant confirms which CBSL rate the books use), entered by or with override, and a reason for any override. Entered by hand at first: the CBSL site could not be reached from this session, and an automated feed is unverified †          |    M     | PLAN §3, §9 (`fx_rate`); [R1 §7.2](research/R1-media-production-erp.md)                       |
| CFO-08 | FIN, VP, SAL     | **Actual rate on settlement:** for USD card charges (Higgsfield, Suno, Claude, ClickUp, GPU), record the LKR the bank actually debited and derive the implied rate; the bank's FX mark-up shows as a fee                                                                                                                           |    M     | [R4 §4.2](research/R4-creative-ops-rights.md)                                                 |
| CFO-09 | FIN              | **Realised FX gain or loss:** when a USD or SGD invoice or bill is settled at a different rate from booking, post the difference to FX gain/loss automatically. **Unrealised** month-end revaluation of open foreign-currency AR, AP and bank balances is optional (management view)                                               |  M / C   | PLAN §9                                                                                       |

### 6.3 Revenue, WIP, deposits and cash

| ID     | Module (BR code) | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Priority | Upstream                                                                                   |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | ------------------------------------------------------------------------------------------ |
| CFO-10 | SAL, FIN         | **Revenue recognition, management view.** Billing is not revenue. Policy is set per contract type, as data: **retainers** (SMM, SEO) are recognised monthly over the service period, or by quota delivered; **milestone projects** (music videos, ads) on milestone acceptance (client approval event, [R4-F02](research/R4-creative-ops-rights.md)) or by pipeline stage completion. Produces **deferred revenue** (billed, not earned) and **unbilled revenue** (earned, not billed). Statutory recognition stays with the accountant; which framework AMPL reports under (full SLFRS or SLFRS for SMEs) is to be confirmed **(unverified)** |    M     | [R1 P11](research/R1-media-production-erp.md), [R4 §6](research/R4-creative-ops-rights.md) |
| CFO-11 | PRJ, FIN         | **WIP and unbilled report:** costs on projects not yet invoiced, by age; completed bookings with no invoice after 48 hours raise an alert; month-end accruals list for the accountant                                                                                                                                                                                                                                                                                                                                                                                                                                                          |    M     | [R1 P7](research/R1-media-production-erp.md)                                               |
| CFO-12 | SAL, POS, BKG    | **Deposits and advances are liabilities** until earned: client deposits and advances (contract liabilities), refundable or non-refundable per policy; a forfeited deposit becomes income on no-show; **gear security deposits** are held as a liability and netted against damage charges; the deposit register reconciles to PayHere settlements †                                                                                                                                                                                                                                                                                            |    M     | [R3 §3.4, §8](research/R3-pos-booking-finance.md)                                          |
| CFO-13 | VP, FIN          | **Vendor advances** (PLAN §5.3 partial payments) are prepayments until the service is delivered, then cleared against the final bill                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |    M     | PLAN §5.3                                                                                  |
| CFO-14 | POS, FIN         | **Petty cash** on an imprest float per custodian: vouchers with receipt photos, top-ups that reconcile, count variance, limits as policy data. POS cash drawers are kept separate from petty cash. **Shift close** with cash count, Z report and variance posted to FIN                                                                                                                                                                                                                                                                                                                                                                        |  M / S   | PLAN Q11; [R3 §7.1](research/R3-pos-booking-finance.md)                                    |
| CFO-15 | POS, SAL         | **Vouchers and gift cards** are a liability until redeemed; expiry and breakage policy as data                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |    C     | [R3 §7.1](research/R3-pos-booking-finance.md)                                              |

### 6.4 Budgets, allocation and profitability

| ID     | Module (BR code) | Requirement                                                                                                                                                                                                                                                                                                                                                                                       | Priority | Upstream                                                |
| ------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | ------------------------------------------------------- |
| CFO-16 | FIN, PRJ         | **Budgets and forecasts as separate versions:** an annual budget by category, project and brand, phased monthly (the budget is the contract); a rolling forecast updated monthly (the forecast is the current view). Project budgets come from the accepted quote lines, and actuals show against them (budget-aware booking, [R1 P3, P4](research/R1-media-production-erp.md))                   |    S     | PLAN §6.3                                               |
| CFO-17 | AI, FIN          | **Shared AI subscription allocation:** each month, pool each subscription's actual LKR cost and allocate it to projects by a driver chosen in policy (equal per active project, by video minutes, or by logged credits). **Unused credits go to an "AI capacity unused" line, not to projects**, so waste is visible. The allocation posts as a journal and is re-runnable until the period locks |    M     | [R4-F09, F10](research/R4-creative-ops-rights.md)       |
| CFO-18 | PRJ, PAY         | **Staff cost to projects:** payroll cost (from the HRIS journal in E) allocated to projects by simple time allocation or a standard rate per role. Without it, project margin ignores the in-house team                                                                                                                                                                                           |    S     | [R1 §5 timesheets](research/R1-media-production-erp.md) |
| CFO-19 | RPT              | **Profitability views:** per project, per music video, per client, per track (music video, photo, ads, studio, SMM/SEO) and per brand or channel. Margin against quote, and AI cost per video in USD and LKR                                                                                                                                                                                      |    M     | PLAN §6.3; [R4-F11](research/R4-creative-ops-rights.md) |

### 6.5 Tax handling (VAT, SSCL, WHT, stamp duty)

All rates, thresholds and dates are **effective-dated rows edited by Finance**, with rule functions in `lib/rules/` (CLAUDE.md), because every one of them changed in the last 18 months ([R3 §6](research/R3-pos-booking-finance.md)).

| ID     | Module (BR code) | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                       | Priority | Upstream                                                                                              |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | ----------------------------------------------------------------------------------------------------- |
| CFO-20 | FIN, SAL, POS    | **Tax codes** (VAT 18% standard, zero-rated export, exempt, out of scope), effective-dated †. Invoices and POS receipts follow the IRD tax invoice format in force since 1 October 2026 when AMPL is VAT-registered (supplier TIN, buyer TIN when registered, per-line VAT)                                                                                                                                                       |    M     | [R3 §6](research/R3-pos-booking-finance.md)                                                           |
| CFO-21 | FIN              | **VAT and SSCL threshold monitor:** rolling 12-month and quarterly taxable supplies against the configured thresholds (VAT LKR 60m / 15m; SSCL LKR 36m / 9m), with turnover split **by activity** (services vs retail of prints and merch), because the SSCL liable share differs                                                                                                                                                 |    M     | [R3 §6](research/R3-pos-booking-finance.md)                                                           |
| CFO-22 | VP, TAL          | **WHT at source:** 5% on service fees to resident individuals once a payee's monthly total exceeds LKR 100,000, using service-category rules (artists, performers, photographers, writers, social media professionals and others since June 2026); 14% for non-residents and 10% on rent, both **unverified**. Monthly aggregation per payee across requests; auto-suggested WHT line; free WHT certificate; monthly WHT schedule |    M     | [R2-44](research/R2-hris-payroll-sri-lanka.md), [R3 §6](research/R3-pos-booking-finance.md), PLAN Q10 |
| CFO-23 | VP, FIN          | **Foreign VAT charged** by non-resident digital vendors (18% from 1 July 2026 when AMPL is not VAT-registered): a field on expense entries, so the true cost of AI tools is visible                                                                                                                                                                                                                                               |    S     | [R3 §6](research/R3-pos-booking-finance.md)                                                           |
| CFO-24 | SAL, POS         | **Stamp duty** flag (LKR 25) on receipts of LKR 25,000 or more, and a monthly stamp duty report **(2026 status unverified; accountant to confirm)**                                                                                                                                                                                                                                                                               |    S     | [R3 §6](research/R3-pos-booking-finance.md)                                                           |
| CFO-25 | INT              | **RAMIS e-invoice outbox** (idempotent, retried, audited) behind an adapter, for when the IRD specification is obtained and AMPL is in scope                                                                                                                                                                                                                                                                                      |    C     | [R3 §6](research/R3-pos-booking-finance.md)                                                           |
| CFO-26 | PAY, FIN         | **Payroll journal in (E):** import the HRIS journal (gross, EPF 8% and 12%, ETF 3%, APIT, net, deductions) mapped to the CoA. Statutory liabilities carry due dates (APIT by the 15th, EPF and ETF by month end) and appear in the payables calendar. Monthly **gratuity provision** accrues per employee once the 15-workmen threshold applies                                                                                   |    M     | [R2-29, R2-32](research/R2-hris-payroll-sri-lanka.md)                                                 |

### 6.6 Controls

| ID     | Module (BR code) | Requirement                                                                                                                                                                                                                                                                                       | Priority | Upstream                                                          |
| ------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | ----------------------------------------------------------------- |
| CFO-27 | APR, VP, SAL     | **Segregation of duties**, enforced on the server and in RLS: requester ≠ approver ≠ payer; the person who changes vendor bank details cannot pay that vendor on the same day; Finance records receipts but cannot approve its own write-offs; Admins cannot approve their own requests (PLAN §2) |    M     | PLAN §2, §5.3; CLAUDE.md                                          |
| CFO-28 | APR              | **Approval limit matrix as data:** by document type, amount band and entity. Default from PLAN.md: above LKR 15,000 needs one Admin. **Suggestion for the owner to decide:** above LKR 250,000, or any bank-detail change, needs two Admins                                                       |    M     | PLAN §5.3, Q9                                                     |
| CFO-29 | VP, SAL, POS     | **Gapless numbering** per entity, document type and year, from `doc_sequences` inside a transaction; voids are kept and shown, never deleted; corrections are credit notes or reversing entries                                                                                                   |    M     | PLAN §5.4, §9                                                     |
| CFO-30 | FIN              | **Period lock:** a soft close after month-end (Finance only), then a hard lock after the accountant export (Admin unlock with a reason, audited). Changes to a locked period post as reversing entries in the open period †                                                                       |    M     | [R1 P12](research/R1-media-production-erp.md)                     |
| CFO-31 | VP, ADM          | **Master-data controls:** duplicate vendor detection (name plus NIC, BRN or bank account) and duplicate bill detection (vendor plus amount plus date window); bank-detail changes alert Finance and Admins, with a cooling-off period before the next payment                                     |    M     | PLAN §5.1                                                         |
| CFO-32 | ADM              | **Audit:** the `audit_row_change()` trigger on every money table; read logging on salary, NIC and bank fields                                                                                                                                                                                     |    M     | `docs/phase-0.md`; [R2-33](research/R2-hris-payroll-sri-lanka.md) |
| CFO-33 | FIN              | **Close checklist** in the app: bank reconciled, PayHere settlements matched, deposits register reconciled, POS shifts closed, AI allocation run, HRIS journal imported and reconciled (headcount and gross pay), WHT schedule produced, export pre-flight passed                                 |    S     | –                                                                 |

---

## 7. Funding, phasing and the KPIs the CFO will track

### 7.1 Funding and phasing

| Gate | When                                | What is funded                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Budget                                                                                                                                    | Exit criteria to pass the gate                                                                                                                                                                                                                                                    |
| ---- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Now (November 2026)                 | Accountant review of VAT/SSCL registration, WHT since June 2026, APIT practice and payroll classification; name the DPO before 1 January 2027; subscribe to the local payroll SaaS; open a PayHere merchant account; a two-week time and leakage study to replace section 4's estimates                                                                                                                                                                                                                                                               | About LKR 25,000 a month (HRIS) plus accountant fees (not quoted)                                                                         | Compliance position known; baseline KPIs measured; delivery lead contracted                                                                                                                                                                                                       |
| 1    | Months 1 to 6                       | **Phase 1 MVP**, lean delivery. Suggested order by benefit per person-week (base case, before the AI effect): (1) sales invoices, AR and deposits with PayHere (about LKR 180k of benefit a year per pw); (2) studio and gear booking linked to invoices (about 110k); (3) project profitability and AI allocation, plus the month-end export (about 90k); (4) vendor and talent payments with WHT (about 70k); (5) HR, attendance and leave with the payroll hand-off (about 60k). The PO sets the final order in `docs/discovery/21-mvp-roadmap.md` | **Cap LKR 6.0m (about USD 18k)** all-in, including the LKR 0.6m professional sign-off. Review if the forecast at completion goes above it | After 3 months live: at least 90% of vendor payments and invoices go through ChordusAM; AR over 14 days down at least 25% from baseline; unbilled completed bookings under 2%; month-end close in 5 working days or fewer; measured benefit run-rate at least LKR 300,000 a month |
| 2    | Months 7 to 10, if Gate 1 is passed | Phase 2: offline POS, quotes, retainers and client portal, deliverables, rights and consents, accounting API sync, WhatsApp, SG entity                                                                                                                                                                                                                                                                                                                                                                                                                | LKR 2.5m (lean) to 4.1m (blended)                                                                                                         | Either the Gate 1 KPIs are met, or at least 3 other studios sign letters of intent at LKR 50,000 or more a month (SaaS validation). PDPA and rights items may be pulled forward if the lawyer says so                                                                             |
| 3    | Year 2, optional                    | Multi-tenant SaaS hardening, payroll in-house (if the HRIS hand-off is painful), RAMIS e-invoicing                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Separate business case                                                                                                                    | 10 or more committed studios, or an IRD mandate                                                                                                                                                                                                                                   |

**Funding source:** from operating cash flow. A Phase 1 spend of LKR 6.0m over six months is about LKR 1.0m a month, roughly 13% of the assumed monthly revenue of LKR 7.5m. If cash is tight, slow the delivery pace; do not hand the work to an agency on a fixed price, because the conservative case shows how badly that ends.

### 7.2 KPIs the CFO will track after go-live

Each KPI has a definition and a baseline from the Gate 0 study. Targets below are proposals.

| KPI                                      | Definition                                                                     | Target (proposal)                           | Ties to        |
| ---------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------- | -------------- |
| DSO                                      | AR ÷ trailing-90-day revenue × 90                                              | −10 days against baseline                   | SAL, leakage   |
| AR over 14 days                          | Share and LKR value of AR more than 14 days overdue                            | Down 25%, then 50%                          | PLAN §6.1      |
| Unbilled WIP days                        | Days from booking completion or milestone approval to invoice                  | 2 days or fewer                             | CFO-11         |
| Booked vs billed studio hours            | Billed hours ÷ booked and used hours                                           | 98% or more                                 | BKG, SAL       |
| Deposit coverage and no-show rate        | Share of bookings with a deposit paid; no-shows ÷ bookings                     | 90% or more; tracked                        | CFO-12         |
| Gear damage recovery                     | Damage cost recovered ÷ damage cost incurred                                   | 60% or more                                 | BKG            |
| Gross margin by track and by video       | (Revenue − talent − AI − studio − allocated staff) ÷ revenue                   | Tracked; floor per package set by owner     | CFO-19         |
| Quote accuracy                           | Actual cost ÷ quoted cost per project (forecast accuracy)                      | Within ±10%                                 | PRJ            |
| AI cost per video and credit utilisation | Allocated AI cost per music video (USD and LKR); credits used ÷ credits bought | Utilisation 80% or more                     | CFO-17         |
| Payroll and freelancer cost % of revenue | As named                                                                       | Tracked against budget                      | PAY, VP        |
| Statutory on-time rate                   | APIT by the 15th, EPF and ETF by month end, WHT schedule on time               | 100%                                        | CFO-26, CFO-22 |
| Month-end close days                     | Working days from month end to locked period and accountant export             | 5 or fewer                                  | CFO-30, CFO-33 |
| Revenue forecast accuracy                | abs(forecast − actual) ÷ actual, one month ahead                               | Within ±10%                                 | CFO-16         |
| System adoption                          | Share of payments, invoices and bookings raised in ChordusAM                   | 90% or more                                 | All            |
| Run cost vs plan                         | Monthly hosting and maintenance against section 3.6                            | Within plan (about LKR 200k a month all-in) | TCO            |
| Benefit realisation                      | Measured benefits ÷ section 4 base case, reviewed quarterly                    | 80% or more by month 12                     | This document  |

---

## 8. Open questions

| #   | Question                                                                                                                                                                   | Who                | Why it matters here                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| 1   | Actual headcount by status: employees, retainer contractors, per-job freelancers. How many freelancers are paid more than LKR 100,000 in a month?                          | Thoshan, Abilasini | HRIS tier, gratuity threshold, WHT scope, misclassification exposure             |
| 2   | Revenue band and mix by track for the last 12 months (music video, photo, ads, studio, SMM/SEO), and online collection volume                                              | Janaka             | Every benefit scales with it; the VAT and SSCL position depends on it            |
| 3   | Can we run a two-week time and leakage study (hours per process, unbilled sessions, no-shows, AR ageing, revision rounds)?                                                 | Thoshan            | It replaces section 4's estimates before Gate 1                                  |
| 4   | Which accounting package does the external accountant use, and will they accept a journal export or an API sync? Can we have their chart of accounts?                      | Janaka, accountant | CFO-02, CFO-03; the first sync target                                            |
| 5   | Is AMPL registered for VAT and SSCL today? Has WHT been withheld on freelancer fees since June 2026? Is APIT deducted, and how are "net" contracts grossed up?             | Accountant         | The biggest tail risks (section 4.4)                                             |
| 6   | Does Media Digital SG exist and trade? Does it bill AMPL or clients? Any intercompany recharges?                                                                           | Thoshan            | Whether multi-entity (CFO-05, CFO-06) moves into the MVP                         |
| 7   | Which reporting framework does AMPL use (full SLFRS or SLFRS for SMEs)? Does the accountant want deferred and unbilled revenue at month end?                               | Accountant         | CFO-10                                                                           |
| 8   | Which bank does AMPL use, in what statement format, and is there a bulk payment file format?                                                                               | Janaka             | CFO-04, payment batches                                                          |
| 9   | Monthly USD spend on AI tools and GPU, and which plans are held                                                                                                            | Thoshan            | CFO-17; the AI-waste benefit                                                     |
| 10  | Studio, room and gear revenue, bookings a month, and whether gear is rented out                                                                                            | Thoshan            | The booking leakage benefits                                                     |
| 11  | Preferred delivery model and budget ceiling: an in-house contract lead with AI agents, a blended team, or an agency?                                                       | Thoshan            | The single biggest cost driver (section 3.5)                                     |
| 12  | How much is the SaaS option worth to the owner? Would 3 studios sign letters of intent?                                                                                    | Thoshan            | It justifies, or does not justify, the NPV gap and Phase 2                       |
| 13  | Does the local HRIS offer an API or a CSV import/export for payroll inputs and journals?                                                                                   | CFO, with vendor   | E's interface cost and risk                                                      |
| 14  | Exact penalty and interest rates for late APIT and WHT under the Inland Revenue Act (ss. 157, 159, 176 onward) as amended in 2026                                          | Accountant         | The compliance values are placeholders until confirmed                           |
| 15  | Research gaps to close: Odoo partner quotes in LKR, Odoo.sh pricing, WhatsApp BSP fees, Supabase compute tiers, Zapier/Make prices, and the CBSL rate on the decision date | CFO, SA            | TCO precision; vendor and CBSL sites were blocked or not fetched in this session |

---

## 9. Assumption register

| ID   | Assumption                                                                 | Value (c / b / o)                                                                      | Owner to verify              |
| ---- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------- |
| A-01 | USD/LKR                                                                    | 333 (sensitivity 300 / 370)                                                            | CFO, on decision date        |
| A-02 | SGD/LKR                                                                    | 260 (unverified for November)                                                          | CFO                          |
| A-03 | INR/USD (Odoo billing)                                                     | 93.9                                                                                   | CFO                          |
| A-04 | Staff and users                                                            | 20 staff, about 25 users                                                               | Thoshan                      |
| A-05 | Revenue                                                                    | LKR 60m / 90m / 140m                                                                   | Janaka                       |
| A-06 | Common costs excluded (accountant's package, PayHere fees, existing tools) | –                                                                                      | –                            |
| A-07 | Phase 0 is sunk                                                            | –                                                                                      | –                            |
| A-08 | Recurring cost escalation                                                  | 10% / 8% / 5% a year                                                                   | CFO                          |
| A-09 | Loaded hourly cost by role                                                 | LKR 710 to 3,500                                                                       | Janaka                       |
| A-10 | Build effort before AI, E                                                  | 118 / 96.5 / 75 pw                                                                     | Tech Lead (22-delivery-plan) |
| A-11 | AI effort reduction                                                        | 10% / 25% / 40%                                                                        | Tech Lead, tracked           |
| A-12 | Rate per person-week                                                       | LKR 300k / 150k / 115k                                                                 | Thoshan                      |
| A-13 | Contingency                                                                | 25% / 15% / 10%                                                                        | CFO                          |
| A-14 | Running cost, AMPL                                                         | USD 514 / 262 / 125 a month (24 §8: about USD 412 from Phase 7; re-base, review RV-06) | DevOps (24-devops-plan)      |
| A-15 | Maintenance                                                                | E: 11 / 8 / 6 pw a year; D: 16 / 12 / 8                                                | Tech Lead                    |
| A-16 | Benefit drivers                                                            | Section 4.1 to 4.6                                                                     | Gate 0 study                 |
| A-17 | Option capture and ramp                                                    | Section 4.7                                                                            | CFO                          |
| A-18 | Discount rate                                                              | 18% (sensitivity 14% / 24%)                                                            | CFO                          |
| A-19 | B implementation, C implementation and customisation, C support            | Ranges in sections 2.3 and 2.4; no quotes                                              | CFO, vendor quotes           |
| A-20 | WHT penalty factor and APIT penalty values                                 | Placeholders (unverified)                                                              | Accountant                   |

The model behind these tables is a short Python script. The CFO can re-run it when the Gate 0 data arrives. It is kept outside the repository because the brief allows no code changes in this exercise.
