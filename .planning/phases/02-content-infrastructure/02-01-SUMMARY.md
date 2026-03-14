---
phase: 02-content-infrastructure
plan: 01
subsystem: contentful-data-layer
tags: [contentful, typescript, isr, rich-text, api]
dependency_graph:
  requires: []
  provides: [contentful-types, contentful-client, contentful-fetchers, rich-text-renderer, isr-webhook]
  affects: [02-02, 02-03, phase-4-pages]
tech_stack:
  added: [contentful@11.10.6, "@contentful/rich-text-react-renderer@16", "@contentful/rich-text-types@17", contentful-management, slugify, tsx]
  patterns: [EntrySkeletonType, unstable_cache-with-tags, webhook-secret-validation]
key_files:
  created:
    - src/lib/contentful/types.ts
    - src/lib/contentful/client.ts
    - src/lib/contentful/locale.ts
    - src/lib/contentful/fetchers.ts
    - src/lib/contentful/richText.tsx
    - src/app/api/revalidate/route.ts
    - .env.example
  modified:
    - package.json
    - package-lock.json
    - .gitignore
decisions:
  - "Used interface extends EntrySkeletonType pattern instead of generic two-arg form (v11 SDK fields param is first, not second)"
  - "Dropped @types/slugify (does not exist on npm — slugify ships its own types)"
  - "Added !.env.example exception to .gitignore so template is committed"
metrics:
  duration: 221s
  completed: "2026-03-14T16:26:27Z"
---

# Phase 2 Plan 1: Contentful SDK + TypeScript Types + Client + Fetchers + ISR Webhook Summary

Typed Contentful data layer with 8 skeleton types, delivery/preview client factory, 12 cached fetcher functions with ISR tags, rich text renderer, and webhook route handler for on-demand revalidation.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Install Contentful dependencies + env config | 8dc6aaf | package.json, .env.example, .gitignore |
| 2 | Create types, client, locale, fetchers, rich text, webhook | d426df0 | src/lib/contentful/*.ts, src/app/api/revalidate/route.ts |

## What Was Built

### Content Type Definitions (types.ts)
8 EntrySkeletonType interfaces covering all Alkemia content models:
- PortfolioCompanySkeleton (12 fields: name, slug, description, shortDescription, sector, investmentType, year, logo, website, featured, fundRef, sortOrder)
- TeamMemberSkeleton (9 fields: name, slug, role, category, bio, photo, linkedIn, isBoard, sortOrder)
- FundSkeleton (8 fields: name, slug, description, strategy, status, fundSize, investmentPeriod, platformRef)
- NewsArticleSkeleton (8 fields: title, slug, date, category, excerpt, body, featuredImage, externalUrl)
- InvestmentPlatformSkeleton (5 fields: name, slug, description, strategy, funds)
- PageSkeleton (4 fields: title, slug, body, sections)
- SiteConfigSkeleton (8 fields: siteName, tagline, heroVideoUrl, logo, socialLinkedIn, socialTwitter, contactEmail, offices)
- OfficeSkeleton (5 fields: city, address, phone, isHeadquarters, sortOrder)

Resolved entry types exported for each (e.g., `PortfolioCompany = Entry<PortfolioCompanySkeleton, undefined, string>`).

### Client Factory (client.ts)
- `contentfulClient` — delivery API (published content)
- `contentfulPreviewClient` — preview API (draft content)
- `getClient(preview?)` — factory function selecting appropriate client

### Locale Mapping (locale.ts)
- `toContentfulLocale('it')` returns `'it-IT'`, `toContentfulLocale('en')` returns `'en-US'`

### Fetcher Functions (fetchers.ts)
12 typed fetch functions, all wrapped in `unstable_cache` with content-type-specific tags:
- getPortfolioCompanies, getPortfolioCompanyBySlug
- getTeamMembers, getTeamMemberBySlug
- getFunds
- getNewsArticles (with optional limit), getNewsArticleBySlug
- getInvestmentPlatforms, getInvestmentPlatformBySlug
- getPageBySlug
- getSiteConfig
- getOffices

### Rich Text Renderer (richText.tsx)
- 'use client' component
- Handles EMBEDDED_ASSET (next/image), headings (h1-h6), HYPERLINK (external with target=_blank)
- Graceful handling of missing assets

### ISR Webhook (route.ts)
- POST: validates x-contentful-webhook-secret, extracts contentTypeId, calls revalidateTag()
- GET: health check returning { status: 'ok' }
- Asset changes trigger revalidateTag('contentful-asset')
- Invalid secret returns 401

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed EntrySkeletonType generic parameter order**
- **Found during:** Task 2
- **Issue:** RESEARCH.md showed `EntrySkeletonType<'contentTypeId', {fields}>` but v11 SDK has `EntrySkeletonType<Fields, Id>` — fields first, ID second
- **Fix:** Used `interface X extends EntrySkeletonType { contentTypeId: '...'; fields: {...} }` pattern instead
- **Files modified:** src/lib/contentful/types.ts
- **Commit:** d426df0

**2. [Rule 3 - Blocking] Removed @types/slugify from install**
- **Found during:** Task 1
- **Issue:** `@types/slugify` does not exist on npm (slugify ships its own TypeScript types)
- **Fix:** Installed `contentful-management slugify tsx` without the missing types package
- **Commit:** 8dc6aaf

**3. [Rule 2 - Missing] Added .env.example gitignore exception**
- **Found during:** Task 1
- **Issue:** `.env*` pattern in .gitignore was excluding .env.example, which should be committed
- **Fix:** Added `!.env.example` exception line
- **Commit:** 8dc6aaf

## Verification

- `npx tsc --noEmit` passes with zero errors after both tasks
- All 8 EntrySkeletonType interfaces compile correctly
- All 12 fetcher functions accept locale string and return typed arrays/objects
- ISR webhook route has POST handler with secret validation
- No NEXT_PUBLIC_ prefix on any Contentful environment variable
- Rich text renderer handles embedded assets via next/image

## Self-Check: PASSED

- All 7 created files exist on disk
- Commits 8dc6aaf and d426df0 verified in git log
