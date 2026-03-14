---
phase: 04-core-pages
plan: 03
subsystem: team-news-pages
tags: [team, news, filters, pagination, detail-pages, rich-text]
dependency_graph:
  requires: [contentful-fetchers, contentful-types, FilterPills, NewsCard, richText, i18n]
  provides: [team-listing, team-detail, news-listing, news-detail]
  affects: [navigation, SEO, static-generation]
tech_stack:
  added: []
  patterns: [server-component-data-fetch, client-component-filters, load-more-pagination, generateStaticParams]
key_files:
  created:
    - src/components/cards/TeamCard.tsx
    - src/app/[locale]/team/page.tsx
    - src/app/[locale]/team/TeamGrid.tsx
    - src/app/[locale]/team/[slug]/page.tsx
    - src/app/[locale]/news/page.tsx
    - src/app/[locale]/news/NewsList.tsx
    - src/app/[locale]/news/[slug]/page.tsx
  modified:
    - src/messages/it.json
    - src/messages/en.json
decisions:
  - Team cards use 3:4 aspect ratio with initials fallback for missing photos
  - News load-more pagination in batches of 6 with client-side slicing
  - Article body styled with max-width 720px for optimal reading width
metrics:
  duration: 3m
  completed: "2026-03-14T19:02:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 7
  files_modified: 2
---

# Phase 4 Plan 3: Team & News Pages Summary

Team grid with category filters and member detail pages, plus news listing with load-more pagination and article detail pages -- both reusing FilterPills and NewsCard components from earlier plans.

## Tasks Completed

### Task 1: Team grid page with filters and detail pages
- **Commit:** 88c5df4
- **TeamCard:** 3:4 portrait photos with hover scale, initials fallback, link to detail
- **TeamGrid:** Client component with category FilterPills (Partners/Investment Team/Operations) and counts
- **Team page:** Server component fetching all members via `getTeamMembers`
- **Team detail:** Photo left + bio right layout, board badge, LinkedIn link, `generateStaticParams` for both locales

### Task 2: News listing with load-more and article detail pages
- **Commit:** 303f678
- **NewsList:** Client component with category filters and load-more (6 per batch), resets on filter change
- **News page:** Server component fetching all articles (no limit), ordered newest-first
- **News detail:** Featured image 16:9, category badge + date, article body in 720px reading container, external link support, `generateStaticParams` for both locales

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- `npx tsc --noEmit` passes with zero errors
- `npm run build` succeeds: 105 static pages generated
- Team detail pages: 30+ paths (15 members x 2 locales)
- News detail pages: 35 paths (17+ articles x 2 locales)
- Both IT and EN locales generate correctly

## Self-Check: PASSED

All 7 created files exist. Commits 88c5df4 and 303f678 verified in git log.
