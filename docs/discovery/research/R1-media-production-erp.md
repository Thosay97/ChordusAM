# R1: Media, Agency and Production Management Systems: Market Scan

**Date:** 9 November 2026
**Author:** R1, Market Researcher (discovery team)
**Upstream reading:** `docs/discovery/00-brief.md`, `docs/PLAN.md` (sections 1, 5, 6, 9, 16)

**Summary.** I looked at 17 products in four groups. The first is creative-agency management tools (Workamajig, Function Point, Scoro, Productive.io, Accelo, Streamtime, Synergist, Deltek WorkBook/Maconomy). The second is media-facility schedulers (farmerswife, Xytech MediaPulse). The third is production trackers and pre-production tools (Autodesk Flow Production Tracking, ftrack, StudioBinder, Yamdu, Celtx). The fourth is general all-in-one ERPs (Odoo, ERPNext). I also searched for Sri Lankan and South-East Asian products and for AI music-video pipeline tools. Almost every agency tool covers the core money chain: estimate, then job, then timesheet, then invoice, with budget against actual. Booking rooms and equipment is rare, and so are payroll and POS. Of everything I found, only Odoo and ERPNext cover all three. **No product covers Sri Lankan statutory payroll natively.** The nearest is Odoo, through a USD 79 third-party module. None works through WhatsApp, imports fingerprint attendance, or treats freelancers and USD AI-tool costs as part of job costing. That gap is the space ChordusAM can own. Section 7 recommends 7 comparators for the benchmark (`docs/discovery/12-benchmark-usp.md`).

---

## 1. Method and limits

- **How I researched.** I used web search on 9 November 2026. Direct page fetches failed for every vendor site I tried (workamajig.com, scoro.com, productive.io, accelo.com, streamtime.net, functionpoint.com), because the session's network allowlist blocks them. Every fact below therefore comes from search-engine extracts of vendor pages, vendor help centres and app-store listings, or from third-party directories (Capterra, GetApp, G2, CostBench, Software Advice).
- **Prices.** Directories often disagree on prices. Where they do, I give the range and name the sources. Unless stated otherwise, prices are USD per user per month. A price marked "(third-party)" was not confirmed on the vendor's own page. "Not public" means no list price was found anywhere.
- **Legend in the tables:**
  - **Y** = the cited source confirms it.
  - **P** = partial, add-on, or via a third-party module.
  - **?** = likely, but I could not verify it (unverified).
  - **–** = not found in any source. The feature may still exist; this is not proof it is absent.
- **Scope boundary.** POS, rental and payments belong to R3. Review/approval tools, DAM (digital asset management) and rights belong to R4. HRIS and payroll depth belongs to R2. I touch these areas only where an R1 product covers them.

---

## 2. Product profiles

