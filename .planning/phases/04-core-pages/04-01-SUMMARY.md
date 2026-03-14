---
phase: 04-core-pages
plan: 01
subsystem: homepage
tags: [homepage, hero, stats, news, newsletter, i18n]
dependency_graph:
  requires: [contentful-fetchers, theme-tokens, i18n-setup, layout-shell]
  provides: [homepage-sections, news-card-component, stats-section-component]
  affects: [page.tsx, messages/it.json, messages/en.json]
tech_stack:
  added: []
  patterns: [server-component-data-fetching, styled-components-sections, next-image-hero]
key_files:
  created:
    - src/components/sections/HeroSection.tsx
    - src/components/sections/StatsSection.tsx
    - src/components/sections/NewsletterStrip.tsx
    - src/components/sections/NewsPreview.tsx
    - src/components/cards/NewsCard.tsx
  modified:
    - src/app/[locale]/page.tsx
    - src/messages/it.json
    - src/messages/en.json
decisions:
  - "HeroSection uses 'use client' for useTranslations; image served as next/image with fill+priority"
  - "StatsSection hardcodes values with data-stat-value attributes for Phase 5 GSAP counters"
  - "NewsPreview is a Server Component using getTranslations from next-intl/server"
  - "NewsCard uses next-intl Link for locale-aware routing to /news/[slug]"
metrics:
  duration: "2m 12s"
  completed: "2026-03-14"
  tasks_completed: 2
  tasks_total: 2
---

# Phase 4 Plan 01: Homepage Sections Summary

Full homepage with hero poster image, 4 Alkemia stats, latest 3 Contentful news cards, and newsletter signup strip — all i18n-ready for IT/EN.

## What Was Built

### HeroSection
Full-viewport hero with `/images/hero-poster.jpg` background, dark gradient overlay, white Alkemia logo, headline ("Passione per l'impresa" / "A Passion for Enterprise"), gold accent divider, and subtitle. Uses `next/image` with `fill` and `priority` for LCP optimization.

### StatsSection
4-column grid (2-col on mobile) showing Alkemia key figures: ~20 years experience, EUR270M AUM, 29 deals, 18 portfolio companies. Each stat has `data-stat-value` attribute ready for Phase 5 GSAP counter animations. Dark surface background.

### NewsPreview
Server Component that fetches latest 3 news articles via `getNewsArticles(locale, 3)`. Renders heading + "View all" link + 3-column grid of NewsCard components. Returns null gracefully when no articles exist.

### NewsCard
Reusable card component with Contentful featured image (16:9 aspect), date, category badge, title (2-line clamp), excerpt (3-line clamp). Wrapped in next-intl Link to `/news/[slug]`. Hover effects: card translateY(-4px), image scale(1.03).

### NewsletterStrip
Full-width teal strip with heading and email input + subscribe button. Form is UI-only (preventDefault on submit) per user decision. Stacks vertically on mobile.

### i18n
Added `headline`, `subtitle` (updated to real Alkemia copy), `stats.*`, `newsletter.*`, and `newsPreview.*` keys to both `it.json` and `en.json`. Preserved all existing keys.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | f4163a5 | Hero, Stats, Newsletter sections + i18n messages |
| 2 | 55ccb15 | NewsCard, NewsPreview, wire homepage |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused import in NewsCard**
- **Found during:** Task 2 build verification
- **Issue:** `mq` imported from breakpoints but not used, causing ESLint warning
- **Fix:** Removed the unused import
- **Files modified:** src/components/cards/NewsCard.tsx

## Verification

- `npx tsc --noEmit` passes with zero errors
- `npm run build` succeeds, both `/` and `/en` routes generated
- All 5 section components created and properly imported
- i18n messages merged (not overwritten) into existing files
