# 12: Benchmark, positioning and USPs

**Date:** 9 November 2026
**Author:** PMM, Product Marketing Manager (discovery team)
**Upstream read:** `docs/discovery/00-brief.md` (all), `docs/PLAN.md` section 1, `docs/discovery/research/R1-media-production-erp.md`, `R2-hris-payroll-sri-lanka.md`, `R3-pos-booking-finance.md`, `R4-creative-ops-rights.md`.
**Requirement IDs:** `docs/discovery/10-brd.md` does not exist yet, so this file cites module codes from the brief (section 7, for example `VP`, `TAL`) and research IDs (for example `R2-44`, `R4-F09`). The BA can map them to `BR-*` IDs later.

## 1. Summary

I benchmarked ten products that AMPL could adopt instead of building ChordusAM. Five are agency or media tools (Scoro, Productive.io, Streamtime, farmerswife, Rentman). Two are general ERPs (Odoo, ERPNext with Frappe HR). One is a Sri Lankan payroll product (Humanised). Two are studio or POS point tools (Studio Ninja, Loyverse). I scored them on 14 weighted criteria. **Odoo scores highest at 53/100, ERPNext 40, and every vertical tool 23 to 31.** The status quo (spreadsheets, WhatsApp and ClickUp) scores 27. ChordusAM's _target_ score is 79, but that is a design goal, not a measured result. Three findings matter most. First, **two candidate USPs fail the honesty test.** Odoo has an official WhatsApp app with invoice and POS-receipt templates (Enterprise only), and fingerprint import is standard in Sri Lankan HRIS products (Gallery HR, MiHCM) and in Frappe HR. So "WhatsApp-first" and "fingerprint import" are features, not USPs. "Sri Lankan payroll" on its own is not a USP either: local HRIS products already do it for about LKR 10,000 to 25,000 a month. Second, the **defensible ground is linking money to creative facts**: freelancer payouts with withholding tax (WHT), per-video margin including USD AI credits, and a rights and consent register that can block a publish. No product in the research does any of these. Third, **inside AMPL the real competitor is the status quo**, not Odoo. Adoption should start with high-frequency, low-risk staff tasks (leave, attendance, payslips), then payments, then a two-month payroll parallel run.

---

## 2. Audiences, ICPs and personas

### 2.1 Audience A (primary): AMPL staff

**The job ChordusAM is hired for:** replace "ask on WhatsApp, record in a spreadsheet, chase later" with one place where requests, approvals and money are recorded once (`docs/PLAN.md` section 1).

**Competing alternative:** the status quo. It is free, familiar and fast for one-off messages. It fails on memory, audit and totals: nobody can answer "what did this video cost?" or "who approved this payment?" without digging through chats (`00-brief.md` section 2).

### 2.2 Audience B (optional, later): studios and agencies as SaaS customers

| ICP                                                             | Definition                                                                                                                                                                                                                                                           | Fit with ChordusAM USPs                                                                                                                                                                                                                                                                                                                                                    | Confidence                                                       |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **ICP-1: Sri Lankan creative studio**                           | 8 to 50 staff, Colombo or regional city. Runs productions (music video, ads, photo) **and** has rentable space or gear. Pays a freelancer pool. VAT-registered, or near the VAT (LKR 60m) or SSCL (LKR 36m) thresholds ([R3 §6](research/R3-pos-booking-finance.md)) | High. All five USPs apply, including SL tax and WHT on artists and photographers, which was widened in June 2026 ([R3 §6](research/R3-pos-booking-finance.md))                                                                                                                                                                                                             | Medium. **No count of such studios was found** (open question 1) |
| **ICP-2: Sri Lankan production or post house without a studio** | Agencies, YouTube channel operators, post houses                                                                                                                                                                                                                     | Medium. Booking and POS matter less. Freelancer payouts, AI cost and rights still apply                                                                                                                                                                                                                                                                                    | Medium                                                           |
| **ICP-3: SEA boutique studio (Singapore first, then Malaysia)** | 5 to 30 staff. Singapore via AMPL's own Media Digital SG                                                                                                                                                                                                             | Low at first. The SL tax and payroll USPs do not transfer. SG needs CPF, SDL and IRAS packs ([R2 B.12](research/R2-hris-payroll-sri-lanka.md)) and InvoiceNow ([R3 §6](research/R3-pos-booking-finance.md)). Regional demand signal: Malaysian producer JAP Media moved from WhatsApp coordination to a central platform ([R1 §4.18](research/R1-media-production-erp.md)) | Low                                                              |

**Anti-ICP:** retail-first shops (Loyverse and local POS vendors serve them), broadcasters (Xytech territory, [R1 §4.10](research/R1-media-production-erp.md)), and studios above roughly 150 staff (they buy PeoplesHR or Odoo with a partner).

### 2.3 Personas

Names are AMPL's real role holders from the brief. "Front desk" is an assumed role: the brief does not name one (open question 3).

| Persona                    | AMPL example                   | Jobs to be done ("When I…, I want to…, so I can…")                                                                                                                                                                                             | Pains today                                                                                                                                                                                                                                     | What wins them                                                                      |
| -------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Studio owner / Admin**   | Thoshan, Fazlur, Gurpreet      | When a payment or leave request comes in, I want to approve it on my phone in one tap, so the team is not blocked. When I price a music-video package, I want to know the real margin after AI and freelancer costs, so I don't sell at a loss | Approvals scattered across WhatsApp. No per-video P&L. USD AI costs move with FX ([R4 §4.3](research/R4-creative-ops-rights.md)). Legal exposure on AI likeness and PDPA from 1 January 2027 ([R2 B.11](research/R2-hris-payroll-sri-lanka.md)) | Approval inbox. Margin per video. Publish block when consent is missing             |
| **Producer / coordinator** | Chathurika                     | When I book a vocalist for a shoot, I want to raise the payment and see its status without chasing Finance, so the talent trusts us. When a client approves a cut, I want it recorded, so the balance invoice goes out                         | Chasing payment status. Re-typing talent bank details. "Who approved v2?" disputes. Juggling ClickUp, WhatsApp and Drive                                                                                                                        | Talent pool with saved details. Payment status visible. Approval events logged      |
| **Ops / HR manager**       | Abilasini                      | When month end comes, I want attendance, leave and pay rules to produce a payroll draft, so I check exceptions instead of building a spreadsheet. When the IRD or EPF rules change, I want to edit a rate, not rebuild formulas                | Fingerprint export cleaned by hand. Leave balances in a sheet. APIT, EPF base and gratuity not modelled ([R2 D.4](research/R2-hris-payroll-sri-lanka.md))                                                                                       | Import with exceptions list. Payroll draft with statutory figures. Rates as data    |
| **Finance**                | Janaka                         | When a payment is approved, I want the voucher, the WHT line and the bank details in one place, so I pay once and post once. When the accountant asks, I want exports that match the books                                                     | Re-keying. WHT on artists above LKR 100,000 a month since June 2026 ([R3 §6](research/R3-pos-booking-finance.md)). No receivables view. No VAT-format invoice ([R3 §6](research/R3-pos-booking-finance.md))                                     | Numbered vouchers, WHT certificates, VAT-format invoices, accountant export or sync |
| **Front desk** (assumed)   | Not named                      | When a walk-in client books the studio, I want to see free slots, take a deposit by LankaQR or card and print a receipt, so the booking is confirmed on the spot                                                                               | Double bookings. Deposits recorded on paper. Cash not reconciled at day end                                                                                                                                                                     | One screen for booking, deposit and receipt. Shift close with cash count            |
| Secondary: **employee**    | All staff                      | Request leave, see balance and payslip without asking HR                                                                                                                                                                                       | Asking HR on WhatsApp                                                                                                                                                                                                                           | Self-service on the phone                                                           |
| Secondary: **freelancer**  | Vocalists, editors, AI artists | Know when I'll be paid and get my WHT certificate                                                                                                                                                                                              | No visibility                                                                                                                                                                                                                                   | Status link, certificate PDF ([R2-47](research/R2-hris-payroll-sri-lanka.md))       |

---

## 3. Benchmark

### 3.1 Comparators chosen (10)

