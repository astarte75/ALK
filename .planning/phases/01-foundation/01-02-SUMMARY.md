---
phase: 01-foundation
plan: 02
subsystem: i18n-routing
tags: [next-intl, i18n, middleware, locale-routing, bilingual]
dependency-graph:
  requires: [nextjs-app, styled-components-ssr, dark-theme]
  provides: [i18n-routing, locale-middleware, bilingual-pages, translation-messages]
  affects: [all-page-routes, api-routes-excluded]
tech-stack:
  added: [next-intl@4]
  patterns: [defineRouting-as-needed, createMiddleware-api-exclusion, async-params-locale, NextIntlClientProvider, getLocale-root-layout]
key-files:
  created:
    - src/i18n/routing.ts
    - src/i18n/request.ts
    - middleware.ts
    - src/app/[locale]/layout.tsx
    - src/app/[locale]/page.tsx
    - src/messages/it.json
    - src/messages/en.json
  modified:
    - next.config.js
    - src/app/layout.tsx
decisions:
  - Used dynamic html lang via getLocale() instead of hardcoded lang=it for proper i18n
  - Removed root page.tsx since middleware routes all requests through [locale] segment
  - Fixed messages import path (../messages not ../../messages) since messages dir is inside src/
metrics:
  duration: 182s
  completed: 2026-03-14T15:05:28Z
  tasks: 2/2
  files-created: 7
  files-modified: 2
---

# Phase 1 Plan 2: next-intl v4 i18n Routing Summary

next-intl v4 wired with IT default locale (clean URLs), EN with /en/ prefix, middleware excluding API routes, and bilingual styled placeholder page proving full SSR + i18n pipeline.

## What Was Done

### Task 1: Configure next-intl routing, middleware, and locale layout
- Installed next-intl and wired plugin into next.config.js via createNextIntlPlugin
- Created `src/i18n/routing.ts` with defineRouting: locales [it, en], defaultLocale it, localePrefix as-needed
- Created `src/i18n/request.ts` with getRequestConfig resolving locale from requestLocale with fallback
- Created `middleware.ts` at project root with API-excluding matcher pattern `/((?!api|_next|_vercel|.*\\..*).*)`
- Created `src/app/[locale]/layout.tsx` as async Server Component with `await params` (Next.js 15 Promise params) and NextIntlClientProvider
- Created placeholder message files for both locales

### Task 2: Create bilingual placeholder page with translations
- Created full translation messages for both locales (home + common namespaces)
- Created `src/app/[locale]/page.tsx` with styled-components: teal title (Plus Jakarta Sans), subtitle, description (Inter), and gold locale badge
- Updated root layout to use dynamic `lang` attribute via `getLocale()` from next-intl/server
- Removed old root `src/app/page.tsx` (middleware handles routing to [locale] segment)
- Fixed dynamic import path in request.ts (../messages instead of ../../messages)

## Verification Results

- `npx tsc --noEmit` passes with zero errors
- `npm run build` completes successfully (both locale routes compile)
- Middleware matcher excludes API routes via negative lookahead pattern
- Locale layout uses `await params` correctly for Next.js 15

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed messages import path in request.ts**
- **Found during:** Task 2
- **Issue:** Research doc showed `../../messages/${locale}.json` but messages directory is at `src/messages/`, making correct relative path `../messages/`
- **Fix:** Changed import path from `../../messages` to `../messages`
- **Files modified:** src/i18n/request.ts
- **Commit:** 4193948

**2. [Rule 2 - Missing] Dynamic html lang attribute**
- **Found during:** Task 2
- **Issue:** Root layout had hardcoded `lang="it"` which would be incorrect for EN pages
- **Fix:** Used `getLocale()` from next-intl/server to set html lang dynamically, made RootLayout async
- **Files modified:** src/app/layout.tsx
- **Commit:** 4193948

**3. [Rule 3 - Blocking] Stale .next types cache**
- **Found during:** Task 2
- **Issue:** After removing root page.tsx, `.next/types/` still referenced it causing tsc errors
- **Fix:** Cleared .next directory to regenerate types
- **Files modified:** .next/ (cache only)
- **Commit:** N/A (build artifact)

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | 35c1cc9 | feat(01-02): configure next-intl v4 i18n routing and middleware |
| 2 | 4193948 | feat(01-02): add bilingual placeholder page with styled-components |

## Self-Check: PASSED

All 7 created files and 2 modified files verified on disk. Both commits (35c1cc9, 4193948) verified in git log.
