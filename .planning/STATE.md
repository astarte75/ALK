---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
last_updated: "2026-03-15T12:00:00Z"
progress:
  total_phases: 7
  completed_phases: 5
  total_plans: 15
  completed_plans: 15
  percent: 71
---

# Project State: Alkemia Capital Website

*Single source of truth for project memory. Updated at each session boundary.*

---

## Project Reference

**Core Value:** The site must look and feel indistinguishable in quality from hgcapital.com while being unmistakably Alkemia Capital in content and branding.
**Reference site:** hgcapital.com (Next.js + Contentful + Styled Components + GSAP + Vercel)
**Stack:** Next.js 15 (App Router) · Contentful REST API · styled-components v6 · GSAP + Lenis · next-intl · Vercel

---

## Current Position

**Phase:** 5 — Animation Layer (COMPLETE)
**Plan:** 2/2 complete
**Status:** Complete — ready for Phase 6
**Last action:** Completed Phase 5 execution (animated homepage with GSAP + Lenis)

```
Progress: [####################░░░░░░░░] 71%

Phase 1 [############░░░░░░░░] 2/3 plans complete
Phase 2 [####################] 3/3 plans complete
Phase 3 [####################] 3/3 plans complete
Phase 4 [####################] 5/5 plans complete
Phase 5 [####################] 2/2 plans complete
Phase 6 [░░░░░░░░░░░░░░░░░░░░] Not started
Phase 7 [░░░░░░░░░░░░░░░░░░░░] Not started
```

---

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance | 90+ | — |
| Lighthouse Accessibility | 90+ | — |
| Lighthouse SEO | 90+ | — |
| Lighthouse Best Practices | 90+ | — |
| TypeScript errors | 0 | 0 |
| Hydration mismatches | 0 | 0 |

---

## Accumulated Context

### Architecture Decisions

| Decision | Rationale | Status |
|----------|-----------|--------|
| Next.js 15 (NOT 16) | Next.js 16 breaks styled-components integration (async params mandatory, Turbopack default) | Locked |
| Contentful REST API (not GraphQL) | GraphQL has query size limits with nested rich text; REST simpler for SSG | Locked |
| styled-components v6.3 + SSR Registry | Matches HG Capital approach; v6.3 supports RSC natively | Locked |
| CSS custom properties for dark theme | Prevents FOUC; colors available before JS executes | Locked |
| next-intl v4 with `localePrefix: 'as-needed'` | Clean IT URLs (`/portfolio`), EN gets prefix (`/en/portfolio`) | Locked |
| SSG + on-demand ISR (not SSR) | All public pages pre-rendered; Contentful webhook triggers `revalidateTag` | Locked |
| GSAP (not Framer Motion) for scroll animations | Framer Motion forces Client Components too high in tree; Safari compatibility | Locked |
| Lenis v1.3 for smooth scroll | RAF synced to GSAP ticker via autoRaf:false + tickerCallback pattern | Locked |
| useGSAP + gsap.matchMedia() | Unified responsive + reduced-motion handling; auto-cleanup | Locked |
| Local MP4 hero (not Vimeo) | Stock video for launch; Vimeo can replace later via Contentful | Locked |
| Static homepage backup at /homepage-static | Original non-animated homepage preserved for rollback | Locked |
| interface extends EntrySkeletonType (not generic two-arg) | Contentful v11 SDK has Fields as first generic param, not contentTypeId | Locked |
| next-intl createNavigation for locale-aware Links | v4 requires createNavigation() from routing config; used across all layout components | Locked |
| IntersectionObserver sentinel for header scroll | More performant than scroll event listeners; zero-cost when idle | Locked |
| Ref-based DOM + combined transform for custom cursor | Avoids 60 re-renders/sec; translate+scale in one property avoids CSS class conflicts | Locked |

### Open Decisions (Blocking)

| Decision | Blocks | Notes |
|----------|--------|-------|
| Alkemia brand accent color | Phase 1 close | Must contrast-check against dark bg before any CSS written |
| Font choice | Phase 1 close | Inter as placeholder; confirm if licensed font needed |
| Contentful space + locale setup | Phase 2 start | Non-technical; user must create space with `it-IT` and `en-US` |
| Vimeo video URL for hero | Post-launch | Using local MP4 stock video for now; Vimeo optional later |

