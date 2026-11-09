# 13: UX design, information architecture and user journeys

**Date:** 9 November 2026
**Author:** PD, Product Designer (discovery team)
**Upstream read:** `docs/discovery/00-brief.md`, `docs/PLAN.md` (sections 2, 3, 4, 5, 6, 7, 8, 11, 12, 15), `docs/phase-0.md` (especially "Look and feel"), `app/globals.css`, `app/(app)/layout.tsx`, `components/*.tsx`, `lib/auth/roles.ts`, and the research files `docs/discovery/research/R1-media-production-erp.md` to `R4-creative-ops-rights.md`.

**Summary.** This document describes how ChordusAM should look and behave once it grows from an HR and finance tool into a Media and Studio ERP with POS and HRIS. It covers 8 personas, a navigation tree for all 19 module codes in the brief, 10 user journeys, an MVP screen inventory with wireframes for the 6 most important screens, the design-system additions, content and localisation rules, and a research plan. The main design decisions are these. (1) **One shell, many role-shaped homes.** Everyone lands on `/home`, which shows only the cards for their role. The current 5-pill module switcher becomes 8 "hubs" on desktop, and a 4 to 5 item bottom bar on phones. (2) **Two surfaces in one brand.** The AMPL liquid glass stays for the header, navigation, dashboards and portals. Tables, forms, POS and payroll sit on solid surfaces with stronger borders. I measured the current tokens: several fail WCAG 2.2 AA (muted text on glass is 4.15:1, field borders are 1.42:1, rose is 3.37:1 and brand green is 2.63:1 on ink). I propose fixed tokens and an optional light "Workbench" mode. (3) **Approvals happen in one tap from a single inbox**, with the policy reason shown on the card and a short undo window. Money approvals need a second confirming tap that repeats the amount. (4) **POS and attendance tolerate dropped internet.** They queue cash and recorded payments on the device, show the queue, and block anything that changes shared balances. (5) **Bilingual-ready from day one.** Sinhala and Tamil fonts are chosen to pair with the brand, no hardcoded strings, no uppercase or letter-spacing on Sinhala or Tamil text, and receipts are printed as images when they use those scripts. The research cited is R1 to R4. No BRD exists yet, so I cite research IDs (for example R2-44, R4-F02, R1 pattern P1) and the BA can map them to `BR-*` IDs in `docs/discovery/10-brd.md`. Screen IDs (`S-xx`) and journey IDs (`J-xx`) are local to this document.

---

## Contents

