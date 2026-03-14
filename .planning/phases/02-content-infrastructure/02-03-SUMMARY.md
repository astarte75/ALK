---
phase: 02-content-infrastructure
plan: 03
subsystem: content-validation
tags: [contentful, validation, playwright, migration, webhook, isr]
dependency_graph:
  requires: [02-01, 02-02]
  provides: [populated-contentful-space, content-validation, webhook-tests]
  affects: [04-pages]
tech_stack:
  added: [dotenv]
  patterns: [unstable-cache-mock-for-scripts, playwright-api-tests]
key_files:
  created:
    - scripts/validate-content.ts
    - tests/revalidate.spec.ts
  modified:
    - scripts/migrate.ts
    - package.json
decisions:
  - Patched next/cache unstable_cache in validation script via require.cache mock to run typed fetchers outside Next.js runtime
  - Fixed office idempotency check to query by city field instead of non-existent slug field (Rule 1 bug fix)
  - Added GET endpoint test for /api/revalidate beyond plan spec (4 tests total)
metrics:
  duration_seconds: 371
  completed: "2026-03-14T17:04:27Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 3
---

# Phase 2 Plan 3: Content Migration & Validation Summary

Full Contentful migration executed against real space, all data seeded and validated via typed fetch layer -- 18 portfolio companies, 15 team members, 5 funds, 17 news articles all queryable in both IT and EN locales.

## What Was Built

### Task 1: Contentful Space Setup (User-completed)

Contentful space "Alkemia Capital" created with Space ID `leie6d1iscjw`, locales `it-IT` (default) and `en-US` (fallback to it-IT). All 4 API tokens configured in `.env.local`.

### Task 2: Migration Execution + Validation Tests

**Migration run** -- All 8 content types created, 38 images uploaded from WordPress, 66 entries seeded:
- 18 portfolio companies with logos, sectors, descriptions
- 15 team members with photos, roles, bios
- 5 funds linked to 3 investment platforms
- 17 news articles with featured images
- 5 static pages (Societa, Governance, ESG, Contatti, Culture)
- 1 site config with 2 offices (Milano HQ, Padova)

**scripts/validate-content.ts** -- Standalone validation script that imports the project's actual typed fetchers (`src/lib/contentful/fetchers.ts`) to prove runtime behaviour. Mocks `next/cache` so `unstable_cache` works outside Next.js. Tests: all content types queryable, both IT and EN locales work, slug-based fetching works, TypeScript types match actual field structure.

**tests/revalidate.spec.ts** -- 4 Playwright API tests for the ISR webhook route:
1. POST with valid secret returns 200 + `revalidated: true` + content type ID
2. POST with invalid secret returns 401
3. POST with Asset type returns 200 + `contentful-asset` tag
4. GET returns 200 status ok

## Verification Results

- `npx tsx scripts/validate-content.ts` -- PASSED (12/12 checks)
- `npx playwright test tests/revalidate.spec.ts` -- PASSED (4/4 tests)
- `npx tsc --noEmit` -- PASSED (zero errors)

### Content Counts Verified

| Content Type | Count | Both Locales |
|-------------|-------|-------------|
| Portfolio Companies | 18 | Yes |
| Team Members | 15 | Yes |
| Funds | 5 | Yes |
| Investment Platforms | 3 | Yes |
| News Articles | 17 | Yes |
| Pages | 5 | Yes |
| Site Config | 1 | Yes |
| Offices | 2 | Yes |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed office idempotency check in migrate.ts**
- **Found during:** Task 2 (migration execution)
- **Issue:** `entryExistsBySlug` queried `fields.slug` on `office` content type, but office has no slug field (uses `city` as identifier)
- **Fix:** Replaced with direct `fields.city` query for office deduplication
- **Files modified:** scripts/migrate.ts
- **Commit:** 88c55c2

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | -- | User-completed (Contentful space + credentials) |
| 2 | 88c55c2 | Migration execution, validation script, webhook tests |
