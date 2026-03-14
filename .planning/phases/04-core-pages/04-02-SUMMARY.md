---
phase: 04-core-pages
plan: 02
subsystem: portfolio
tags: [portfolio, filters, grid, detail-pages, contentful]
dependency_graph:
  requires: [contentful-fetchers, types, i18n, styled-components]
  provides: [portfolio-page, portfolio-detail, filter-pills, portfolio-card]
  affects: [navigation, sitemap]
tech_stack:
  added: []
  patterns: [dual-axis-filtering, generateStaticParams-both-locales, css-hover-effects]
key_files:
  created:
    - src/components/filters/FilterPills.tsx
    - src/components/cards/PortfolioCard.tsx
    - src/app/[locale]/portfolio/page.tsx
    - src/app/[locale]/portfolio/PortfolioGrid.tsx
    - src/app/[locale]/portfolio/[slug]/page.tsx
  modified:
    - src/messages/it.json
    - src/messages/en.json
decisions:
  - "Used useState for filters (not useSearchParams) to preserve SSG compatibility"
  - "Sector counts update dynamically when area filter changes, with sector reset to 'all'"
  - "Logo fallback uses company initial in colored circle when Contentful asset missing"
  - "Rich text description rendered via renderRichText client component"
metrics:
  duration: "~3 minutes"
  completed: "2026-03-14"
---

# Phase 4 Plan 2: Portfolio Pages Summary

Portfolio grid with dual-axis filtering (area + sector) and 36 static detail pages across both locales.

## What Was Built

### FilterPills Component (`src/components/filters/FilterPills.tsx`)
Reusable pill filter component with `role="group"`, `aria-pressed`, and support for optional counts. Styled with transient `$active` prop for styled-components. Will be reused in Team and News pages.

### PortfolioCard Component (`src/components/cards/PortfolioCard.tsx`)
Rich card showing logo (with fallback), company name, sector, short description (2-line clamp), year, and investment type badge (PE=teal, VC=gold, PIPE=border). CSS hover with `translateY(-4px)`, box-shadow increase, and logo `scale(1.03)`.

### Portfolio Grid Page (`src/app/[locale]/portfolio/`)
Server Component fetches all companies via `getPortfolioCompanies(locale)`. Client Component `PortfolioGrid` manages two filter states:
- **Area filter**: All / Private Equity / Venture Capital / PIPE
- **Sector filter**: Dynamically built from filtered companies with live counts
When area changes, sector resets to "all" to avoid empty results. Grid is responsive: 1col / 2col / 3col.

### Portfolio Detail Pages (`src/app/[locale]/portfolio/[slug]/`)
`generateStaticParams` produces 36 paths (18 companies x 2 locales). Layout: back link, logo, company name, metadata row, 2/3 content + 1/3 sidebar on desktop. Sidebar shows website link, sector, investment type, year, and fund reference.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 84b2328 | Portfolio grid page with filters and cards |
| 2 | 39632b8 | Portfolio detail pages with generateStaticParams |

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- `npx tsc --noEmit`: PASSED (zero errors)
- `npm run build`: PASSED (41 static pages generated including 36 portfolio detail paths)
- All 18 companies rendered in grid
- Both IT and EN locales generate static paths
