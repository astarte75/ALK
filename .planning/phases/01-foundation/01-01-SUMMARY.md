---
phase: 01-foundation
plan: 01
subsystem: project-scaffold
tags: [nextjs, styled-components, ssr, dark-theme, responsive]
dependency-graph:
  requires: []
  provides: [nextjs-app, styled-components-ssr, dark-theme, css-custom-properties, responsive-breakpoints, font-loading]
  affects: [all-subsequent-phases]
tech-stack:
  added: [next@15.5.12, react@18, styled-components@6, typescript@5, prettier, sharp]
  patterns: [StyledComponentsRegistry-SSR, CSS-custom-properties-theme, next-font-css-variables, mobile-first-breakpoints]
key-files:
  created:
    - next.config.js
    - src/components/providers/StyledComponentsRegistry.tsx
    - src/styles/GlobalStyle.ts
    - src/styles/theme.ts
    - src/styles/breakpoints.ts
    - src/app/layout.tsx
    - src/app/page.tsx
    - .prettierrc
  modified: []
decisions:
  - Used next.config.js (CommonJS) instead of next.config.ts for broader compatibility with styled-components compiler flag
  - Removed scroll-behavior smooth from html (Lenis will handle in Phase 5)
  - Placeholder page uses 'use client' with styled-components to prove SSR pipeline end-to-end
metrics:
  duration: 229s
  completed: 2026-03-14T14:59:00Z
  tasks: 2/2
  files-created: 8
  files-modified: 0
---

# Phase 1 Plan 1: Next.js 15 Scaffold + styled-components SSR + Dark Theme Summary

Next.js 15 App Router scaffolded with styled-components v6 SSR registry using useServerInsertedHTML, dark premium theme (#1A1E22) via CSS custom properties on :root, Plus Jakarta Sans + Inter fonts as CSS variables, and mobile-first responsive breakpoint system.

## What Was Done

### Task 1: Scaffold Next.js 15 project with styled-components SSR
- Scaffolded Next.js 15.5.12 with TypeScript, ESLint, src/ directory, App Router
- Installed styled-components v6 (types included), prettier, sharp
- Created `next.config.js` with `compiler: { styledComponents: true }` and Contentful image domain
- Implemented `StyledComponentsRegistry` with exact official Next.js pattern (useServerInsertedHTML + typeof window guard)
- Updated root layout with Plus Jakarta Sans (400-800) and Inter (400-600) as CSS variables on html element
- Set `<html lang="it">` as default language
- Created `.env.local` with site URL only (no secrets)
- Created `.prettierrc` with project conventions

### Task 2: Dark theme via CSS custom properties and responsive breakpoints
- Created `GlobalStyle.ts` with full CSS reset and :root custom properties for all color tokens, font tokens, and spacing scale
- Created `theme.ts` with typed constants (colors, fonts, spacing) mirroring CSS vars for TypeScript usage in styled-components
- Created `breakpoints.ts` with bp object (640-2560px) and mq media query helpers for styled-components
- Created placeholder homepage with styled-components proving SSR pipeline: teal heading, gold accent element, Inter body text on dark background

## Verification Results

- `npx tsc --noEmit` passes with zero errors
- `npm run build` completes successfully (all pages static)
- StyledComponentsRegistry wired in root layout before any styled-component
- Dark background #1A1E22 applied via CSS custom properties on :root
- Both fonts loaded as CSS variables (--font-plus-jakarta-sans, --font-inter)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] next.config.ts replaced with next.config.js**
- **Found during:** Task 1
- **Issue:** create-next-app@15 generates next.config.ts by default, but plan specifies next.config.js with CommonJS module.exports
- **Fix:** Removed next.config.ts, created next.config.js with CommonJS format
- **Files modified:** next.config.js (replaced next.config.ts)
- **Commit:** a286a07

**2. [Rule 3 - Blocking] Default CSS and page files removed**
- **Found during:** Task 1
- **Issue:** create-next-app generates globals.css and page.module.css which conflict with styled-components approach
- **Fix:** Removed both CSS files, replaced default page.tsx with minimal version
- **Files modified:** src/app/page.tsx (replaced), src/app/globals.css (deleted), src/app/page.module.css (deleted)
- **Commit:** a286a07

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | a286a07 | feat(01-01): scaffold Next.js 15 with styled-components SSR |
| 2 | b7421f0 | feat(01-01): add dark theme, typed theme constants, and breakpoints |

## Self-Check: PASSED

All 8 created files verified on disk. Both commits (a286a07, b7421f0) verified in git log.
