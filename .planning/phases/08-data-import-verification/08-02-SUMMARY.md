---
phase: "08"
plan: "02"
subsystem: data-import
tags: [import, excel, supabase]
metrics:
  completed: "2026-03-15"
  tasks_completed: 7
  tasks_total: 7
---

# Phase 8 Plan 2: Import Script — Summary

Built and executed the fund data import script from Excel reports.

## What Was Done
- Created `scripts/import-fund-data.ts` — reads AMARONE_Report.xlsx and AFEX_Report.xlsx
- Extracts: fund metadata, IRR, investors, positions, capital calls, NAV history (pro-rata), portfolio holdings
- Investor deduplication across funds (uppercase name matching)
- Call type mapping: richiamo → capital_call, management fee, setup_cost, expense, distribution
- Batch inserts (50-100 per batch) for performance
- --dry-run mode for preview
- Cleans test data before import (deletes all non-placeholder records)
- Successfully imported: 2 funds, 40+ investors, 41 positions, 219 capital calls, NAV history, holdings

## Data Summary
| Fund | Investors | Committed | NAV | Calls | Holdings |
|------|-----------|-----------|-----|-------|----------|
| Amarone | 14 | €20,985,000 | €17,249,670 | 93 | 3 |
| AFEX | 27 | €15,500,000 | €14,600,000 | 126 | 6 |

## Commits
| Hash | Message |
|------|---------|
| d963159 | feat(portal): import script for real fund data from Excel reports |