I took R1's seven recommendations ([R1 §8](research/R1-media-production-erp.md)) and R3's list ([R3 §9](research/R3-pos-booking-finance.md)), then cut to the products AMPL could realistically adopt, one per category.

| #   | Comparator                                       | Category                    | Why it is in                                                                                                                                      | Left out, and why                                                                                                                                                        |
| --- | ------------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Scoro**                                        | Agency all-in-one           | Best quote-to-bill chain and real multi-entity ([R1 §4.3](research/R1-media-production-erp.md))                                                   | Workamajig: similar scope at a higher price ([R1 §4.1](research/R1-media-production-erp.md))                                                                             |
| 2   | **Productive.io**                                | Agency suite                | Cheapest modern suite, leave linked to capacity ([R1 §4.4](research/R1-media-production-erp.md))                                                  | Accelo: price not public                                                                                                                                                 |
| 3   | **Streamtime**                                   | Small-studio job management | Closest in size and style to AMPL ([R1 §4.6](research/R1-media-production-erp.md))                                                                | Synergist: UK-centric                                                                                                                                                    |
| 4   | **farmerswife**                                  | Media facility scheduler    | Reference for booking people, rooms and gear and billing from bookings ([R1 §4.9](research/R1-media-production-erp.md))                           | Xytech: broadcaster-grade                                                                                                                                                |
| 5   | **Odoo** (Standard, with SL third-party modules) | General ERP                 | The only product covering agency flow, rental, POS and payroll in one database, with SL add-ons ([R1 §4.16](research/R1-media-production-erp.md)) |                                                                                                                                                                          |
| 6   | **ERPNext + Frappe HR**                          | Open-source ERP             | Cost floor. Offline POS, payroll, ZKTeco sync ([R1 §4.17](research/R1-media-production-erp.md), [R2 A.2](research/R2-hris-payroll-sri-lanka.md))  |                                                                                                                                                                          |
| 7   | **Humanised**                                    | Sri Lankan HRIS and payroll | Public LKR pricing, EPF, ETF and APIT in each pay run ([R2 A.3](research/R2-hris-payroll-sri-lanka.md))                                           | Gallery HR: better attendance (Hikvision real-time sync) but price not public. Used as a note below                                                                      |
| 8   | **Rentman**                                      | Media gear and crew rental  | Gold standard for gear check-out, QR, repairs ([R3 §3.1](research/R3-pos-booking-finance.md))                                                     | Current RMS, Booqable                                                                                                                                                    |
| 9   | **Studio Ninja**                                 | Photo studio CRM            | Booking, contracts, payment schedules ([R3 §3.3](research/R3-pos-booking-finance.md))                                                             | HoneyBook: **not available to Sri Lankan businesses** ([HoneyBook pricing](https://www.honeybook.com/pricing), via R3)                                                   |
| 10  | **Loyverse**                                     | Retail POS                  | Free core POS, usable with a separate bank terminal ([R3 §2.1](research/R3-pos-booking-finance.md))                                               | Square: **cannot process cards in Sri Lanka** ([Square help 4956](https://www.square.com/help/au/en/article/4956-international-availability), via R3). UX reference only |

Two reference columns are added: **status quo** (spreadsheets, WhatsApp, ClickUp) and **ChordusAM target**. The ChordusAM column is what the design aims for if the MVP and later phases deliver. It is not a measured score, and it should be re-scored after each phase.

### 3.2 Criteria and weights

Weights reflect AMPL's money and risk. Statutory and money-chain criteria carry the most weight because errors there cost cash or create legal exposure.

| #   | Criterion                                                                                                   | Weight  | What a 5 means                                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| C1  | SL statutory payroll (EPF/ETF on the "total earnings" base, APIT tables, gratuity, statutory exports)       | 11      | All computed natively, tables maintained, exports for EPF Form C, ETF and APIT ([R2 D.2](research/R2-hris-payroll-sri-lanka.md)) |
| C2  | SL tax on sales and payouts (LKR, VAT invoice format from 1 Oct 2026, SSCL, WHT on freelancers, stamp duty) | 9       | All rules as effective-dated data, WHT certificates, IRD-format invoices ([R3 §6](research/R3-pos-booking-finance.md))           |
| C3  | Studio, room and gear booking with check-out and check-in                                                   | 8       | Rooms, people and gear on one calendar, hard conflict prevention, booking becomes a bill                                         |
| C4  | Service POS with deposits and offline mode                                                                  | 6       | Deposits and balances, offline queue, shifts, works with SL rails (LankaQR, PayHere, bank terminal)                              |
| C5  | Quote-to-invoice job costing                                                                                | 10      | Quote → job → PO/bill → invoice, budget against actual per job ([R1 §5](research/R1-media-production-erp.md))                    |
| C6  | Freelancer and talent management                                                                            | 9       | Talent profiles, engagement per project, payouts, classification checks ([R2 D.3](research/R2-hris-payroll-sri-lanka.md))        |
| C7  | Rights, releases and AI-likeness consents                                                                   | 5       | Rights register per deliverable, consent records, publish block ([R4 §7](research/R4-creative-ops-rights.md))                    |
| C8  | AI cost tracking per project                                                                                | 5       | USD subscriptions and credits allocated to projects in LKR ([R4 §4.3](research/R4-creative-ops-rights.md))                       |
| C9  | Attendance device import and leave                                                                          | 6       | Device import or push, leave with accrual and approvals                                                                          |
| C10 | Mobile, offline and WhatsApp reach                                                                          | 10      | Works on a phone over a weak line, native WhatsApp utility notifications                                                         |
| C11 | Multi-entity and multi-currency (SG readiness)                                                              | 4       | Several legal entities and currencies in one system                                                                              |
| C12 | Cost for about 20 users per year                                                                            | 7       | Very low total cost of ownership for AMPL's size (see 3.5)                                                                       |
| C13 | PDPA readiness, data residency and audit                                                                    | 5       | Self-host or local option, audit trail, consent and retention support ([R2 B.11](research/R2-hris-payroll-sri-lanka.md))         |
| C14 | Ease of use for a 10–30 person team                                                                         | 5       | Small-team UX, low setup, no partner needed                                                                                      |
|     | **Total**                                                                                                   | **100** |                                                                                                                                  |

Scores are 0 to 5. **0** = not offered or not found. **1** = generic or manual workaround. **2** = partial. **3** = solid, with gaps. **4** = strong. **5** = best in class for AMPL. "Not found" in research becomes 0 or 1, never a guess upward.

### 3.3 Scoring matrix

Weighted total = Σ(weight × score) ÷ 5, out of 100.

| Criterion (weight)                 | Scoro    | Productive | Streamtime | farmerswife | Odoo     | ERPNext  | Humanised | Rentman  | Studio Ninja | Loyverse | Status quo | ChordusAM target  |
| ---------------------------------- | -------- | ---------- | ---------- | ----------- | -------- | -------- | --------- | -------- | ------------ | -------- | ---------- | ----------------- |
| C1 SL payroll (11)                 | 0        | 0          | 0          | 0           | 3        | 1        | **4**     | 0        | 0            | 0        | 1          | 4                 |
| C2 SL tax (9)                      | 1        | 1          | 1          | 1           | **3**    | 1        | 0         | 1        | 1            | 1        | 1          | 4                 |
| C3 Booking (8)                     | 0        | 0          | 0          | **5**       | 4        | 1        | 0         | 4        | 2            | 0        | 1          | 4                 |
| C4 POS (6)                         | 0        | 0          | 0          | 0           | **3**    | 2        | 0         | 0        | 1            | 2        | 0          | 4                 |
| C5 Quote-to-invoice (10)           | **5**    | 4          | 4          | 3           | 3        | 2        | 0         | 2        | 2            | 0        | 1          | 4                 |
| C6 Freelancers (9)                 | 1        | 1          | 1          | 1           | 1        | 1        | 0         | **2**    | 0            | 0        | 1          | 4                 |
| C7 Rights and consents (5)         | 0        | 0          | 0          | 0           | 0        | 0        | 0         | 0        | **1**        | 0        | 0          | 4                 |
| C8 AI cost (5)                     | 1        | 1          | 1          | 1           | 1        | 1        | 0         | 0        | 0            | 0        | 0          | 4                 |
| C9 Attendance and leave (6)        | 1        | 2          | 0          | 0           | 3        | **4**    | 2         | 0        | 0            | 1        | 2          | 4                 |
| C10 Mobile, offline, WhatsApp (10) | 2        | 2          | 1          | 2           | **3**    | 2        | 1         | 2        | 1            | 2        | 2          | 4                 |
| C11 Multi-entity (4)               | **5**    | 4          | 0          | 0           | 4        | 4        | 1         | 0        | 0            | 1        | 1          | 3                 |
| C12 Cost, 20 users (7)             | 1        | 2          | 2          | n/s         | 3        | **5**    | 4         | 4        | 5            | 5        | 5          | 4                 |
| C13 PDPA and audit (5)             | 2        | 2          | 2          | 2           | 3        | **4**    | 3         | 2        | 1            | 2        | 0          | 4                 |
| C14 Ease of use (5)                | 3        | **4**      | 4          | 2           | 2        | 2        | 3         | 3        | 4            | 4        | 3          | 4                 |
| **Weighted total /100**            | **30.2** | **31.0**   | **23.4**   | **28.6\***  | **52.8** | **39.8** | **25.6**  | **30.4** | **25.2**     | **23.2** | **26.6**   | **79.2 (target)** |

\* farmerswife price is not public, so C12 is not scored (n/s). Its total is re-based on the other 93 weight points (raw 26.6 of 93).

**Sensitivity checks.**

- **Equal weights** (each criterion counts the same) keep the same order: Odoo 51, ERPNext 43, Productive 33, Scoro 31, the rest 23 to 29, status quo 26.
- **Stack of point tools** (Productive + Humanised + Rentman + Loyverse, taking the best score per criterion, cost 1 and ease of use 2 for running four systems) scores **47**. That is below Odoo alone, and it still has no rights register, no AI cost and no SL tax on payouts. The stack score also flatters it: the four tools do not share data, so "leave blocks crew booking" or "booking becomes the job cost" cannot happen.
- **Odoo + Humanised** (Odoo with payroll handed to a local vendor) scores about **54**. Payroll stops being the gap, and the gaps that remain are C6, C7 and C8: freelancers, rights and AI cost.

### 3.4 Score justifications

One line per product per criterion. Products with the same score for the same reason share a line.

**C1 SL statutory payroll (11)**

- Humanised **4**: says it calculates EPF, ETF and APIT in every pay run, and the vendor maintains tables. Gratuity and export depth unverified ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)).
- Odoo **3**: the third-party `l10n_lk_payroll` (USD 79) computes APIT Table 1, EPF 8/12 and ETF 3 and produces an EPF schedule. It is unaudited, and the vendor tells users to check against IRD guidance ([R1 §4.16](research/R1-media-production-erp.md), [Odoo Apps](https://apps.odoo.com/apps/modules/19.0/l10n_lk_payroll)).
- ERPNext **1**: generic salary structures, with no SL localisation found ([R2 A.2](research/R2-hris-payroll-sri-lanka.md)).
- Scoro, Productive, Streamtime, farmerswife, Rentman, Studio Ninja, Loyverse **0**: no payroll found ([R1 §3](research/R1-media-production-erp.md), [R3 §2–3](research/R3-pos-booking-finance.md)).
- Status quo **1**: spreadsheets. No APIT engine, no EPF base logic ([R2 D.4](research/R2-hris-payroll-sri-lanka.md)).
- ChordusAM target **4**: tables as versioned data, `computeApit()` in `lib/rules/`, exports (`PAY`, R2-20 to R2-32). Not 5, because AMPL must own the April table updates and the risk of errors ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)).

**C2 SL tax on sales and payouts (9)**

- Odoo **3**: third-party IRD VAT invoice layout, SVAT transition and "Sri Lankan Taxes with LankaQR" modules. No WHT-on-freelancer flow and no RAMIS submission found ([R3 §4.1](research/R3-pos-booking-finance.md)).
- Scoro, Productive, Streamtime, farmerswife, ERPNext, Rentman, Studio Ninja, Loyverse **1**: generic tax rates at best. No SL edition. Scoro's FX uses World Bank rates, not CBSL ([R1 §4.3, §7](research/R1-media-production-erp.md), [R3 §4.1](research/R3-pos-booking-finance.md)).
- Humanised **0**: payroll only. Does not handle sales tax or freelancer WHT ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)).
- Status quo **1**: the accountant handles it after the fact. WHT on artists since June 2026 is at risk of being missed ([R3 §6](research/R3-pos-booking-finance.md)).
- ChordusAM target **4**: VAT format, SSCL by activity, WHT 5% above LKR 100,000 with certificates, stamp duty flag, all as effective-dated data (`SAL`, `VP`, `POS`, `FIN`). RAMIS submission is later, and the IRD spec has not been obtained ([R3 §6](research/R3-pos-booking-finance.md)).

