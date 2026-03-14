# Roadmap: Alkemia Capital Website

**Project:** Alkemia Capital — premium PE/VC corporate website (replica of hgcapital.com)
**Created:** 2026-03-14
**Granularity:** Standard (5-8 phases)
**Coverage:** 68/68 requirements mapped

---

## Phases

- [x] **Phase 1: Foundation** — Project scaffolding, dark theme, i18n routing, Vercel CI/CD (completed 2026-03-14)
- [x] **Phase 2: Content Infrastructure** — Contentful content models, TypeScript types, data layer (completed 2026-03-14)
- [ ] **Phase 3: Layout Shell & Legal** — Header, footer, cookie consent, GDPR pages
- [ ] **Phase 4: Core Pages** — All site pages with static content, no animations
- [ ] **Phase 5: Animation Layer** — GSAP, Lenis, Vimeo hero, scroll-triggered reveals
- [ ] **Phase 6: SEO & Performance** — Metadata, structured data, sitemap, Lighthouse 90+
- [ ] **Phase 7: Production Hardening** — Accessibility audit, ISR webhooks, error states, cross-browser

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/3 | Complete    | 2026-03-14 |
| 2. Content Infrastructure | 3/3 | Complete | 2026-03-14 |
| 3. Layout Shell & Legal | 0/3 | Planning complete | - |
| 4. Core Pages | 0/? | Not started | - |
| 5. Animation Layer | 0/? | Not started | - |
| 6. SEO & Performance | 0/? | Not started | - |
| 7. Production Hardening | 0/? | Not started | - |

---

## Phase Details

