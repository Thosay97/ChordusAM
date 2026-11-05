# ChordusAM: Mini ERP for Alliance Media Company

> **ChordusAM** = chord + chorus + AM (Alliance Media). One internal system for people, studio operations and money: attendance, leave, contracts, payroll, vendor and artist payments, income, expenses and P&L.

Owner: Thoshan Rathnayake (Fractional COO). Company: Alliance Media Company (Private) Limited (AMPL), Colombo, Sri Lanka.
Status: Planning document, v2.0, November 2026 (v1.0 covered HR only; v2.0 adds vendor invoicing and a Finance module). Hand this file to Claude Code as the project brief.

---

## 1. Purpose and scope

Replace spreadsheet and WhatsApp admin with one internal web app, built as modules on a shared database:

| Module | Main owner | What it does |
|---|---|---|
| **HR** | Operations Manager | Attendance import, leave, manual attendance, contract types, monthly payroll preparation. |
| **Vendor Payments** | Ops Manager, producers, Admins | Raise a payment request for an external person or company (for example a vocal artist), route it for approval, send it to Finance, and generate a downloadable invoice or payment voucher. |
| **Finance** | Finance (Janaka) | Income, expenses, payroll and vendor payouts, receivables, P&L and cash reports. |
| **Admin** | Thoshan, Fazlur, Gurpreet | Final approvals, full overview dashboards, settings, audit trail. |
| **Employee self-service** | Everyone | Own attendance, leave requests, manual attendance, pay statements. |

Core flows:

1. Import the weekly report from the fingerprint attendance machine and turn it into clean attendance records.
2. Leave requests go to HR for review, then to any one Admin for final approval.
3. Employees mark missed attendance manually, approved by any one Admin.
4. Different contract types per employee (office days per week, pro rata leave, probation rules, pay rules).
5. Month-end payroll goes from HR to an Admin to Finance, and posts to the books once paid.
6. External payments (artists, musicians, editors, freelancers) go from a request to Finance to a downloadable invoice, and post to the books once paid.
7. Finance records income and other expenses and reads P&L, receivables and project profitability.
8. Admins get a calendar and finance overview in one dashboard.