**C3 Studio, room and gear booking (8)**

- farmerswife **5**: people, rooms and equipment on linked timelines, and a booking turns into a bill ([R1 §4.9](research/R1-media-production-erp.md)).
- Odoo **4**: Rental with padding time, late fees and signature at pickup, plus Planning. One user reports padding did not stop overlaps ([R3 §3.1](research/R3-pos-booking-finance.md)).
- Rentman **4**: QR scan-to-pack and scan-to-return, repairs, "charge damage on invoice", crew. Built for gear, not rooms ([R3 §3.1](research/R3-pos-booking-finance.md)).
- Studio Ninja **2**: session booking for photographers. No room or gear inventory ([R3 §3.3](research/R3-pos-booking-finance.md)).
- ERPNext **1**: asset register only (P in [R1 §3](research/R1-media-production-erp.md)).
- Scoro, Productive, Streamtime, Humanised, Loyverse **0**: no room or gear booking found ([R1 §3](research/R1-media-production-erp.md)).
- Status quo **1**: shared calendar and WhatsApp. No conflict prevention.
- ChordusAM target **4**: rooms, people and gear as resources, a Postgres exclusion constraint against double booking, leave blocking crew (`BKG`, [R3 §3.4](research/R3-pos-booking-finance.md)).

**C4 Service POS with deposits and offline (6)**

- Odoo **3**: offline POS that syncs on reconnect. Partial payment offline needs a third-party module ([R3 §2.1](research/R3-pos-booking-finance.md)).
- ERPNext **2**: core offline POS reported broken in later versions. POS Awesome is the replacement. Core POS invoices need full payment ([R3 §2.1](research/R3-pos-booking-finance.md)).
- Loyverse **2**: free core POS, basic offline, no deposits found ([R3 §2.1](research/R3-pos-booking-finance.md)).
- Studio Ninja **1**: payment schedules, but no in-person POS. Deposits rely on Western gateways ([R3 §3.4](research/R3-pos-booking-finance.md)).
- Scoro, Productive, Streamtime, farmerswife, Humanised, Rentman **0**: no POS found ([R1 §5](research/R1-media-production-erp.md)).
- Status quo **0**: paper receipts and a bank terminal.
- ChordusAM target **4**: PWA with an offline queue for cash and recorded-card sales, deposits through PayHere Preapproval plus Charging, LankaQR static code, shifts (`POS`, [R3 §8](research/R3-pos-booking-finance.md)).

**C5 Quote-to-invoice job costing (10)**

- Scoro **5**: quote → project, task, invoice, PO or bill in one step, with approval workflows ([R1 §4.3](research/R1-media-production-erp.md)).
- Productive **4**: phase budgets, POs, bills against POs, invoicing. Quoting depth unverified ([R1 §4.4](research/R1-media-production-erp.md)).
- Streamtime **4**: the job plan becomes quote, schedule and invoice. "Pulse Check" flags under-invoiced jobs ([R1 §4.6](research/R1-media-production-erp.md)).
- farmerswife **3**: projects, budgets, time reports and invoicing. Quoting unverified ([R1 §4.9](research/R1-media-production-erp.md)).
- Odoo **3**: CRM, quotations, Project, Timesheets, Purchase, Accounting. Generic, with no media pipeline ([R1 §4.16](research/R1-media-production-erp.md)).
- ERPNext **2**: time-and-materials project billing. Generic ([R1 §4.17](research/R1-media-production-erp.md)).
- Rentman **2**: rental and crew projects with invoices. Not job costing for productions ([R3 §3.1](research/R3-pos-booking-finance.md)).
- Studio Ninja **2**: quotes and invoices for sessions. No costing ([R3 §3.3](research/R3-pos-booking-finance.md)).
- Humanised, Loyverse **0**: not in scope.
- Status quo **1**: ClickUp tasks and spreadsheets. No link from cost to invoice.
- ChordusAM target **4**: production record as the single source of truth (R1 patterns P1 to P3), payment requests attached to estimate lines (`CRM`, `PRJ`, `SAL`, `VP`).

