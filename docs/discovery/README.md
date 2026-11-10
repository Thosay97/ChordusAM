# ChordusAM discovery pack

This is the discovery work for turning ChordusAM into a **Media and Studio ERP with POS and HRIS** for Alliance Media (AMPL). A team of role agents produced it between 9 and 10 November 2026. It sits beside the existing project brief (`docs/PLAN.md`) and the Phase 0 code, and changes neither.

## Read in this order

| #   | Document                                               | Role                    | What it answers                                                                   |
| --- | ------------------------------------------------------ | ----------------------- | --------------------------------------------------------------------------------- |
| 0   | [00-brief.md](00-brief.md)                             | Lead                    | The ask, company context, rules, requirement ID scheme                            |
| 1   | [10-brd.md](10-brd.md)                                 | Business Analyst        | Business requirements: 222 BRs, 84 NFRs, 71 business rules, 54 open questions     |
| 2   | [11-gap-analysis.md](11-gap-analysis.md)               | Business Analyst        | Gaps: today vs to-be, PLAN.md vs BRD, market vs ChordusAM                         |
| 3   | [12-benchmark-usp.md](12-benchmark-usp.md)             | Product Marketing       | Weighted benchmark of 10 comparators, positioning, USPs, adoption plan            |
| 4   | [21-mvp-roadmap.md](21-mvp-roadmap.md)                 | Product Owner           | MVP scope (133 BRs), releases, epics, user stories, owner decisions with defaults |
| 5   | [20-solution-design.md](20-solution-design.md)         | Solution Architect      | Architecture decisions, modules, domain model, flows, integrations, scaling path  |
| 6   | [22a-foundation-spike.md](22a-foundation-spike.md)     | Developer               | Measured proof of the riskiest foundation decisions on real Postgres              |
| 7   | [22-delivery-plan.md](22-delivery-plan.md)             | Tech Lead               | Work breakdown, estimates, team, conventions, timeline                            |
| 8   | [13-ux-design.md](13-ux-design.md)                     | Product Designer        | Personas, information architecture, journeys, MVP screens, wireframes             |
| 9   | [14-business-case.md](14-business-case.md)             | CFO                     | Buy vs build vs hybrid, 3-year TCO, benefits, payback, finance controls           |
| 10  | [15-compliance-security.md](15-compliance-security.md) | Compliance and Security | Regulatory register, PDPA, threat model, controls, Phase 0 security review        |
| 11  | [23-test-strategy.md](23-test-strategy.md)             | QA Lead                 | Test pyramid, traceability to Must BRs, UAT and payroll parallel run              |
| 12  | [24-devops-plan.md](24-devops-plan.md)                 | DevOps                  | Environments, CI/CD, region, backups and DR, observability, running cost          |
| 13  | [30-review-log.md](30-review-log.md)                   | Reviewer                | Cross-document review: conflicts found and how they were resolved                 |

## Research (sources for everything above)

| File                                                                           | Scope                                                                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| [research/R1-media-production-erp.md](research/R1-media-production-erp.md)     | 17 agency, media and production ERPs (Scoro, Productive, Workamajig, Streamtime, farmerswife, Xytech, Odoo, ERPNext and others) |
| [research/R2-hris-payroll-sri-lanka.md](research/R2-hris-payroll-sri-lanka.md) | Global and Sri Lankan HRIS and payroll; EPF, ETF, APIT, gratuity, Shop and Office Act, PDPA; attendance devices                 |
| [research/R3-pos-booking-finance.md](research/R3-pos-booking-finance.md)       | POS, studio and gear booking, studio CRMs, accounting packages, Sri Lankan payments and 2026 tax                                |
| [research/R4-creative-ops-rights.md](research/R4-creative-ops-rights.md)       | Review and approval, DAM, rights and royalties, AI-hybrid production costs, WhatsApp, retainers                                 |

## Status and caveats

- These are **drafts for owner review** (version 0.1). Nothing in them is approved until the owner decides the open questions in `21-mvp-roadmap.md` section 8.2.
- Several vendor and government sites could not be fetched directly. Facts taken from search results are marked "(unverified)" where they could not be confirmed. Tax rates and statutory values must be confirmed by AMPL's accountant before they go into code.
- Dates, costs and estimates are planning figures, not commitments.
