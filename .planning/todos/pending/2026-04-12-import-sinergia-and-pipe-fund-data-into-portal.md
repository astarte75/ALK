---
created: 2026-04-12T10:59:23.302Z
title: Import Sinergia Venture Fund and Fondo PIPE into investor portal
area: database
files:
  - scripts/import-fund-data.ts
  - scripts/generate-fund-templates.ts
  - fund-data/sinergia-venture-fund-template.xlsx
  - fund-data/fondo-pipe-template.xlsx
---

## Problem

Sinergia Venture Fund and Fondo PIPE currently exist only in Contentful (editorial content on
public site). They are **not** yet in Supabase, so they have no presence in the investor portal —
no positions, no capital calls, no NAV history, no holdings.

Both funds are older vintages already deployed. We need to recover historical data (investor
anagrafica, capital calls, distributions, quarterly NAV, portfolio holdings) before they can
appear in the portal.

Currently in Supabase: only `amarone` (2023) and `alkemia-food-excellence-i` (2025).

## Solution

1. Recover historical data from legacy Alkemia reports / accounting system for both funds.
2. Compile the Excel templates in `./fund-data/`:
   - `sinergia-venture-fund-template.xlsx`
   - `fondo-pipe-template.xlsx`
3. Rename the compiled files removing `-template` (e.g. `sinergia-venture-fund-dati.xlsx`).
4. Extend `scripts/import-fund-data.ts` — the current `FUND_CONFIGS` array is hardcoded for
   Amarone and AFEX using a different Excel format (internal accounting reports). Either:
   - Add the new funds to `FUND_CONFIGS` with the internal report format, OR
   - Write a new importer that reads the simpler template format in `./fund-data/`.
5. Run dry-run, verify, import for real.
6. Confirm portal UI works: login as admin test user, impersonate an investor,
   verify NAV chart, capital calls table, and positions dashboard render correctly.

Contentful slugs already align: `sinergia-venture-fund`, `fondo-pipe`.

Reference README in `./fund-data/README.md` has the full workflow and sheet structure.
