---
phase: 02-content-infrastructure
plan: 02
subsystem: migration-script
tags: [contentful, migration, data-seeding, typescript]
dependency_graph:
  requires: [02-01]
  provides: [migration-script, content-data, image-upload, rich-text]
  affects: [02-03]
tech_stack:
  added: [contentful-management]
  patterns: [idempotent-migration, rich-text-conversion, image-upload-pipeline]
key_files:
  created:
    - scripts/migrate.ts
    - scripts/lib/contentful-models.ts
    - scripts/lib/image-upload.ts
    - scripts/lib/rich-text.ts
    - scripts/lib/scraper.ts
    - scripts/tsconfig.json
    - scripts/data/portfolio.ts
    - scripts/data/team.ts
    - scripts/data/funds.ts
    - scripts/data/news.ts
    - scripts/data/pages.ts
    - scripts/data/config.ts
  modified: []
decisions:
  - Used `any` cast for contentful-management createContentTypeWithId fields param (SDK type too strict for dynamic field definitions)
  - Mapped PIPE investment type to 'PIPE' (matching types.ts validation) rather than 'Private Investment in Public Equity'
  - Sectors mapped to types.ts enum values; some portfolio companies in non-standard sectors use 'Other' or 'Digital Services'
  - News articles include 17 entries spanning 2025-01 to 2026-03
  - Governance page uses JSON sections field for structured board/auditor/control data
metrics:
  duration_seconds: 627
  completed: "2026-03-14T16:40:04Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 12
  files_modified: 0
---

# Phase 2 Plan 2: Migration Script + Content Data Summary

Complete Contentful migration script with all 8 content type definitions and structured data files for 18 portfolio companies, 15 team members, 5 funds, 3 platforms, 17 news articles, 5 pages, 2 offices, and site config -- all with IT + EN bilingual content.

## What Was Built

### Task 1: Migration Infrastructure

**scripts/migrate.ts** -- Main orchestrator supporting `--dry-run`, `--skip-models`, `--skip-images`, `--skip-entries` flags. Handles full migration lifecycle: content types -> images -> entries (offices -> platforms -> funds -> companies -> team -> news -> pages -> config).

**scripts/lib/contentful-models.ts** -- Idempotent content type creation for all 8 models. Field IDs match `src/lib/contentful/types.ts` skeletons exactly. Includes field-level localization, validation rules (sector enum, investment type enum, category enum), and unique slug constraints.

**scripts/lib/image-upload.ts** -- Downloads images from WordPress URLs, strips thumbnail suffixes (-1024x683 etc.) for max resolution, uploads to Contentful Assets with processing polling (30 retries, 1s interval). Sequential processing with rate-limit delay. Deduplication by URL.

**scripts/lib/rich-text.ts** -- Markdown-to-Contentful-Rich-Text converter handling headings, bold, italic, links, unordered lists, and paragraphs. Output matches Contentful Rich Text JSON schema (nodeType, data, content, marks).

**scripts/lib/scraper.ts** -- Basic news article scraper for fetching full article content from URLs. Used as fallback; primary content already extracted from alkemiacapital-site.md.

### Task 2: Structured Data Files

| Data File | Content | IT + EN |
|-----------|---------|---------|
| scripts/data/portfolio.ts | 18 portfolio companies with descriptions, sectors, logos | Yes |
| scripts/data/team.ts | 15 team members with roles, photos, board flags | Yes |
| scripts/data/funds.ts | 5 funds + 3 investment platforms | Yes |
| scripts/data/news.ts | 17 news articles with ISO dates, categories | Yes |
| scripts/data/pages.ts | 5 static pages (Societa, Governance, ESG, Contatti, Culture) | Yes |
| scripts/data/config.ts | Site config + 2 offices (Milano HQ, Padova) | Yes |

### Content Counts

- **Portfolio companies**: 18 (Agricooltur, Casta Diva, Circle Group, Codemotion, Contents, Convivio, DHH, Ermes, Glickon, Hlpy, Izertis, Pakelo, Redelfi, Soplaya, Sys-Dat, Tecno, TXT eSolutions, 4Gift)
- **Team members**: 15 (7 Partners, 4 Investment Team, 4 Operations)
- **Funds**: 5 (Amarone, Food Excellence I, Flexible Capital I, Sinergia Venture Fund, Fondo PIPE)
- **Investment platforms**: 3 (Private Equity, Venture Capital, PIPE)
- **News articles**: 17 (spanning 2025-01 to 2026-03)
- **Static pages**: 5
- **Offices**: 2 (Milano, Padova)
- **Images to upload**: 38 (18 logos + 14 team photos + 5 news images + 1 site logo)

## Verification Results

- `npx tsc -p scripts/tsconfig.json --noEmit` -- PASSED (zero errors)
- `npx tsx scripts/migrate.ts --dry-run` -- PASSED (all 8 content types, 38 images, 61 entries logged)

## Deviations from Plan

None -- plan executed exactly as written.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 6653271 | Migration infrastructure (models, image upload, rich text, scraper, orchestrator) |
| 2 | 957aa42 | Structured data files for all Alkemia content |
