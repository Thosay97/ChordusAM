# lib/rules

Pure business rule functions (PLAN.md section 4.1): plain data in, plain data out, no database or network access. Every function here has unit tests next to it (`*.test.ts`). First functions arrive in Phase 1 to 4: `accrueLeave()`, `computeAbsence()`, `checkOfficeDays()`, `computePayroll()`.