**Out of scope for v1:** biometric device integration (we only upload its report), tax filing, EPF/ETF government submissions (we only produce figures), full statutory accounting and double-entry bookkeeping (the Finance module is a management ledger, not a replacement for the accountant's books), bank integrations, recruitment, performance reviews, mobile app (the web app must work well on a phone).

## 2. Users and roles

| Role | Who | Can do |
|---|---|---|
| **Employee** | All staff and contractors | View own attendance, balances, payslip. Request leave. Submit manual attendance. Cancel own pending requests. Users with the "can request payments" permission (for example producers and coordinators) can also raise vendor payment requests. |
| **HR** | Operations Manager (Abilasini) | Upload attendance reports. Review leave and manual attendance requests (recommend or return). Manage employee records and contract assignments. Prepare and submit monthly payroll. Raise vendor payment requests and manage the vendor directory. Cannot give final approval. |
| **Admin** | Thoshan, Fazlur, Gurpreet | Final approval of leave and manual attendance (**any one Admin is enough**). Approve payroll runs and vendor payments above the spending limit. Full dashboards including finance. Configure contract types, holidays, policies, categories. |
| **Finance** | Janaka | Full write access to the Finance module (income, expenses, categories). Receives approved payroll runs and vendor payment requests, downloads their documents, marks them Paid with a payment reference. Runs P&L, receivables and cash reports. No access to attendance or leave details. |

Rules:
- A person cannot approve their own request. If an Admin requests leave, another Admin approves it.
- Roles are additive in data (a user has one primary role) but permissions are enforced on the server, never only in the UI.

## 3. Recommended stack (change if the team prefers something else)

- **Next.js (App Router) + TypeScript**, deployed on Vercel.
- **Supabase**: Postgres database, Auth (email magic link or Google sign-in), Row Level Security, Storage (uploaded reports and PDFs).
- **Tailwind CSS + shadcn/ui** for the interface. **FullCalendar** (or a small custom grid) for calendar views. **Recharts** for charts.
- **SheetJS (xlsx)** and **Papa Parse** for XLSX/CSV import. **@react-pdf/renderer** for payslip and invoice PDFs.
- **Resend** (or Supabase email) for notifications. **Zod** for validation. **Vitest** for unit tests, **Playwright** for a few end-to-end flows.
- Timezone fixed to **Asia/Colombo**. Base currency **LKR**, with optional USD or other currency on an entry (store the amount, currency and the exchange rate used, since AI tool subscriptions are billed in USD). Store timestamps in UTC, display in Colombo time.

Brand: use the Alliance Media palette: burgundy `#4A1528`, gold `#E8941A`, light tints `#F9F0F2` and `#FBF8F5`, ink `#1A1A2E`, green `#1A6040`. Arial or Inter.

## 4. Core concepts

### 4.1 Contract types (the configurable heart of the system)

A **Contract Type** is a reusable template. Each employee is assigned one, with an effective date, and can have **overrides**. Assignments are versioned (history is never overwritten), so a salary or policy change applies from a date forward.

Contract type fields:

| Group | Setting | Examples |
|---|---|---|
| Schedule | Working days, start and end time, grace minutes | Mon to Fri, 9:00 to 17:00, 15 min grace |
| Location | Office days required per week, which days are fixed (if any) | 3 office days a week, rest remote |
| Probation | Probation length in months, rules during probation | 3 months, leave unpaid |
| Leave | Leave types allowed, annual entitlement per type, accrual method, carry forward, who is eligible after probation | Annual 14 days, accrued monthly (pro rata), no carry forward |
| Pay | Pay basis, monthly amount, net or gross, absence deduction rule | Monthly fee LKR 85,000 net, deduct LKR 4,000 per unapproved absent day |
| Statutory | EPF/ETF applies yes or no, tax handling note | Contractor: no EPF/ETF. Employee: EPF 8% employee, 12% employer, ETF 3% employer |
| Flags | Counts public holidays as paid, overtime eligible | yes, no |

Implementation guidance:
- Store rules as **validated JSON** (Zod schema) on the contract type, plus typed columns for the basics (pay amount, dates).
- Build a small **rules engine module** (`/lib/rules`) with pure functions: `accrueLeave()`, `computeAbsence()`, `checkOfficeDays()`, `computePayroll()`. Every function takes plain data in and returns plain data out so it is fully unit testable.
- Seed three starter types: **Probationary Operations Manager** (from the AMPL contract: 9 to 5, Mon to Fri, unpaid leave in months 1 to 3, absence adjustment LKR 4,000 per day, 85,000 monthly), **Part-time Contractor** (retainer based, no leave), **Permanent Employee** (pro rata leave, EPF/ETF on).
- The numbers above are examples. Admins edit them in the UI; do not hardcode company policy.

### 4.2 Attendance model

- **Raw punches** are stored exactly as imported (never edited), linked to the upload batch.
- **Daily attendance record** per employee per date is derived: first in, last out, hours worked, status.
- Statuses: `present`, `late`, `half_day`, `absent`, `on_leave`, `public_holiday`, `weekend`, `remote` (only meaningful for hybrid contracts), `manual_pending`, `manual_approved`.
- A day can be overridden only by an approved leave, an approved manual attendance, or an Admin correction (with reason, written to the audit log).
- Hybrid check: for contracts with "N office days per week", count days with a fingerprint punch per ISO week and flag weeks below N. This is a flag for HR and Admins, not an automatic deduction (configurable).

### 4.3 Leave model

- Leave types are configurable (annual, casual, medical, unpaid, short leave, etc.).
- **Pro rata accrual:** balance grows monthly from the employee start date, using the contract type's entitlement. A pure function computes the balance as of any date.
- Probation rules (for example "unpaid only") block paid leave types during probation.
- Requests support full day, half day, and date ranges. Weekends and public holidays inside a range are not counted.
- Warn about overlap with an existing request and, optionally, about too many people off on the same day.

### 4.4 Approval workflows

**Leave request**
`Employee submits` -> `HR reviews (recommend approve / recommend reject / return with comment)` -> `any one Admin gives final decision` -> `employee notified`.
Statuses: `submitted`, `hr_recommended`, `hr_returned`, `approved`, `rejected`, `cancelled`.
HR can only recommend. Admins can also decide directly if HR has not acted within a configurable number of days (default 2).

**Manual attendance request**
`Employee submits (date, in time, out time, reason, optional note)` -> `any one Admin approves or rejects` -> record updated.
HR can see all requests and add a comment but approval is Admin only. If the same date already has an approved leave, the request is blocked.

**Month-end payroll**
`HR runs payroll for month` -> system builds a draft from attendance, leave and contract rules -> `HR reviews and fixes exceptions` -> `HR submits` -> `Admin approves the run` -> `Finance receives it` -> `Finance marks Paid`.
Each employee gets a **monthly pay statement/invoice PDF**, and the run produces one **summary sheet** (XLSX and PDF) for Janaka.

## 5. Vendor Payments and invoicing (external projects)

For paying anyone outside payroll: a vocal artist, session musician, videographer, editor, voice-over artist, studio, AI artist, or any supplier.

### 5.1 Vendor directory

Reusable records so details are typed once: name, type (individual or company), service category (vocalist, musician, videographer, editor, AI artist, equipment hire, studio, software, other), contact details, NIC or business registration number, bank details (encrypted, shown only to Finance and Admins), preferred payment method, notes, active flag. Optional file uploads (their contract, ID copy). Duplicate detection on name plus NIC or bank account.

### 5.2 Payment request (the form)

Fields: vendor (pick or create), **project** (internal or external, from the Projects list, optional ClickUp task or list link), **description of the service**, service category, **fee** (amount and currency), optional breakdown lines (for example recording session, mixing, usage rights), tax or withholding amount if applicable, due date, preferred payment method, **attachments** (vendor's own bill, agreement, WhatsApp confirmation screenshot), notes for Finance. The requester name and date are recorded automatically.

### 5.3 Workflow

`Requester submits` -> `Admin approval if above the spending limit` -> `Finance receives` -> `Finance schedules or pays` -> `Paid (with payment reference and date)`.
Statuses: `draft`, `submitted`, `awaiting_admin`, `approved`, `rejected`, `returned`, `paid`, `cancelled`.

- **Spending limit** is configurable (default LKR 15,000, matching clause 7.10 of the Operations Manager contract: spending above that needs prior written approval). At or below the limit the request goes straight to Finance. Above it, any one Admin approves first.
- A requester cannot approve their own request. Finance can return a request with a comment (missing details, wrong amount).
- Once Paid, the request is locked and automatically posts an **expense entry** in the Finance module, tagged to the project and category.
- Finance can record partial payments (advance, balance), each with its own reference.

### 5.4 Downloadable invoice or payment voucher

- On submission the system generates a **PDF** with a sequential number (for example `AMPL-PV-2026-0001`), AMPL's company details, vendor details, project, service description, fee lines, tax lines, total, payment terms, requester, approver and status. Alliance Media burgundy and gold branding.
- Downloadable by the requester, Admins and Finance at any time; regenerated if the request is edited before payment, with a version history.
- Two document styles, chosen per vendor: **payment voucher** (AMPL's internal record) and **self-billed invoice** (AMPL issues it on the vendor's behalf with their agreement). Attach the vendor's own invoice if they have one. Ask the accountant whether withholding tax or stamp duty applies to any vendor type; the system only records what Finance enters.
- Numbering is gapless per year and cannot be edited.

### 5.5 Views

Requester: my requests and their status. Finance: payables queue (to pay this week, overdue, paid), filter by vendor, project, status, due date. Admin: all requests, spend by vendor and by project.

## 6. Finance module (mini ERP)

A management ledger for Finance (Janaka) and Admins. It is **not** statutory accounting: keep the accountant's books for tax and audits, and give the accountant an export.

### 6.1 Income

- **Clients** directory and **client invoices** or income entries: client, project, description, amount, currency, issue date, due date, status (`draft`, `sent`, `partially_paid`, `paid`, `overdue`, `cancelled`), receipts with date, method and reference.
- Optional later phase: generate client invoices as PDFs with the same numbering and branding as vendor documents.
- **Receivables (AR)** view with ageing buckets (current, 1 to 14, 15 to 30, 31 to 60, over 60 days). This directly supports the Operations Manager's Invoice and AR KPI: overdue over 14 days is flagged for escalation.
- Other income types: studio rentals, event bookings, production fees, grants and credits, other.

### 6.2 Expenses

- Expense entries with date, amount, currency and rate, category, vendor, project, payment method, receipt upload, notes, and status (`recorded`, `paid`).
- **Auto-posted entries:** paid payroll runs (one entry per run, with lines per person), paid vendor payments. They link back to the source and cannot be edited at the source after posting.
- **Manual entries:** subscriptions (Higgsfield, Suno, ClickUp, Claude), GPU rental, equipment, studio rent, utilities, transport, marketing, petty cash.
- **Recurring expenses:** monthly or annual templates that create a draft entry on schedule for Finance to confirm.
- Categories are editable by Admins. Starter set: Payroll, Talent and vendors, AI tools and software, Cloud and GPU, Equipment, Studio and rent, Utilities, Marketing, Travel and transport, Professional fees, Other.

### 6.3 Reports

- **Profit and Loss** by month, quarter, year or custom range, with drill down from any line to its entries. Compare to the previous period.
- **Project profitability:** income less talent, AI tools and other costs per project, per client and per music video or track (important for pricing).
- **Cash view:** money in, money out, payables due, receivables due, simple 30 day forecast.
- **Expense breakdown** by category, vendor and project. Payroll cost versus revenue.
- **Payables and receivables** ageing. Exports to XLSX and PDF for the accountant.
- Budgets (a later phase): monthly budget per category and per project, actual versus budget.

### 6.4 Projects (light)

A simple Projects list that ties everything together: name, type (internal or external), client, status, start and end dates, optional **ClickUp link or ID**, budget. Income, expenses and vendor payments reference a project. No task management here, ClickUp stays the place for tasks.

## 7. Fingerprint report import

We do not know the exact format yet. **First task for Claude Code: ask for a sample export and build around it.** Design for a typical device export (CSV or XLSX with device user ID, name, date and time of each punch, or one row per day with first in and last out).

Import flow:
1. HR uploads the file (weekly). The file is stored in Supabase Storage with a checksum.
2. **Column mapper:** the first time, HR maps the file columns to fields (user ID, name, timestamp, in/out). The mapping is saved as an **Import Profile** and reused.
3. **Employee matching:** each device user ID is linked to an employee (one time setup in the employee record). Unmatched IDs are listed for HR to resolve.
4. **Preview screen** before anything is saved: number of rows, date range, unmatched IDs, duplicates, odd rows (single punch in a day, punch outside plausible hours, future dates).
5. **Commit** creates raw punches and recalculates daily records for the affected employees and dates. The import is **idempotent**: uploading the same week again, or an overlapping week, must not create duplicates (unique key on employee, timestamp, source).
6. Each upload is a **batch** that is listed in history with who uploaded it, and can be rolled back by an Admin.
7. After commit, show a **weekly exceptions list**: missing punch, absent with no leave, late arrivals, hybrid office days below target. HR can chase these and employees can fix them with manual attendance requests.

## 8. Dashboards

- **Today strip:** who is in, on leave, absent, late. Pending approvals count.
- **Attendance calendar:** month grid per employee (rows are people, columns are days) with colour coded statuses. Click a cell to see punches and the audit trail. Toggle week/month. Filter by team, contract type, status.
- **Team calendar:** who is off on which day (leave plus public holidays), for planning shoots and studio bookings.
- **Approvals inbox:** leave and manual attendance waiting for an Admin, one click approve or reject with a comment.
- **Payroll panel:** current month status (not started, draft, awaiting Admin, sent to Finance, paid), total amount, exceptions, a month-by-month view of the last 12 months.
- **Leave balances:** table by employee and leave type, with projected balance at year end.
- **Insights:** lateness trend, absence trend, hybrid compliance, probation end dates and contract end or extension dates in the next 60 days (the AMPL contracts have fixed terms, so this matters).
- **Finance snapshot (Admins and Finance):** income and expenses this month, P&L to date, cash in and out, receivables overdue, payables due this week, top projects by profit.
- **Payments inbox:** vendor payment requests above the spending limit waiting for an Admin.
- **Reports:** export attendance, leave, payroll and finance reports to XLSX and PDF.

Role views: **Admin** sees everything. **HR** sees attendance, leave, payroll and the vendor requests they raised. **Finance** sees the Finance module, payroll runs and vendor requests, not attendance detail. **Employees** see their own data.

Employee view is simple: my month calendar, my balances, request leave, mark attendance, my pay statements, my pending requests.

## 9. Data model (Postgres)

Use UUID primary keys, `created_at`, `updated_at`, and soft deletes where noted. Enable RLS on every table.

```
profiles            id (auth user), email, full_name, role, active
employees           id, profile_id, employee_code, full_name, nic (encrypted), phone, address,
                    designation, department, start_date, end_date, status, device_user_id, manager_id
contract_types      id, name, description, schedule jsonb, location_rules jsonb, probation jsonb,
                    leave_policy jsonb, pay_rules jsonb, statutory jsonb, active
employee_contracts  id, employee_id, contract_type_id, effective_from, effective_to,
                    base_amount, amount_basis (net|gross), overrides jsonb, probation_end, term_end,
                    extension_status, notes            -- versioned history
holidays            id, date, name, type (public|poya|company), paid
leave_types         id, name, paid, requires_documents, active
leave_balances_ledger id, employee_id, leave_type_id, entry_date, delta_days, reason, source_ref
leave_requests      id, employee_id, leave_type_id, start_date, end_date, half_day, days_counted,
                    reason, status, hr_reviewer_id, hr_comment, hr_reviewed_at,
                    decided_by, decision_comment, decided_at, attachment_path
attendance_imports  id, uploaded_by, file_path, checksum, profile_id, row_count, date_from, date_to,
                    status (previewed|committed|rolled_back), summary jsonb
import_profiles     id, name, column_map jsonb, date_format, time_format, notes
raw_punches         id, import_id, employee_id, device_user_id, punched_at, direction, raw jsonb
attendance_days     id, employee_id, work_date, first_in, last_out, minutes_worked, status,
                    source (device|manual|leave|system), flags jsonb, locked boolean
manual_attendance_requests id, employee_id, work_date, in_time, out_time, reason, status,
                    decided_by, decision_comment, decided_at
payroll_runs        id, period_start, period_end, status, prepared_by, approved_by, sent_to_finance_at,
                    paid_at, payment_reference, totals jsonb
payroll_lines       id, run_id, employee_id, base_amount, deductions jsonb, additions jsonb,
                    net_pay, working_days, days_present, days_absent, unpaid_leave_days, notes
documents           id, owner_type, owner_id, kind (payslip|invoice|summary), file_path
audit_log           id, actor_id, action, entity, entity_id, before jsonb, after jsonb, at
notifications       id, user_id, kind, payload jsonb, read_at, emailed_at

-- Vendor payments and finance
clients             id, name, contact, address, brn, notes, active
projects            id, name, type (internal|external), client_id, status, start_date, end_date,
                    clickup_ref, budget_amount, notes
vendors             id, name, vendor_type (individual|company), service_category, contact jsonb,
                    nic_or_brn, bank_details (encrypted), payment_method, notes, active
payment_requests    id, number (gapless per year), vendor_id, project_id, requested_by, description,
                    service_category, currency, fx_rate, subtotal, tax_amount, total, due_date,
                    document_style (voucher|self_billed), status, admin_approved_by, admin_comment,
                    finance_comment, paid_at, version
payment_request_lines id, request_id, description, quantity, unit_amount, amount
payment_request_payments id, request_id, paid_on, amount, method, reference, recorded_by   -- supports advance and balance
payment_attachments id, request_id, file_path, kind (vendor_bill|agreement|proof|other)
doc_sequences       id, prefix, year, last_number                                         -- gapless numbering
expense_categories  id, name, parent_id, kind (expense|income), active
expense_entries     id, entry_date, amount, currency, fx_rate, amount_lkr, category_id, vendor_id,
                    project_id, method, receipt_path, notes, source_type (manual|payroll|payment_request),
                    source_id, status, created_by
income_entries      id, client_id, project_id, invoice_number, issue_date, due_date, amount, currency,
                    fx_rate, amount_lkr, status, description, created_by
income_receipts     id, income_id, received_on, amount, method, reference
recurring_expenses  id, name, amount, currency, category_id, vendor_id, frequency, next_run_on, active
budgets             id, period, category_id, project_id, amount                           -- later phase
```

Key constraints: `payment_requests.number` comes only from `doc_sequences` inside a transaction; auto-posted `expense_entries` are unique per (source_type, source_id) so a payment can never post twice; payments and receipts can only be added, never silently edited (corrections are reversing entries with a reason); unique (employee_id, work_date) on `attendance_days`; unique (employee_id, punched_at, source) on `raw_punches`; payroll lines locked once a run is approved; leave balances computed from the ledger, never stored as a single mutable number.

## 10. Payroll rules (v1 logic to implement and test)

For each employee and month:
1. Find the active contract version(s) for each day (handle mid-month changes).
2. Count scheduled working days (contract schedule minus weekends and paid public holidays).
3. Count days present, approved leave (paid and unpaid), approved manual attendance, and absent.
4. Apply the contract's **absence rule** (for example fixed LKR per unapproved absent day, or base divided by working days). Unpaid leave days are deducted per the contract. Both are configurable, and the line item shows exactly how each figure was reached.
5. Apply statutory flags (EPF/ETF figures shown only when the contract says so; otherwise skipped).
6. Output net pay plus a transparent breakdown. HR can add a manual adjustment with a required reason (audit logged).
7. Handle part months (start or end mid month) pro rata by calendar days.
8. When Finance marks a run as Paid, post one **expense entry** (category Payroll) per run with the lines linked, so payroll cost appears in the P&L automatically.

Warning in the UI and in tests: **legal treatment of contractors vs employees under Sri Lankan law (EPF/ETF, deductions from pay) must be confirmed by the company's lawyer or accountant.** The system calculates what the contract says; it does not decide the legal classification.

## 11. Notifications

Email and in-app: leave submitted (to HR), HR recommendation (to Admins), decision (to employee), manual attendance submitted (to Admins), decision (to employee), payroll submitted (to Admins), approved and sent (to Finance), paid (to HR), contract or probation ending in 30 days (to HR and Admins), weekly reminder to HR to upload attendance, vendor payment request submitted (to Finance, or to Admins if above the limit), approved or returned or rejected (to requester), paid (to requester), receivable overdue by more than 14 days (to Finance and the Operations Manager), recurring expense due for confirmation (to Finance).

## 12. Security, privacy and audit

- Sri Lanka's **Personal Data Protection Act No. 9 of 2022** applies: collect only what is needed, restrict access, keep a record of who viewed or changed sensitive data.
- RLS enforces: employees see only their own data, HR sees all employee and attendance data but not Admin-only settings, Finance sees only approved payroll runs, Admins see everything.
- Salary, NIC and bank details are sensitive. Encrypt NIC and bank fields at rest, hide them by default in the UI, and show them only to roles that need them.
- Vendor bank details, payment amounts and the Finance module are restricted to Finance and Admins by RLS. Requesters see the status of their own requests and the generated document, not other vendors' bank details.
- Every approval, edit, import, rollback, payroll, payment and finance entry action writes to `audit_log` (who, when, before, after).
- Uploaded files go in private storage buckets with signed URLs. No public links.
- Keep a secret scan and `.env` out of the repo. Use environment variables only.
- Daily database backups (Supabase) and a documented restore step.

## 13. Build phases for Claude Code

Work one phase at a time. At the end of each phase: run the tests, check the acceptance criteria, commit. Phases 0 to 4 deliver HR. Phases 5 and 6 deliver the money side. Phase 7 ties payroll into Finance. Phases 8 and 9 deliver dashboards and polish.

**Phase 0: Project setup**
Create the Next.js + Supabase project, lint, formatting, test runner, CI, environment template, brand theme, layout with role-based navigation and a module switcher (HR, Vendor Payments, Finance, Admin). Seed 4 demo users (Employee, HR, Admin, Finance).
*Done when:* login works, each role sees only its own menu and modules, a protected API route returns 403 for the wrong role.

**Phase 1: Employees, contract types, holidays**
Employee CRUD, contract type editor (form that edits the validated JSON), contract assignment with effective dates and history, holiday calendar (seed Sri Lankan public and Poya days for the year, editable).
*Done when:* HR can create a contract type, assign it, change it from a date, and see history. Holidays show on a calendar.

**Phase 2: Attendance import**
Upload, column mapper, import profiles, employee matching, preview, idempotent commit, batch history, rollback, daily record derivation, exceptions list. Build against a real sample export from the fingerprint machine.
*Done when:* uploading the same file twice makes no duplicates, an overlapping week merges cleanly, and unmatched IDs are blocked until resolved. Unit tests cover derivation (late, half day, missing punch, overnight).

**Phase 3: Manual attendance requests**
Employee form, Admin approval inbox (any one Admin), HR comments, audit trail, notifications.
*Done when:* an approved request updates the day record and shows the source as manual. A second Admin cannot re-decide it. Self approval is blocked.

**Phase 4: Leave**
Leave types, pro rata accrual ledger, balances, request form with day counting, HR recommendation step, Admin final decision, cancellation, calendar overlap warnings.
*Done when:* balances match hand-calculated examples for three contract types, probation blocks paid leave, and weekend or holiday days inside a range are not counted.

**Phase 5: Vendor Payments and invoicing**
Projects and clients lists, vendor directory (with encrypted bank details), payment request form with line items and attachments, spending limit routing, Admin approval, Finance payables queue, partial payments, mark as Paid, gapless numbering, PDF voucher or self-billed invoice with version history, notifications.
*Done when:* a producer submits a request for a vocal artist, it goes to Finance (or to an Admin first when above the limit), the PDF downloads with the correct number and totals, Finance marks it Paid with a reference, and the request locks. A requester cannot approve their own request.

**Phase 6: Finance module**
Expense categories, manual expenses with receipts and multi-currency, recurring expenses, clients and income entries with receipts, receivables ageing, auto-posting from paid vendor payments, P&L by period with drill down, project profitability, cash view, XLSX and PDF exports.
*Done when:* a paid vendor request appears as an expense on its project, a part-paid client invoice shows the right balance and ageing bucket, and the P&L for a test month matches a hand-built spreadsheet.

**Phase 7: Payroll and Finance handoff**
Payroll run, calculation engine per section 10, exception review, manual adjustments, Admin approval, Finance view, payslip PDFs, summary XLSX/PDF, mark as Paid with reference, lock after approval, auto-post the paid run to expenses.
*Done when:* a test month with mixed contract types produces correct figures that match a hand-built spreadsheet, a locked run cannot be changed, and paid payroll appears in the P&L under Payroll.

**Phase 8: Dashboards**
Today strip, attendance calendar (people by days), team leave calendar, approvals and payments inboxes, balances table, upcoming contract and probation dates, finance snapshot, filters and exports. Role specific home screens.
*Done when:* an Admin can see a full month for all staff and the finance snapshot on one screen, drill into any cell, and approve from the inboxes.

**Phase 9: Notifications, polish, hardening**
Emails and in-app alerts, reminders, empty states, mobile layout check, accessibility pass, audit log viewer, backup and restore note, user guide (one page per role). Optional extras: client invoice PDFs, budgets versus actuals.
*Done when:* all items in section 14 pass.

## 14. Acceptance checklist (whole system)

- [ ] Weekly upload of the real fingerprint report works end to end and can be repeated safely.
- [ ] Leave: Employee -> HR -> any one Admin, with notifications at each step.
- [ ] Manual attendance: Employee -> any one Admin.
- [ ] No one can approve their own request.
- [ ] Contract types are configured in the UI, not in code, and changes are versioned.
- [ ] Pro rata leave balances are correct for a mid-year joiner.
- [ ] Hybrid (office days per week) check flags weeks below target.
- [ ] Month-end payroll goes HR -> Admin -> Finance and is locked after approval.
- [ ] Finance can download the summary and each pay statement and mark paid.
- [ ] Vendor payment request: requester -> (Admin if above the limit) -> Finance -> Paid, with a downloadable numbered PDF.
- [ ] Vendor documents are numbered without gaps and cannot be edited after payment.
- [ ] Paid payroll and paid vendor requests appear automatically as expenses, once only.
- [ ] Finance can record income, expenses, receipts and see P&L, receivables ageing and project profitability.
- [ ] Bank details and finance data are visible only to Finance and Admins.
- [ ] Admin dashboard shows attendance, leave, payroll and finance snapshot.
- [ ] RLS tests prove each role sees only what it should.
- [ ] Audit log records every approval, edit and payroll action.
- [ ] Works on a phone.

## 15. Edge cases to handle explicitly

- One punch only in a day (missing in or out). Multiple punches (breaks). Punch just after midnight for a late shift.
- Employee joins or leaves mid month. Contract changes mid month. Probation ends mid month.
- Leave spanning a holiday or weekend. Half day on either side of a range. Leave cancelled after approval.
- Manual attendance on a day that already has a device punch (keep both, flag the conflict).
- Re-import after an approved correction (do not overwrite approved manual or leave days).
- Device ID reassigned to a new person. Two employees with similar names.
- An Admin who is also the requester. All three Admins away (allow any Admin to delegate for a date range).
- Poya days and ad hoc closures declared by the government.
- A vendor paid in parts (advance and balance). A payment request edited after Finance has seen it. A vendor paid in USD with a different rate on payment day. The same invoice entered twice.
- A vendor payment cancelled after being marked Paid (reversing entry, not deletion). A client invoice paid in two instalments or overpaid.
- Requester is the only Admin available (another Admin must approve). Spending split into several small requests to stay under the limit (flag repeated requests to the same vendor and project within a few days).

## 16. Open questions for Thoshan

1. Can you share a sample of the fingerprint report (names and IDs can be masked)? The importer is built around it.
2. Which employees are on which contract type today, and what are the rules for each (office days, leave, pay basis)?
3. Which leave types do you want (annual, casual, medical, short leave, unpaid)? Any carry forward?
4. Are salaries net or gross for each person, and which staff are contractors with no EPF/ETF versus employees with EPF/ETF? (Confirm with your accountant.)
5. What does Finance (Janaka) need exactly: one summary sheet, per-person invoices, or both? Which bank file format, if any?
6. Is the absence deduction rule the same for everyone (for example LKR 4,000 per day) or per contract?
7. Sign-in method: Google accounts, or email magic links?
8. Who should be able to see salary amounts besides Admins and Finance?
9. Who can raise vendor payment requests (Ops Manager, Fazlur, Chathurika, anyone)? Is LKR 15,000 the right Admin approval limit?
10. Voucher or self-billed invoice: which do vendors expect, and does your accountant need withholding tax recorded?
11. Which income types and expense categories do you want from day one? Do you need to track the cash in the bank and petty cash, or only income and expense?
12. Should client invoices also be generated in ChordusAM, or only recorded?
13. How do you want projects named and linked to ClickUp (a link or the ClickUp ID)?

## 17. Starter prompt for Claude Code

Paste this to begin, together with this file in the repo root (`/docs/PLAN.md`):

> Read `/docs/PLAN.md` fully. We are building ChordusAM, an internal mini ERP for Alliance Media covering HR, vendor payments and finance. Start with Phase 0 only. Plan the database so the HR, Vendor Payments and Finance modules share users, projects and the audit log. Before writing code, list your assumptions and anything you need from me (especially a sample fingerprint report). Use the stack in section 3. Keep business rules in `/lib/rules` as pure, unit-tested functions, keep contract settings editable in the UI, enforce permissions on the server with Row Level Security, and write to the audit log for every sensitive action. Stop at the end of the phase and show me how to run it and the test results.

Suggested `CLAUDE.md` rules for the repo: TypeScript strict, no secrets in code, every migration reversible, every rule function has tests, ask before changing the data model, one phase per branch.