1. [Summary and design principles](#1-summary-and-design-principles)
2. [Personas](#2-personas)
3. [Information architecture](#3-information-architecture)
4. [Key user journeys](#4-key-user-journeys)
5. [Screen inventory and wireframes](#5-screen-inventory-and-wireframes)
6. [Component and design-system additions](#6-component-and-design-system-additions)
7. [Content and localisation guidelines](#7-content-and-localisation-guidelines)
8. [Usability risks, research plan and open questions](#8-usability-risks-research-plan-and-open-questions)

---

## 1. Summary and design principles

### 1.1 Design principles

| #     | Principle                                     | What it means in practice                                                                                                                                                                                                                                                                                                                                                             | Test it with                                                                      |
| ----- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| DP-1  | **Mobile-first for staff**                    | Every employee, producer and approver screen is designed at 360 px wide first. About 80% of mobile use in Sri Lanka is Android ([StatCounter, mid 2026](https://gs.statcounter.com/os-market-share/mobile/sri-lanka)), so the reference test device is a mid-range Android phone in Chrome. Thumb-reach primary actions sit at the bottom of the screen.                              | Every journey in section 4 completed on a 360 px Android phone on 4G              |
| DP-2  | **Front desk is fast**                        | POS is a tablet-first, one-screen layout. A repeat walk-in sale takes at most 5 taps from "sell" to "receipt". There are no modal chains: payment is a bottom sheet over the cart.                                                                                                                                                                                                    | J-01 under 60 seconds for a trained cashier                                       |
| DP-3  | **Glanceable dashboards**                     | Each home card answers one question ("Do I need to act?", "Is cash OK?", "Is the studio full?"). It shows a number, a state and one link. No chart without a sentence that says what it means.                                                                                                                                                                                        | 5-second test: participants say what needs attention after 5 s                    |
| DP-4  | **Approvals in one tap**                      | All approvals of every type land in one inbox (S-02). Each card shows who, what, how much, and **why it is here** (for example "Above the LKR 15,000 limit", "HR recommends approve"). Approve is one tap with an undo toast. Money approvals show a confirm step that repeats the amount and payee. Reject and Return always ask for a comment.                                      | J-08 owner clears 7 items in under 3 minutes                                      |
| DP-5  | **Bilingual-ready (Sinhala, Tamil, English)** | Every string comes from a message catalogue. Layouts allow 30 to 50% text growth (a common rule of thumb, unverified for Sinhala and Tamil). Language is a per-user setting and a per-portal-link setting. Typography rules in section 7.3 handle scripts with no case and taller glyphs.                                                                                             | Pseudo-locale build plus native-speaker review of the 30 most used screens        |
| DP-6  | **WCAG 2.2 AA**                               | Contrast at least 4.5:1 for text and 3:1 for control borders and focus. Targets at least 24 × 24 CSS px ([2.5.8](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)), 44 px on touch screens where possible. Focus never hidden by the sticky header or bottom bar (2.4.11). Every drag has a button alternative (2.5.7). Login allows paste and password managers (3.3.8). | Automated axe check in Playwright plus a manual TalkBack pass (Android) per phase |
| DP-7  | **Offline tolerance where it matters**        | POS and mobile check-in work through short outages: they queue safe actions on the device, show a visible queue, and sync later. Actions that change shared balances (deposits, vouchers, refunds) are blocked with a clear message. Everything else shows "You are offline, nothing is saved" instead of failing silently.                                                           | Airplane-mode test on J-01, J-09 and J-10                                         |
| DP-8  | **Brand-consistent, data-dense**              | The website's ink, wine, gold, glass and Cormorant headings are kept for the "showcase" layer (header, navigation, home, portals, empty states). Data screens use solid surfaces, Inter with tabular figures, and a density setting. See 1.2.                                                                                                                                         | Visual review against alliancemedia.lk plus contrast audit (1.3)                  |
| DP-9  | **Show the rule, not just the result**        | Company policy is data (CLAUDE.md), so the UI always says which rule produced a number: "Deducted LKR 4,000: 1 unapproved absent day × LKR 4,000 (contract type _Probationary Ops Manager v3_)". Users trust payroll, WHT and late fees only when they can see why.                                                                                                                   | Payroll review test (J-07): HR can explain every deduction without a spreadsheet  |
| DP-10 | **The UI is never the only lock**             | Hidden buttons are a convenience, not protection. Every screen assumes the server guard and RLS (CLAUDE.md) and shows a calm 404 or "You don't have access" state when the server says no.                                                                                                                                                                                            | Playwright: each role × each route (already a Phase 0 pattern)                    |

### 1.2 Brand versus data density: two surfaces, one brand

The Phase 0 theme is a faithful copy of the website: a dark ink page, wine glows, frosted glass panels, uppercase tracked labels and gold pill buttons (`app/globals.css`). It works for a landing page. A payroll table with 20 rows and 12 columns, or a POS used for 8 hours under studio lights, needs more. I propose two surface types that share the same tokens.

| Layer         | Used for                                                                                           | Background                                                             | Type                                                                                                   | Effects                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **Showcase**  | Header, hub navigation, Home cards, portals (talent and client), sign-in, empty states, PDF covers | Ink with wine glows; `.glass` panels                                   | Cormorant Garamond page titles with the gold italic word; mono eyebrows                                | Glass blur, gold hairline, short `rise` entrance (already switched off for reduced motion) |
| **Workbench** | Tables, forms, POS, calendars, payroll, import preview, anything with more than about 5 fields     | New solid `surface-1` (`#211017`) on ink. No backdrop blur behind text | Inter 14 to 16 px with `font-variant-numeric: tabular-nums`; Cormorant only for the H1 above the table | No blur, no entrance animation on rows; 1 px `border-strong` on controls                   |

Why: content placed on top of other content becomes harder to read, which is Nielsen Norman Group's main criticism of Apple's Liquid Glass ([NN/g](https://www.nngroup.com/articles/liquid-glass/)). Glass also makes contrast depend on whatever is behind it, so a ratio that passes in one spot fails in another ([wecandevelopit research note](https://www.wecandevelopit.com/news/accessibility-in-the-age-of-glassmorphic-ui-research-report-and-evidence-base)). The Phase 0 notes already chose to leave out WebGL and refraction for this reason. This proposal takes the same reasoning one step further.

**Other brand adjustments for data screens:**

- **Uppercase tracked text** (`.btn`, `.eyebrow`, `.field-label`) is kept for primary buttons and section eyebrows only. Table headers, row actions, chips and helper text use sentence case. Long uppercase strings with 0.18 to 0.28 em tracking are slower to read, and Sinhala and Tamil have no case (section 7.3).
- **Minimum text size of 12 px.** The current eyebrow is 0.68 rem and the field label 0.62 rem (about 10 to 11 px). Raise both to 0.75 rem (12 px) and reduce tracking to 0.16 em in Workbench screens.
- **The gold pill stays the single primary action** on each screen (Krug: one primary action). Secondary actions use `.btn-glass` on Showcase and a new outline button on Workbench.
- **Numbers** are Inter with tabular figures, right-aligned, and currency code first in column headers ("Amount (LKR)"). JetBrains Mono is for document numbers (`AMPL-PV-2026-0001`), timecodes and device IDs.

### 1.3 Contrast audit of the current tokens

**Method.** I used the WCAG relative-luminance formula on the hex values in `app/globals.css`. Where the theme uses transparency, I composited it over the **worst-case backdrop**: the top-right wine glow (75% `#6B1F35` over ink gives about `#55192B`). Then, for glass, I added the 14% white top-left highlight of `.glass` (about `#6D3949`). Real values move with the backdrop, which is the point of 1.2.

| Pair                                                | Ratio         | Needed                    | Result                                                 |
| --------------------------------------------------- | ------------- | ------------------------- | ------------------------------------------------------ |
| Cream `#FBF8F5` on ink                              | 18.7          | 4.5                       | Pass                                                   |
| Cream on the brightest glass corner                 | 8.5           | 4.5                       | Pass                                                   |
| Cream 75% (idle nav pill) on header glass           | 6.1           | 4.5                       | Pass                                                   |
| Muted `#C8A8B0` on ink                              | 9.1           | 4.5                       | Pass                                                   |
| **Muted on the brightest glass corner**             | **4.15**      | 4.5 (labels are 10–11 px) | **Fail** for small text                                |
| **Placeholder (muted at 60%) in a field**           | **3.6**       | 4.5                       | **Fail** (and placeholders must not be the only label) |
| Gold `#F5A623` on ink / on glass                    | 9.8 / 4.4     | 4.5                       | Pass on ink; **borderline fail** on bright glass       |
| Button text `#2A0A14` on the gold gradient          | 7.5–14.4      | 4.5                       | Pass                                                   |
| **Rose `#C2185B` on ink / on wine glow**            | **3.4 / 2.3** | 4.5 text, 3 non-text      | **Fail**: use only in decorative gradients             |
| **Brand green `#1A6040` on ink**                    | **2.6**       | 4.5                       | **Fail**: cannot mean "Paid" or "Approved" on dark     |
| **Field border (white 14%) against ink**            | **1.4**       | 3 (WCAG 1.4.11)           | **Fail**: inputs are hard to find for low-vision users |
| Soft-gold focus ring against ink                    | 13.7          | 3                         | Pass                                                   |
| Error text `#FFD0DF` on the `.msg-err` fill         | 12.6          | 4.5                       | Pass                                                   |
| **Deep gold `#E8941A` on cream** (for a light mode) | **2.3**       | 4.5                       | **Fail**: a light mode needs a darker gold for text    |

**Fixes (new semantic tokens, all measured):**

| Token                 | Dark (default)                        | Light "Workbench" mode        | Ratio (dark on `surface-1` / light on white) |
| --------------------- | ------------------------------------- | ----------------------------- | -------------------------------------------- |
| `--surface-0` (page)  | ink `#14060B` (unchanged)             | cream `#FBF8F5`               | n/a                                          |
| `--surface-1` (panel) | `#211017` solid                       | `#FFFFFF`                     | n/a                                          |
| `--surface-2` (hover) | `#2C1620`                             | tint `#F9F0F2`                | n/a                                          |
| `--text-1`            | cream `#FBF8F5`                       | ink `#14060B`                 | 17+ / 18.7                                   |
| `--text-2`            | `#D8C2C8` (replaces muted on glass)   | `#5E4650`                     | 10.8 on surface, 5.4 on bright glass / 8.5   |
| `--text-3`            | muted `#C8A8B0`, solid surfaces only  | `#6B4F57`                     | 8.4 / 7.3                                    |
| `--border-strong`     | `#7D5867` (inputs, chips, table grid) | `#8F7680`                     | 3.3 vs ink / 3.9 vs cream                    |
| `--accent`            | gold `#F5A623` (fills, focus)         | gold fill, `#8A5A00` for text | 9.8 / 5.9                                    |
| `--ok`                | `#7EE2A8`                             | `#146B3A`                     | 11.6 / 6.6                                   |
| `--warn`              | `#FFB86B`                             | `#9A3412`                     | 10.7 / 7.3                                   |
| `--danger`            | `#FF8FB1`                             | `#A3123F`                     | 8.5 / 7.7                                    |
| `--info`              | `#9CC8FF`                             | `#1D4ED8`                     | 10.5 / 6.7                                   |

Brand green `#1A6040` and burgundy `#4A1528` stay as fills and as text in the light mode (7.5 and 14.7 on white). Rose stays in gradients only.

**Light "Workbench" mode.** Phase 0 chose dark only and said a light theme could come later for long data-entry sessions (`docs/phase-0.md`, assumption 7). I recommend adding it in the MVP as a **per-user setting** (Dark, Light, Match device). Default it to Light on the POS tablet: front desks are often near windows, and a light screen is easier to read in glare (a heuristic, to test in J-01). Keep the brand in the light mode through the burgundy header, the gold primary button and Cormorant page titles. Also honour `prefers-contrast: more` by turning off glass blur and using solid `surface-1` everywhere.

---

## 2. Personas

The personas below are archetypes. Where the brief names a real person in that role, I note it, so research sessions (section 8) can start with them. All quotes are hypotheses to test, not interview findings.

| #   | Persona                                                        | Role key (today → proposed)                                          | Devices and context                                                                                                   | Language                                  |
| --- | -------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| P1  | **Nadeesha, studio employee** (editor, photographer, engineer) | `employee`                                                           | Own Android phone, 4G, often in the studio or on location. Laptop at the desk for editing work, not for admin         | English at work, Sinhala or Tamil at home |
| P2  | **Abilasini-type HR and Ops manager**                          | `hr`                                                                 | Laptop most of the day, phone for approvals and WhatsApp. Uploads the fingerprint file weekly                         | English                                   |
| P3  | **Owner and Admins** (Thoshan, Fazlur, Gurpreet)               | `admin`                                                              | Phone first: mornings, between meetings, abroad. Laptop for month-end reviews                                         | English                                   |
| P4  | **Janaka-type Finance officer**                                | `finance`                                                            | Desktop with a wide screen and keyboard. Bank portal open in another tab. Prints and files                            | English                                   |
| P5  | **Chathurika-type producer and project manager**               | `employee` + `can_request_payments` → proposed `producer` capability | Phone on set and in the studio; laptop in the office. Lives in WhatsApp and ClickUp                                   | English, Sinhala and Tamil with talent    |
| P6  | **Front desk and cashier** (studio coordinator)                | none today → proposed `front_desk` capability                        | Shared counter tablet in landscape, a thermal printer, the bank card terminal, a LankaQR standee. Sometimes own phone | Sinhala, Tamil and English with customers |
| P7  | **Freelancer and talent** (vocalist, AI artist, editor, model) | none → proposed **talent portal identity** (not a staff role)        | Phone only, WhatsApp first, sometimes low data balance. Will not install an app or remember a password                | Often Sinhala-first or Tamil-first        |
| P8  | **Client** (brand marketer, artist or channel manager)         | none → proposed **client link or portal identity**                   | Phone, opens links from WhatsApp or email. Busy; reviews between other tasks                                          | English, Sinhala or Tamil                 |

The external accountant is a secondary persona: they receive exports and never log in for the MVP.

### P1 Nadeesha, studio employee

- **Goals:** know where I need to be today, fix attendance problems quickly, get leave approved without chasing, see my pay.
- **Top tasks:** (1) See today: my bookings, call times and shifts. (2) Request leave. (3) Fix a missed fingerprint punch. (4) Open my payslip. (5) Log time against a job (if timesheets come in, R1 table stakes).
- **Pain today:** asks HR on WhatsApp for balances; does not know if a leave request was seen; payslip arrives as a file in a chat.
- **Success:** a leave request from the phone in under 1 minute; a status that updates without asking anyone.

### P2 HR and Ops manager

- **Goals:** clean attendance by Monday noon, no payroll surprises, nothing stuck in the approval chain, contracts and probation dates never missed.
- **Top tasks:** (1) Weekly fingerprint import and exceptions. (2) Recommend or return leave and manual attendance. (3) Prepare and submit payroll. (4) Maintain employees, contracts and holidays. (5) Raise vendor payment requests.
- **Pain today:** spreadsheet cleanup after each import; chasing people for missing punches; rebuilding payroll by hand; 15,000-limit approvals by WhatsApp.
- **Success:** import to clean exceptions in under 15 minutes; payroll draft in under 30 minutes.

### P3 Owner and Admins

- **Goals:** know the state of the business in 3 minutes, approve without opening a laptop, spot jobs losing money early.
- **Top tasks:** (1) Morning check: cash, studio, productions at risk. (2) Approve leave, manual attendance, payments, payroll, discounts. (3) Look at margin per job, brand and channel. (4) Change policies (limits, rates, leave types).
- **Pain today:** approvals scattered in WhatsApp threads with no record; margin known only weeks later.
- **Success:** "inbox zero" every morning on the phone; any approval traceable in the audit log.

### P4 Finance officer

- **Goals:** pay the right people the right amount once, keep receivables under control, close the month for the accountant, keep tax (WHT, VAT, SSCL, stamp duty) right.
- **Top tasks:** (1) Payables queue: pay and mark paid with a reference. (2) Record receipts and chase overdue invoices. (3) Reconcile POS shifts against bank and QR. (4) Month-end exports. (5) Monthly WHT schedule and certificates (R2-44).
- **Pain today:** missing bills, payments split to dodge the limit (PLAN.md section 15), cash counts in a notebook.
- **Success:** a payables run in under 20 minutes; POS reconciliation daily, not monthly.

### P5 Producer and project manager

- **Goals:** turn a WhatsApp enquiry into a quoted, booked, crewed job fast (48 h turnaround claim); keep the job inside budget; get paid on approval.
- **Top tasks:** (1) Create a quote from a template and send it. (2) Book studio, gear and crew. (3) Engage and pay freelancers. (4) Move the job through stages and send cuts for review. (5) See budget versus actual.
- **Pain today:** retyping the same details into a quote, a ClickUp task, a payment request and an invoice; no idea of margin until after.
- **Success:** quote accepted to job ready in 2 minutes; margin visible on the job page every day.

### P6 Front desk and cashier

- **Goals:** serve the person at the counter without making them wait; never double-book a room; cash balances at day end.
- **Top tasks:** (1) Check in today's bookings and take the balance. (2) Sell walk-in studio time, prints and add-ons. (3) Take LankaQR, cash and card payments and print receipts. (4) Check gear out and in. (5) Open and close the shift.
- **Pain today:** paper diary, no receipt numbers, cash variances nobody can explain, gear returned without notes.
- **Success:** walk-in sale under 60 seconds; shift close under 5 minutes with zero unexplained variance.

### P7 Freelancer and talent

- **Goals:** know the job, the fee and when I will be paid; sign quickly; never have to chase AMPL.
- **Top tasks:** (1) Accept an engagement. (2) Sign the services agreement, release and AI-likeness consent (R2-42, R4-F06). (3) Upload an invoice or deliverable link. (4) See payment status, voucher and WHT certificate (R2-47). (5) Check a call sheet (R1 pattern P14).
- **Pain today:** fee and WHT disputes ("Why is it less?"), unclear payment dates, contracts on paper or not at all.
- **Success:** onboarding in under 5 minutes on a phone without a password; zero "When will I be paid?" messages.

### P8 Client

- **Goals:** approve or comment on a cut quickly, see what I owe, pay easily.
- **Top tasks:** (1) Accept a quote and pay the deposit. (2) Review a cut and approve or request changes. (3) Download invoices and receipts. (4) See the status of my project.
- **Pain today:** feedback scattered across WhatsApp voice notes; unclear how many revision rounds are included.
- **Success:** approve a cut from a WhatsApp link in under 1 minute with no sign-up ([R4 section 1.2](research/R4-creative-ops-rights.md)).

**Data-model note.** P5 and P6 need capabilities that Phase 0 does not have, and P7 and P8 need identities that are not staff profiles. Phase 0 already asked whether a separate permissions table is better than more columns (`docs/phase-0.md`, "One addition to the PLAN.md data model"). I recommend a small **capabilities** model (`can_request_payments`, `can_sell_pos`, `can_manage_bookings`, `can_manage_jobs`) on top of the 4 roles, plus separate `portal_contacts` for talent and clients. This changes PLAN.md section 9, so per CLAUDE.md **the owner must approve it**; the SA owns the detail in `docs/discovery/20-solution-design.md`.

---

## 3. Information architecture

### 3.1 Model

The app has four levels:

1. **Shell:** brand, hub switcher, global search, Create (+), the Approvals inbox with a count, notifications, and the profile menu (language, theme, density, sign out). Later it also gets an entity switcher (AMPL or the SG entity, R2-34).
2. **Hubs:** the evolved module switcher. Each hub groups modules that the same people use together.
3. **Sections:** tabs inside a hub (for example Studio › Calendar).
4. **Records:** a booking, job, invoice, employee or payroll run. Each record has a stable URL so a WhatsApp or email link opens it directly.

### 3.2 Navigation tree (target product)

Codes in brackets are the brief's module codes. `(own)` means the person sees only their own records.

```text
/home ............................ Home: role-shaped cards [RPT]
/inbox ........................... Approvals inbox, all types [APR]; notifications tab [NOT]
/search (Ctrl+K) ................. People, clients, jobs, bookings, invoices, vouchers

/me .............................. My Workspace (everyone)
  /me/today ...................... My day: bookings, call times, shifts, tasks
  /me/attendance ................. My month calendar; mark missed attendance [ATT]
  /me/leave ...................... Balances; request leave; history [LV]
  /me/requests ................... Everything I raised: leave, attendance, payments, bookings
  /me/pay ........................ Payslips; tax and EPF summary [PAY]
  /me/jobs ....................... Jobs and bookings I'm on (producers see "my jobs") [PRJ]
  /me/documents .................. My contract, letters, policies to acknowledge [HR]
  /me/profile .................... Contact details, bank (masked), language, theme, WhatsApp opt-in

/studio .......................... Studio hub
  /studio/calendar ............... Rooms × time, gear, crew (S-20) [BKG]
  /studio/bookings ............... List, filters, tentative holds, no-shows [BKG]
  /studio/pos .................... Sell, receipts, refunds (S-30) [POS]
  /studio/shifts ................. Open, close, cash count, Z-reports [POS]
  /studio/gear ................... Check-out and check-in (scan), register, maintenance [BKG][AST]
  /studio/catalogue .............. Rooms, packages, add-ons, vouchers, price rules [POS][BKG]

/production ...................... Production hub
  /production/pipeline ........... All jobs by stage (board and list) [PRJ]
  /production/jobs/:id ........... Job page (S-43): overview, budget, schedule, crew,
                                   deliverables, approvals, money, links, activity
  /production/clients ............ Clients, contacts, leads [CRM]
  /production/quotes ............. Quotes and estimates; templates [CRM]
  /production/retainers .......... SMM and SEO retainers with quotas (R4-F15) [CRM][SAL]
  /production/talent ............. Talent pool, engagements, contracts, consents [TAL]
  /production/deliverables ....... Register, versions, rights, releases, publish checklist [AST]
  /production/channels ........... YouTube channels and brands, revenue imports (R4-F11) [AST]
  /production/ai ................. AI subscriptions, credit pool, per-job allocation [AI]

/money ........................... Money hub
  /money/invoices ................ Sales invoices, credit notes, receipts [SAL]
  /money/receivables ............. Ageing, reminders, deposits held [SAL]
  /money/payables ................ Vendor and talent payment requests, payables queue [VP]
  /money/expenses ................ Expenses, recurring, receipts [FIN]
  /money/reconcile ............... POS shifts, QR and card against the bank [FIN][POS]
  /money/cash .................... Cash and bank view, 30-day forecast [FIN]
  /money/tax ..................... VAT, SSCL, WHT schedules and certificates, stamp duty [FIN][VP]
  /money/budgets ................. Budgets versus actual (post-MVP) [FIN]

/people .......................... People hub
  /people/employees .............. Directory, contracts and history, documents [HR]
  /people/onboarding ............. Onboarding and offboarding checklists (R2-08) [HR]
  /people/attendance ............. People × days calendar, imports (S-81), exceptions [ATT]
  /people/leave .................. Review queue, team calendar, balances [LV]
  /people/payroll ................ Runs (S-85), payslips, statutory exports (R2-24) [PAY]
  /people/holidays ............... Public and Poya holidays with gazette references [HR]

/reports ......................... Reports hub (Admin, Finance; HR sees people reports)
  P&L, project and job profitability, brand and channel P&L, studio utilisation,
  AR and AP ageing, payroll cost, attendance and leave, AI cost per job, exports [RPT]

/admin ........................... Admin hub (Admins)
  /admin/users ................... Users, roles, capabilities, delegation (PLAN.md section 15)
  /admin/policies ................ Contract types, leave types, limits, rates, tax tables,
                                   revision rounds, deposit and late-fee rules
  /admin/approvals ............... Approval rules per type (thresholds, steps) [APR]
  /admin/notifications ........... Templates per channel and language, WhatsApp opt-ins [NOT]
  /admin/integrations ............ Accounting export or sync, PayHere, Frame.io, ClickUp [INT]
  /admin/entities ................ Entities, brands, locations (multi-entity ready) [ADM]
  /admin/audit ................... Audit log viewer [ADM]

/portal .......................... Talent portal (P7), separate light shell
  /portal/jobs | /portal/documents | /portal/payments | /portal/profile

/r/:token ........................ Client review link (P8): one cut, approve or request changes
/q/:token ........................ Client quote link: accept, sign, pay deposit
/pay/:token ...................... Pay an invoice or deposit (PayHere hosted checkout)
/client .......................... Client portal (post-MVP): projects, reviews, invoices
```

Every hub also has a small **Settings** tab for the policies it owns (for example Studio › Catalogue). The settings live in one data store and are listed in full under `/admin/policies`, so there is one place to audit them.

### 3.3 Who sees what

`F` full, `O` own records, `L` limited (named sections), `R` read only, `–` none (the route returns 404, as in Phase 0).

| Hub / section                         | Employee          | Producer                | Front desk          | HR                        | Finance                | Admin | Talent (portal)     | Client (link/portal) |
| ------------------------------------- | ----------------- | ----------------------- | ------------------- | ------------------------- | ---------------------- | ----- | ------------------- | -------------------- |
| Home                                  | O                 | O + jobs                | Studio today        | People                    | Money                  | F     | Portal home         | –                    |
| Approvals inbox                       | O (mine)          | O + job approvals       | O (discounts asked) | Recommend step            | Payables returns       | F     | –                   | –                    |
| My Workspace                          | O                 | O                       | O                   | O                         | O                      | O     | –                   | –                    |
| Studio › Calendar, Bookings           | R (mine)          | F                       | F                   | R                         | R                      | F     | –                   | –                    |
| Studio › POS, Shifts                  | –                 | –                       | F                   | –                         | R + reconcile          | F     | –                   | –                    |
| Studio › Gear                         | R                 | F                       | F                   | –                         | R (values)             | F     | –                   | –                    |
| Production › Pipeline, Jobs           | O (assigned)      | F                       | R (bookings)        | –                         | R (money tabs)         | F     | O (engagements)     | O (status)           |
| Production › Clients, Quotes          | –                 | F                       | L (quick add)       | –                         | R                      | F     | –                   | O (own quotes)       |
| Production › Talent                   | –                 | F (no bank)             | –                   | L (classification, R2-43) | L (tax, bank)          | F     | O (profile)         | –                    |
| Production › Deliverables, Rights     | O (assigned)      | F                       | –                   | –                         | R                      | F     | O (own releases)    | O (own reviews)      |
| Production › AI costs                 | –                 | L (allocate to my jobs) | –                   | –                         | F                      | F     | –                   | –                    |
| Money › Invoices, Receivables         | –                 | R (my jobs)             | L (POS receipts)    | –                         | F                      | F     | –                   | O (own invoices)     |
| Money › Payables                      | O (if capability) | O                       | –                   | O (raise)                 | F                      | F     | O (own payments)    | –                    |
| Money › Expenses, Cash, Tax           | –                 | –                       | –                   | –                         | F                      | F     | O (WHT certificate) | –                    |
| People › Employees, Attendance, Leave | –                 | R (team calendar)       | R (team calendar)   | F                         | –                      | F     | –                   | –                    |
| People › Payroll                      | –                 | –                       | –                   | F (prepare)               | L (approved runs only) | F     | –                   | –                    |
| Reports                               | –                 | L (my jobs)             | L (shift reports)   | L (people)                | F (money)              | F     | –                   | –                    |
| Admin                                 | –                 | –                       | –                   | –                         | –                      | F     | –                   | –                    |

Rules carried over from PLAN.md section 2 and `docs/phase-0.md`: Finance never sees attendance or leave detail; nobody approves their own request; bank details only for Finance and Admins. Producers see talent **fees** but not bank details. These rules are enforced by guards and RLS; the matrix only says what the UI offers.

### 3.4 How the module switcher evolves

Today `components/module-nav.tsx` shows up to 5 pills (My Workspace, HR, Vendor Payments, Finance, Admin) in the glass header, and on a phone they scroll sideways under the brand row. That is fine for 5 modules. It will not work for 19 module codes.

| Step                             | Desktop (≥ 1024 px)                                                                                                                                                                                | Phone (< 768 px)                                                                                                          | When                                    |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Now (Phase 0)**                | 5 module pills, role-filtered, centred in the header                                                                                                                                               | Same pills, scrolling sideways in a second header row                                                                     | Done                                    |
| **Step 1: Home and Inbox**       | Add **Home** as the first pill and an **Inbox** icon button with a count, right of the pills. `homePathFor()` sends everyone to `/home`                                                            | Header shrinks to one row: logo, Inbox, avatar. Hubs move to a **bottom bar** (below)                                     | With the first approvals (PLAN Phase 3) |
| **Step 2: Hubs**                 | Pills become **hubs**: Home, Me, Studio, Production, Money, People, Reports, Admin (max 8, role-filtered; an employee sees 2). Sections show as tabs under the page title, sticky below the header | Bottom bar shows 4 role-specific items plus **More**, which opens a sheet listing every hub and section the user can open | When Studio or Production arrives       |
| **Step 3: Rail for power users** | On ≥ 1280 px, Money and People can show a collapsible left rail of sections (Finance and HR use many sections per day). The header stays the brand anchor                                          | Unchanged                                                                                                                 | When Money has 6+ sections              |

Legacy URLs (`/hr`, `/vendor-payments`, `/finance`) redirect to `/people`, `/money/payables` and `/money`, so old links in WhatsApp still work.

**Bottom bar per role (phones).** Material guidance is 3 to 5 destinations in a bottom bar, never scrolling ([Material Design](https://material.io/components/bottom-navigation), [Smashing Magazine](https://www.smashingmagazine.com/2016/11/the-golden-rules-of-mobile-navigation-design/)).

| Role          | 1    | 2          | 3           | 4       | 5    |
| ------------- | ---- | ---------- | ----------- | ------- | ---- |
| Employee      | Home | My time    | Leave       | Inbox   | More |
| Producer      | Home | Jobs       | Calendar    | Inbox   | More |
| Front desk    | POS  | Calendar   | Gear        | Inbox   | More |
| HR            | Home | Attendance | Leave       | Inbox   | More |
| Finance       | Home | Payables   | Receivables | Inbox   | More |
| Admin         | Home | Inbox      | Money       | Studio  | More |
| Talent portal | Jobs | Documents  | Payments    | Profile | –    |

The bottom bar and sticky header take space, so the page needs `scroll-padding-top` and `scroll-padding-bottom` equal to their heights. Otherwise a focused field can hide behind them (WCAG 2.4.11).

**Portals use a different, lighter shell.** No hub switcher, the AMPL mark, the language choice in the top-right, one task per page. Client links (`/r/`, `/q/`, `/pay/`) have no navigation at all: a client who opens a review link should see only that review.

---

## 4. Key user journeys

Each journey lists the steps with the screens touched, the failure paths, the pain removed and a measure. Screen IDs refer to the inventory in section 5.

### J-01 Walk-in studio session paid by LankaQR at POS

**Persona:** P6 front desk. **Trigger:** a podcaster walks in and asks for the podcast room for an hour, now.

1. **S-30 POS** is open on the counter tablet; the shift is open. The "Rooms now" strip at the top shows _Podcast room: free until 14:00_.
2. Tap the **Podcast room · 1 h** tile. A small sheet asks for the start (defaults to now, rounded to the next 5 minutes) and length (stepper: 1 h). The server checks the room is free (a Postgres exclusion constraint, [R3 section 3.4](research/R3-pos-booking-finance.md)). The tile becomes a cart line, and the room shows "Held" on the calendar.
3. Tap the add-on chip **Engineer · 1 h**. Only engineers on shift and not on leave are offered (PLAN.md section 8 team calendar).
4. Customer defaults to **Walk-in**. Optional: type a phone number to send a WhatsApp receipt (with a consent tick, PDPA).
5. Tap the gold **Charge LKR 8,500**. The payment sheet opens. Tap **LankaQR**.
6. The sheet shows the amount in large type and says: "Ask the customer to scan the counter QR and pay LKR 8,500. Enter the reference from their success screen." AMPL uses a **static LankaQR** from its bank ([R3 section 8](research/R3-pos-booking-finance.md)), so the POS records the reference and does not confirm the payment itself. Type the last 6 characters of the reference and tap **Record payment**.
7. The **receipt sheet** (S-31) offers **Print**, **WhatsApp**, **Email** or **No receipt**. Print sends an 80 mm receipt with a gapless number.
8. The booking shows "In session" on the calendar. Ten minutes before the end, the POS shows a quiet banner: "Podcast room ends 12:05. Extend?" Extending adds a line to a new sale.

**If the internet drops** at step 2: the POS shows "Offline · last synced 10:42". It can still record the sale (cash, LankaQR reference or card approval code) in the device queue. It creates the room use as an **unconfirmed walk-in**, flagged when it syncs. If it then clashes with a booking, the Admin and front desk get an alert. This is a "flag, don't block" exception: the customer is already in the room. Deposits, vouchers and refunds stay blocked offline (R3 section 2.2).

**Pain removed:** paper diary, unnumbered receipts, unknown room status. **Measure:** a repeat walk-in sale in under 60 seconds and 5 taps or fewer.

### J-02 Booking a studio and gear with a deposit

**Persona:** P6 front desk (or P5 producer). **Trigger:** a client messages on WhatsApp: photo shoot on Saturday, 14:00 to 18:00, with a lighting kit.

1. **S-20 Booking calendar**, day view for Saturday. Drag across 14:00 to 18:00 on the _Photo studio_ row, or press **New booking** and type the times (the keyboard path, WCAG 2.5.7).
2. **S-21 Booking form** opens as a side panel, with the room and time filled in. Add **Lighting kit A** from the gear picker (availability shown for the same period, including the padding time for checks). Optionally add a photographer (staff availability, leave excluded).
3. Price is calculated from the price rules (weekend rate, package, add-ons, [R3 section 3.4](research/R3-pos-booking-finance.md) "Skedda rules"). It shows each rule as a line, so the desk can explain it.
4. Pick the client or **quick add** (name, phone, company). The client record is shared with CRM.
5. The deposit policy fills in (for example 50%, a policy setting), plus the cancellation terms. Tap **Hold and send deposit link**.
6. The booking becomes **Tentative · hold until Thu 18:00** (dashed outline on the calendar). The client gets a WhatsApp utility template with a **Pay deposit** button (PayHere hosted checkout, R3 section 8) and an email copy.
7. The client pays. The PayHere notification confirms it. The booking turns **Confirmed** (solid), the desk gets a toast, and the client gets a confirmation with the terms. A reminder goes 24 hours before.
8. On the day, the desk opens **S-30 POS › Bookings today** and taps the booking to **check in**.
9. **S-25 Gear check-out**: scan the QR labels on each item with the tablet camera, take a condition photo if something looks worn, and hand over.
10. After the shoot, **S-25 check-in**: scan items back, note damage if any. A late return suggests the late fee from policy, but the desk confirms it; nothing is charged automatically.
11. **S-30 POS** takes the balance plus extras. The receipt shows the deposit applied and the balance paid.

**Failure paths:** the deposit is not paid by the hold time → the system asks the desk "Release the slot?" (one tap), and tells the client. The client pays after release → the payment is held as a credit and the desk is asked to rebook or refund. Gear conflict → the picker shows the clash and the next free kit.

**Pain removed:** double-booking, deposits in personal bank accounts, unknown gear location. **Measure:** booking with deposit link in under 2 minutes; no-shows tracked.

### J-03 Music video job from quote to delivery to invoice

**Persona:** P5 producer. **Trigger:** an artist asks on WhatsApp for an AI-hybrid Tamil music video.

1. **S-40 Clients** › quick add the artist as a lead.
2. **S-41 Quote builder** › start from the template _AI-hybrid music video · standard_. Options (live shoot day, extra revision round) are toggles with prices. Free revision rounds (for example 2) come from policy data (R4-F03). The quote shows the margin estimate to the producer only.
3. **Send quote** › the client gets a `/q/` link (S-96): read the quote, choose options, type their name to accept (click-to-accept with an audit trail, [R3 section 8](research/R3-pos-booking-finance.md)), and pay the advance online or see bank details.
4. On acceptance the **job is created** (R1 pattern P1, "one-step conversion chain"). **S-43 Job page** has the stages from the template (R4 section 4.1: brief, song, mix, storyboard, generation, shoot, edit, review, publish) and budget lines from the quote.
5. From the job's **Crew** tab, engage a vocalist from **S-50 Talent pool** (journey J-04), and book the vocal booth on **S-20** (the booking is linked to the job as an internal cost).
6. On **Budget**, allocate AI credits from the pool (**S-60**, R4-F09). Budget versus actual updates as costs arrive (R1 pattern P3).
7. On set, the producer moves stages on the phone: tap the stage strip, then **Mark done**. The ClickUp link stays on the job (R4-F12).
8. Vendor payment requests are raised from a budget line, so the vendor, job and amount are already filled in (**S-74**).
9. **S-44 Deliverables** › add **v1** as a link (Frame.io, Vimeo or Drive) and **Send for review** (journey J-05).
10. The client approves **v2**. The job moves to _Publish_. **S-46 Publish checklist**: AI-disclosure decision, consent and releases present (it blocks if they are missing, R4-F06), video ID.
11. The approval **drafts the balance invoice** (R4-F02). Finance confirms and sends it (S-70). The client pays by `/pay/` link or bank transfer.
12. The job closes with a margin summary. If costs are higher than income, a "pulse check" alert goes to Admins and Finance (R1 pattern P7).

**Pain removed:** the same details typed 4 times; margin known only after the fact; no record of approval. **Measure:** accepted quote to a fully set-up job in under 2 minutes; 100% of jobs with an approval event before the balance invoice.

### J-04 Freelancer onboarding, engagement and payment with WHT

**Persona:** P7 talent with P5 producer, P2 HR and P4 Finance.

1. The producer adds a new vocalist in **S-50 Talent** with name, phone and skills, then taps **Invite**. The talent gets a WhatsApp message with a sign-in link (one-time code, no password).
2. **S-90 Portal**, first screen: choose **සිංහල / தமிழ் / English**. Then a 3-step profile: skills and languages; NIC or passport and TIN, residency; bank details (masked after saving). Progress is saved after each step.
3. **S-91 Documents**: the services agreement, IP assignment and performer release, each with a plain-language summary above the legal text. **AI-likeness consent is separate and granular**: voice cloning, face likeness, and use in promotional material are separate toggles, each with an example (R2-42, R4-F06). Sign with the **signature pad** or by typing a name.
4. HR completes the **classification checklist** (R2-43) on the talent record. The portal does not show it.
5. The producer sends an **engagement** from the job: role, deliverables, fee, dates. The offer shows the WHT note up front: "WHT of 5% may be deducted if AMPL's payments to you this month go over LKR 100,000" ([R3 section 6](research/R3-pos-booking-finance.md), R2-44). The rate and threshold are policy data.
6. The talent taps **Accept**. The call sheet (date, time, location map link) appears in **S-90**, and a reminder goes the day before.
7. After the session, the talent uploads their invoice (optional) or the producer marks the deliverable done. A **payment request is drafted** with the WHT preview: "This month's total to this payee: LKR 135,000 → WHT 5% on the full amount: LKR 6,750. Net payable: LKR 128,250." The line shows which rule produced it (DP-9).
8. Approval: straight to Finance if under the limit, otherwise an Admin approves in S-02.
9. Finance pays and marks it paid (**S-75**). The talent gets "Payment sent · ref …" and the portal shows the voucher and the WHT certificate as PDFs (**S-92**).

**Failure paths:** the talent stops halfway → the producer sees "Profile 2 of 3" on the talent card and can resend the link. A consent is missing → the publish checklist blocks the deliverable, naming the person.

**Pain removed:** paper contracts, "Why is it less?" disputes, "When will I be paid?" messages. **Measure:** onboarding completed on a phone in under 5 minutes; fewer than 1 payment-status query per 10 payments.

### J-05 Client approving a cut via a link

**Persona:** P8 client. **Trigger:** the producer taps **Send for review** on v2.

1. Producer, on **S-44**: choose the client contact(s), add a short message, set the due time (default from policy, for example 24 h). Send by WhatsApp and email.
2. The client gets a WhatsApp utility template: "Version 2 of _[title]_ is ready for your review" with a **Review now** button.
3. **S-95 Review link** opens with no account (the market norm, [R4 section 1.2](research/R4-creative-ops-rights.md); Frame.io review links work the same way, [Frame.io help](https://help.frame.io/en/articles/414306-sharing-your-files-as-a-review-page)). It shows the AMPL mark, a language switch, project and version, the embedded or linked player, and "Revision rounds used: 1 of 2 included".
4. Two buttons: **Approve version 2** (gold) and **Request changes**.
5. **Approve**: a confirm sheet shows the name (pre-filled from the contact, editable), a tick box "I approve version 2 for publishing", and an optional note. Tap **Confirm approval**. ChordusAM records who, which version, when, through which link and channel (R4 section 1.3), append-only.
6. A thank-you screen says what happens next ("We'll prepare the final files and your balance invoice").
7. The producer gets an in-app and WhatsApp notice. The job stage moves and the invoice is drafted (J-03, step 11).

**Request changes:** a text box, plus a reminder that time-coded comments go in the player. If this would be round 3, the page says so before sending: "Round 3 is outside your package and costs LKR X." The client must tick to accept the charge (R4-F03).

**Failure paths:** the link is expired → "This link has expired. Ask AMPL for a new one" with a WhatsApp button to the producer. The link is forwarded → the approval records the typed name and the link it came from. Whether approval also needs a one-time code to the client's phone is a policy choice for SEC (`docs/discovery/15-compliance-security.md`).

**Pain removed:** voice-note feedback, disputes about what was approved. **Measure:** median time from send to decision; share of approvals made from a phone.

### J-06 Weekly fingerprint import

**Persona:** P2 HR. **Trigger:** Monday 9:00 reminder (in-app and optional WhatsApp, PLAN.md section 11).

1. **S-81 Attendance import** › drop the file (CSV, XLSX or ZKTeco `attlog.dat`, [R2 Part C](research/R2-hris-payroll-sri-lanka.md)).
2. The saved **import profile** is detected from the file shape. A new format opens the **column mapper**: sample rows on the left, fields on the right, with a dropdown per column (not drag-only, WCAG 2.5.7).
3. **Preview** (PLAN.md section 7): rows, date range, matched people, duplicates ignored, odd rows. **Unmatched device IDs block commit**, and each one can be resolved inline by picking the employee.
4. **Commit**. A progress bar, then a summary: "412 punches saved, 0 duplicates, 3 days recalculated."
5. **S-82 Exceptions**, grouped: missing punch (8), absent without leave (2), late (5), hybrid below target (1). Select a group, then **Ask to fix**: each person gets an in-app and WhatsApp nudge with a link to S-12.
6. Through the week, the exceptions list shrinks as people submit manual attendance and Admins approve it.

**Pain removed:** spreadsheet cleanup, duplicate rows, chasing by hand. **Measure:** file dropped to exceptions sent in under 15 minutes.

### J-07 Month-end payroll

**Persona:** P2 HR, then P3 Admin, then P4 Finance.

1. **S-85 Payroll** › **New run: November 2026**. A **pre-flight checklist** shows: attendance imported to 30 Nov; open exceptions (2); pending leave (1); contract changes this month (1); mid-month joiners (1). Each line links to the fix. HR can continue with warnings but must tick "I know about these".
2. The draft is built from the rules engine (PLAN.md section 10). The review screen opens **exceptions-first** (wireframe 5.6).
3. HR fixes items or adds manual adjustments (the reason is required and audit-logged), then taps **Submit to Admins**.
4. Admins get an inbox card: "November payroll · 18 people · Net LKR 2.14M · +3.8% vs October · 2 manual adjustments · 1 joiner." The card opens a read-only review with the variances highlighted. **Approve run** confirms the total. An Admin whose own pay is in the run sees "Your own pay is included" (open question Q5).
5. Finance gets "Ready to pay". They download the bank file and summary, pay, then tap **Mark paid** with the reference and date. The run locks.
6. Employees get "Your November payslip is ready" (no amounts in WhatsApp, section 7.5). Statutory reminders follow: APIT by the 15th, EPF and ETF by month end (R2-32).

**Pain removed:** a manual spreadsheet rebuild; no audit trail for adjustments. **Measure:** draft to submit in under 30 minutes; zero corrections after approval.

### J-08 Owner morning dashboard check

**Persona:** P3 Admin, 8:30 on the phone.

1. **S-01 Home**: the top card says **"7 need you"**, split by type.
2. Tap it. **S-02 Inbox** opens in card mode. Each card shows the reason. Leave and manual attendance: **Approve** (one tap, 8-second undo toast). Payments: **Approve**, then a confirm that repeats "LKR 45,000 to _Kasun P._ for _Vocal session, job MV-1142_".
3. Back on Home: **Cash today** (in, out, bank balance as of the last import), **Studio today** (bookings, utilisation, gear out, late returns), **Productions at risk** (late reviews, margin under target).
4. Tap an at-risk job to open the job page; leave a comment that tags the producer.

**Pain removed:** approvals scattered across WhatsApp threads; no single picture. **Measure:** all 7 items cleared in under 3 minutes; the 5-second test passes (DP-3).

### J-09 Leave request from a phone

**Persona:** P1 employee.

1. **S-01 Home** › **Request leave** (also in the bottom bar).
2. **S-13 Leave form**: leave type chips show balances ("Annual · 6.5 left", "Casual · 3 left"). A date picker marks weekends, public holidays and Poya days, and shows small dots on days when other team members are off.
3. Pick dates. The form updates live: "2 working days (Poya day on Wed not counted)". Half-day toggles for the first and last day.
4. Warnings appear before submit, not after: overlap with an existing request; "Paid leave starts after your probation ends on 3 Jan 2027. You can request unpaid leave" (PLAN.md section 4.3).
5. Optional reason; for medical leave, attach a certificate with the camera.
6. **Submit**. A status tracker shows _Submitted → HR recommended → Approved_. Each step sends a notification. The employee can cancel while it is pending.

**Offline:** the form saves a local draft as you type. If you submit while offline, the request is queued with "Will send when you're back online", and the server checks it again when it arrives. It can still be refused, for example if the balance has changed.

**Pain removed:** asking HR for balances; not knowing the status. **Measure:** request submitted in under 1 minute; zero "Did you see my leave?" messages.

### J-10 POS shift close and reconciliation

**Persona:** P6 front desk, then P4 Finance.

1. **S-32 Close shift**. If sales are still in the offline queue, closing is blocked: "3 sales waiting to sync. Connect to finish closing."
2. **Blind count**: enter cash by denomination (LKR 5,000, 2,000, 1,000, 500, 100, 50, 20, coins). The expected figure is hidden until the count is entered, which is a common cash control.
3. The variance shows by method: cash, LankaQR, card, payment link. If it is over the tolerance (a policy setting), a reason is required.
4. Print the **Z-report** (80 mm) and hand over the cash.
5. Finance, on **S-75 Reconcile**: match LankaQR and card totals against the bank statement lines, then approve the shift.

**Pain removed:** unexplained cash gaps. **Measure:** shift closed in under 5 minutes; variances explained in 100% of shifts.

---

## 5. Screen inventory and wireframes

### 5.1 MVP screen inventory

Priority: **P1** is needed for the first useful release of that module, **P2** completes the MVP, and **P3** is after the MVP. The PO owns the final cut in `docs/discovery/21-mvp-roadmap.md`. "Layer" is Showcase (S) or Workbench (W) from section 1.2.

| ID    | Screen                            | Roles                       | Purpose                                    | Key components                                                          | Layer | Priority |
| ----- | --------------------------------- | --------------------------- | ------------------------------------------ | ----------------------------------------------------------------------- | ----- | -------- |
| S-00  | Sign in                           | All staff                   | Magic link or password; language           | Field, gold button, message                                             | S     | Done     |
| S-01  | Home (per role)                   | All staff                   | What needs me today                        | KPI tile, attention card, stage strip, sparkline, skeleton              | S     | P1       |
| S-02  | Approvals inbox                   | All approvers, requesters   | One place to decide                        | Approval card, filters, bulk select, undo toast, comment sheet          | S/W   | P1       |
| S-03  | Notifications                     | All                         | What happened                              | List, read state, deep links                                            | S     | P2       |
| S-04  | Global search and command         | Staff                       | Jump to any record                         | Command palette (Ctrl+K), recent items                                  | S     | P2       |
| S-05  | Profile and preferences           | All                         | Language, theme, density, WhatsApp opt-in  | Segmented control, toggles, consent text                                | W     | P1       |
| S-10  | My day                            | Employee, producer          | Today's bookings, call times, shift        | Agenda list, map link                                                   | S     | P2       |
| S-11  | My attendance month               | Employee                    | See my days and fix gaps                   | Month grid with status chips, legend                                    | W     | P1       |
| S-12  | Manual attendance request         | Employee                    | Fix a missed punch                         | Date, time inputs, reason, status tracker                               | W     | P1       |
| S-13  | Leave request                     | Employee                    | Ask for leave                              | Balance chips, range picker with holidays, live day count, file capture | W     | P1       |
| S-14  | My requests                       | Everyone                    | Status of everything I raised              | List with status chips, cancel                                          | W     | P1       |
| S-15  | My pay                            | Employee                    | Payslips and year summary                  | PDF list, masked amounts until tapped                                   | W     | P1       |
| S-17  | My documents                      | Employee                    | Contract, letters, acknowledgements        | File list, acknowledge button                                           | W     | P2       |
| S-20  | Booking calendar                  | Front desk, producer, Admin | Rooms, gear, crew over time                | Resource timeline, day/week, filters, legend with patterns              | W     | P1       |
| S-21  | Booking create and detail         | Front desk, producer        | Hold, price, deposit, status               | Side panel, resource picker, price breakdown, deposit link              | W     | P1       |
| S-22  | Catalogue and price rules         | Admin, front desk lead      | Rooms, packages, add-ons, rules            | Data table, rule editor (effective-dated)                               | W     | P1       |
| S-25  | Gear check-out and check-in       | Front desk, producer        | Scan, condition, late fee                  | QR scanner, checklist, photo capture                                    | W     | P2       |
| S-26  | Asset register and maintenance    | Admin, producer             | What we own, where it is                   | Data table, history, QR label print                                     | W     | P2       |
| S-30  | POS sell and checkout             | Front desk                  | Sell and take payment                      | Tile grid, cart, payment sheet, offline banner, queue chip              | W     | P1       |
| S-31  | Receipt                           | Front desk, client          | Print, WhatsApp, email                     | Receipt layouts 80/58 mm, A4 PDF                                        | W     | P1       |
| S-32  | Shift open and close              | Front desk                  | Float, blind count, Z-report               | Denomination counter, variance summary                                  | W     | P1       |
| S-33  | Sales history and refunds         | Front desk, Finance         | Find a sale, refund with approval          | Data table, refund sheet (approval if over limit)                       | W     | P2       |
| S-40  | Clients and leads                 | Producer, Admin             | Who we work with                           | Data table, quick add, contact card                                     | W     | P1       |
| S-41  | Quote builder                     | Producer                    | Price a job from a template                | Line editor, options, money input, margin (internal), preview           | W     | P1       |
| S-42  | Pipeline                          | Producer, Admin             | All jobs by stage                          | Board with keyboard move, list view, filters                            | W     | P1       |
| S-43  | Job page                          | Producer, Admin, Finance    | Single source of truth per job             | Stage tracker, budget table, deliverables, tabs, activity               | W     | P1       |
| S-44  | Deliverables and versions         | Producer                    | Versions and send for review               | Version stack, send sheet, approval history                             | W     | P1       |
| S-45  | Rights and releases register      | Producer, Admin             | Owners, licences, expiry                   | Data table, expiry chips                                                | W     | P2       |
| S-46  | Publish checklist                 | Producer                    | Block publish without consent              | Checklist with blocking items                                           | W     | P2       |
| S-50  | Talent pool                       | Producer, HR                | Find and engage people                     | Filter chips (skill, language), cards or table                          | W     | P1       |
| S-51  | Talent profile and engagements    | Producer, HR, Finance       | History, contracts, consents, fees         | Tabs, document status, classification checklist (HR)                    | W     | P1       |
| S-60  | AI subscriptions and credits      | Finance, producer           | Pool, allocation, allowance                | Table, allocation sheet, USD/LKR money display                          | W     | P2       |
| S-70  | Sales invoices                    | Finance                     | Issue, send, record receipts               | Data table, invoice editor, PDF preview                                 | W     | P1       |
| S-72  | Receivables ageing                | Finance, Admin              | Who owes what                              | Ageing buckets, reminder action                                         | W     | P1       |
| S-73  | Payment requests                  | Requester, Finance          | Raise and track vendor and talent payments | Data table, status chips                                                | W     | P1       |
| S-74  | Payment request form              | Requester                   | Raise a payment                            | Vendor picker, lines, money input, WHT preview, attachments             | W     | P1       |
| S-75  | Payables queue and reconciliation | Finance                     | Pay, mark paid; match shifts               | Data table (compact), bulk mark paid, match view                        | W     | P1       |
| S-76  | Expenses                          | Finance                     | Record and recur                           | Data table, receipt capture                                             | W     | P1       |
| S-77  | P&L and profitability             | Finance, Admin              | Are we making money, where                 | Period compare, drill-down table, job and brand views                   | W     | P2       |
| S-79  | Tax schedules                     | Finance                     | VAT, SSCL, WHT, stamp duty                 | Data table, certificate PDFs                                            | W     | P2       |
| S-80  | Employees and contracts           | HR, Admin                   | People records and history                 | Data table, contract timeline, masked sensitive fields                  | W     | P1       |
| S-81  | Attendance import                 | HR                          | Upload, map, preview, commit               | File drop, column mapper, preview stats, blocking list                  | W     | P1       |
| S-82  | Attendance exceptions             | HR                          | Chase and fix                              | Grouped list, bulk nudge                                                | W     | P1       |
| S-83  | Attendance calendar               | HR, Admin                   | People × days                              | Dense grid, status chips with letters, cell drill-down                  | W     | P1       |
| S-84  | Leave review and team calendar    | HR, Admin                   | Recommend, decide, plan                    | Queue, team calendar                                                    | W     | P1       |
| S-85  | Payroll run review                | HR, Admin, Finance          | Build, check, approve, pay                 | Stepper, totals, exceptions, dense table, row breakdown                 | W     | P1       |
| S-87  | Onboarding and offboarding        | HR                          | Checklists                                 | Checklist, due dates                                                    | W     | P3       |
| S-90  | Talent portal home                | Talent                      | Jobs, call sheets, to-dos                  | Cards, language switch                                                  | S     | P2       |
| S-91  | Talent documents and signing      | Talent                      | Sign contracts and consents                | Plain-language summary, signature pad, granular consent toggles         | S     | P2       |
| S-92  | Talent payments                   | Talent                      | Status, vouchers, WHT certificates         | Status list, PDF links                                                  | S     | P2       |
| S-95  | Client review link                | Client                      | Approve or request changes                 | Player embed or link, round counter, confirm sheet                      | S     | P1       |
| S-96  | Client quote and pay link         | Client                      | Accept, sign, pay deposit                  | Quote view, options, accept sheet, pay button                           | S     | P2       |
| S-97  | Client portal                     | Client                      | All projects, reviews, invoices            | Lists                                                                   | S     | P3       |
| S-100 | Reports library                   | Admin, Finance, HR          | Standard reports and exports               | Report cards, filters, export XLSX and PDF                              | W     | P2       |
| S-110 | Users, roles and capabilities     | Admin                       | Access and delegation                      | Data table, capability toggles, delegation date range                   | W     | P1       |
| S-111 | Policies                          | Admin                       | All policy data in one place               | Effective-dated rule editor, change history                             | W     | P1       |
| S-113 | Notification templates            | Admin                       | Copy per channel and language              | Template editor with variables and preview                              | W     | P2       |
| S-114 | Audit log                         | Admin                       | Who did what                               | Dense table, diff view, filters                                         | W     | P2       |

### 5.2 Wireframe: Home dashboard (S-01), per role

**Admin, desktop (≥ 1024 px).** Cards are in priority order; each answers one question. Sample data is invented.

```text
+-- [AMPL] ChordusAM   Home  Me  Studio  Production  Money  People  Reports  Admin   [Inbox 7] [TR v] --+

  — MON 9 NOV 2026 · 08:30
  GOOD MORNING, *THOSHAN*                       (Cormorant, gold italic word)

  +-- NEEDS YOU ------------------------+  +-- CASH TODAY ------------+  +-- STUDIO TODAY -------------+
  |  7                                  |  |  In    LKR 186,500       |  |  4 bookings · 72% booked     |
  |  3 leave · 2 payments · 1 payroll   |  |  Out   LKR  92,000       |  |  Next 11:00 Podcast room     |
  |  1 discount                         |  |  Bank  LKR 2.41M (Fri)   |  |  Gear out 6 · 1 late  (!)    |
  |  [ OPEN INBOX ]  (gold)             |  |  Open shift: Nadee       |  |  [Calendar ->]               |
  +-------------------------------------+  +--------------------------+  +------------------------------+

  +-- PRODUCTIONS IN FLIGHT · 14 --------------------------------------------------------------------+
  |  Brief 2 | Song 3 | Generate 4 | Shoot 1 | Edit 2 | Review 2 (1 late) | Publish 0                  |
  |  At risk:  MV-1139 "Sample title"   margin 8% (target 30%)   review overdue 26 h    [Open job ->] |
  |            AD-0311 "Brand spot"     AI credits 140% of budget                        [Open job ->] |
  +--------------------------------------------------------------------------------------------------+

  +-- PEOPLE TODAY -------------+  +-- THIS MONTH ------------------------+  +-- WATCH LIST ----------+
  |  In 14 · Leave 2 · Late 1   |  |  Revenue LKR 4.2M   +12% vs Oct  ..:|  |  AR > 14 days: 3       |
  |  Absent, no leave: 1        |  |  Costs   LKR 3.1M   AI USD 1,240     |  |   (LKR 640k)           |
  |  Import: Mon 9 Nov done     |  |  Margin  26%        Payroll: draft   |  |  Probation ends: 1     |
  |  [Attendance ->]            |  |  [P&L ->]                             |  |  Suno 52/60 downloads |
  +-----------------------------+  +---------------------------------------+  +------------------------+
```

**Admin, phone (360 px).** The same cards stacked in the same order. "Needs you" is sticky at the top until it reaches zero.

```text
+----------------------------------+
| [AMPL]            [Inbox 7] (TR) |
|----------------------------------|
| MON 9 NOV                        |
| Good morning, *Thoshan*          |
| +------------------------------+ |
| | 7 NEED YOU                   | |
| | 3 leave · 2 pay · 1 payroll  | |
| | [ OPEN INBOX ]               | |
| +------------------------------+ |
| +------------------------------+ |
| | CASH TODAY   In 186.5k       | |
| |              Out 92k         | |
| +------------------------------+ |
| +------------------------------+ |
| | AT RISK  MV-1139  8% margin  | |
| +------------------------------+ |
| | STUDIO  4 bookings · 1 late  | |
|----------------------------------|
| Home | Inbox | Money | Studio | ≡ |
+----------------------------------+
```

**Other roles (same component set, different cards):**

| Role       | Cards, in order                                                                                                                              | Primary action        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Employee   | My day (bookings, call times); My requests (status); Leave balances; This month's attendance (gaps to fix); Latest payslip                   | **Request leave**     |
| Producer   | My jobs by stage, with late items first; Reviews waiting on clients; Budget alerts on my jobs; Today's bookings; Payment requests I raised   | **New quote**         |
| Front desk | Rooms now (free and busy strip); Today's bookings with check-in status; Gear due back; Shift status and float; Deposits due                  | **Open POS**          |
| HR         | Attendance import status (due Monday); Exceptions open; Leave to recommend; Payroll status; Contract and probation dates in the next 60 days | **Import attendance** |
| Finance    | Payables due this week; Receivables over 14 days; Shifts to reconcile; Payroll ready to pay; Tax due dates (APIT 15th, WHT schedule)         | **Open payables**     |

### 5.3 Wireframe: POS checkout (S-30)

**Tablet landscape (front desk default).** One screen: catalogue on the left, cart on the right. Payment is a bottom sheet over the cart, not a new page.

```text
+-- POS · Shift #0142 · Nadee · Float LKR 5,000 ------------- [● Online] [Queue 0] [Light/Dark] [≡] --+
| [ Search items, scan QR, or type booking no. ________________ ]  | CART            Walk-in  [Client v] |
|                                                                  |-------------------------------------|
| ROOMS NOW  Photo: busy to 13:00 | Podcast: free to 14:00 | Booth: free                              |
|                                                                  | Podcast room · 1 h       6,000.00   |
| [Studio time] [Packages] [Add-ons] [Gear hire] [Prints & merch]  |   11:05–12:05                [x]    |
| [Bookings today · 4]                                             | Engineer · 1 h           2,500.00   |
|                                                                  |                              [x]    |
| +------------+ +------------+ +------------+ +------------+      | USB copy                   500.00   |
| | Podcast    | | Photo      | | Vocal      | | Dubbing    |      |   qty [-] 1 [+]              [x]    |
| | room · 1 h | | studio·1 h | | booth · 1 h| | room · 1 h |      |-------------------------------------|
| | 6,000      | | 8,500      | | 5,000      | | 5,500      |      | Subtotal                 9,000.00   |
| +------------+ +------------+ +------------+ +------------+      | Discount        [Add]        0.00   |
| +------------+ +------------+ +------------+ +------------+      | VAT (shown only if registered)  –   |
| | Engineer   | | Make-up    | | Prints A4  | | Gift       |      |                                     |
| | 1 h · 2,500| | 3,000      | | 1,200      | | voucher    |      | TOTAL               LKR 9,000.00    |
| +------------+ +------------+ +------------+ +------------+      |                                     |
|                                                                  | [ CHARGE LKR 9,000 ]  (gold, 56 px) |
|                                                                  | [Hold sale]   [Clear]               |
+------------------------------------------------------------------+-------------------------------------+
```

**Payment sheet** (rises over the cart; the cart stays visible behind it):

```text
+-- Pay LKR 9,000.00 ------------------------------------------------ [Close] --+
| Method:  [ Cash ]  [ LankaQR ]  [ Card (terminal) ]  [ Payment link ]  [Split] |
|-------------------------------------------------------------------------------|
| LankaQR                                                                       |
|  Ask the customer to scan the counter QR and pay  LKR 9,000.00                |
|  Reference from their success screen:  [ ______ ]  (last 6 characters)        |
|  [ ] Deposit / part payment   Amount [ 9,000.00 ]                             |
|                                                                               |
|  [ RECORD PAYMENT ]  (gold)                                                   |
|-------------------------------------------------------------------------------|
| Cash: amount given [ 10,000 ] -> change LKR 1,000.00                          |
| Card: approval code [ ____ ]  last 4 [ ____ ]                                 |
+-------------------------------------------------------------------------------+
```

**Receipt sheet:** a large tick, the receipt number in mono, then **Print 80 mm** (default), **WhatsApp**, **Email**, **No receipt**, and **New sale** (gold).

**Behaviour notes:**

- **Offline:** the status chip turns amber, "Offline · Queue 2". Card (terminal) and LankaQR record a reference, so they are allowed offline; **Payment link**, **gift voucher redemption**, **deposit application** and **refund** are disabled with a one-line reason. Square, the market reference, also queues offline payments on the device and limits what works offline; its queued payments **expire** if they are not uploaded in time ([Square help](https://squareup.com/help/gb/en/article/8106-offline-payments-time-limits)). ChordusAM's queue does not move money, so it does not expire. It must still sync before the shift closes (J-10).
- **Idempotency:** every queued sale carries a client-generated ID, so a retry never creates a second sale.
- **Background sync:** the Background Sync API works in Chrome and Edge but not in Safari or Firefox ([caniuse](https://caniuse.com/background-sync)). Workbox replays the queue when the app opens instead, and that fallback has been unreliable in Safari ([Workbox issue 2386](https://github.com/GoogleChrome/workbox/issues/2386)). **Recommendation: an Android tablet with Chrome for the counter.** The POS also retries every 30 seconds while open and shows the queue count.
- **Phone layout (fallback):** the cart becomes a bottom bar ("3 items · LKR 9,000 · Charge"), and the catalogue fills the screen.
- **Shared tablet:** cashier switch from the header avatar. Ask SEC how to do this without breaking WCAG 3.3.8 (for example a passkey, or a PIN entry that allows paste and password managers).

### 5.4 Wireframe: Booking calendar (S-20)

**Desktop day view.** Rows are resources, grouped by type. Columns are time. Bookings show the client and status. Status uses **pattern and text as well as colour** (WCAG 1.4.1).

```text
+-- Studio › Calendar ---------------------------------------------------------------------------------+
| [< ] Sat 14 Nov 2026 [ >]  [Today]   View: (Day) Week  Month   Show: [Rooms][Gear][Crew]  [+ New booking] |
| Filter: [All brands v] [Status v]      Legend: ███ Confirmed  ╌╌╌ Tentative (hold)  /// Buffer  ░░ Leave |
|------------------------------------------------------------------------------------------------------|
|              | 08   09   10   11   12   13   14   15   16   17   18   19   20   21   22               |
| ROOMS        |                                                                                       |
| Photo studio |      [███ Brand X · product ███]///      [╌╌ Client Y · portrait · hold Thu 18:00 ╌╌]// |
| Podcast room |                [███ Walk-in ███]//                                                    |
| Vocal booth  |  [███ MV-1142 vocal (internal) ███]//                [███ Dubbing · Varnam TV ███]    |
| Dubbing room |                                                                                       |
| GEAR         |                                                                                       |
| Lighting A   |      [█ Brand X █]                     [╌╌ Client Y ╌╌]                               |
| Camera 2     |  [█ MV-1142 location shoot (out) ██████████████████████████████████]  due 20:00       |
| CREW         |                                                                                       |
| Sahan (eng.) |  [█ MV-1142 █]  ░░░░░░░░░░░░░░ Leave (afternoon) ░░░░░░░░░░░░░░░░░░░░                  |
| Ishara (ph.) |      [█ Brand X █]                     [╌╌ Client Y ╌╌]                               |
|------------------------------------------------------------------------------------------------------|
| Utilisation today: Photo 75% · Podcast 15% · Booth 55%          Conflicts: 0   Unpaid holds: 1        |
+------------------------------------------------------------------------------------------------------+
```

**Interaction notes:**

- **Create:** drag across empty time, **or** press **New booking**, or focus a cell and press Enter (WCAG 2.5.7 requires the non-drag path).
- **Move or resize:** drag, or open the booking and edit the times. Moves re-check conflicts on the server; a clash shows the reason ("Lighting A is booked 14:00–18:00").
- **Buffers** (cleaning, reset, gear checks) are drawn as hatching, so the gap is visibly not bookable.
- **Crew leave** comes from the Leave module (R1 pattern P10).
- **Keyboard:** arrow keys move between cells; each booking is a button with a full label ("Photo studio, 14:00 to 18:00, Client Y, tentative, hold until Thursday 18:00").
- **Phone:** the default is an **agenda list per resource** with a day strip at the top; the grid is available in landscape. A 15-column grid on a 360 px screen fails DP-1.
- **Library:** FullCalendar's resource timeline views need a **Premium licence for commercial use**, from USD 480 ([FullCalendar pricing](https://fullcalendar.io/premium)). PLAN.md section 3 names "FullCalendar (or a small custom grid)". The SA should compare that licence with a custom CSS-grid timeline; the custom option is simpler to make accessible.

### 5.5 Wireframe: Job and project page (S-43)

```text
+-- Production › Jobs › MV-1142 -----------------------------------------------------------------------+
| — MUSIC VIDEO · AI-HYBRID · TAMIL                                                                     |
| SAMPLE *TITLE*                         Client: Artist Z  ·  Brand: Varnam TV  ·  Producer: Chathurika |
| Due Thu 12 Nov 18:00  (in 31 h)   Rounds 1 of 2   [ClickUp ↗]          [ SEND FOR REVIEW ] (gold) [⋯] |
|------------------------------------------------------------------------------------------------------|
| Stages:  ✓Brief  ✓Song  ✓Mix  ✓Storyboard  ●Generate  ○Shoot  ○Edit  ○Review  ○Publish               |
|------------------------------------------------------------------------------------------------------|
| [Overview] [Budget] [Schedule] [Crew & talent] [Deliverables] [Approvals] [Money] [Links] [Activity]  |
|------------------------------------------------------------------------------------------------------|
| BUDGET VS ACTUAL                                    | NEXT UP                                         |
| Quoted price  LKR 450,000                           | ! Vocalist release not signed (blocks publish)  |
| Cost budget   LKR 309,000                           | ! AI credits at 92% of budget                   |
| Committed     LKR 280,400  ██████████████████░ 91%  | ! Shoot day committed 6% over its line          |
| Actual        LKR  68,400  ████░░░░░░░░░░░░░░░ 22%  | · Shoot Sat 14 Nov 09:00, Camera 2 booked       |
| Margin (forecast)  31%   target 30%  ✓              | · v1 due to client Thu 12:00                    |
|                                                     |                                                 |
| Line              Budget    Committed  Actual  Var. | DELIVERABLES                                    |
| Vocalist          60,000    60,000     15,000   –   | Master video 16:9   v1 in edit                  |
| AI generation     45,000    41,400     41,400  -8%  | Short 9:16          not started                 |
|  (USD 138 @ 300.0)                                  | Thumbnail           not started                 |
| Studio (internal) 24,000    24,000     12,000   –   |                                                 |
| Editor            70,000    70,000          0   –   | MONEY                                           |
| Shoot day         80,000    85,000          0  +6%! | Advance invoice  INV-2026-0311  Paid 225,000    |
| Contingency       30,000         0          0   –   | Balance invoice  drafts on final approval       |
| [+ Add line]  [Raise payment from line]             | Vendor payments  3 (1 awaiting Admin)           |
+------------------------------------------------------------------------------------------------------+
```

**Notes:**

- The **stage strip** is a list of buttons with text states ("done", "current", "not started"), not colour alone. On a phone it scrolls sideways and the current stage stays in view, the same pattern `module-nav.tsx` already uses.
- **Budget columns:** Budget (from the quote), Committed (engaged or ordered), Actual (paid or posted), Variance. USD AI costs show the USD amount and the rate used under the LKR figure (PLAN.md section 3 stores the amount, currency and rate).
- **Margin** and cost columns are hidden from roles without money access (server-side, DP-10). An employee assigned to the job sees stages, schedule and deliverables only.
- **Phone:** the Overview tab stacks _Next up_, Stages, Deliverables, then a compact budget summary ("22% of cost budget spent · margin 31%"). The full budget table is a scrolling table with the first column fixed.

### 5.6 Wireframe: Approvals inbox (S-02)

**Desktop: list with a detail pane.** Filters by type; the reason line is always visible.

```text
+-- Inbox ------------------------------------------------------------------------------------------------+
| [All 7] [Leave 3] [Attendance 0] [Payments 2] [Payroll 1] [Discounts 1]  [Waiting on others 4]   Sort: Oldest |
|---------------------------------------------------------------------------------------------------------|
| [ ] LEAVE · Nadeesha K. · Annual · Tue 17 – Wed 18 Nov (2 days)        | DETAIL                          |
|     HR recommends approve · 1 other person off on 17 Nov    2 d ago    | Payment request PR-2026-0217    |
|                                    [Approve] [Reject] [Return]         | Kasun P. (vocalist)             |
| [ ] LEAVE · Ruwan S. · Casual · Fri 13 Nov (1 day)                     | Job MV-1142 · Vocal session     |
|     HR recommends approve                                    1 d ago   | Fee        LKR 45,000.00        |
| [ ] LEAVE · Priya M. · Medical · Mon 9 Nov (certificate attached)      | WHT        not applicable        |
|     HR has not acted in 2 days · you can decide directly     2 d ago   |  (month total LKR 60,000)       |
|     HR has not acted in 2 days · you can decide directly     2 d ago   |  (month total LKR 45,000)       |
| > PAYMENT · Kasun P. · LKR 45,000 · MV-1142                            | Why here: above the LKR 15,000  |
|     Above LKR 15,000 limit · raised by Chathurika            3 h ago   |  Admin limit (policy v2)        |
| [ ] PAYMENT · Lens hire Co. · LKR 28,000 · AD-0311                     | Budget line: 60,000 left 15,000 |
|     Above limit · 2nd request to this vendor this week (!)  1 h ago    | Attachments: bill.pdf, chat.png |
| [ ] PAYROLL · November 2026 · Net LKR 2.14M · 18 people                |                                 |
|     Submitted by HR · +3.8% vs Oct · 2 adjustments          today      | [ APPROVE LKR 45,000 ] (gold)   |
| [ ] DISCOUNT · POS sale #0142-0007 · 20% off · Nadee        10 min ago | [Return with comment] [Reject]  |
|---------------------------------------------------------------------------------------------------------|
| Selected: 2 leave   [Approve selected]   (bulk allowed for leave and attendance only)                     |
+---------------------------------------------------------------------------------------------------------+
```

**Phone: card stack.** One card per item, swipe or arrows to go to the next.

```text
+----------------------------------+
| Inbox · 7        [Filter]        |
|----------------------------------|
| PAYMENT                    3 h   |
| Kasun P. · vocalist              |
| LKR 45,000.00                    |
| MV-1142 · Vocal session          |
| Above LKR 15,000 limit           |
| Budget left after: 15,000        |
| [View bill]                      |
|                                  |
| [ APPROVE ]           (gold 48px)|
| [Return]            [Reject]     |
|----------------------------------|
|  1 of 7                  Next >  |
+----------------------------------+
   after Approve on a payment:
+----------------------------------+
| Approve LKR 45,000.00 to         |
| Kasun P. for MV-1142?            |
| [ YES, APPROVE ]   [Cancel]      |
+----------------------------------+
   then toast: "Approved · Undo (8 s)"
```

**Rules shown in the UI:**

- **One tap** for leave and manual attendance; **tap plus confirm** for anything with money (payments, payroll, discounts, refunds). The confirm repeats the amount and the payee, which prevents the most costly mistake.
- **Undo for 8 seconds.** The server records the decision immediately. Notifications wait until the undo window closes, and an undo writes its own audit row.
- **Reject and Return always need a comment.** The comment box opens with the keyboard up.
- **Self-approval is impossible.** Your own requests appear under "Waiting on others" with no buttons (PLAN.md section 2).
- **Policy context on the card:** "HR recommends", "HR has not acted in 2 days" (PLAN.md section 4.4), "Above limit", and the split-request warning (PLAN.md section 15).
- **Already decided elsewhere:** if another Admin decided first, the card turns grey: "Approved by Fazlur 2 min ago". Buttons disappear and nothing is applied twice.
- **No approvals by WhatsApp reply in the MVP.** WhatsApp links open the inbox, which needs a signed-in session (section 7.5).

### 5.7 Wireframe: Payroll run review (S-85)

```text
+-- People › Payroll › November 2026 ----------------------------------------------------------------------+
| — PAYROLL RUN                                                                                           |
| NOVEMBER *2026*      Draft → Submitted → Admin approved → Paid       [Compare: Oct v]  [Export v]       |
|                       ●                                                                                  |
|---------------------------------------------------------------------------------------------------------|
| Gross        Employee EPF 8%   Employer EPF 12%   ETF 3%      APIT        Net pay       People           |
| 2,540,000    142,400           213,600            53,400      118,200     2,140,000     18 (1 joiner)   |
|---------------------------------------------------------------------------------------------------------|
| CLEAR BEFORE SUBMIT (3)                                                                                  |
|  ! Missing punch 18 Nov · Ruwan S. — no manual attendance yet                [Ask Ruwan] [Mark absent]  |
|  ! Manual adjustment without reason · Priya M. +5,000                        [Add reason]               |
|  ! Below minimum wage check · Intern A (part month) — confirm pro rata       [Review]                   |
| WARNINGS (2)   · Net change > 10% vs Oct: 2 people   · Contract changed mid-month: 1                     |
|---------------------------------------------------------------------------------------------------------|
| Density: (Compact) Standard    Filter: [All] [Exceptions] [Changed vs Oct]     Search [______]           |
| Name           Contract type       Days  Abs.  Gross      EPF 8%   APIT     Adj.     Net        vs Oct  |
| Nadeesha K.    Permanent v4        21    0     120,000    9,600    2,400    0        108,000    0%      |
| > Ruwan S.     Permanent v4        20    1 !   95,000     7,600    0        -4,000   83,400     -4.6%   |
|   +-- How this was calculated --------------------------------------------------------------------+    |
|   | Base 95,000 (Permanent v4, from 1 Jan 2026)                                                    |    |
|   | Absence: 1 unapproved day × LKR 4,000 (absence rule, contract v4)          -4,000              |    |
|   | EPF 8% on EPF-liable earnings 95,000 (components: basic)                    -7,600             |    |
|   | APIT: Table 01, monthly gross below the tax-free threshold (rule set 2026-04) 0                |    |
|   | Employer: EPF 12% 11,400 · ETF 3% 2,850 (not deducted from pay)                                |    |
|   +------------------------------------------------------------------------------------------------+    |
| Priya M.       Probationary OM v3  21    0     85,000     –        –        +5,000 ! 90,000     +5.9%   |
| ...                                                                                                     |
|---------------------------------------------------------------------------------------------------------|
| HR:  [ SUBMIT TO ADMINS ] (gold, disabled until 3 items are cleared)                                     |
+---------------------------------------------------------------------------------------------------------+
```

**Notes:**

- **Exceptions come first**, above the table, because they are the work. The submit button explains why it is disabled ("Clear 3 items first").
- **The "How this was calculated" row** shows every figure with the rule and version that produced it (DP-9; PLAN.md section 10 step 4). The labels for EPF base and APIT tables follow R2-20 to R2-22.
- **Role views of the same screen:** HR edits; the Admin sees it read-only with **Approve run** and **Return to HR**; Finance sees the approved run with **Download bank file**, **Download summary** and **Mark paid**. Once approved, a lock banner says "Locked by approval on [date] · changes need a new correction run".
- **Admin on a phone:** the inbox card (5.6) plus a summary page of totals, exceptions handled, variance list and adjustments with reasons. The full table is not designed for a phone.
- **Privacy:** salary columns are blurred until the "Show amounts" toggle is on, which logs a read for PDPA (R2-33). It also helps when someone is looking over a shoulder.
- **Legal reminder:** a small permanent note links to PLAN.md section 10's warning that contractor versus employee treatment must be confirmed by the lawyer or accountant.

---

## 6. Component and design-system additions

Phase 0 has these building blocks: `.glass`, `.btn` (`-gold`, `-glass`, `-sm`), `.eyebrow`, `.gold-text`, `.field-label`, `.field-input`, `.msg-ok`, `.msg-err`, `.rise`, `Logo`, `ModuleNav` and `ModuleLanding`. shadcn/ui was planned for Phase 1 (`docs/phase-0.md`, assumption 6). The table maps each new component to existing tokens plus the new semantic tokens in 1.3.

### 6.1 Tokens to add

| Group     | Tokens                                                                                      | Notes                                                                                                                                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surfaces  | `--surface-0/1/2`, `--border-subtle` (`#4A2A36`, decorative), `--border-strong` (`#7D5867`) | Defined for dark and light under `[data-theme]`; `@theme` exposes them to Tailwind                                                                                                                                                                       |
| Text      | `--text-1/2/3`, `--text-on-gold` (`#2A0A14`, already used in `.btn-gold`)                   | `--text-3` never on glass                                                                                                                                                                                                                                |
| Status    | `--ok`, `--warn`, `--danger`, `--info`, each with a `-bg` at 16% and a `-border` at 40%     | Same recipe as the existing `.msg-ok` (gold 16% fill, 40% ring)                                                                                                                                                                                          |
| Density   | `--row-h`: 48 px comfortable, 40 px standard, 32 px compact; `--cell-px`                    | Row heights follow Carbon's scale (compact 32, medium 40, large 48) ([Carbon v10](https://v10.carbondesignsystem.com/components/data-table/style), [Carbon](https://carbondesignsystem.com/components/data-table/usage/)). Toolbars match the row height |
| Type      | `--text-xs` 12 px minimum, `--num` (Inter `tnum`), `--font-si`, `--font-ta`                 | See 7.3                                                                                                                                                                                                                                                  |
| Elevation | `--shadow-sheet`, `--shadow-pop`                                                            | From the `.glass` shadow values, without the inset highlights, for solid surfaces                                                                                                                                                                        |
| Motion    | Keep `--ease-brand`; add `--dur-fast` 150 ms, `--dur-base` 250 ms                           | The existing reduced-motion rule already covers everything                                                                                                                                                                                               |

### 6.2 Components

| Component                     | Purpose and behaviour                                                                                                                                                                                                                                | States                                                                            | Accessibility                                                                                                                                             | Built from                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **DataTable**                 | Sort, column show/hide, fixed first column, row expand (payroll breakdown), row select with a bulk bar, density switch (remembered per user and table), totals row, CSV or XLSX export of the current view. Money right-aligned with tabular figures | Loading (skeleton rows), empty, filtered-empty, error, partial (some rows locked) | Real `<table>` semantics, `aria-sort`, a caption, row actions as labelled buttons, keyboard row navigation. Compact rows still keep 24 px targets (2.5.8) | TanStack Table plus `surface-1`, `border-strong`                     |
| **FilterBar**                 | Chips for quick filters ("Exceptions", "Overdue"), a "More filters" sheet, saved views, filters in the URL so links share the view                                                                                                                   | Default, active (count), cleared                                                  | Each chip is a toggle button with `aria-pressed`; the result count is announced                                                                           | shadcn Popover and Command                                           |
| **ResourceTimeline**          | Rooms × time, gear and crew rows, buffers, holds, leave overlay, utilisation footer                                                                                                                                                                  | Confirmed, tentative, buffer, leave, conflict, past                               | Status by pattern **and** text; every booking is a button with a full label; non-drag create and move (2.5.7); arrow-key navigation                       | Custom CSS grid, or FullCalendar Premium (licence, see 5.4)          |
| **MonthGrid** (people × days) | Attendance calendar and my month                                                                                                                                                                                                                     | Present, late, half, absent, leave, holiday, weekend, remote, manual pending      | A letter code in each cell (P, L, H, A, LV) as well as colour; cell opens a detail sheet                                                                  | Custom grid                                                          |
| **StatusChip**                | One vocabulary for all modules: _Draft · Submitted · In review · Recommended · Approved · Returned · Rejected · Scheduled · Paid · Overdue · Cancelled · Locked_. The PLAN.md status keys map onto these labels                                      | 4 tones (ok, warn, danger, info) plus neutral                                     | Text always visible; icon plus text, never colour alone                                                                                                   | Status tokens                                                        |
| **StageTracker**              | Job stages from a template; current stage highlighted; tap to advance (with confirm)                                                                                                                                                                 | Done, current, blocked, skipped, not started                                      | Ordered list of buttons; state in the accessible name                                                                                                     | Custom                                                               |
| **MoneyInput**                | Amount with a currency selector (LKR default; USD and SGD), formatting on blur, rate field when not LKR (stores amount, currency and rate, PLAN.md section 3), and the LKR equivalent shown under it                                                 | Default, focus, error ("Enter an amount over 0"), read-only, locked               | `inputmode="decimal"`, visible label, currency announced with the value                                                                                   | `.field-input` plus a currency segment                               |
| **MoneyDisplay**              | Formats per section 7.2; compact on dashboards ("LKR 2.14M") with the full figure in a tooltip and in the accessible name                                                                                                                            | Positive, negative (minus sign and danger tone), masked ("LKR •••••")             | Masked values have a "Show" button that logs the read                                                                                                     | `Intl.NumberFormat` wrapper in `lib/format`                          |
| **WhtPreview**                | Inline explanation of the WHT calculation on payment requests and engagements                                                                                                                                                                        | Not applicable, applies, threshold close ("LKR 12,000 below the threshold")       | Plain sentence first, figures second                                                                                                                      | Pure function in `lib/rules/` plus a card                            |
| **ApprovalCard**              | The unit of the inbox (5.6): type, who, what, amount, reason line, attachments, actions                                                                                                                                                              | Pending, confirming, decided (by me or someone else), undo window, error          | Buttons with full names ("Approve payment of LKR 45,000 to Kasun P."); focus moves to the next card after a decision                                      | `.glass` on Showcase; `surface-1` in the list                        |
| **BottomSheet / SidePanel**   | Payment sheet, booking form, comment box, filters on a phone                                                                                                                                                                                         | Open, closing, with sticky footer actions                                         | Focus trap, Escape closes, return focus to the opener, no swipe-only close                                                                                | shadcn Sheet (Radix Dialog)                                          |
| **SignaturePad**              | Draw a signature (talent documents, delivery notes), **or type the name** as an equal option                                                                                                                                                         | Empty, drawing, signed (with timestamp), cleared                                  | The typed-name path is required, because drawing is a path-based gesture that some users cannot do (2.5.1, 2.5.7)                                         | Canvas (for example `signature_pad`, unverified fit) plus text input |
| **QRScanner**                 | Gear check-out and check-in, POS item lookup                                                                                                                                                                                                         | Camera permission ask, scanning, found, not found, denied                         | Manual code entry always visible next to the camera view                                                                                                  | Browser `BarcodeDetector` where supported, with a JS fallback        |
| **FileDrop + ColumnMapper**   | Attendance import (S-81), revenue CSV import (R4-F07)                                                                                                                                                                                                | Idle, dragging, uploading, parsing, mapped, blocking errors                       | "Choose file" button as well as drop; mapping by dropdown, not only by drag                                                                               | Papa Parse and SheetJS (PLAN.md section 3)                           |
| **KPI tile and Sparkline**    | Home cards: number, change, short sentence, link                                                                                                                                                                                                     | Loading, value, no data yet, stale ("as of Fri")                                  | The sentence carries the meaning; the sparkline is `aria-hidden` with a text alternative                                                                  | Recharts (PLAN.md section 3)                                         |
| **ReceiptLayout**             | 80 mm, 58 mm and A4 PDF from one data model (6.3)                                                                                                                                                                                                    | Receipt, tax invoice, deposit receipt, refund note, Z-report                      | The PDF is tagged with real text; the e-receipt page is HTML                                                                                              | `@react-pdf/renderer` (PLAN.md section 3) and a raster renderer      |
| **EmptyState**                | Every list has one: a Cormorant line, one sentence, one action ("No bookings today. Walk-ins can be sold from POS. [Open POS]")                                                                                                                      | First use, filtered empty, no access, error                                       | Heading level correct for the page                                                                                                                        | Showcase layer                                                       |
| **Toast**                     | Success with Undo, info, error with Retry. Bottom-centre on phones, above the bottom bar                                                                                                                                                             | Shows for at least 8 s when it has an action; pauses on hover or focus            | `role="status"` (or `alert` for errors); the action is reachable by keyboard; never the only place an error is shown                                      | shadcn Sonner or Toast                                               |
| **Skeleton**                  | Placeholder shapes for cards, rows and the calendar while loading. No spinner for loads under about 300 ms                                                                                                                                           | Shimmer off under reduced motion                                                  | `aria-busy` on the region                                                                                                                                 | `surface-2` blocks                                                   |
| **OfflineBanner + SyncChip**  | "Offline · Queue 2" in the header of POS and attendance; a list of queued items with retry and discard (discard needs a reason)                                                                                                                      | Online, offline, syncing, conflict                                                | Changes announced with `aria-live="polite"`                                                                                                               | Service worker plus IndexedDB queue                                  |
| **DateRangePicker**           | Leave and reports: weekends, public and Poya holidays marked, team-off dots, half-day ends                                                                                                                                                           | Range, single, invalid                                                            | Typed dates accepted ("17/11/2026"); the calendar is optional                                                                                             | shadcn Calendar, extended                                            |
| **CommandPalette**            | Ctrl+K search and actions ("New quote", "Open POS")                                                                                                                                                                                                  | Results grouped by type, recent                                                   | Combobox pattern                                                                                                                                          | shadcn Command                                                       |
| **ConsentToggleGroup**        | Granular consents (WhatsApp, AI likeness: voice, face, promo use) with plain explanations and an example                                                                                                                                             | Off by default; on with timestamp; withdrawn                                      | Each toggle has its own label and description; nothing pre-ticked (PDPA)                                                                                  | Switches                                                             |

### 6.3 Receipt and document layouts

Thermal printers do not have one fixed width. The common case is **80 mm paper with a 72 mm print area at 576 dots (48 characters in Font A)** and **58 mm paper with 48 mm at 384 dots (32 characters)**, at 203 dpi ([Seiko spec](https://sii-thermalprinters.com/wp-content/uploads/2023/12/spec-NP-K2042D.pdf), [Rongta guide](https://www.rongtatech.com/news/thermal-receipt-printer-solutions-a-complete-guide-to-80mm-vs-58mm-models/)). Some models fit more; Epson's TM-T82II lists 48 or 64 columns on 80 mm and 35 or 46 on 58 mm ([Epson](https://www.epson.com.au/pos/products/Printers/DisplaySpecs.asp?id=tmt82ii)). So the layout is defined by column count and printer profile, not hardcoded.

**Sinhala and Tamil on receipts.** Receipt printers do not understand Unicode. The usual way to print complex scripts is to render the receipt to a **1-bit image with a Unicode font and print it as a raster** ([escpos-php wiki on text encoding](https://github.com/mike42/escpos-php/wiki/Text-encoding), [WCPOS non-Latin receipts](https://docs.wcpos.com/hardware/printers/non-latin-receipts)). I found no source specific to Sinhala or Tamil, so test it with the actual printer. English receipts can use fast text mode; Sinhala or Tamil receipts use raster mode at the printer's dot width.

**80 mm receipt (48 columns), English:**

```text
                 [AMPL logo, 1-bit]
         ALLIANCE MEDIA COMPANY (PVT) LTD
           [Address line], Colombo 05
        Tel [phone]   TIN [9 digits]
            RECEIPT   (or: TAX INVOICE)
------------------------------------------------
Receipt   AMPL-RC-2026-004127
Date      Mon 9 Nov 2026  11:07
Cashier   Nadee         Shift #0142
Customer  Walk-in
------------------------------------------------
Podcast room 1 h  11:05-12:05          6,000.00
Engineer 1 h                           2,500.00
USB copy            1 x 500.00           500.00
------------------------------------------------
Subtotal                               9,000.00
VAT 18%                                    —
TOTAL                          LKR     9,000.00
------------------------------------------------
Paid  LankaQR   ref ...4F7K2A          9,000.00
Balance                                    0.00
------------------------------------------------
     [QR: e-receipt and booking terms link]
   Thank you. Bookings: [phone / WhatsApp]
```

**Rules for every layout (receipt, tax invoice, deposit receipt, refund note, Z-report):**

- Heading is **RECEIPT** or **TAX INVOICE** depending on AMPL's VAT status and the buyer, following the IRD format mandatory from 1 October 2026 (supplier TIN always; buyer TIN, name and address when the buyer is VAT-registered) ([R3 section 6](research/R3-pos-booking-finance.md)). The field list is policy data, effective-dated, because it changed three times in 2026.
- **Gapless number** per document type and year, in mono, as PLAN.md section 5.4 does for vouchers.
- **Deposit applied** and **balance due** lines when the sale is linked to a booking.
- **Stamp duty**: a receipt above LKR 25,000 attracts LKR 25 stamp duty (R3 section 6). How AMPL pays it (stamp, or statement to IRD) decides whether the receipt needs a line. Ask the accountant.
- **Payment line** shows the method and reference (LankaQR reference, card last 4 and approval code) but never the full card number.
- **Language:** the receipt language follows the customer's choice, else AMPL's default. Amounts and document numbers always use Western digits.
- **A4 PDF:** the same data with the AMPL header (burgundy and gold, PLAN.md section 5.4), the terms, and space for the IRD-required fields. The PDF is the record; thermal prints are copies.
- **58 mm:** the same order; item lines wrap the description onto a second line and keep the amount right-aligned.

---

## 7. Content and localisation guidelines

### 7.1 Voice

- **Plain and short.** "Payment approved" not "Your payment request has been successfully approved."
- **Say what happened, why, and what to do next** in errors: "This room is booked 14:00–16:00 by _Client Y_. Choose another time or room."
- **Verbs are consistent across modules:** Submit, Recommend, Approve, Reject, Return (with comment), Mark as paid, Request changes, Check in, Check out, Hold, Release. Do not use "OK" or "Yes" on buttons; name the action.
- **Never blame the user**, and never show raw error codes. Log them and show a reference ("Ref 7F2A") the user can quote.
- **Talk to talent and clients as guests.** No internal jargon (no "PR-2026-0217" without "payment" before it).

### 7.2 Numbers, currency, dates and time

I checked what the browser's `Intl` API produces for Sri Lankan locales (Node 22.23 with its bundled ICU, 9 November 2026):

| Locale  | `LKR 1234567.5` as currency | Date and time (10:00 Colombo) | Note                                                                              |
| ------- | --------------------------- | ----------------------------- | --------------------------------------------------------------------------------- |
| `en-LK` | `LKR 1,234,567.50`          | `Nov 9, 2026, 10:00 AM`       | Month-first date: easy to misread                                                 |
| `si-LK` | `රු. 1,234,567.50`          | `2026 ඉල් 9, 10.00`           | Sinhala rupee symbol; dot as the time separator                                   |
| `ta-LK` | `Rs. 12,34,567.50`          | `9 நவ., 2026, 10:00`          | **Indian lakh grouping**: the same amount looks different from the English screen |

CLDR uses one currency pattern with a symbol placeholder, and locales override it ([CLDR](https://cldr.unicode.org/translation/number-currency-formats/number-and-currency-patterns)). Because the defaults disagree, ChordusAM should **set the formats itself** in one `lib/format` module, not leave them to the locale:

| Item                 | Rule                                                                                                                       | Example                                       |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Currency in tables   | Code in the column header, numbers without symbol, 2 decimals, Western 3-digit grouping in **every** language              | Header "Amount (LKR)", cell `1,234,567.50`    |
| Currency in text     | `LKR` before the amount with a space; other currencies the same                                                            | `LKR 45,000.00`, `USD 138.00`, `SGD 1,200.00` |
| Sinhala and Tamil UI | Keep `LKR` (or `රු.` / `ரூ.` if user testing prefers it) but **keep the 3-digit grouping**                                 | `රු. 1,234,567.50`, not `12,34,567.50`        |
| Compact              | Dashboards only, with the full value in the tooltip and accessible name; "M" for millions (test whether staff prefer "Mn") | `LKR 2.14M`                                   |
| Negative             | Minus sign, not brackets, except in exported accounting reports if the accountant wants brackets                           | `-4,000.00`                                   |
| FX                   | Show the rate and its date with the converted amount                                                                       | `USD 138.00 @ 300.00 (CBSL, 2 Nov)`           |
| Dates                | Day first with the month as a word, in every language: avoids the `en-LK` month-first default                              | `Mon 9 Nov 2026`; short `9 Nov`               |
| Typed dates          | Accept `DD/MM/YYYY` and pickers; show the parsed result back ("Tue 17 Nov 2026")                                           | `17/11/2026`                                  |
| Time                 | 12-hour with AM/PM in the UI (to confirm with staff); 24-hour in exports. Always **Asia/Colombo** (CLAUDE.md); store UTC   | `11:05 AM`                                    |
| Ranges               | En dash, no spaces for times                                                                                               | `14:00–18:00`, `Tue 17 – Wed 18 Nov`          |
| Week                 | Starts Monday. Poya days are marked on every calendar                                                                      |                                               |
| IDs                  | Mono, never translated, never with local digits                                                                            | `AMPL-PV-2026-0001`                           |
| Phone numbers        | Store E.164, show `+94 77 123 4567`                                                                                        |                                               |

Singapore (later): `en-SG` gives `9 Nov 2026, 10:00 am`, which is already day first. Currency code first works for SGD too.

### 7.3 Typography for Sinhala and Tamil

| Use                            | English (current)  | Sinhala                                                                                                                                                                                                                                                                                     | Tamil                                                                                                                                                                                                                      |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UI and body (pairs with Inter) | Inter              | **Noto Sans Sinhala**: unmodulated sans, multiple weights and widths, OFL ([Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+Sinhala/about))                                                                                                                                  | **Noto Sans Tamil**: Latin and Tamil, available as a variable font on Fontsource ([jsDelivr](https://www.jsdelivr.com/package/npm/@fontsource-variable/noto-sans-tamil))                                                   |
| Display (pairs with Cormorant) | Cormorant Garamond | **Abhaya Libre**: the libre version of FM Abhaya, the most widely used Sinhala typeface, by Mooniak ([Google Fonts](https://fonts.google.com/specimen/Abhaya+Libre/about), [Fontsource](https://fontsource.org/fonts/abhaya-libre/about)). Its modulated strokes sit well next to Cormorant | **Noto Serif Tamil** (unverified pairing; to test) or **Mukta Malar**, which is described as handling Tamil conjuncts well beside Latin ([fonttamil.com](https://fonttamil.com/blog/10-best-free-tamil-google-fonts.html)) |
| Narrow titles (optional)       | n/a                | **Yaldevi Colombo** (Sinhala and Latin), by Mooniak ([GitHub](https://github.com/mooniak/yaldevi-font))                                                                                                                                                                                     | **Yaldevi Jaffna** (Tamil and Latin) from the same family, for matching titles across both scripts                                                                                                                         |
| Mono labels                    | JetBrains Mono     | No Sinhala mono needed: labels in Sinhala use Noto Sans Sinhala at 12 px+                                                                                                                                                                                                                   | Same, with Noto Sans Tamil                                                                                                                                                                                                 |

**Rules:**

1. **Self-host through `@fontsource`**, as Phase 0 does for the Latin fonts, and load the Sinhala or Tamil files only for users with that language (`unicode-range` subsets).
2. **No uppercase and no letter-spacing on Sinhala or Tamil.** These scripts have no case, and tracking breaks up the joined letter forms. `.eyebrow`, `.btn` and `.field-label` need `:lang(si), :lang(ta) { text-transform: none; letter-spacing: normal; }`.
3. **No italic for the gold word.** Sinhala and Tamil fonts generally have no true italic; a browser-faked slant looks broken. Use the gold colour alone.
4. **More line height.** Sinhala and Tamil are among the "tall" scripts that need more line height than Latin ([Thottingal, web typography](https://docs.thottingal.in/web-typography)), and Tamil has deep descenders ([W3C Tamil gap analysis](https://www.w3.org/TR/2023/DNOTE-taml-gap-20231004/)). Use line-height 1.6 to 1.7 for body text (Latin uses about 1.5), and do not set a fixed height on buttons, chips or table cells. Use min-height plus padding so glyphs are not clipped.
5. **Set `lang` on the right element:** the page `lang` follows the user setting, and mixed content (a Tamil client name in an English table) carries its own `lang` so screen readers pronounce it correctly.
6. **Size:** Sinhala and Tamil at the same pixel size look smaller than Latin. Start at +1 px (for example 15 px where Latin is 14 px) and confirm in testing.

### 7.4 Localisation process

- **Message catalogue from Phase 1.** All strings in ICU MessageFormat (plurals and genders handled properly). The SA picks the library (for example `next-intl`).
- **English is the source.** Sinhala and Tamil translations are done and reviewed by **native speakers who know the studio's vocabulary**. I have not written any Sinhala or Tamil copy here on purpose: machine-made labels for "leave", "voucher" or "withholding tax" would not be trusted.
- **A shared glossary** of about 60 business terms (leave types, payroll terms, booking statuses) per language, approved once by HR and Finance and reused everywhere.
- **Staff screens**: English first in the MVP, Sinhala and Tamil when the glossary is ready. **Portals, client links, WhatsApp templates and receipts** are trilingual in the MVP, because talent and clients are the people most likely to prefer Sinhala or Tamil (P7, P8). This order should be confirmed in research.
- **Pseudo-localisation build** (strings padded by 40% and wrapped in markers) in CI to catch hardcoded text and clipped layouts.
- **Legal texts** (contracts, consents) are translated and checked by the lawyer, with the version stored against each signature.

### 7.5 Notification copy patterns

**One pattern for every channel:** _what happened_ + _object_ + _what you need to do and by when_ + _one action_. In-app and email can carry more detail; WhatsApp carries the minimum and a link.

**WhatsApp rules:**

- **Utility templates only**, never marketing, with an opt-in per person stored with the consent text and time ([R4 section 5.1](research/R4-creative-ops-rights.md)). Each template is approved in English, Sinhala and Tamil.
- **Buttons:** recent sources say utility templates can carry up to 10 buttons with labels of about 20 characters, but they disagree on how many URL and phone buttons are allowed, so check Meta's documentation and the BSP editor before finalising ([Meta template components](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/components), [Bird template guidelines](https://docs.bird.com/applications/content/message-templates/concepts/whatsapp-message-templates/whatsapp-business-template-guidelines-and-restrictions)). Design for **one URL button plus at most two quick replies**, labels up to 20 characters.
- **No sensitive data in WhatsApp:** no salary, no payslip amount, no NIC or bank details. Phones are shared and messages show on lock screens.
- **No approvals by reply.** Quick replies are only for low-risk confirmations ("See you there" for a booking reminder). Anything that changes money or HR records opens ChordusAM, which checks the session.
- **Links are signed and expire.** Staff links open the app and need sign-in; client and talent links carry a token scoped to one record.

**Template set for the MVP** (English source; `{{n}}` are variables):

| Template key            | Audience | Body (English source)                                                                                 | Buttons                                  |
| ----------------------- | -------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `booking_hold_deposit`  | Client   | Hi {{1}}, your {{2}} booking on {{3}} is on hold until {{4}}. Pay the deposit of {{5}} to confirm it. | URL: "Pay deposit"                       |
| `booking_confirmed`     | Client   | Your {{1}} booking on {{2}} is confirmed. Receipt {{3}}.                                              | URL: "View booking"                      |
| `booking_reminder`      | Client   | Reminder: {{1}} at AMPL studio, {{2}}, {{3}}.                                                         | Quick: "See you there", "Need to change" |
| `cut_ready_review`      | Client   | Version {{1}} of "{{2}}" is ready for your review. Please reply by {{3}}.                             | URL: "Review now"                        |
| `quote_ready`           | Client   | Your quote {{1}} for "{{2}}" is ready. It is valid until {{3}}.                                       | URL: "View quote"                        |
| `invoice_due`           | Client   | Invoice {{1}} for "{{2}}" is due on {{3}}.                                                            | URL: "View and pay"                      |
| `talent_invite`         | Talent   | {{1}} from AMPL has invited you to join as {{2}}. It takes about 5 minutes.                           | URL: "Get started"                       |
| `talent_engagement`     | Talent   | New job offer: {{1}} on {{2}}. Please accept or decline by {{3}}.                                     | URL: "View offer"                        |
| `talent_call_sheet`     | Talent   | Call time for {{1}}: {{2}} at {{3}}.                                                                  | URL: "Call sheet"                        |
| `talent_payment_sent`   | Talent   | AMPL has sent a payment for {{1}}. Ref {{2}}. Your voucher is in your portal.                         | URL: "View payment"                      |
| `staff_approval_needed` | Staff    | {{1}} needs your decision: {{2}}.                                                                     | URL: "Open inbox"                        |
| `staff_request_decided` | Staff    | Your {{1}} request for {{2}} was {{3}}.                                                               | URL: "View request"                      |
| `staff_fix_attendance`  | Staff    | We have no fingerprint record for you on {{1}}. Please add it in ChordusAM.                           | URL: "Fix it"                            |
| `staff_payslip_ready`   | Staff    | Your {{1}} payslip is ready.                                                                          | URL: "Open payslip"                      |
| `hr_import_reminder`    | HR       | It's Monday: time to import last week's attendance.                                                   | URL: "Import now"                        |

**In-app and email:** the same message as the WhatsApp body for the title, then the details (amount, dates, who), then one button. Email subjects start with the object: "Leave approved: 17–18 Nov", "Payment returned: PR-2026-0217".

---

## 8. Usability risks, research plan and open questions

### 8.1 Usability risks

| #     | Risk                                                                                                     | Likelihood | Impact | Mitigation                                                                                                                           |
| ----- | -------------------------------------------------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| UR-1  | **Glass and dark theme reduce legibility** on dense screens and in glare                                 | High       | High   | Workbench surfaces, new tokens (1.3), Light mode, `prefers-contrast` support; contrast tests in CI                                   |
| UR-2  | **Accidental money approval** from a one-tap flow on a phone                                             | Medium     | High   | Confirm step repeating amount and payee; 8-second undo; no WhatsApp reply approvals                                                  |
| UR-3  | **HR "recommend" versus Admin "approve" is confusing**; people think HR's recommendation is the decision | Medium     | Medium | Status tracker on every request; the words "Recommended" and "Approved" are never the same colour; employee sees "Waiting for Admin" |
| UR-4  | **Offline POS sales duplicate or conflict** when they sync                                               | Medium     | High   | Client-generated IDs, visible queue, shift close blocked until synced, walk-in conflict alert; Android tablet with Chrome            |
| UR-5  | **Talent abandon onboarding** (too many fields, legal text)                                              | High       | Medium | 3 short steps with saved progress, plain summaries, WhatsApp resume link; only legally needed fields before the first payment        |
| UR-6  | **Poor Sinhala and Tamil translations** reduce trust more than English would                             | Medium     | High   | Native-speaker glossary, legal review for contracts, staff UI English-first until reviewed                                           |
| UR-7  | **Forwarded client review links** lead to disputes about who approved                                    | Low        | High   | Typed name recorded, per-contact tokens, optional one-time code (SEC decision), version and time in the record                       |
| UR-8  | **Navigation overload** as hubs grow; employees see too much                                             | Medium     | Medium | Role-shaped Home; employees see 2 hubs; tree test before Step 2 (3.4)                                                                |
| UR-9  | **Ambiguous dates and number groupings** between languages (`en-LK` month-first, `ta-LK` lakh grouping)  | High       | Medium | One formatting module with fixed rules (7.2); unit tests for each locale                                                             |
| UR-10 | **Payroll trust**: HR cannot explain a figure, so goes back to the spreadsheet                           | Medium     | High   | "How this was calculated" on every row (5.7); compare with last month; run the spreadsheet in parallel for 2 months                  |
| UR-11 | **Shared front-desk tablet** blurs who sold what                                                         | Medium     | Medium | Quick cashier switch, cashier on every receipt and Z-report, auto-lock after idle                                                    |
| UR-12 | **Calendar is unusable on phones** if the desktop grid is shrunk                                         | High       | Medium | Agenda view by default on phones (5.4)                                                                                               |

### 8.2 Research plan

**Who to test with at AMPL** (about 14 people, 45 to 60 minutes each, paid in time; PDPA consent form; no real salaries or NICs in prototypes):

| Group            | People                                                                                             | Why                                  |
| ---------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------ |
| HR and Ops       | Abilasini                                                                                          | Owns import, leave and payroll       |
| Finance          | Janaka                                                                                             | Payables, reconciliation, tax        |
| Owner and Admins | Thoshan plus one of Fazlur or Gurpreet                                                             | Dashboard and approvals on the phone |
| Producers        | Chathurika plus one other producer                                                                 | Quote to job, talent, reviews        |
| Front desk       | Whoever runs the studio counter today (or the person who takes studio bookings)                    | POS and calendar                     |
| Employees        | 3 staff, including one who prefers Sinhala and one who prefers Tamil                               | Leave and attendance on a phone      |
| Freelancers      | 3 regulars: a vocalist, an AI artist and an editor; at least one Sinhala-first and one Tamil-first | Portal onboarding and consent        |
| Clients          | 2 (one brand, one artist), recruited through producers                                             | Review link and quote acceptance     |

**Rounds:**

| Round | When (indicative)          | Method                                                                                                                                                          | Output                                                         |
| ----- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| R0    | Week 1                     | **Contextual inquiry**: watch the weekly import, a payroll month-end (or its spreadsheet), a front-desk shift and a producer's day; collect real files (masked) | Baseline times and error counts; confirm personas and journeys |
| R1    | Week 2                     | **Tree test** of the IA in section 3 (10 tasks, "Where would you find…")                                                                                        | Hub and section names that people actually find                |
| R2    | Weeks 3 to 4               | **Clickable prototypes** on participants' own phones and the counter tablet: J-01, J-05, J-08, J-09 first; then J-04, J-06, J-07                                | Task success, time, errors; design changes                     |
| R3    | Week 4                     | **5-second tests** of each role's Home; **first-click tests** on the inbox                                                                                      | Whether Home cards communicate the right thing                 |
| R4    | Before each module release | **Accessibility pass**: TalkBack on Android, keyboard only, 200% zoom, Light and Dark                                                                           | Issues logged against WCAG 2.2 AA                              |
| R5    | 4 to 6 weeks after launch  | **Analytics and a short survey** (SUS plus 2 open questions) per role                                                                                           | Adoption, satisfaction, next fixes                             |

**What to measure:**

| Measure                                               | Baseline (R0)                  | Target                                                                   |
| ----------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| Walk-in sale, tap to receipt (J-01)                   | Measure the paper process      | Under 60 s, 5 taps or fewer                                              |
| Fingerprint file to exceptions sent (J-06)            | Measure today's spreadsheet    | Under 15 min                                                             |
| Payroll draft to submit (J-07)                        | Measure today                  | Under 30 min, zero post-approval corrections                             |
| Owner inbox of 7 items (J-08)                         | n/a                            | Under 3 min                                                              |
| Leave request on a phone (J-09)                       | n/a                            | Under 1 min, 90%+ task success                                           |
| Talent onboarding on a phone (J-04)                   | n/a                            | Under 5 min, 80%+ complete without help                                  |
| Client review link to decision (J-05)                 | Today: WhatsApp back-and-forth | Median under 24 h; 95%+ of approvals recorded in the app                 |
| Approval latency (submitted to decided), all types    | Unknown                        | Median under 1 working day                                               |
| "Where is my…?" messages to HR, Finance and producers | Count for 2 weeks in R0        | Halved after 2 months                                                    |
| SUS score per role                                    | n/a                            | 70 or higher                                                             |
| Accessibility                                         | n/a                            | Zero axe critical or serious issues; TalkBack can complete J-09 and J-05 |

### 8.3 Open questions

1. **Front desk:** who runs the studio counter today, on what device, and is there a receipt printer? Is it 80 mm or 58 mm, and which model (for raster Sinhala and Tamil printing)?
2. **Studio for outside clients:** how much studio and gear time is sold to outside clients versus used for AMPL's own jobs? This decides how much of POS and the public booking page goes in the MVP (also R1 open question 1).
3. **Languages:** which staff, freelancers and clients would really use Sinhala or Tamil screens? Is "English staff UI, trilingual portals and messages" the right MVP split?
4. **Capabilities model:** is the owner happy to add a capabilities model (producer, front desk) and portal identities for talent and clients? This changes PLAN.md section 9 and needs approval under CLAUDE.md.
5. **Admin's own pay in a payroll run:** PLAN.md says nobody approves their own request. Does that apply when an Admin's salary is in the run, so a different Admin must approve it?
6. **Money approvals on the phone:** is "tap plus confirm plus 8-second undo" enough, or do Admins want a stronger check (for example a one-time code above a higher amount)? Ask SEC as well.
7. **Client approval strength:** is a signed link plus typed name enough evidence for "final cut approved", or should approval also need a one-time code to the client's phone?
8. **Light mode default:** are Admins happy for the POS and data screens to default to the light Workbench mode, given the website brand is dark?
9. **Compact figures:** do staff and the owner say "M" or "Mn" for millions, and do they prefer 12-hour or 24-hour time?
10. **Calendar library:** custom accessible grid, or FullCalendar Premium (from USD 480)? This is for the SA and CFO.
11. **WhatsApp sender:** one AMPL number for all brands, or one per brand (The Studio LK, Varnam TV)? This affects template approval and how clients recognise the sender.
12. **Review player:** does AMPL already use Frame.io, Vimeo or Drive for client reviews? The review link page depends on which player it embeds (R4 section 1.3).