**C6 Freelancer and talent management (9)**

- Rentman **2**: crew scheduling on projects, including sub-rentals. No talent profiles or payout tax ([R3 §3.1](research/R3-pos-booking-finance.md)).
- Scoro, Productive, Streamtime, farmerswife, Odoo, ERPNext **1**: freelancers handled as vendors or per-seat users. Per-seat pricing penalises freelancer logins ([R1 §4.3, §7 item 3](research/R1-media-production-erp.md)).
- Humanised **0**: no freelancer pool linked to projects in any local vendor ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)).
- Studio Ninja, Loyverse **0**: not in scope.
- Status quo **1**: talent details in WhatsApp chats and memory.
- ChordusAM target **4**: talent profile, engagement per project, WHT at source, classification checklist, free freelancer portal (`TAL`, `VP`, R2-40 to R2-48).

**C7 Rights, releases and AI-likeness consents (5)**

- Studio Ninja **1**: contract e-signature could hold a model release, but there is no rights register ([R3 §3.3](research/R3-pos-booking-finance.md)).
- All other comparators **0**: no rights or consent register found. DAMs with expiry (Canto) are outside this set and priced for mid-market ([R4 §2.1](research/R4-creative-ops-rights.md)).
- Status quo **0**: no record of who owns the video or master ([R4 §3.2](research/R4-creative-ops-rights.md)).
- ChordusAM target **4**: rights register, release and AI-likeness consent records, publish block (`AST`, `TAL`, R4-F04 to R4-F08). Not 5, because contract templates need a Sri Lankan IP lawyer ([R4 §8](research/R4-creative-ops-rights.md)).

**C8 AI cost tracking per project (5)**

- Scoro, Productive, Streamtime, farmerswife, Odoo, ERPNext **1**: a USD expense can be logged manually against a project. None treats AI credits or subscriptions as job cost ([R1 §7 item 4](research/R1-media-production-erp.md)).
- Humanised, Rentman, Studio Ninja, Loyverse **0**: not in scope.
- Status quo **0**: AI subscriptions paid on cards and not attributed ([00-brief §2](00-brief.md)).
- ChordusAM target **4**: pool-and-allocate in the MVP, then a usage log, plus a Suno download-cap tracker (`AI`, R4-F09, R4-F10). Not 5, because most consumer AI plans have no usage API ([R4 §4.3](research/R4-creative-ops-rights.md)).

**C9 Attendance device import and leave (6)**

