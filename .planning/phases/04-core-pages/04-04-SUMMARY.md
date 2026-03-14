---
phase: 04-core-pages
plan: 04
subsystem: content-pages
tags: [investment-platforms, societa, governance, esg, culture, i18n]
dependency_graph:
  requires: [contentful-fetchers, rich-text-renderer, stats-section, theme-tokens]
  provides: [investment-platforms-pages, societa-page, governance-page, esg-page, culture-page, page-sections-component, pdf-download-component, fund-card-component]
  affects: [navigation, site-build]
tech_stack:
  added: []
  patterns: [server-components, page-sections-json, pdf-downloads, fund-metrics-cards, board-photo-cards, compact-governance-lists]
key_files:
  created:
    - src/app/[locale]/investment-platforms/page.tsx
    - src/app/[locale]/investment-platforms/[slug]/page.tsx
    - src/components/cards/FundCard.tsx
    - src/components/content/PageSections.tsx
    - src/components/content/PdfDownloadList.tsx
    - src/app/[locale]/societa/page.tsx
    - src/app/[locale]/corporate-governance/page.tsx
    - src/app/[locale]/sostenibilita/page.tsx
    - src/app/[locale]/culture/page.tsx
  modified:
    - src/messages/it.json
    - src/messages/en.json
decisions:
  - PageSections renders flexible JSON with timeline, list, and fallback modes
  - Governance page visually differentiates CdA (photo cards) from Collegio/Funzioni (compact bordered lists)
  - All pages have graceful fallback rendering when Contentful content is missing
metrics:
  duration: ~4 min
  completed: 2026-03-14
---

# Phase 4 Plan 04: Content Pages Summary

Investment platforms (overview + detail with fund cards), societa with history/sections/stats, governance with board photos and compact lists, ESG with PDF downloads, and culture with values/photos -- all rendering from Contentful with full IT/EN i18n.

## Task Results

### Task 1: Investment Platforms pages and shared components
- **Commit:** 2227c89
- **Created:** FundCard (metrics grid), PageSections (flexible JSON renderer), PdfDownloadList (download links with PDF icon)
- **Created:** Investment platforms overview page (3-col grid), detail page with generateStaticParams and fund filtering by platformRef
- **i18n:** Added investmentPlatforms namespace to both locales

### Task 2: Societa, Governance, ESG, and Culture pages
- **Commit:** 171ad71
- **Created:** Societa page with body, sections, StatsSection reuse
- **Created:** Corporate Governance page with CdA photo grid, Collegio Sindacale/Funzioni di Controllo compact lists, shareholder body
- **Created:** Sostenibilita page with ESG body, sections, PDF download section
- **Created:** Culture page with values cards grid and photo masonry layout
- **i18n:** Added governance, sustainability, about, culture namespaces to both locales

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- `npx tsc --noEmit`: PASSED (zero errors)
- `npm run build`: PASSED (all pages generated, including investment-platforms/[slug] with 3 platform paths x 2 locales)
- All new pages visible in build output: societa, sostenibilita, corporate-governance, culture, investment-platforms, investment-platforms/[slug]