### Phase 1: Foundation
**Goal**: The project skeleton is running on Vercel with dark theme, i18n routing, and styled-components SSR — every subsequent phase builds on a stable, pitfall-free base.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-05, FOUND-06, FOUND-07
**Success Criteria** (what must be TRUE):
  1. `next build` completes without TypeScript or hydration errors on both local and Vercel
  2. The site renders in dark theme (#1A1E22) with no flash of unstyled content on first load
  3. Navigating to `/` shows Italian content and `/en/` shows English content, both served as statically generated HTML
  4. The site is responsive and usable from 320px to 2560px viewport width (verified by resizing)
  5. A Vercel deployment URL is live and auto-deploys on push to main branch
**Plans:** 2/3 plans complete

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js 15 + styled-components SSR + dark theme + responsive breakpoints
- [x] 01-02-PLAN.md — next-intl i18n routing (IT default + EN prefix) + bilingual placeholder
- [ ] 01-03-PLAN.md — Vercel deployment + Playwright e2e smoke tests + human verification

**Pitfall gates (must resolve before phase ends):**
- `StyledComponentsRegistry` using `useServerInsertedHTML` wired in root layout before any component is written
- Full dark palette defined as CSS custom properties on `:root` in `GlobalStyle` — no JS ThemeProvider colors
- `next-intl` middleware installed before any page route is created
- Alkemia brand accent color decided and contrast-checked against dark background (block phase completion if unresolved)
- Font choice confirmed (Inter or licensed alternative)

---

### Phase 2: Content Infrastructure
**Goal**: All Contentful content models are defined and seeded with Alkemia data; TypeScript types and fetch functions exist for every content type so Phase 4 pages can query data immediately.
**Depends on**: Phase 1
**Requirements**: FOUND-04, FOUND-08
**Success Criteria** (what must be TRUE):
  1. All 8 content models exist in the Contentful space with field-level localization enabled for `it-IT` and `en-US`
  2. A TypeScript call to `getPortfolioCompanies('it')` returns typed `PortfolioCompany[]` objects without any TypeScript errors
  3. Alkemia's 18 portfolio companies, 15 team members, 5 funds, and news articles are queryable from Contentful via the typed client
  4. Contentful webhook hits `/api/revalidate` and triggers `revalidateTag` (verifiable in Vercel logs)
**Plans:** 3/3 plans complete

Plans:
- [x] 02-01-PLAN.md — Contentful SDK + TypeScript types + client + fetchers + ISR webhook (wave 1)
- [x] 02-02-PLAN.md — Migration script: content models + image upload + data seeding (wave 2, depends on 02-01)
- [x] 02-03-PLAN.md — Run migration + content validation + Vercel env setup (wave 3, depends on 02-01 + 02-02)

**Pitfall gates:**
- Contentful space created with `it-IT` and `en-US` locales before model definition
- All fetches use batch calls (not per-page individual requests) to avoid 429 rate limit at build time
- Content models have max 3-level nesting and max 20 fields per type
- `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_PREVIEW_TOKEN` set in Vercel environment variables

---

### Phase 3: Layout Shell & Legal
**Goal**: Every page has a consistent header and footer; users are presented with a GDPR-compliant cookie consent experience; Privacy and Cookie Notice pages exist.
**Depends on**: Phase 1 (theme + i18n wired)
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, LEGAL-01, LEGAL-02, LEGAL-03, LEGAL-04
**Success Criteria** (what must be TRUE):
  1. The fixed header shows the Alkemia logo, navigation links, and a functional hamburger menu on mobile; scrolling past the hero does not cause layout shift
  2. The footer displays legal links (Privacy, Cookie, Legal, Governance, Accessibility) and social icons (LinkedIn, X) in both Italian and English
  3. On first visit, a cookie consent banner appears with Accept and Reject buttons of equal visual prominence; non-essential scripts are blocked until consent is given
  4. The Privacy Notice and Cookie Notice pages are reachable via footer links and contain the required GDPR information
  5. The custom cursor element renders and scales correctly on desktop when hovering interactive elements
**Plans:** 3 plans

Plans:
- [ ] 03-01-PLAN.md — Header (scroll-aware, mobile menu) + Footer (offices, legal links, social) (wave 1)
- [ ] 03-02-PLAN.md — Cookie consent modal (GDPR Italy) + Privacy/Cookie Policy pages (wave 2, depends on 03-01)
- [ ] 03-03-PLAN.md — Custom cursor on desktop (wave 1, parallel with 03-01)

**Note:** LEGAL-04 (Accessibility Statement) is deferred to Phase 7.

---

### Phase 4: Core Pages
**Goal**: Every section of the Alkemia site is reachable and displays real Alkemia content — portfolio companies, team members, news, investment platforms, governance, ESG, contacts — as static HTML without animations.
**Depends on**: Phase 2 (content models and data), Phase 3 (layout shell)
**Requirements**: HOME-01, HOME-05, HOME-06, HOME-07, PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, PORT-06, TEAM-01, TEAM-02, TEAM-03, NEWS-01, NEWS-02, NEWS-03, NEWS-04, NEWS-05, INVP-01, INVP-02, INVP-03, INVP-04, ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04, GOV-01, GOV-02, GOV-03, GOV-04, ESG-01, ESG-02, ESG-03, ESG-04, CONT-01, CONT-02, CONT-03, CULT-01, CULT-02
**Success Criteria** (what must be TRUE):
  1. A visitor can navigate to `/portfolio`, see all 18 Alkemia portfolio companies in a responsive grid, filter by sector and fund type, and click through to an individual company detail page
  2. A visitor can navigate to `/team`, see all 15 team member cards with photos and roles, filter by category, and view individual profile pages
  3. A visitor can navigate to `/news`, see news articles ordered newest-first with image/date/title/excerpt, filter by category, paginate, and open individual article pages
  4. The homepage shell renders with a video poster image, the animated stat section, the newsletter strip, and the latest 3 news cards — all with real Alkemia data, no placeholder text
  5. All content pages (Societa, Governance, ESG, Investment Platforms, Contatti, Culture) are reachable via navigation, display real Alkemia content, and work in both Italian and English
  6. The Contact page has a working form with request type selector and reCAPTCHA validation
**Plans**: TBD

**Pitfall gates:**
- Every Contentful fetch receives `params.locale` from route params; never hard-coded
- `generateStaticParams` generates paths for both `it` and `en` on every dynamic route
- All images use `next/image` with `fill` + explicit aspect-ratio container (no CLS)
- ESG downloadable PDFs hosted on Contentful assets (verify download links work)

---

### Phase 5: Animation Layer
**Goal**: The site feels indistinguishable in animation quality from hgcapital.com — smooth scrolling, staggered text reveals, scroll-triggered section fades, Vimeo video hero, and multi-section scroll narrative are all live.
**Depends on**: Phase 4 (DOM structure must exist before GSAP targets it)
**Requirements**: HOME-02, HOME-03, HOME-04, HOME-08
**Success Criteria** (what must be TRUE):
  1. The homepage hero plays a muted Vimeo video (or shows a poster image on slow connections) and the headline text reveals with a staggered split-text animation on load
  2. Scrolling the homepage triggers visible section reveals on all content sections (fade-up or fade-in) with no jank or layout shift
  3. The multi-section scroll narrative (3-5 fullscreen sections with background video/images) scrolls smoothly with parallax text overlays
  4. The smooth scroll experience (Lenis) is active: page scrolling has momentum and no abrupt stops; GSAP ScrollTrigger animations stay in sync across page navigations
  5. All animations are disabled or gracefully degraded on mobile devices where they would impact performance; `prefers-reduced-motion` disables all motion
**Plans**: TBD

**Pitfall gates:**
- Lenis initialized in a `'use client'` Provider component; RAF synced to `gsap.ticker` before any ScrollTrigger is created
- All GSAP animations use `useGSAP()` hook, never raw `useEffect`
- GSAP plugins registered once in `gsap-init.ts` at app root
- `ScrollTrigger.refresh()` called on `usePathname()` change
- Pin animations disabled on mobile via `ScrollTrigger.matchMedia`
- Full-screen sections use `100svh` (not `100vh`) for iOS Safari compatibility
- Actual Vimeo video URL from Alkemia account required before this phase can close (external dependency)
- Phase begins with proof-of-concept: Lenis + GSAP RAF sync verified before building full animation suite

---

### Phase 6: SEO & Performance
**Goal**: Every page is discoverable by search engines with proper metadata, structured data, and hreflang; the site scores 90+ on all Lighthouse metrics.
**Depends on**: Phase 4 (pages must exist to add metadata), Phase 5 (performance score measured after animations)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05
**Success Criteria** (what must be TRUE):
  1. Every page has a unique `<title>`, `<meta description>`, Open Graph tags, and a canonical URL visible in page source
  2. Switching between `/portfolio` and `/en/portfolio` shows correct `hreflang` alternates in `<head>`
  3. `https://alkemiacapital.com/sitemap.xml` returns a valid XML sitemap listing all pages including dynamic portfolio and team routes in both locales
  4. Lighthouse scores 90+ on Performance, Accessibility, Best Practices, and SEO when run on the Vercel production URL
  5. All images load using the Contentful image CDN with correct `sizes` attributes; no oversized image requests visible in Network tab
**Plans**: TBD

---

### Phase 7: Production Hardening
**Goal**: The site is production-ready: WCAG 2.1 AA compliant, error states handled, on-demand ISR working, and cross-browser tested — ready for the alkemiacapital.com domain.
**Depends on**: Phase 6 (Lighthouse and SEO baseline established)
**Requirements**: A11Y-01, A11Y-02, A11Y-03, A11Y-04
**Success Criteria** (what must be TRUE):
  1. All text on the dark theme passes WCAG 2.1 AA contrast ratio (4.5:1 for body text, 3:1 for large text) — verified with an automated contrast checker
  2. A user navigating the entire site using only the keyboard (Tab, Shift+Tab, Enter, Escape) can access every interactive element with visible focus indicators
  3. A screen reader (VoiceOver on Safari or NVDA on Chrome) can navigate portfolio, team, and news grids and announce card content meaningfully
  4. Publishing a content change in Contentful triggers a page revalidation within 60 seconds without a full rebuild; the updated content is visible on the live site
  5. All animated pages render correctly on Safari (latest), Chrome (latest), and Firefox (latest), including the Vimeo hero and ScrollTrigger sections
**Plans**: TBD

---

## Requirement Coverage

| Phase | Requirements | Count |
|-------|-------------|-------|
| 1 - Foundation | FOUND-01, FOUND-02, FOUND-03, FOUND-05, FOUND-06, FOUND-07 | 6 |
| 2 - Content Infrastructure | FOUND-04, FOUND-08 | 2 |
| 3 - Layout Shell & Legal | NAV-01, NAV-02, NAV-03, NAV-04, LEGAL-01, LEGAL-02, LEGAL-03, LEGAL-04 | 8 |
| 4 - Core Pages | HOME-01, HOME-05, HOME-06, HOME-07, PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, PORT-06, TEAM-01, TEAM-02, TEAM-03, NEWS-01, NEWS-02, NEWS-03, NEWS-04, NEWS-05, INVP-01, INVP-02, INVP-03, INVP-04, ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04, GOV-01, GOV-02, GOV-03, GOV-04, ESG-01, ESG-02, ESG-03, ESG-04, CONT-01, CONT-02, CONT-03, CULT-01, CULT-02 | 39 |
| 5 - Animation Layer | HOME-02, HOME-03, HOME-04, HOME-08 | 4 |
| 6 - SEO & Performance | SEO-01, SEO-02, SEO-03, SEO-04, SEO-05 | 5 |
| 7 - Production Hardening | A11Y-01, A11Y-02, A11Y-03, A11Y-04 | 4 |
| **Total** | | **68** |

**Coverage: 68/68 v1 requirements mapped. No orphans.**

---

## External Dependencies (Non-Technical)

These must be resolved before the indicated phase can close:

| Dependency | Required By | Owner |
|------------|-------------|-------|
| Alkemia brand accent color decision | Phase 1 close | User |
| Font licensing decision (Inter or custom) | Phase 1 close | User |
| Contentful space created with IT/EN locales | Phase 2 start | User |
| Alkemia Vimeo account and hero video URL | Phase 5 close | User |

---

*Created: 2026-03-14*
*Last updated: 2026-03-14 after planning Phase 3*