- ERPNext **4**: `Employee Checkin` API, biometric sync tool and a free ZKTeco sync app, plus leave ([R2 A.2](research/R2-hris-payroll-sri-lanka.md)).
- Odoo **3**: Attendance app plus third-party ZKTeco push modules, and leave ([R2 A.2](research/R2-hris-payroll-sri-lanka.md)).
- Productive **2**: built-in time off linked to capacity. No device import ([R1 §4.4](research/R1-media-production-erp.md)).
- Humanised **2**: leave yes. Device support not found ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)). Note: Gallery HR would score 4–5 here, with Hikvision real-time sync and offline buffering ([Gallery HR](https://galleryhr.com/pages/hris-demo-request-gallery-hr-platformgallery-hr-demo), via R2).
- Scoro **1**: time off is a paid add-on ([R1 §4.3](research/R1-media-production-erp.md)).
- Loyverse **1**: employee timecards add-on ([R3 §2.1](research/R3-pos-booking-finance.md)).
- Streamtime, farmerswife, Rentman, Studio Ninja **0**: none found.
- Status quo **2**: the device export exists, and the cleaning is manual ([`docs/PLAN.md` §1](../PLAN.md)).
- ChordusAM target **4**: import profiles and column mapper in the MVP, ADMS push later (`ATT`, `LV`, [R2 C.3](research/R2-hris-payroll-sri-lanka.md)).

**C10 Mobile, offline and WhatsApp reach (10)**

- Odoo **3**: **official WhatsApp app with templates for invoices and POS receipts** ([Odoo WhatsApp](https://www.odoo.com/app/whatsapp)), **Enterprise only** ([Odoo 18 docs](https://www.odoo.com/documentation/18.0/th/applications/productivity/whatsapp.html)). Offline POS. This corrects R1 §5, which found no native WhatsApp in any product.
- Scoro **2**: "Scoro Time" app. The full iOS app is rated 2.7/5. WhatsApp only through third-party automation ([R1 §4.3](research/R1-media-production-erp.md)).
- Productive **2**: iOS app. No WhatsApp found ([R1 §4.4](research/R1-media-production-erp.md)).
- farmerswife **2**: Cirkus companion app on iOS and Android ([R1 §4.9](research/R1-media-production-erp.md)).
- ERPNext **2**: Frappe HR PWA. WhatsApp through community or paid apps such as `frappe_whatsapp` and WATI ([Frappe Cloud marketplace](https://cloud.frappe.io/marketplace/apps/whatsapp_integration), [WATI app](https://cloud.frappe.io/marketplace/apps/wati_integration)).
- Rentman **2**: mobile scanning app. No WhatsApp found ([R3 §3.1](research/R3-pos-booking-finance.md)).
- Loyverse **2**: mobile POS with basic offline. No WhatsApp ([R3 §2.1](research/R3-pos-booking-finance.md)).
- Streamtime, Humanised, Studio Ninja **1**: mobile not verified.
- Status quo **2**: WhatsApp is where everyone already is, but nothing is structured or recorded.
- ChordusAM target **4**: phone-first web app, offline POS queue, WhatsApp utility templates with opt-in (`NOT`, R4-F13). About USD 0.002 a utility message in SL (unverified, [R4 §5.1](research/R4-creative-ops-rights.md)).

**C11 Multi-entity and multi-currency (4)**

- Scoro **5**: several legal entities in one environment, multi-currency, each entity linked to its own Xero or QuickBooks ([R1 §4.3](research/R1-media-production-erp.md)).
- Productive **4**: multi-currency, multi-subsidiary billing ([R1 §4.4](research/R1-media-production-erp.md)).
- Odoo **4**: multi-company, but it forces the Custom plan ([R1 §4.16](research/R1-media-production-erp.md)).
- ERPNext **4**: multi-company and multi-currency ([R3 §4.1](research/R3-pos-booking-finance.md)).
- Humanised **1**: single country. Multi-company not verified.
- Loyverse **1**: multi-store add-ons only.
- Streamtime, farmerswife, Rentman, Studio Ninja **0**: none found ([R1 §3](research/R1-media-production-erp.md)).
- Status quo **1**: separate spreadsheets.
- ChordusAM target **3**: `entity_id` and per-entity tax and statutory profiles designed in. SG payroll is not built in the MVP ([R2 B.12](research/R2-hris-payroll-sri-lanka.md)).

**C12 Cost for about 20 users (7)**. Derived from section 3.5. 5 means under about LKR 0.2m a year, 4 under LKR 0.5m, 3 under LKR 2.5m before implementation, 2 under LKR 3m, 1 above that.

- ERPNext **5**, Studio Ninja **5**, Loyverse **5**, Status quo **5** (licence only. Hidden labour cost not counted).
- Humanised **4**, Rentman **4** (3 power users).
- Odoo **3**: licence on the SL price list is low, but implementation often exceeds the licence ([Octura](https://octurasolutions.com/resources/the-honest-cost-of-odoo-in-2026-why-the-license-is-only-20-percent-of-the-budget), via R1).
- Productive **2**, Streamtime **2**, Scoro **1**.
- farmerswife **n/s**: price not public.
- ChordusAM target **4**: hosting is small, and build cost dominates. The CFO owns the number in `docs/discovery/14-business-case.md`.

**C13 PDPA readiness, data residency and audit (5)**

- ERPNext **4**: open source and self-hostable anywhere, including in Sri Lanka ([R2 A.2](research/R2-hris-payroll-sri-lanka.md)).
- Odoo **3**: self-host option for Community. Online is hosted abroad.
- Humanised **3**: local vendor. Hosting location and DPA terms not verified.
- Scoro, Productive, Streamtime, farmerswife, Rentman, Loyverse **2**: hosted outside SL. Vendor data-processing terms not reviewed (unverified). PDPA cross-border rules still to be checked ([R2 B.11](research/R2-hris-payroll-sri-lanka.md)).
- Studio Ninja **1**: US-centric tool for a market it does not target.
- Status quo **0**: NIC and bank details in chats, with no access control or retention.
- ChordusAM target **4**: RLS, append-only audit log (Phase 0), read logging, retention schedule and consent records planned (`ADM`, R2-33). Supabase and Vercel host outside SL, so cross-border terms are still an open item for SEC (`docs/discovery/15-compliance-security.md`).

**C14 Ease of use for a 10–30 person team (5)**. Evidence is thin: review notes only.

- Productive **4**: modern UI, low entry price ([R1 §4.4](research/R1-media-production-erp.md)).
- Streamtime **4**: built for small studios ([R1 §4.6](research/R1-media-production-erp.md)).
- Studio Ninja **4**, Loyverse **4**: single-purpose and simple (unverified).
- Scoro **3**: clean flow, but a 5-seat minimum and a weak iOS app ([R1 §4.3](research/R1-media-production-erp.md)).
- Rentman **3**: specialised, with a learning curve (unverified).
- Humanised **3**: unverified.
- farmerswife **2**: dated interface (unverified) ([R1 §4.9](research/R1-media-production-erp.md)).
- Odoo **2**: generic, and needs Odoo Studio or a partner to customise ([R1 §4.16](research/R1-media-production-erp.md)).
- ERPNext **2**: general-purpose UX ([R1 §4.17](research/R1-media-production-erp.md)).
- Status quo **3**: familiar, but error-prone.
- ChordusAM target **4**: role-based screens for AMPL's five personas. Unproven until usability tests (`docs/discovery/13-ux-design.md`).

### 3.5 Total cost of ownership per year, about 20 users

Planning rate: **USD 1 = LKR 310** (assumption). Recent market reports put the rate at about LKR 312 to 319 ([list.lk](https://www.list.lk/pulse/sri-lankan-rupee-depreciates-against-us-dollar-selling-rate-crosses-rs-319-mark-532bd)). Check the CBSL indicative rate ([CBSL daily indicators](https://www.cbsl.gov.lk/sites/default/files/daily_economic_indicators_20261104_e.pdf)) before using these numbers in the business case. Licence only unless stated. Implementation, training and data migration are **not included**, and are often larger than the licence.

| Comparator                                                                 | Basis                                                                                                                                                                                                        | Licence per year (USD)                                            | ≈ LKR per year             | What it does not cover                                                                                                                                                                                               |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scoro                                                                      | Standard USD 37/user/month (annual), 5-seat minimum ([R1 §2](research/R1-media-production-erp.md))                                                                                                           | 8,880 (Pro at USD 63: 15,120)                                     | 2.75m (Pro 4.69m)          | Payroll, POS, booking, SL tax, rights                                                                                                                                                                                |
| Productive.io                                                              | Professional about USD 25–29/user/month ([R1 §2](research/R1-media-production-erp.md))                                                                                                                       | 6,000–6,960                                                       | 1.86m–2.16m                | Same as Scoro                                                                                                                                                                                                        |
| Streamtime                                                                 | About USD 25–40/user/month, conflicting ([R1 §2](research/R1-media-production-erp.md))                                                                                                                       | 6,000–9,600                                                       | 1.86m–2.98m                | Same, plus multi-entity                                                                                                                                                                                              |
| farmerswife                                                                | Not public ([R1 §2](research/R1-media-production-erp.md))                                                                                                                                                    | Unknown                                                           | Unknown                    | Payroll, POS, SL tax                                                                                                                                                                                                 |
| Odoo Standard (US list)                                                    | USD 24.90–31.10/user/month (annual) ([R1 §2](research/R1-media-production-erp.md))                                                                                                                           | 5,976–7,464, plus USD 148 one-off for SL payroll and SVAT modules | 1.85m–2.31m                | Rights, AI cost, talent pool. Multi-company needs Custom at USD 46.70–61 (11,208–14,640 a year)                                                                                                                      |
| Odoo Standard (SL price list)                                              | Reportedly the India / South Asia list at INR 580–725/user/month (secondary, garbled source) ([oec.sh](https://oec.sh/odoo-pricing/sri-lanka))                                                               | INR 139,200–174,000                                               | Not converted (unverified) | As above. Implementation not public, and licence can be about 20% of total budget ([Octura](https://octurasolutions.com/resources/the-honest-cost-of-odoo-in-2026-why-the-license-is-only-20-percent-of-the-budget)) |
| ERPNext + Frappe HR                                                        | Software free. Frappe Cloud from USD 5/site/month, HR support from the USD 50 plan ([R1 §2](research/R1-media-production-erp.md))                                                                            | 60–600                                                            | 19k–186k                   | SL payroll localisation is custom work (cost unknown). No creative features                                                                                                                                          |
| Humanised                                                                  | LKR 25,000/month up to 50 employees. LKR 10,000 up to 15 ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)). A review site gives LKR 5,000 up to 5 ([hr.software](https://www.hr.software/reviews/humanised)) | ≈ 970                                                             | 300k                       | Everything except HR and payroll                                                                                                                                                                                     |
| Rentman                                                                    | USD 19/power user/month + USD 39 platform fee ([R3 §3.1](research/R3-pos-booking-finance.md)). Assumes a monthly platform fee and 3 power users                                                              | 1,152 (20 users: 5,028)                                           | 357k (1.56m)               | Payroll, finance, rights                                                                                                                                                                                             |
| Studio Ninja                                                               | USD 24–53/month per account, sources conflict, another source gives 16–40 ([CostBench](https://costbench.com/verify/studio-ninja/), [R3 §3.3](research/R3-pos-booking-finance.md))                           | 288–636                                                           | 89k–197k                   | Deposits depend on Western gateways. Nearly everything else                                                                                                                                                          |
| Loyverse                                                                   | Core free. Add-ons USD 5/employee/month, for example 3 front-desk staff ([R3 §2.1](research/R3-pos-booking-finance.md))                                                                                      | about 180 + per-store add-ons (unknown)                           | about 56k + unknown        | Booking, deposits, everything else                                                                                                                                                                                   |
| Status quo                                                                 | ClickUp subscription (price not checked) plus staff time                                                                                                                                                     | Unknown                                                           | Unknown                    | Audit, totals, compliance                                                                                                                                                                                            |
| **Point-tool stack** (Productive + Humanised + Rentman 3 users + Loyverse) | Sum of the rows above                                                                                                                                                                                        | 8,300–9,260                                                       | 2.6m–2.9m                  | Rights, AI cost, freelancer WHT. Four systems, no shared data                                                                                                                                                        |
| **ChordusAM**                                                              | Hosting plus build and run cost                                                                                                                                                                              | For CFO and OPS                                                   | For CFO and OPS            | AMPL owns statutory upkeep                                                                                                                                                                                           |

**Reading the TCO.** Agency suites cost about **LKR 1.9m to 4.7m a year** for 20 seats and still leave payroll, POS and SL tax uncovered. Local payroll is cheap (about **LKR 0.3m**). Odoo is the cheapest "covers most things" option on licence, but implementation and Sri Lankan customisation decide its real cost. The CFO should compare ChordusAM's build cost against **Odoo plus implementation** and against the **status quo's hidden labour cost**, not against licence prices alone.

---

## 4. Positioning

### 4.1 Category

**Internal (AMPL):** "our studio's operating system", the one place for people, productions and money. Avoid "ERP" in staff-facing language: it sounds heavy and corporate.

**External (if SaaS):** **Studio operations ERP for South Asian creative studios.** It is a new subcategory between agency suites (which have no studio floor, payroll or local tax) and general ERPs (which have no creative pipeline). Lead with the problem ("run the studio, the productions and the payouts in one place") rather than the category name. Buyers do not search for "media ERP" today (unverified, no search-volume data obtained).

### 4.2 Competitive alternatives (what the customer would do instead)

| Alternative                                     | Who chooses it       | Why they would                                                                                                                | Why it falls short for AMPL                                                                                           |
| ----------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Status quo**: spreadsheets, WhatsApp, ClickUp | Everyone, by default | Free, familiar, instant                                                                                                       | No audit, no totals, no compliance. Fails PDPA from 1 January 2027 ([R2 B.11](research/R2-hris-payroll-sri-lanka.md)) |
| **Odoo with a local partner**                   | Owner or Finance     | One database with POS, rental and payroll. SL add-ons. Local partners exist ([R1 §4.16](research/R1-media-production-erp.md)) | Generic. No freelancer voucher flow, rights or AI cost. Partner dependency. Implementation cost                       |
| **Local HRIS + accountant + agency tool**       | HR and Finance       | Each piece is good and cheap (Humanised about LKR 25,000 a month)                                                             | Three to four systems, and no link between payouts, bookings and productions                                          |
| **Agency suite** (Scoro, Productive)            | Producers            | Best quote-to-bill flow                                                                                                       | Per-seat USD pricing, no SL tax, payroll or POS ([R1 §7](research/R1-media-production-erp.md))                        |

### 4.3 Positioning statement

> **For** Sri Lankan creative studios that run productions, rent out their own studio and gear, and pay a pool of freelancers,
> **ChordusAM is** a studio operations system
> **that** ties every booking, freelancer payout, AI credit and approval to the production it served, with Sri Lankan tax and payroll rules built in as editable data.
> **Unlike** agency suites (priced per seat in USD, with no Sri Lankan tax, payroll or studio floor) or general ERPs such as Odoo (broad but generic, with no rights, consent or AI cost tracking, and partner-dependent),
> **ChordusAM** shows the true margin of each video and keeps the studio safe to pay, invoice and publish.

Internal version for AMPL staff: **"One place for your leave, your payments and your productions. Less chasing on WhatsApp."**

### 4.4 Unique attributes → value → proof

| Unique attribute                                                                 | Value to AMPL                                                                                                                                | Proof (research)                                                                                                                                                                          | Owner persona        |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Freelancer engagement → payment request → voucher → WHT certificate, in one flow | Pays talent correctly and on time. Meets WHT rules widened in June 2026                                                                      | No local HRIS links freelancers to projects ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)). WHT and self-billed vouchers appear nowhere ([R1 §7](research/R1-media-production-erp.md)) | Producer, Finance    |
| Per-production P&L that includes USD AI credits at the booked FX rate            | Know if a LKR-priced package still makes money after FX or vendor price changes                                                              | No product treats AI usage as job cost ([R1 §7 item 4](research/R1-media-production-erp.md), [R4 §4](research/R4-creative-ops-rights.md))                                                 | Owner                |
| Rights register, releases and AI-likeness consents that can block publishing     | Avoids takedowns, disputes and PDPA exposure                                                                                                 | No comparator has it ([R4 §7](research/R4-creative-ops-rights.md)). YouTube likeness detection is live ([R4 §4.4](research/R4-creative-ops-rights.md))                                    | Owner, Producer      |
| SL tax rules as effective-dated data across sales, payouts and payroll           | Rule changes become a settings edit, not a rebuild. Every number changed in the past 18 months ([R3 §6](research/R3-pos-booking-finance.md)) | Odoo covers parts through unaudited modules only ([R1 §7](research/R1-media-production-erp.md))                                                                                           | Finance, HR          |
| Rooms, people and gear on one calendar, linked to leave, deposits and job cost   | No double bookings. Deposits always recorded                                                                                                 | Only farmerswife, Xytech and Odoo book rooms and gear well ([R1 §5](research/R1-media-production-erp.md)). None links to SL payment rails and HR leave                                    | Front desk, Producer |

---

## 5. USPs

### 5.1 Accepted USPs

**USP 1: "Pay every freelancer right, first time."**

- **Claim:** raise a talent payment from a phone, and ChordusAM applies the right WHT, numbers the voucher, issues the certificate and books the cost to the production.
- **Why it's true and defensible:** AMPL's main cost line is external talent paid per deliverable ([R1 §7 item 3](research/R1-media-production-erp.md)). The 5% WHT above LKR 100,000 a month now covers artists, performers and photographers ([R3 §6](research/R3-pos-booking-finance.md)). No local HRIS has a project-linked talent pool, and no agency tool handles SL WHT. Deel's contractor product is the nearest pattern, at about USD 49 per contractor a month ([R2 A.2](research/R2-hris-payroll-sri-lanka.md)), and it has no SL WHT. It is defensible because it combines local tax rules with the studio's own project data.
- **Delivered by:** `TAL`, `VP`, `PRJ`, `FIN`, `APR` (R2-40 to R2-47, R2-44).
- **Demo proof:** the producer raises LKR 120,000 for a vocalist on "MV-0412". ChordusAM suggests WHT of LKR 6,000 because the monthly total passes LKR 100,000. An Admin approves on a phone. Finance marks it paid. The voucher PDF and WHT certificate download, and the production P&L updates. Under 2 minutes.

**USP 2: "Know the real margin of every video, AI credits included."**

- **Claim:** each music video shows quote, freelancer cost, studio time, gear and its share of Suno, Higgsfield, Runway and GPU spend in LKR.
- **Why it's true and defensible:** trackers (ShotGrid, ftrack) stop before the money, and generation tools stop at the video ([R1 §7 item 4](research/R1-media-production-erp.md)). AI credits expire and Suno caps downloads at 20 or 60 a month ([R4 §4.2](research/R4-creative-ops-rights.md)), so wasted credits are real money. At 12 to 15 videos a month this is AMPL's core economics. Odoo or Scoro could hold a manual expense line, but neither allocates shared subscriptions.
- **Delivered by:** `PRJ`, `AI`, `FIN`, `RPT` (R4-F09, R4-F10, R4-F12).
- **Demo proof:** open the October production list sorted by margin. Click one video and see the AI allocation line ("Higgsfield: 340 of 1,000 credits, LKR 4,900 at the booked rate"). Show the Suno allowance meter at 17 of 20.

**USP 3: "Approved, cleared, safe to publish."**

- **Claim:** every deliverable records who approved which cut and when, who owns the video and master, and which releases and AI-likeness consents it relies on. ChordusAM blocks "publish" when consent or ownership is missing.
- **Why it's true and defensible:** SL default ownership of commissioned and audiovisual work is unclear, so it must come from the contract ([R4 §3.2](research/R4-creative-ops-rights.md)). YouTube likeness detection lets artists flag videos ([R4 §4.4](research/R4-creative-ops-rights.md)). The PDPA processing rules start on 1 January 2027 ([R2 B.11](research/R2-hris-payroll-sri-lanka.md)). No comparator has a rights and consent register. Frame.io and Vimeo handle review, not rights ([R4 §1](research/R4-creative-ops-rights.md)).
- **Delivered by:** `AST`, `TAL`, `APR`, `ADM` (R4-F01 to R4-F08).
- **Demo proof:** try to mark a video "published" while the dancer's AI-likeness consent has expired. ChordusAM blocks it and names the missing record. Then show the approval history: "v3 approved by client, 14:02, via portal".

**USP 4: "Sri Lankan tax, built in on every rupee in and out."**

- **Claim:** VAT-format invoices, SSCL by activity, WHT on payouts, the stamp duty flag on receipts, and EPF, ETF and APIT in payroll, all as effective-dated settings Finance can edit.
- **Honest scope:** payroll alone is **not** unique. Humanised, Gallery HR and LankaPayslip already do EPF, ETF and APIT, and maintain the tables ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)). The USP is **coverage across sales, payouts and payroll in one ledger**. Odoo reaches parts of this only through unaudited third-party modules ([R1 §7](research/R1-media-production-erp.md)). Never claim "files your taxes": ChordusAM produces figures and exports ([`docs/PLAN.md` §1](../PLAN.md)).
- **Delivered by:** `SAL`, `POS`, `VP`, `PAY`, `FIN`, `ADM` (R2-20 to R2-32, R3 §8 tax engine).
- **Demo proof:** change the SSCL threshold in settings with an effective date, and the threshold monitor updates. Print a VAT-format invoice with supplier and buyer TIN. Show the monthly WHT schedule and the EPF Form C export.

**USP 5 (conditional): "One booking, one bill."**

- **Claim:** book the studio, the engineer and a lighting kit in one go, take the deposit by PayHere link or LankaQR, check the gear out by QR, and the balance invoice and job cost follow automatically.
- **Why conditional:** Odoo also has rental, POS and planning in one database ([R1 §4.16](research/R1-media-production-erp.md)), so "all in one" is not unique. What is defensible is the **fit**: no double booking enforced in the database (Odoo's padding has a reported overlap gap, [R3 §3.1](research/R3-pos-booking-finance.md)), staff leave blocking crew availability, PayHere Preapproval plus Charging for deposit and balance ([R3 §5](research/R3-pos-booking-finance.md)), and the booking feeding the production P&L. Use it as a USP only if AMPL confirms it rents studio and gear to **outside** clients ([R1 §9 Q1](research/R1-media-production-erp.md), [R3 §10 Q4](research/R3-pos-booking-finance.md)).
- **Delivered by:** `BKG`, `POS`, `SAL`, `CRM`, `LV`, `INT` (PayHere).
- **Demo proof:** try to double-book Studio A, and it is refused. Book with a PayHere deposit link. Scan the camera out. Close the shift with a cash count.

### 5.2 Supporting proof point (not a headline USP)

**"Audit-ready by design."** Append-only audit log, server-side guards and RLS (Phase 0), numbered vouchers, read logging on salary, NIC and bank data, and PDPA consent and retention records (`ADM`, R2-33). It is valuable and should be in every demo, but mature ERPs also have audit trails, so it supports USPs 1, 3 and 4 rather than standing alone.

### 5.3 Rejected USP candidates

| Candidate                               | Verdict                                                  | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "WhatsApp-first"                        | **Rejected as a USP.** Keep it as a feature (`NOT`)      | Odoo has an official WhatsApp app with templates for invoices and POS receipts, Enterprise only ([Odoo WhatsApp](https://www.odoo.com/app/whatsapp), [Odoo docs](https://www.odoo.com/documentation/18.0/th/applications/productivity/whatsapp.html)). ERPNext has community and paid WhatsApp apps ([Frappe Cloud](https://cloud.frappe.io/marketplace/apps/whatsapp_integration)). R1 §5 said "native WhatsApp: 0", and that needs correcting (flag for REV in `docs/discovery/30-review-log.md`). Meta's per-message pricing also makes heavy WhatsApp use a cost risk ([R4 §5.1](research/R4-creative-ops-rights.md)) |
| "Fingerprint import"                    | **Rejected.** Table stakes in HRIS                       | Gallery HR has Hikvision real-time sync with offline buffering. MiHCM publishes a ZKTeco guide. Frappe HR has a free ZKTeco sync app. Odoo has third-party ZKTeco push modules ([R2 A.2, A.3](research/R2-hris-payroll-sri-lanka.md)). R1 found it absent only among _agency_ tools                                                                                                                                                                                                                                                                                                                                       |
| "Sri Lanka-native payroll" (on its own) | **Rejected as phrased.** Folded into USP 4               | Local SaaS products do it for about LKR 10,000 to 25,000 a month and maintain the tables ([R2 A.3](research/R2-hris-payroll-sri-lanka.md))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| "Studio + POS + production in one"      | **Rejected as phrased.** Reframed as USP 5 (conditional) | Odoo covers all three in one database ([R1 §5](research/R1-media-production-erp.md))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| "Works offline / mobile-first"          | **Rejected.** Hygiene factor                             | Offline POS exists in Odoo, Loyverse and local POS vendors ([R3 §7.1](research/R3-pos-booking-finance.md))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

---

## 6. Messaging hierarchy and internal launch plan

### 6.1 Messaging hierarchy

| Level                                      | Internal (AMPL staff)                                           | External (if SaaS)                                                                   |
| ------------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Umbrella**                               | "One place for your leave, your payments and your productions." | "Run the studio, the productions and the payouts in one place, built for Sri Lanka." |
| **Pillar 1: Know your margin** (USP 2)     | "See what each video really cost, AI tools included."           | "Every production shows its true margin, AI credits included."                       |
| **Pillar 2: Pay people right** (USP 1, 4)  | "Raise a payment in a minute and see when it's paid."           | "Freelancer payouts with WHT, vouchers and certificates done for you."               |
| **Pillar 3: Run the studio floor** (USP 5) | "Book the room, the gear and the crew without clashes."         | "Bookings, deposits and gear check-out that never double-book."                      |
| **Pillar 4: Safe to publish** (USP 3)      | "Know we have the rights and consents before it goes live."     | "Approvals, rights and AI-likeness consents on record."                              |
| **Proof points**                           | Phase 0 audit log, AMPL's own numbers after go-live             | AMPL case study: "12 to 15 music videos a month" (after measuring)                   |

**Copy rules** (for `docs/discovery/13-ux-design.md`):

- Use "Request payment", not "Create voucher". Use "Ask for leave", not "Submit leave application".
- Show the next person in the chain: "Waiting for an Admin", not "Pending".
- Say "We'll work out the WHT" next to the amount field, so producers don't fear tax.
- Sinhala and Tamil quick-reference cards for staff-facing flows. The UI language is an open question.
- Never say "files your tax", "compliant" or "guaranteed" without the accountant's sign-off.

### 6.2 Internal launch and adoption plan

**Principle:** win the daily habit first. Leave, attendance and payslips touch every employee every month and carry low risk if something goes wrong. That builds logins and trust before money and payroll move in. The final sequence follows the PO's roadmap (`docs/discovery/21-mvp-roadmap.md`). This plan only orders adoption.

| Wave                       | What goes live                                                 | Who                                      | Cutover rule                                                      | Exit criterion                                             |
| -------------------------- | -------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| 0. Pilot (2 weeks)         | Demo mode walkthrough, then real logins                        | Champions only                           | None                                                              | Champions complete every flow for their role               |
| 1. Self-service            | Leave requests, manual attendance, attendance import, balances | All staff, HR, Admins                    | From day X, leave is valid only if it is in ChordusAM             | ≥ 95% of leave requests in-app by week 4                   |
| 2. Payments                | Vendor and talent payment requests, approvals, vouchers, WHT   | Producers, coordinators, Finance, Admins | No voucher number means no payment                                | 100% of payouts raised in-app 2 weeks after cutover        |
| 3. Payroll parallel run    | Payroll draft alongside the existing spreadsheet for 2 months  | HR, Finance, accountant                  | Spreadsheet stays the source until 2 clean months                 | Zero unexplained differences for 2 consecutive months      |
| 4. Productions and AI cost | Production records, pipeline stages, AI allocation, P&L        | Producers, Admins, Finance               | New productions are opened in ChordusAM (ClickUp stays for tasks) | ≥ 90% of the month's productions have a costed P&L         |
| 5. Studio floor            | Booking, deposits, POS, gear check-out                         | Front desk, producers                    | All bookings in ChordusAM                                         | Zero double bookings. Shift-close variance reported daily  |
| 6. Rights and client view  | Deliverables register, consents, approvals, client portal      | Producers, Admins                        | No publish without a complete record                              | 100% of published deliverables have rights fields complete |

**Champions.** One per function, with 1 hour a week protected for it:

- Executive sponsor: Thoshan.
- HR: Abilasini.
- Finance: Janaka.
- Producers: Chathurika.
- Front desk: to be named.
- Admin: Fazlur or Gurpreet.

Champions test each wave first, run the weekly 15-minute "what's stuck" check, and collect requests in one list.

**Training.**

- A 30-minute session per role per wave, run on the phone, because most staff use phones (`00-brief.md` §4).
- 2-minute screen recordings for each core task.
- One-page quick cards in Sinhala, Tamil and English.
- A weekly office hour for the first 6 weeks of each wave.
- Demo mode (from Phase 0, `docs/phase-0.md`) as a safe practice space.

**Change tactics.**

- WhatsApp becomes a notification channel that links back into ChordusAM, not the place where decisions are made (`NOT`).
- Admins stop approving anything sent only on WhatsApp after each cutover date. This is the single most important behaviour change, and it has to come from the top.
- Celebrate early wins in the team chat, for example "Payroll draft done in 2 hours instead of 2 days" once it is true.

**Adoption KPIs.** Measure a baseline in the 2 weeks before each wave. All targets are hypotheses to adjust after the baseline.

| KPI                                                                                | Funnel stage | Target (hypothesis)             |
| ---------------------------------------------------------------------------------- | ------------ | ------------------------------- |
| Staff activated (logged in and completed one task) within 7 days of a wave         | Activation   | ≥ 90%                           |
| Weekly active users ÷ staff                                                        | Retention    | ≥ 80% by month 2                |
| Share of leave requests and payment requests raised in-app rather than on WhatsApp | Habit        | ≥ 95%                           |
| Median time from payment request to paid                                           | Value        | Halve the baseline              |
| HR hours to prepare monthly payroll                                                | Value        | Down 50% after the parallel run |
| Payroll parallel-run differences without an explanation                            | Quality      | 0                               |
| Share of productions with a costed P&L                                             | Value        | ≥ 90%                           |
| Share of published deliverables with complete rights and consent records           | Risk         | 100%                            |
| Staff satisfaction (3-question pulse, quarterly)                                   | Sentiment    | ≥ 4 of 5                        |

---

## 7. If ChordusAM later becomes SaaS (OPTIONAL)

**Everything in this section is optional and hypothetical.** AMPL's own needs come first (`00-brief.md` §4). Nothing here should change the MVP, except keeping multi-tenant readiness in the design.

### 7.1 Pricing hypotheses

**Model:** price per studio, not per seat. Freelancer logins and client portal users are free and unlimited. Per-seat pricing is the known pain for freelancer-heavy studios ([R1 P13](research/R1-media-production-erp.md)). freispace already prices per facility with unlimited users ([R1 §4.18](research/R1-media-production-erp.md)).

**Anchors:**

- Sri Lankan HRIS: Humanised LKR 10,000 (up to 15 staff) and LKR 25,000 (up to 50) a month ([R2 A.3](research/R2-hris-payroll-sri-lanka.md)). Better HR about LKR 399 per employee. Gallery HR about LKR 400–500 per employee (secondary).
- Agency suites: about LKR 155,000 to 230,000 a month for 20 seats (Productive to Scoro Standard at USD 1 = LKR 310, section 3.5).

| Tier                     | For                             | Includes                                                                                     | Hypothesis price (LKR/month, annual billing) | Rationale                                                                                                                 |
| ------------------------ | ------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Crew**                 | Up to 15 staff                  | HR, leave, attendance import, payroll with statutory exports, freelancer payouts with WHT    | 15,000                                       | 1.5× Humanised's entry price, justified by freelancer payouts and WHT, which local HRIS lacks                             |
| **Studio** (recommended) | Up to 40 staff, 1 location      | Crew + productions and job costing, AI cost, booking and POS, rights register, client portal | 45,000                                       | About a fifth of a 20-seat agency suite, yet it covers payroll and POS. The decoy-free middle tier most ICP-1 studios fit |
| **Network**              | Multi-brand or multi-entity, SG | Studio + multi-entity, multiple locations, accounting sync, WhatsApp utility messages, API   | From 90,000, or quote                        | Multi-entity is premium everywhere (Odoo Custom, Scoro) ([R1 §4.3, §4.16](research/R1-media-production-erp.md))           |

**Add-ons and fees:**

- Onboarding and data migration: LKR 50,000 to 150,000 one-off (hypothesis).
- WhatsApp messages at Meta cost plus a margin.
- Payment processing passed through to PayHere, so ChordusAM never holds funds.
- Annual billing at about 2 months free.

**Free tier:** none at first. Instead, a 30-day trial with demo data, because statutory payroll carries support cost. Test pricing with 5 to 10 design-partner studios (willingness-to-pay interviews, then a Van Westendorp survey) before publishing a price.

### 7.2 Go-to-market notes

1. **AMPL is the case study.** Publish measured results only after 6 months of live use.
2. **Design partners first.** Recruit 5 to 10 studios from AMPL's network: photo studios, production houses and music-video makers in Colombo.
3. **Accountants and payroll bureaus as a channel.** They influence SME software choice and feel the WHT and VAT-format pain. Colombo Xero partner firms are a starting list ([R3 §4.1](research/R3-pos-booking-finance.md)).
4. **Content on SL tax changes** in Sinhala, Tamil and English, for example "WHT on artists and photographers from June 2026" or "the new VAT invoice format". These topics change often ([R3 §6](research/R3-pos-booking-finance.md)) and bring searchers with the exact pain.
5. **Built-in referral loop.** Freelancers receive vouchers and WHT certificates, and clients open approval links. Both see a discreet "Made with ChordusAM" footer, which the studio can switch off on the Network tier. Offer one free month per referred studio.
6. **SEA only via Singapore,** and only after AMPL's SG entity runs on ChordusAM with a CPF, SDL and IRAS pack, or a partner payroll provider ([R2 B.12](research/R2-hris-payroll-sri-lanka.md)).

### 7.3 Risks

| Risk                          | Detail                                                                                                                       | Mitigation                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Statutory liability           | A payroll or tax error becomes a vendor liability across many customers                                                      | Accountant sign-off step in the product. Clear terms. Published update log for rate changes |
| Small market                  | The number of SL studios matching ICP-1 is unknown                                                                           | Size it before investing (open question 1)                                                  |
| Odoo partners on price        | Local Odoo partners can bundle a cheaper generic offer                                                                       | Compete on fit (USPs 1 to 3), not breadth                                                   |
| Multi-tenancy                 | Phase 0 is single-tenant. RLS would need a `tenant_id` throughout                                                            | Keep `entity_id` and tenant readiness in `docs/discovery/20-solution-design.md`             |
| PDPA and cross-border hosting | Customer HR data hosted abroad                                                                                               | SEC review. Consider a regional hosting option                                              |
| Distraction                   | SaaS work competes with AMPL's own roadmap                                                                                   | No SaaS work until AMPL has 6 months of stable use                                          |
| Brand                         | "AM" stands for Alliance Media, and "Varnam TV" may clash with another brand ([R4 §3.5](research/R4-creative-ops-rights.md)) | Neutral product name for SaaS. Trademark search                                             |

---

## 8. Open questions

1. **Market size (SaaS only):** how many Sri Lankan studios match ICP-1 (8 to 50 staff, own studio, freelancer pool)? No source was found.
2. Does AMPL rent the studio and gear to **outside** clients? This decides whether USP 5 is real and whether POS is MVP.
3. Is there a **front desk** role, and who does it today?
4. Which **accounting package** does the accountant use? This changes the "one ledger" message (export versus sync).
5. Will AMPL keep **payroll in ChordusAM** or hand the run to a local bureau (R2 hybrid option)? If it hands it over, USP 4 narrows to sales and payout tax.
6. Baseline numbers for the KPIs: current hours for payroll preparation, and median days from payment request to paid.
7. Staff UI language: is English enough, or are Sinhala and Tamil screens needed, not just quick cards?
8. Does Odoo's official WhatsApp app work on Odoo Online Standard in Sri Lanka, or only on Custom and Enterprise plans? This matters for the CFO's Odoo comparison.
9. **Verification gaps:** farmerswife price; Odoo's Sri Lankan price list in LKR; Humanised's entry tier (LKR 5,000 or 10,000); Studio Ninja's current price; whether Rentman's platform fee is monthly; ClickUp's current cost to AMPL.
10. For REV: correct R1 §5 and §7 item 6 ("native WhatsApp: 0"), given Odoo's official WhatsApp app.