### Known Pitfalls (Pre-validated)

1. styled-components SSR — install `StyledComponentsRegistry` before writing ANY component
2. GSAP memory leaks — use `useGSAP()` hook always, never `useEffect`; register plugins once in `gsap-init.ts`
3. Dark theme FOUC — CSS custom properties on `:root` in GlobalStyle, not JS ThemeProvider
4. Contentful rate limits — batch fetches per content type, not per page
5. next-intl locale not wired to Contentful — every API call must receive `locale` from route params; map `it` → `it-IT`, `en` → `en-US`
6. Vimeo hero LCP — facade pattern: poster image first, inject iframe after mount/intersection
7. GSAP pixel values on resize — use percentage/viewport-relative values only
8. WCAG contrast on dark + accent — check every color pair before writing CSS
9. CLS from Contentful images — use `next/image` with `fill` + aspect-ratio container
10. Safari scroll-driven animations — CSS scroll-driven not supported until Safari 26; use GSAP for everything

### Contentful Content Models (8 defined)

1. `page` — generic static pages (Approach, Contact, Sustainability)
2. `portfolioCompany` — platform reference, featured flag, sector
3. `teamMember` — photo, bio rich text, board flag
4. `newsArticle` — title, category, body rich text, external URL option
5. `investmentPlatform` — PE/VC/PIPE, references funds
6. `fund` — name, vintage, status, platform reference
7. `siteConfig` — singleton (hero video URL, nav, footer links, offices)
8. `office` — city, address, map URL

### Research Flags

- **Phase 5 (Animation):** VALIDATED — GSAP + Lenis + Next.js 15 integration confirmed HIGH confidence. POC built, bugs fixed (autoRaf, cleanup, ScrollTrigger sync), migrated to production. All pitfall gates resolved.

---

## Todos

- [ ] Decide Alkemia brand accent color (blocking Phase 1 close)
- [ ] Confirm font licensing (blocking Phase 1 close)
- [ ] Create Contentful space with `it-IT` and `en-US` locales (blocking Phase 2 start)
- [x] ~~Obtain video for homepage hero~~ (done: using local stock MP4, Vimeo optional post-launch)
- [x] ~~Run `/gsd:plan-phase 1` to begin Phase 1 planning~~ (done)
- [x] ~~Execute 01-01-PLAN.md~~ (done: a286a07, b7421f0)
- [x] ~~Execute 01-02-PLAN.md~~ (done: 35c1cc9, 4193948)
- [x] ~~Execute 02-01-PLAN.md~~ (done: 8dc6aaf, d426df0)
- [x] ~~Execute 02-02-PLAN.md~~ (done: 6653271, 957aa42)
- [x] ~~Execute 02-03-PLAN.md~~ (done: 88c55c2)
- [x] ~~Execute 03-01-PLAN.md~~ (done: a7948bb, 81787a6)
- [x] ~~Execute 03-02-PLAN.md~~ (done: 9aaba0c, c3e8b53)
- [x] ~~Execute 03-03-PLAN.md~~ (done: 01a1c49)
- [x] ~~Execute 04-01-PLAN.md~~ (done: f4163a5, 55ccb15)
- [x] ~~Execute 04-02-PLAN.md~~ (done: 84b2328, 39632b8)
- [x] ~~Execute 04-03-PLAN.md~~ (done: 88c5df4, 303f678)
- [x] ~~Execute 04-04-PLAN.md~~ (done: 2227c89, 171ad71)
- [x] ~~Execute 04-05-PLAN.md~~ (done: 53945bc, 8844bb9)

---

## Blockers

None currently.

---

## Session Continuity

**To resume this project:**
1. Read `.planning/ROADMAP.md` for current phase and success criteria
2. Read `.planning/STATE.md` (this file) for decisions, pitfalls, and todos
3. Run `/gsd:plan-phase [N]` to get the execution plan for the next phase

**Phase sequence:** 1 → 2 → 3 → 4 → 5 → 6 → 7

**Current milestone:** v1 (initial launch at alkemiacapital.com)

---

*State initialized: 2026-03-14*
*Last updated: 2026-03-15 after completing Phase 5 (Animation Layer)*