| #   | Product                                         | Group                          | Target customer                                                        | Deployment                                                                       | Public price (USD/user/month unless noted)                                                                                                                                                                                                                                                                                                  |
| --- | ----------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Workamajig                                      | Agency mgmt                    | Creative agencies and in-house creative teams                          | Cloud SaaS                                                                       | About 37–50, tiered by seat count from 5 users (third-party: [Capterra UK](https://www.capterra.co.uk/software/10533/workamajig), [CostBench](https://costbench.com/software/agency-project-management/workamajig/)). One extract of the vendor pricing page gave 49 (47 annual) ([xpay](https://www.xpay.sh/saas-pricing/workamajig/))     |
| 2   | Function Point                                  | Agency mgmt                    | Small and mid-size creative agencies                                   | Cloud SaaS                                                                       | 53–68 ([CostBench](https://costbench.com/software/agency-project-management/function-point/), [Software Advice](https://www.softwareadvice.com/project-management/function-point-profile)). Older listings show 34–54 (third-party)                                                                                                         |
| 3   | Scoro                                           | Agency/PSA all-in-one          | Agencies and consultancies, 5+ users                                   | Cloud SaaS                                                                       | Essential 26 (annual) / 28; Standard 37 / 42; Pro 63 / 71; Ultimate not public. 5-user minimum (third-party: [Agiled](https://agiled.app/blog/scoro-pricing), [tech.co](https://tech.co/project-management-software/scoro-pricing))                                                                                                         |
| 4   | Productive.io                                   | Agency mgmt                    | Digital and creative agencies                                          | Cloud SaaS                                                                       | Essential about 10–12; Professional about 25–29; Ultimate custom, or 33–40 (unverified). 3-user minimum reported ([ERPResearch](https://erpresearch.com/erp-add-ons/professional-services/productive/pricing), [Capterra](https://www.capterra.com/p/169710/Productive/pricing/), [CostBench](https://costbench.com/verify/productive-io/)) |
| 5   | Accelo                                          | PSA                            | Professional-services firms and agencies                               | Cloud SaaS                                                                       | Not public. Third-party estimates range from 20 to 90, with a minimum of 5 to 10 users ([Taskip](https://taskip.net/accelo-pricing/), [TechRepublic](https://www.techrepublic.com/article/accelo-review/))                                                                                                                                  |
| 6   | Streamtime                                      | Agency job mgmt                | Small creative studios (Australian vendor; strong Xero focus)          | Cloud SaaS                                                                       | About 25–40 (conflicting: [Capterra](https://www.capterra.com/p/133010/Streamtime/), [Software Advice](https://www.softwareadvice.com/project-management/streamtime-profile/))                                                                                                                                                              |
| 7   | Synergist                                       | Agency mgmt                    | UK agencies ("over 1,000")                                             | Cloud SaaS                                                                       | GBP 13 per timesheet-only user, GBP 33 per full user ([GetApp UK](https://www.getapp.co.uk/software/108511/synergist)). Third-party                                                                                                                                                                                                         |
| 8a  | Deltek WorkBook                                 | Agency ERP                     | Mid-size agencies; 15+ users recommended                               | Cloud                                                                            | From EUR 20 / USD 27 per user ([Capterra UK](https://www.capterra.co.uk/software/180595/workbook)); G2 shows "request a quote"                                                                                                                                                                                                              |
| 8b  | Deltek Maconomy                                 | Project ERP                    | Large agencies and consultancies, multi-country                        | Cloud or on-premise                                                              | Not public                                                                                                                                                                                                                                                                                                                                  |
| 9   | farmerswife (plus Cirkus)                       | Media facility scheduler       | Post-production, broadcast, equipment rental, agencies, education      | Cloud or on-premise (unverified)                                                 | Not public ([Software Advice](https://www.softwareadvice.com/collaboration/farmerswife-profile/)). Cirkus from EUR 35 ([Capterra](https://www.capterra.ca/software/174843/cirkus))                                                                                                                                                          |
| 10  | Xytech MediaPulse                               | Media facility mgmt            | Broadcasters, large facilities. "Dash" is the smaller-facility product | Cloud or on-premise                                                              | Not public                                                                                                                                                                                                                                                                                                                                  |
| 11  | Autodesk Flow Production Tracking (ex-ShotGrid) | Production tracker             | VFX, animation, games, post-production                                 | Cloud                                                                            | About 50 monthly or 390 per year per user (third-party, citing CG Channel: [Shade](https://shade.inc/blog/autodesk-flow-production-tracking-for-post-production)). The Autodesk page price fields did not load                                                                                                                              |
| 12  | ftrack Studio / Review / cineSync               | Production tracker plus review | VFX, animation, post-production                                        | Cloud                                                                            | Studio 25 (annual) / 30; Review 10 / 15 ([ftrack pricing via G2](https://www.g2.com/products/ftrack/pricing), [ftrack](https://www.ftrack.com/en/pricing))                                                                                                                                                                                  |
| 13  | StudioBinder                                    | Pre-production                 | Film, video and commercial producers                                   | Cloud                                                                            | Priced per account, not per user: free tier; paid tiers about 29 to 399 per month (conflicting: [SpotSaaS](https://www.spotsaas.com/product/studiobinder/pricing), [TrustRadius](https://www.trustradius.com/compare-products/studiobinder))                                                                                                |
| 14  | Yamdu                                           | Production mgmt                | Film, TV and commercial productions (Germany, founded 2012)            | Cloud (browser)                                                                  | EUR 39–179 per month ([Software Advice](https://www.softwareadvice.com/creative-management/yamdu-profile/)), or USD 35 per month for 1 project and 5 users ([Slashdot](https://slashdot.org/software/p/Yamdu))                                                                                                                              |
| 15  | Celtx                                           | Pre-production                 | Writers, video producers, education                                    | Cloud plus iOS                                                                   | About 15 per user, with conflicting tiers ([Software Advice](https://www.softwareadvice.com/project-management/celtx-profile/))                                                                                                                                                                                                             |
| 16  | Odoo                                            | General ERP (modular)          | Small and mid-size firms of any industry                               | Cloud (Odoo Online / Odoo.sh) or self-host. The Community edition is open source | Standard 24.90–31.10 (annual), Custom about 46.70–61 (annual); prices differ by country ([odoo.com/pricing via search](https://odoo.com/pricing), [ERPResearch](https://www.erpresearch.com/pricing/odoo)). Multi-company requires Custom. One App Free tier                                                                                |
| 17  | ERPNext (+ Frappe HR)                           | General ERP, open source       | Small and mid-size firms, services companies                           | Self-host (free) or Frappe Cloud                                                 | Software free. Frappe Cloud from about USD 5 per site per month; HR support from the USD 50 plan ([Frappe announcement](https://frappe.io/blog/announcements/introducing-erpnext-support-for-frappe-cloud), [ERPResearch](https://erpresearch.com/pricing/erpnext))                                                                         |

---

## 3. Capability matrix

Columns: **Est** quoting/estimates · **Job** job or project tracking · **Ppl** scheduling people · **Rm/Eq** booking rooms and equipment · **TS** timesheets · **BvA** budget vs actual · **PO** purchase orders or vendor bills · **Inv** invoicing · **Port** client portal or approvals · **CRM** pipeline · **Rpt** profitability reporting · **Leave** time off · **Pay** payroll · **POS** · **ME** multi-entity · **MC** multi-currency · **Mob** mobile app.

| Product             | Est           | Job             | Ppl        | Rm/Eq       | TS  | BvA      | PO  | Inv | Port       | CRM | Rpt | Leave | Pay                  | POS         | ME              | MC  | Mob            |
| ------------------- | ------------- | --------------- | ---------- | ----------- | --- | -------- | --- | --- | ---------- | --- | --- | ----- | -------------------- | ----------- | --------------- | --- | -------------- |
| Workamajig          | Y             | Y               | Y          | –           | ?   | ?        | Y   | Y   | Y          | ?   | ?   | –     | –                    | –           | ?               | ?   | ?              |
| Function Point      | Y             | Y               | Y          | –           | Y   | Y        | Y   | ?   | Y          | Y   | ?   | –     | –                    | –           | –               | –   | ?              |
| Scoro               | Y             | Y               | ?          | –           | Y   | Y        | Y   | Y   | ?          | ?   | ?   | P     | –                    | –           | Y               | Y   | Y              |
| Productive.io       | ?             | Y               | Y          | –           | ?   | Y        | Y   | Y   | Y          | ?   | Y   | Y     | –                    | –           | Y               | Y   | Y              |
| Accelo              | Y             | Y               | Y          | –           | Y   | ?        | ?   | Y   | Y          | Y   | ?   | –     | –                    | –           | –               | ?   | ?              |
| Streamtime          | Y             | Y               | Y          | –           | Y   | Y        | Y   | Y   | P          | –   | Y   | –     | –                    | –           | –               | –   | ?              |
| Synergist           | ?             | Y               | Y          | –           | Y   | Y        | Y   | Y   | ?          | P   | Y   | –     | –                    | –           | –               | –   | ?              |
| Deltek WorkBook     | Y             | Y               | Y          | –           | Y   | Y        | ?   | Y   | ?          | Y   | Y   | –     | –                    | –           | ?               | ?   | ?              |
| Deltek Maconomy     | ?             | Y               | Y          | –           | ?   | ?        | ?   | Y   | ?          | ?   | ?   | P     | P                    | –           | Y               | Y   | ?              |
| farmerswife         | ?             | Y               | Y          | Y           | Y   | Y        | ?   | Y   | –          | –   | Y   | –     | –                    | –           | –               | –   | Y (Cirkus)     |
| Xytech MediaPulse   | Y (bids)      | Y (work orders) | Y          | Y           | ?   | ?        | ?   | Y   | –          | –   | Y   | –     | –                    | –           | –               | –   | –              |
| Flow Prod. Tracking | P (time bids) | Y               | Y          | –           | Y   | P (time) | –   | –   | Y (review) | –   | ?   | –     | –                    | –           | –               | –   | ?              |
| ftrack              | –             | Y               | Y          | –           | ?   | –        | –   | –   | Y (review) | –   | –   | –     | –                    | –           | –               | –   | ?              |
| StudioBinder        | –             | Y               | Y (shoots) | –           | –   | –        | –   | –   | –          | –   | –   | –     | –                    | –           | –               | –   | P (mobile web) |
| Yamdu               | –             | Y               | Y (shoots) | P (props)   | –   | Y        | –   | –   | –          | –   | –   | –     | ?                    | –           | –               | –   | ?              |
| Celtx               | –             | Y               | Y (shoots) | P (catalog) | –   | Y        | –   | –   | –          | –   | Y   | –     | –                    | –           | –               | –   | Y (iOS)        |
| Odoo                | Y             | Y               | Y          | Y (Rental)  | Y   | ?        | Y   | Y   | ?          | Y   | ?   | ?     | P (SL via 3rd-party) | Y           | P (Custom plan) | ?   | ?              |
| ERPNext             | ?             | Y               | ?          | P (assets)  | Y   | ?        | ?   | Y   | ?          | ?   | ?   | Y     | Y (generic)          | Y (offline) | ?               | ?   | ?              |

Sources for the cells are in the notes below. Some cells marked "?" are very likely true for mature products (for example multi-currency in Odoo or timesheets in Workamajig), but I could not confirm them in this session.

---

## 4. Product notes

Each note follows the same order: what the product is, HR/payroll, POS, multi-entity and currency, mobile, integrations, strengths, then weaknesses for a 10–30 person Sri Lankan studio.

### 4.1 Workamajig

- **What it is:** project management and agency accounting in one platform. It covers estimates, purchase orders, vendor quote requests and bids, traffic and resource scheduling, invoicing, and a general ledger that it markets as a replacement for QuickBooks, Xero or Sage ([martech.zone](https://martech.zone/workamajig), [Workamajig blog](https://www.workamajig.com/blog/all-in-one-agency-software)).
- **Client portal:** a free portal with unlimited client contacts. Clients use it to request work, check status, approve work and download deliverables. Proofing includes annotation and version history ([Workamajig blog](https://www.workamajig.com/blog/agency-client-management-software)).
- **HR/payroll:** none found. **POS:** none. **Multi-entity and mobile:** unverified.
- **Strengths:** the deepest creative-agency financial model in this group, with estimates converted into POs and a full GL.
- **Weaknesses for AMPL:** reviewers report a learning curve and clunky scheduling ([Findstack](https://findstack.com/products/workamajig/reviews)). At about USD 40–50 per user it is costly. It is built around US agency accounting, with no Sri Lankan tax.

### 4.2 Function Point

- **What it is:** estimates, CRM and sales pipeline, briefs, schedules, timesheets, task budgets and purchase orders ([G2](https://g2.com/products/function-point/pricing), [GetApp](https://www.getapp.com/project-management-planning-software/a/function-point/), [Findstack review](https://findstack.com/products/function-point/pricing)). It also has a client portal, online proofing and QuickBooks Online/Desktop integration ([functionpoint.com](https://functionpoint.com/), [RFP.wiki](https://www.rfp.wiki/marketing/marketing-work-management-platforms/function-point-agency-software)).
- **HR/payroll and POS:** none found. **Multi-entity:** none found.
- **Strengths:** creative briefs with approval gates before work starts.
- **Weaknesses:** the highest per-user price in the group (USD 53–68). Implementation can add 30–60% (CostBench estimate). Its accounting link is QuickBooks only.

### 4.3 Scoro

- **What it is:** turns a quote into a project, task, invoice, purchase order or bill in one step, with approval workflows for quotes, invoices and POs ([ERPResearch](https://erpresearch.com/erp-add-ons/professional-services/scoro), [Scoro invoicing](https://scoro.com/features/invoicing)).
- **Multi-entity and currency:** multiple legal entities in one environment. It handles several currencies inside one project and converts them daily at the World Bank rate (vendor claim). Each entity links to its own Xero or QuickBooks organisation ([Scoro support](https://support.scoro.com/hc/en-us/articles/12791227602701)).
- **HR:** time off is a paid add-on ([Scoro support](https://support.scoro.com/hc/en-us/articles/47615498557325-Time-Off-Management-app)). It also integrates with BambooHR. No payroll.
- **Mobile:** the "Scoro Time" app on iOS and Android logs time ([Scoro support](https://support.scoro.com/hc/en-us/articles/48602491674637-Scoro-Time-mobile-app-iOS-Android-for-time-tracking-on-the-go)). The full iOS app is rated 2.7/5 ([App Store](https://apps.apple.com/app/id1159643539)).
- **WhatsApp:** only through third-party automation ([Integrately](https://integrately.com/integrations/scoro/whatsapp)).
- **Strengths:** the cleanest end-to-end quote-to-bill flow in the group, plus real multi-entity support. That matters for a possible Singapore entity.
- **Weaknesses:** the 5-seat minimum and per-seat pricing penalise freelancers who need logins. FX comes from the World Bank, not from the Central Bank of Sri Lanka (CBSL) rate. There is no Sri Lankan tax.

### 4.4 Productive.io

- **What it is:** project budgets split by phase or scope, resource planning, purchase orders with PDF templates, bills tracked against POs, and multi-currency, multi-subsidiary billing ([Productive POs](https://productive.io/budgeting/purchase-orders/), [Productive cost mgmt](https://productive.io/lp-project-cost-management-software/)). It includes a free client portal (details thin) and an iOS app ([App Store](https://apps.apple.com/app/id958607533)).
- **HR:** built-in time off with balances and per-category approvals. Approved leave flows into resource planning automatically. It integrates with BambooHR, Personio and others ([Productive](https://productive.io/time-off-management/), [blog](https://productive.io/blog/forget-multiple-hr-tools-manage-time-off-in-productive)). No payroll.
- **Integrations:** a Xero PO export appears in the app changelog. QuickBooks appears in directory listings, but its depth is unverified.
- **Strengths:** the lowest entry price of the agency tools, a modern interface, and leave linked to capacity.
- **Weaknesses:** the accounting sync is thinly documented, and there is no Sri Lankan payroll or tax.

### 4.5 Accelo

- **What it is:** quotes convert to projects in one click. It has retainers as a core object, with recurring tasks and billable time that flows to invoices. The client portal lets clients accept quotes and view invoices, and portal users are unlimited ([Accelo](https://accelo.com/post/functions-of-accelo-you-wont-find-anywhere-else), [TechRepublic](https://www.techrepublic.com/article/accelo-review/)). It syncs with QuickBooks Online and Xero, though one user reports the QuickBooks sync breaks often ([GetApp reviews](https://www.getapp.com/project-management-planning-software/a/accelo/reviews/)).
- **HR/payroll and POS:** none found.
- **Strengths:** retainers. These suit AMPL's social media marketing and SEO tracks, which are monthly retainers.
- **Weaknesses:** the price is not public, and the minimums run 5 to 10 seats.

### 4.6 Streamtime

- **What it is:** the job plan is the hub. It becomes a quote (emailed to the client for approval), then the schedule, then the invoice, with expenses rolled in ([Streamtime quoting](https://streamtime.net/features/quoting-and-invoicing), [scheduling](https://streamtime.net/features/scheduling)). A "Pulse Check" flags jobs that have invoiced less than they spent. Progress bars show time, expenses, quotes and paid invoices against budget ([Software Advice](https://www.softwareadvice.com/project-management/streamtime-profile/)). It syncs expenses, POs, invoices and credit notes to Xero ([Xero App Store](https://apps.xero.com/us/function/invoicing-jobs/app/streamtime)).
- **HR/payroll and POS:** none. **Multi-entity:** none found.
- **Strengths:** it is built for small studios and is the simplest model to copy.
- **Weaknesses:** rate cards are unverified, and it depends on Xero, which is not a common choice in Sri Lanka (unverified).

### 4.7 Synergist

- **What it is:** UK agency system covering timesheets, job costing, billing, budgeting and forecasting ([GetApp](https://www.getapp.com/industries-software/a/synergist/)). Drag-and-drop resource scheduling shows the remaining budget as a booking is made ([G2](https://www.g2.com/products/synergist/features)). Supplier invoices match against open POs per project phase ([Synergist help](https://synergistexpress.zendesk.com/hc/en-gb/articles/360010650937)). It batch-exports to Xero, with a pre-flight check, and pulls payment status back ([Xero App Store](https://apps.xero.com/uk/app/synergist)). It also links to Sage and QuickBooks Online.
- **Pricing note:** a separate cheap "timesheet user" tier (GBP 13). That suits freelancers.
- **Weaknesses:** UK-centric, with no HR, payroll or POS.

### 4.8 Deltek WorkBook and Maconomy

- **WorkBook:** a project-based ERP covering CRM, quoting, resource planning, time, accounting, budgeting and invoicing ([Capterra UK](https://www.capterra.co.uk/software/180595/deltek-workbook), [FitGap](https://us.fitgap.com/products/deltek-workbook)). A 15-user minimum is recommended. Reviewers report a steep learning curve.
- **Maconomy:** native multi-company, multi-currency and multi-language support ([Deltek](https://deltek.com/en/products/maconomy)). Its payroll is a module or an integration ([G2](https://www.g2.com/products/deltek-maconomy/features)). HR self-service and skills are covered ([Software Connect](https://softwareconnect.com/erp/deltek-maconomy)).
- **For AMPL:** the enterprise end of the market. Useful as a "ceiling" reference for multi-entity design, and far too heavy and costly to adopt.

### 4.9 farmerswife (plus Cirkus)

- **What it is:** schedules people, rooms and equipment on two linked timelines, with project tracking, budgets, time reports and invoicing in one system. It is aimed at production, post-production, broadcast, equipment rental and agencies ([farmerswife](https://www.farmerswife.com/), [Software Advice](https://www.softwareadvice.com/collaboration/farmerswife-profile/)). Cirkus is the companion task and collaboration app on web, iOS and Android ([App Store](https://apps.apple.com/us/app/cirkus-schedule-your-tasks/id1157319715)).
- **Strengths:** the closest match to AMPL's studio side (the Colombo 05 photo studio, recording and dubbing rooms, cameras), where a booking turns into a bill.
- **Weaknesses:** price not public, a dated interface (unverified), and no HR, payroll or POS.

### 4.10 Xytech MediaPulse

- **What it is:** schedules people, equipment, stages, edit bays and trucks. It handles crewing with labour-contract rules, work orders, bidding, and billing, where scheduled events turn into invoices ([NAB Amplify](https://amplify.nabshow.com/?p=25690), [TV Technology: Kre8](https://tvtechnology.com/the-wire-blog/xytech-kre8), [WGBH case](https://www.tvtechnology.com/the-wire-blog/xytech-wgbh)). At WGBH, creative requests become work orders automatically. "Dash" is a cloud product for smaller facilities ([NextTV](https://www.nexttv.com/post-type-the-wire/xytech-launches-dash-facilities-management-solution-any-size-media-and-broadcast-company-172146)).
- **For AMPL:** the broadcaster-grade reference for Varnam TV / Varna TV-style channel operations. It is enterprise-priced (not public).

### 4.11 Autodesk Flow Production Tracking (ShotGrid)

- **What it is:** tracks tasks, shots and assets. Bids sit on tasks, and time logs compare against them ("Time Logged – % of Bid", "Over/Under Bid") ([Autodesk help](https://help.autodesk.com/cloudhelp/ENU/SG-Producer/files/pr-scheduling-tasks/SG_Producer_pr_scheduling_tasks_pr_tracking_bids_html.html)). It has AI "generative scheduling" and RV review with annotations ([Autodesk](https://www.autodesk.com/products/flow-production-tracking/overview.html)).
- **Gaps:** no invoicing, POs, HR or POS.
- **For AMPL:** the reference for a per-deliverable pipeline (concept, then AI generation, then edit, then grade, then publish) at 12 to 15 videos a month. It is over-built for a 20-person studio, and reviewers note weak Gantt views.

### 4.12 ftrack

- **What it is:** a production tracker (Studio) plus a cheaper Review tier, with cineSync for synchronised review ([ftrack pricing](https://www.ftrack.com/en/pricing), [Backlight](https://backlight.co/blog/real-time-synchronized-media-review-is-now-available-in-ftrack)). Studio and Review cannot share one workspace ([Morphic](https://morphic.com/resources/alternatives/ftrack-alternatives)).
- **For AMPL:** a cheaper ShotGrid-style tracker. It has no finance. Review/approval belongs to R4.

### 4.13 StudioBinder

- **What it is:** call sheets (confirmable on mobile), shot lists, storyboards, script breakdown, contacts and shoot scheduling, with locations and weather ([StudioBinder](https://www.studiobinder.com/film-production-software)). No budgeting module was found.
- **For AMPL:** the pattern for shoot-day logistics (call sheets for talent and crew) on ads and music-video shoots. It has no money side.

### 4.14 Yamdu

- **What it is:** script breakdown as the backbone, feeding the shooting schedule and budget ("Dynamic Globals") ([yamdu.com](https://yamdu.com/), [Yamdu blog](https://yamdu.com/en/blog/collaborative-script-break-down-sheet/)). It covers crew management and call sheets ([SourceForge](https://sourceforge.net/software/product/Yamdu)). Directories list "payroll", which is unverified. A MovieLabs case study covers its cloud pre-production ([MovieLabs](https://movielabs.com/case_study/transforming-pre-production-in-the-cloud/)).
- **For AMPL:** shows the single-source-of-truth pattern for productions.

### 4.15 Celtx

- **What it is:** a scheduler tied to the breakdown, auto-generated call sheets, and a budget on the AICP template with forecast against actual cost reports ([Celtx production](https://www.celtx.com/product/production/), [Celtx budget](https://celtx.com/product/production/budget)). It has an iOS app.
- **For AMPL:** the AICP budget template (the Association of Independent Commercial Producers standard) is the industry norm for ad production estimates. Worth offering as a template for AMPL's ad quotes.

### 4.16 Odoo

- **What it is:** separate apps for CRM, Sales (quotations), Project, Timesheets, Planning (shift and resource scheduling), Rental (online booking, padding time between rentals, signature at pickup, order to invoice), Field Service, Purchase, Accounting, POS and Payroll ([Odoo Rental](https://odoo.com/app/rental), [Odoo Field Service](https://odoo.com/app/field-service)).
- **Pricing:** Standard includes all apps on Odoo Online. Multi-company forces the Custom plan ([odoo.com/pricing](https://odoo.com/pricing)). Price lists vary by country, with Middle East Standard reported from USD 8.95 ([ERPResearch](https://www.erpresearch.com/pricing/odoo)). I found no Sri Lankan price list.
- **Sri Lanka:**
  - Payroll: a third-party module, `l10n_lk_payroll` by Pokutsoft (USD 79, Odoo 18/19), computes APIT, EPF 8%/12% and ETF 3%, and produces the EPF schedule ([Odoo Apps](https://apps.odoo.com/apps/modules/19.0/l10n_lk_payroll)).
  - Tax: there is an SVAT-repeal pack (USD 69) ([Odoo Apps](https://apps.odoo.com/apps/modules/19.0/l10n_lk_svat_transition)) and a module that prints the IRD VAT invoice ([Odoo Apps](https://apps.odoo.com/apps/modules/18.0/l10n_lk_fiscal_invoice_print)).
  - Partners: local Odoo partners exist, for example [Allion Technologies](https://www.odoo.com/partners/allion-technologies-pvt-ltd-1188026) and [Subtle Technologies](https://www.odoo.com/pl_PL/partners/subtle-technologies-pvt-ltd-5919592).
  - None of these modules has been audited, and the vendors themselves tell buyers to check against IRD guidance.
- **Strengths:** the only product found that covers agency flow, rental and booking, POS and payroll in one database, with Sri Lankan add-ons.
- **Weaknesses:**
  - It is generic: no proofing, no media pipeline, and no freelancer-payment voucher flow like PLAN.md section 5.
  - Customising it needs Odoo Studio (Custom plan) or partner development.
  - Implementation costs often exceed the licence ([Octura](https://octurasolutions.com/resources/the-honest-cost-of-odoo-in-2026-why-the-license-is-only-20-percent-of-the-budget)).

### 4.17 ERPNext (+ Frappe HR)

- **What it is:** projects with timesheets that bill customers on a time-and-materials basis, plus cost and billing rates per activity type ([Frappe docs](https://docs.frappe.io/erpnext/user/manual/en/projects-introduction), [Frappe](https://frappe.io/erpnext/open-source-project-management-software)). It has asset depreciation, POS with online and offline modes (since v7), and HRMS with payroll ([Wikipedia](https://en.wikipedia.org/wiki/ERPNext)).
- **Sri Lanka:** no EPF/ETF/APIT localisation or Sri Lankan partner was found.
- **Strengths:** free software, unlimited users, cheap hosting, and offline POS.
- **Weaknesses:** no creative or media features. Sri Lankan statutory payroll would need custom work. Its UX is general-purpose.

### 4.18 Regional and niche finds (Sri Lanka, South and South-East Asia)

- **Sri Lanka:** I found no Sri Lankan product built for studios or agencies.
  - The nearest are general ERPs and software houses: Ants Creation's "Vero ERP" (finance, inventory, procurement, production) ([ants.lk](https://ants.lk/)), and Futura Tech Labs, formerly Microimage, which builds broadcast software ([Wikipedia](https://en.wikipedia.org/wiki/Microimage)).
  - Bellvantage is listed as an ERP consultancy ([EDB directory](https://www.srilankabusiness.com/exporters-directory/ict-outsourcing-service-exporters-in-sri-lanka/digital-marketing-companies/)).
  - Sri Lankan HR and payroll vendors (MiHCM, GalleryHR) are covered by R2.
- **India and South-East Asia:**
  - [Mediawork](https://www.capterra.com.sg/software/1111960/Mediawork) is a CRM/ERP for media-production vendors, including post-production houses and agencies (details thin).
  - [StudioDock](https://www.capterra.com.sg/software/1094872/StudioDock) does studio booking, with room, shared-gear and staff availability linked to each booking.
  - [freispace](https://freispace.com/en-us/pricing) is a post-production scheduler. It is priced per facility, not per user, from about EUR 349 / USD 399 a month with unlimited users, and offers live budget drawdown.
  - Regional demand signal: Malaysian video producer JAP Media moved from WhatsApp coordination to a central operations platform (Rework) to scale ([Rework case study](https://resources.rework.com/es/customers/case-studies/jap-media)). That is the same move AMPL is making.
- **AI music-video pipelines at volume:**
  - Generation tools such as Freebeat market agent-based "song to beat-synced video in about 5 minutes" output for agencies and labels (vendor claim) ([Freebeat](https://freebeat.ai/music-video-production/agency-studio-workflows)).
  - One vendor guide argues that the hard part is now managing AI outputs as deliverables with an owner, version history and status ([Kreatli guide](https://kreatli-review-tool-front-e0w1yu8to-employee-management.vercel.app/guides/ai-video-creation), vendor content).
  - **I found no independent case study and no product that combines AI-pipeline tracking with costing, freelancer payment and invoicing.**

---

## 5. Feature frequency: table stakes vs differentiators

Counts are out of the 18 rows in section 3 (WorkBook and Maconomy counted separately). A count includes Y and P. The number in brackets also includes "?" cells, as an upper bound.

| Capability                                               | Count (Y+P) [with ?]   | Tier                                       | Note for ChordusAM                                                                            |
| -------------------------------------------------------- | ---------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Job/project tracking                                     | 18                     | **Table stakes**                           | Must have. PLAN.md has only "light" projects today (section 6.4)                              |
| Scheduling people                                        | 16 [18]                | **Table stakes**                           | Must have; link it to leave (PLAN.md 4.3 already models leave)                                |
| Invoicing                                                | 12 [13]                | **Table stakes** for agency tools          | PLAN.md Q12 asks whether invoices are generated or only recorded. The market says generated   |
| Budget vs actual per job                                 | 10 [16]                | **Table stakes**                           | PLAN.md 6.3 has project profitability; extend it to estimate vs actual                        |
| Timesheets / time logs                                   | 10 [15]                | **Table stakes**                           | Not in PLAN.md. Needed for staff cost per job                                                 |
| Quoting/estimates                                        | 9 [14]                 | **Common** (table stakes for agency tools) | Missing from PLAN.md                                                                          |
| POs / vendor bills                                       | 7 [13]                 | **Common**                                 | PLAN.md vendor payment requests (section 5) partly cover this; there is no PO before the bill |
| CRM / pipeline                                           | 5 [10]                 | **Common**                                 | Missing from PLAN.md                                                                          |
| Profitability reporting                                  | 7 [15]                 | **Common**                                 | Partly in PLAN.md 6.3                                                                         |
| Client portal / approvals                                | 7 [13]                 | **Common**                                 | Missing; R4 covers review depth                                                               |
| Multi-currency                                           | 3 [8]                  | **Common** in the upper tier               | PLAN.md stores currency and fx_rate on entries (section 9). Good                              |
| Multi-entity                                             | 4 [7]                  | **Rare**                                   | Design for it (Singapore)                                                                     |
| Rooms/equipment booking                                  | 6 (3 Y + 3 P)          | **Rare: differentiator**                   | Core to AMPL's studio. Only farmerswife, Xytech and Odoo do it well                           |
| Leave / time off                                         | 4 [5]                  | **Rare** in this category                  | ChordusAM already plans it (PLAN.md 4.3)                                                      |
| Payroll                                                  | 3 (1 Y + 2 P) [4]      | **Rare: differentiator**                   | Only general ERPs; Sri Lanka only via a third-party Odoo module                               |
| POS                                                      | 2                      | **Rare: differentiator**                   | Only Odoo and ERPNext                                                                         |
| Native WhatsApp                                          | 0                      | **Absent**                                 | Only via Zapier-style connectors                                                              |
| Native Sri Lankan statutory (EPF/ETF/APIT, VAT/SSCL/WHT) | 0 (Odoo P via add-ons) | **Absent**                                 | Clear USP                                                                                     |
| Fingerprint attendance import                            | 0 found                | **Absent** in this category                | ChordusAM already plans it (PLAN.md section 7)                                                |

**Reading the table:**

- The agency tools (rows 1–8) all share the money chain: estimate, job, time, invoice, budget against actual. That chain is the minimum for ChordusAM to count as an agency ERP.
- Media facility tools add room and equipment booking.
- Only general ERPs add payroll and POS.
- No single vertical tool covers agency, studio booking, HRIS and POS together, which is the combination the owner asked for.

---

## 6. Patterns worth copying

| #   | Pattern                                                                                                              | Seen in                                                                      | How it applies to AMPL                                                                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | **One-step conversion chain: quote, then job, then PO/bill, then invoice.** Each document keeps a link to its parent | Scoro, Accelo, Streamtime                                                    | An accepted music-video quote creates the job. Vendor payment requests (PLAN.md section 5) attach to the job's estimate lines, and the invoice pulls the approved quote          |
| P2  | **The job plan is the single source of truth.** It feeds the quote, the schedule and the invoice                     | Streamtime; Yamdu (the breakdown as backbone)                                | One "production" record per music video drives the people booking, studio booking, freelancer POs and the client invoice                                                         |
| P3  | **Bid vs actual per task**, shown as a percentage of the bid                                                         | Flow Production Tracking                                                     | Standard stages per music video (song, AI generation, edit, grade, publish), each with budgeted hours and cost compared to actual. That shows margin across 12–15 videos a month |
| P4  | **Budget-aware booking.** Show the remaining budget while booking a person or room                                   | Synergist; freispace ("live budget drawdown")                                | Stops over-servicing on fixed-price productions                                                                                                                                  |
| P5  | **People and rooms/equipment on linked timelines; a booking becomes a bill**                                         | farmerswife; Xytech ("scheduled events processed into invoices")             | The photo studio, recording and dubbing rooms and cameras are booked against jobs (internal cost) or outside clients (revenue, linked to R3's POS)                               |
| P6  | **Rate per activity or role** (cost rate and bill rate)                                                              | ERPNext (activity cost); agency tools generally (unverified)                 | A rate card for staff roles and freelancer types (vocalist, AI artist, editor), kept as data editable in the UI, per the CLAUDE.md rule on policy                                |
| P7  | **"Pulse check" alerts:** jobs that invoiced less than they spent                                                    | Streamtime                                                                   | A weekly alert to the Admins and Finance (Janaka)                                                                                                                                |
| P8  | **Request intake becomes a work order**                                                                              | Xytech at WGBH; Workamajig client portal requests                            | Brands and channels (Varnam TV, The Studio LK) submit requests through a form, which becomes a job                                                                               |
| P9  | **Free client portal with unlimited client users**; approve quotes and deliverables                                  | Workamajig, Accelo                                                           | Client approval of quotes and cuts. Per-seat pricing for clients is a known pain point                                                                                           |
| P10 | **Approved leave blocks capacity automatically**                                                                     | Productive.io                                                                | Connects PLAN.md leave (4.3) to resource scheduling                                                                                                                              |
| P11 | **Retainers** as a billing object, with recurring tasks and a monthly invoice                                        | Accelo                                                                       | AMPL's social media marketing and SEO tracks                                                                                                                                     |
| P12 | **Accounting export in batches, with a pre-flight check** and payment status pulled back                             | Synergist to Xero                                                            | If AMPL's accountant uses a ledger package, export rather than replace (ties to PLAN.md "management ledger")                                                                     |
| P13 | **Cheap or zero-cost "light" users** (timesheet-only, or flat per-facility pricing)                                  | Synergist (GBP 13 timesheet user); freispace (per facility, unlimited users) | Freelancers need limited logins. Price the possible SaaS per studio, not per seat                                                                                                |
| P14 | **Call sheets generated from the schedule**, confirmable on mobile                                                   | StudioBinder, Celtx                                                          | Shoot days for ads and music videos: talent, location and call time sent to phones (ideally over WhatsApp)                                                                       |
| P15 | **Industry budget template** (AICP)                                                                                  | Celtx                                                                        | An optional estimate template for ad productions                                                                                                                                 |
| P16 | **Offline-capable POS**                                                                                              | ERPNext                                                                      | Matches the brief's "internet can drop" constraint (R3 to detail)                                                                                                                |

---

## 7. What none of them do well for AMPL

1. **Sri Lankan statutory rules.** No agency or media tool handles EPF (8%/12%), ETF (3%), APIT, VAT/SSCL, withholding tax or stamp duty. Odoo comes closest, but only through unaudited third-party modules ([l10n_lk_payroll](https://apps.odoo.com/apps/modules/19.0/l10n_lk_payroll), [SVAT pack](https://apps.odoo.com/apps/modules/19.0/l10n_lk_svat_transition)). Withholding tax on freelancer payments, and self-billed vouchers (PLAN.md Q10), appear nowhere.
2. **LKR as the base currency with official FX.** The multi-currency tools (Scoro, Productive, Maconomy) convert from a generic feed; Scoro uses the World Bank daily rate. None was found using CBSL rates. None handles AMPL's pattern of LKR revenue against USD AI-tool and GPU costs (Higgsfield, Suno, Claude, ClickUp).
3. **Freelancer-heavy cost model.** These tools price per seat and assume employees log time. AMPL's cost is mostly external talent paid per deliverable: vocalists, musicians, AI artists, editors. None models "freelancer + deliverable + voucher + bank transfer + WHT" as the main cost line. PLAN.md section 5 already does the voucher half of this.
4. **AI-hybrid music videos at volume.** No product treats AI tool usage (credits, GPU hours, subscriptions) as a job cost, or tracks a templated 12–15-per-month pipeline with standard AI stages. None combines that with finance. Generation tools such as Freebeat stop at the video; trackers such as ShotGrid and ftrack stop before the money.
5. **Fingerprint attendance import.** None found in this category. ChordusAM's planned importer (PLAN.md section 7) is already ahead of them.
6. **WhatsApp-first communication.** No native WhatsApp anywhere, only Zapier-style connectors (for example [Integrately for Scoro](https://integrately.com/integrations/scoro/whatsapp)). Approvals, call sheets and payslip notices over WhatsApp would set ChordusAM apart.
7. **Mobile and poor connectivity.** Mobile apps are mostly for time logging (Scoro Time) or are thin (Scoro iOS rated 2.7/5). None was found that is designed for flaky connections, apart from ERPNext POS.
8. **Multi-brand under one company, plus channel revenue.** The tools model clients and legal entities. They do not model in-house brands or channels (The Studio LK, Varnam TV) as profit centres, and none tracks YouTube or channel revenue. R4 covers channel revenue.
9. **Cost for a 20-person team.** Agency suites cost about USD 26–68 per user per month (section 2). For 20 users that is about USD 520–1,360 a month before implementation, and minimums of 5 to 15 seats apply. CFO (`docs/discovery/14-business-case.md`) should compare this with build cost.

---

## 8. Recommended comparators for the benchmark

For `docs/discovery/12-benchmark-usp.md`, I recommend these **7**:

| #   | Comparator              | Why it belongs in the benchmark                                                                                                                  |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Scoro**               | The best all-in-one agency reference: quote-to-bill chain, multi-entity, multi-currency. Sets the bar for the Singapore scenario                 |
| 2   | **Productive.io**       | Modern, cheapest agency suite; POs and bills, leave linked to resource planning. The likely "buy instead" alternative for agencies               |
| 3   | **Workamajig**          | The deepest creative-agency finance (estimates to POs, GL, proofing, free client portal)                                                         |
| 4   | **Streamtime**          | Small-studio simplicity; job plan as the hub; Pulse Check. Closest in size and style to AMPL                                                     |
| 5   | **farmerswife**         | The media-facility reference for booking people, rooms and equipment and billing from bookings. Covers AMPL's studio side                        |
| 6   | **Odoo**                | The realistic buy option: one database for CRM, rental, POS and payroll, with Sri Lankan add-ons and local partners. The main build-vs-buy rival |
| 7   | **ERPNext / Frappe HR** | The open-source option: offline POS, payroll, near-zero licence cost. The cost floor for the business case                                       |

**Optional 8th:** Autodesk Flow Production Tracking (or the cheaper ftrack), as the reference for per-stage bid against actual in the music-video pipeline. Use StudioBinder only for the shoot-day call-sheet pattern. R4 benchmarks review and approval tools.

---

## 9. Open questions

1. Are the studio rooms and equipment rented to **outside** clients (revenue that needs POS and booking), or only used for AMPL's own jobs? This decides how much of farmerswife/Odoo Rental to copy (R3 overlap).
2. How many freelancers would need a login (timesheets, call sheets, uploads), and how many are paid without a login? This shapes the pricing pattern P13 and the access matrix in `docs/phase-0.md`.
3. Does Media Digital SG exist as a separate legal entity today? If so, multi-entity support (Scoro- or Maconomy-style) moves from "design for" to "MVP".
4. Does AMPL's accountant already use a ledger package (for example QuickBooks, Xero or a local package)? That decides export vs replace (pattern P12).
5. Are the SMM and SEO tracks billed as monthly retainers? If so, the retainer object (P11) should be in the MVP.
6. **Verification gap:** vendor websites were blocked for direct fetch in this session. If exact prices matter for the business case, allowlist the vendor domains and re-check the "(third-party)" and "?" cells.
