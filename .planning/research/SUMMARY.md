# Research Summary: Alkemia Capital Website

**Project:** Alkemia Capital — premium PE/VC corporate website (replica of hgcapital.com aesthetic)
**Synthesized:** 2026-03-14
**Research files:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

---

## Executive Summary

Alkemia Capital is an Italian SGR (asset management company) building a premium corporate website modeled structurally and aesthetically on hgcapital.com. The stack is effectively non-negotiable: Next.js 15 (App Router), Contentful CMS, styled-components v6, GSAP + Lenis for animations, next-intl for Italian/English i18n, and Vercel for hosting. All these choices mirror what HG Capital actually uses in production, verified through DOM analysis and official documentation. The key implementation insight is that this is a **static-first architecture** — virtually all pages are pre-rendered at build time (SSG) with on-demand ISR triggered by Contentful webhooks. No server-side rendering needed for public pages.

The feature set is well-understood from live analysis of hgcapital.com. The site requires a full-screen Vimeo video hero, scroll-triggered GSAP animations, bilingual content (IT default, EN secondary), portfolio/team/insights grids backed by Contentful, and a full GDPR compliance layer (cookie consent, Privacy Notice, Cookie Notice pages). The site targets institutional investors and LPs — the premium feel is a functional requirement, not a nice-to-have. Italian Garante enforcement on cookie consent is active; this is a legal baseline, not polish.

The primary technical risks are concentrated in the foundation phase: styled-components SSR hydration setup must be done correctly before any component is written, the Contentful content model must be designed before content entry begins (migrations are costly), and i18n routing must be wired to Contentful locale fetching from day one. GSAP cleanup in SPA navigation and Vimeo video hero LCP optimization are the two most likely performance landmines in later phases. Both have clear, documented solutions — the risk is forgetting to apply them, not lack of a solution.

---

## Key Findings

### From STACK.md

| Technology | Version | Rationale |
|------------|---------|-----------|
| Next.js | 15.x | Stable App Router, avoid v16 breaking changes (async params, Turbopack default) |
| React | 18.x | More mature ecosystem with styled-components than React 19 |
| TypeScript | 5.x | Standard for premium projects; Contentful SDK and next-intl have native types |
| Contentful | SDK ^11.x | Same CMS as HG Capital; use REST Content Delivery API (not GraphQL) for SSG simplicity |
| styled-components | ^6.3.x | Same styling approach as hgcapital.com; v6.3+ supports RSC natively |
| GSAP | ^3.14.x | Industry standard for scroll-driven timeline animations; required for HG-style effects |
| Lenis | ^1.3.x | Smooth scroll with RAF ticker synced to GSAP ScrollTrigger |
| next-intl | ^4.8.x | Native App Router i18n; v4 has simplified API and TypeScript strict mode |
| Vimeo iframe | SDK ^2.x | Background video via `background=1` parameter; no react-player overhead |
| Vercel | — | Native Next.js hosting; ISR, preview URLs, Edge CDN |

**Critical version note:** Do NOT upgrade to Next.js 16. As of March 2026, Next.js 16 has breaking changes (async request APIs mandatory, Turbopack as default, middleware renamed) that destabilize the styled-components integration. Stay on 15.x and plan an upgrade post-launch.

**Contentful API choice:** Use REST CDA (Content Delivery API), not GraphQL. GraphQL has query size limits that cause problems with nested rich text, and the added complexity is not justified for a primarily static site.

### From FEATURES.md

**Table stakes (must ship at launch):**
- Fixed navigation header (sticky, hamburger on mobile)
- Full-screen video hero (Vimeo, poster fallback, muted autoplay)
- Scroll-triggered reveal animations (GSAP)
- Portfolio grid with filtering (sector, status, search, sort)
- Team grid with individual profile pages
- News/Insights section with category filtering (News, Insights, Podcast)
- ESG/Responsible Investing page with PDF resource library
- Contact page with office locations
- Bilingual content (IT/EN) via next-intl + Contentful localization
- Cookie consent banner (GDPR-compliant, equal prominence accept/reject, blocks non-essential cookies)
- Privacy Notice and Cookie Notice pages
- SEO basics (meta tags, OG, canonical, hreflang)
- Responsive design (320px through 2560px)
- WCAG 2.1 AA accessibility

**Differentiators (premium signals):**
- Split-text hero animations (GSAP, 2s staggered reveal)
- Multi-section scroll narrative homepage (3-5 fullscreen video sections)
- Glassmorphism/noise texture overlays (CSS only)
- Governance page (mandatory for Italian SGR regulated entity)
- Investment Platforms section (PE/VC/PIPE sub-pages)
- Fund detail pages (Alkemia has 5 named funds)
- Animated stat counters (AUM, portfolio companies, etc.)
- Custom cursor element (CSS/JS, low effort)
- Culture/Life at Alkemia page (talent acquisition signal)

**Anti-features (explicitly out of scope):**
- Gated investor portal (separate system — link to external IR platform)
- Blog commenting, chat widgets, social feed embeds
- Financial calculators, e-commerce, user accounts
- AI chatbot
- Heavy third-party tracking (Italian Garante risk)

**Feature dependency chain (critical ordering):**
```
i18n setup → ALL pages (must come first)
Dark theme tokens → ALL components
Contentful content models → ALL content pages
Portfolio/Team/Insights CMS models → Grid pages
Cookie consent → Analytics (blocks until consent)
Video facade pattern → Homepage LCP score
```

### From ARCHITECTURE.md

**Architectural principles:**
- All pages are RSC by default; only animation wrappers and interactive elements use `'use client'`
- Rendering strategy: SSG + on-demand ISR (webhook triggers `revalidateTag`)
- Data flow: RSC page → `lib/contentful/client.ts` → typed mapper → render HTML → styled-components SSR registry flushes CSS → client hydration with GSAP/Vimeo

**8 Contentful content models defined:**
1. `page` (generic — Approach, Contact, Sustainability)
2. `portfolioCompany` (with platform reference, featured flag, sector)
3. `teamMember` (photo, bio rich text, board flag)
4. `newsArticle` (title, category, body rich text, external URL option)
5. `investmentPlatform` (PE/VC/PIPE, references funds)
6. `fund` (name, vintage, status, platform reference)
7. `siteConfig` (singleton — hero video URL, nav, footer links, offices)
8. `office` (city, address, map URL)

**Key architectural decisions:**
- i18n routing: `localePrefix: 'as-needed'` — Italian URLs are clean (`/portfolio`), English adds prefix (`/en/portfolio`)
- Content localization: Contentful field-level localization (not duplicate content types); locale fallback `it-IT` → `en-US`
- Build order dependency chain: Scaffolding → Content models → Layout shell → Core pages (RSC) → Animation layer → SEO/performance → Production hardening
- GSAP centralized in `gsap-init.ts`, registered once at app root
- Vimeo hero uses facade pattern: poster image first, iframe injected after mount/intersection

**Component boundary table:**

| Component | Type | Reason |
|-----------|------|--------|
| Page files (`page.tsx`) | RSC | Data fetching |
| `<Header>` shell | RSC | Static nav |
| `<MobileMenu>` | Client | Open/close state |
| `<AnimatedSection>` | Client | GSAP needs DOM |
| `<HeroVideo>` | Client | Vimeo + IntersectionObserver |
| `<PortfolioGrid>` | RSC | Static filtered grid |
| `<FilterBar>` | Client | Filter state |
| `<StyledRegistry>` | Client | `useServerInsertedHTML` |
| All card components | RSC | Pure presentation |

### From PITFALLS.md

**Top 5 critical pitfalls and prevention:**

1. **Styled Components SSR hydration mismatch** — Install `StyledComponentsRegistry` using `useServerInsertedHTML` in root layout before writing any component. Use `compiler: { styledComponents: true }` in `next.config.js`. Do this in Phase 1 or pay for it with rewrite costs.

2. **GSAP ScrollTrigger memory leaks on SPA navigation** — Always use `useGSAP()` hook (from `@gsap/react`), never raw `useEffect`. Register GSAP plugins once in `gsap-init.ts`. Call `ScrollTrigger.refresh()` after `usePathname()` changes. Validate with `ScrollTrigger.getAll().length` check across navigation.

3. **Dark theme FOUC (flash of unstyled content)** — Define the entire dark palette as CSS custom properties on `:root` in a global stylesheet, not as JS ThemeProvider values. Colors must be present from first CSS parse before any JS executes. Phase 1 architecture decision.

4. **Contentful build-time 429 rate limit errors** — Fetch all entries of a type in one batch call, not per-page. Use the official `contentful` SDK (has built-in retry with exponential backoff). Cache with `next: { revalidate: false }` tags. Use ISR for dynamic content.

5. **next-intl locale routing not wired to Contentful locale** — Every Contentful API call must receive `locale` from route params. Map `it` → `it-IT` and `en` → `en-US`. Generate static params for both locales on every dynamic route. Do NOT mix Next.js built-in `i18n` config with next-intl middleware.

**Additional moderate pitfalls to watch:**
- Video hero blocking LCP: use poster image first, lazy-inject Vimeo iframe, add `dnt=1` param
- Framer Motion forcing Client Components too high in tree (use GSAP instead for scroll animations)
- Hard-coded GSAP pixel values breaking on resize (use percentage/viewport-relative values always)
- WCAG contrast failures on dark palette + red accent (check every color pair before writing CSS)
- CLS from Contentful images without explicit dimensions (use `fill` + aspect-ratio containers)
- Safari: CSS scroll-driven animations not supported until Safari 26; use GSAP for all scroll animations

---

## Implications for Roadmap

The architecture research explicitly defines a 7-phase build order based on technical dependencies. The feature research defines a 3-phase MVP recommendation. These are compatible and should be merged.

### Suggested Phase Structure

**Phase 1: Foundation**
- Next.js 15 + TypeScript project scaffolding
- styled-components setup: `StyledRegistry`, `GlobalStyle`, `theme.ts` with CSS custom properties for dark palette (prevents FOUC)
- next-intl routing setup: middleware, `routing.ts`, message files `it.json` / `en.json`
- Contentful client: `lib/contentful/client.ts`, environment variables, base fetch pattern with cache tags
- Vercel project setup, environment variables, `vercel.json` headers config
- **Pitfall gates:** StyledRegistry before any component; CSS custom properties before any color CSS; next-intl middleware before any page; `next build` test early to catch TypeScript errors
- *Standard patterns — no additional research needed*

**Phase 2: Content Infrastructure**
- Define all 8 Contentful content models in the space
- Seed Alkemia data from existing content sources
- TypeScript types mirroring all content models (`types/contentful.ts`)
- Contentful queries (REST) per content type with locale parameter
- Response mappers: raw API → typed domain objects
- **Pitfall gates:** Max 3-level nesting, max 20 fields per type; enable field-level localization with `it-IT` → `en-US` fallback; batch fetches not per-page
- *Standard patterns — no additional research needed*

**Phase 3: Layout Shell**
- Header: navigation, locale switcher, mobile menu (RSC shell + Client MobileMenu)
- Footer: legal links, office links, social icons (RSC, fetches from siteConfig)
- Page transition wrapper
- Cookie consent banner (GDPR-compliant; this is a legal requirement, not polish — ship in Phase 3)
- Privacy Notice + Cookie Notice static pages
- **Pitfall gates:** Cookie consent must block non-essential cookies; equal prominence accept/reject
- *Standard patterns — no additional research needed*

**Phase 4: Core Pages (static content, no animations)**
- Homepage shell (structure only, video poster, copy — no GSAP yet)
- Portfolio grid + detail pages (RSC data fetching, filtering via Client FilterBar)
- Team grid + profile pages
- Insights/News listing + article pages
- Approach, Contact, Sustainability/ESG pages
- Investment Platforms + Fund detail pages
- Governance page (regulatory requirement for Italian SGR)
- **Pitfall gates:** Pass `params.locale` to every Contentful call; `generateStaticParams` for both locales on every dynamic route; `next/image` with `fill` + aspect-ratio containers for all grids
- *Standard patterns — no additional research needed*

**Phase 5: Animation Layer**
- GSAP centralized init (`gsap-init.ts`) + `useGSAP` hook pattern
- `<AnimatedSection>` wrapper component (fadeUp/fadeIn/slideLeft)
- Homepage: Vimeo hero facade (poster → iframe after mount), title split-text animation
- ScrollTrigger on all section reveals
- Counter animations (stats bar)
- NavBar scroll behavior (hide/show)
- Lenis smooth scroll integration (ticker synced to GSAP RAF)
- Multi-section scroll narrative (3 fullscreen video sections)
- **Pitfall gates:** `useGSAP()` not `useEffect`; centralized plugin registration; percentage-based trigger values; `ScrollTrigger.refresh()` on route change; disable pin animations on mobile (`matchMedia`); `svh` units for full-screen sections; test on physical iOS Safari device
- **Flag for research:** GSAP + Lenis integration pattern for Next.js 15 App Router (MEDIUM confidence in current research — confirm exact RAF sync implementation)

**Phase 6: SEO + Performance**
- `generateMetadata` per page type with hreflang alternates
- JSON-LD structured data (Organization, Person, NewsArticle, LocalBusiness, ItemList)
- `sitemap.ts` + `robots.ts` auto-generated from Contentful slugs
- Image optimization: `sizes`, `loader` for Contentful CDN transforms, `priority` flags on above-fold images
- Lighthouse audit and targeted fixes
- *Standard patterns — no additional research needed*

**Phase 7: Production Hardening**
- Contentful webhook → `/api/revalidate` wiring with `revalidateTag`
- Draft Mode preview flow for editors
- Error boundaries and `not-found` pages
- WCAG 2.1 AA accessibility audit (keyboard nav, contrast, alt text, focus indicators)
- Safari cross-browser testing (all animated sections)
- Final Vercel deployment config
- *Standard patterns — no additional research needed*

### Phase Dependency Chain

```
Phase 1 (Foundation)
    └── Phase 2 (Content Models) — must define models before fetching data
        └── Phase 3 (Layout Shell) — shell needed before page composition
            └── Phase 4 (Core Pages) — static structure before adding animation
                └── Phase 5 (Animations) — needs DOM structure to target
                    ├── Phase 6 (SEO/Performance) — can partially overlap with Phase 5
                    └── Phase 7 (Production Hardening) — final step
```

---

## Research Flags

| Phase | Research Needed | Reason |
|-------|----------------|--------|
| Phase 1 | No | styled-components SSR, next-intl routing, Vercel config are all well-documented with HIGH confidence sources |
| Phase 2 | No | Contentful content modeling patterns are well-documented; 8 models already defined with full field specs |
| Phase 3 | No | Header/footer patterns and GDPR cookie consent implementation are standard |
| Phase 4 | No | Next.js App Router data fetching patterns are well-documented |
| Phase 5 | **Yes** | GSAP + Lenis + Next.js 15 App Router integration has MEDIUM confidence only. Confirm: (1) exact RAF sync setup for Lenis + GSAP ticker in a Provider component, (2) `ScrollTrigger.refresh()` timing after App Router soft navigation, (3) mobile performance approach for multi-section video scroll |
| Phase 6 | No | Standard Next.js SEO patterns |
| Phase 7 | No | Contentful webhook ISR, Draft Mode, and WCAG audit are well-documented |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack selection | HIGH | All choices verified against official documentation; mirrors HG Capital production stack |
| Contentful REST API choice | HIGH | Official Contentful + community sources agree GraphQL is problematic for SSG with rich text |
| styled-components v6 SSR setup | HIGH | Official Next.js docs + vercel/next.js discussion thread |
| next-intl v4 routing | HIGH | Official next-intl.dev documentation |
| Vimeo background video | HIGH | Official Vimeo Help Center parameters documented |
| Contentful content models | HIGH | All 8 models defined with field-level spec; based on Alkemia's known content |
| Feature completeness | HIGH | Based on live hgcapital.com analysis + project constraints (PROJECT.md) |
| GSAP + Lenis integration | MEDIUM | Multiple sources agree on the pattern but exact Next.js 15 App Router implementation details need validation in Phase 5 |
| Animation performance on mobile | MEDIUM | Pitfalls well-documented; specific Lenis v1.3 + GSAP v3.14 combo needs hands-on validation |
| WCAG palette compliance | LOW | Alkemia accent color TBD in theme.ts; contrast ratios cannot be validated until design tokens are finalized |

**Overall confidence: HIGH** — the unknowns are tactical (animation integration details, final palette) not strategic (stack, architecture, feature scope).

### Gaps to Address

1. **Alkemia brand accent color** — `theme.ts` has `accent: '#[TBD]'`. The accent color must be contrast-checked against `#0D1117` background before any CSS is written. Block Phase 1 completion on this decision.

2. **GSAP + Lenis RAF sync in App Router** — Phase 5 should start with a proof-of-concept: initialize Lenis in a `'use client'` Provider, sync to `gsap.ticker`, set as ScrollTrigger proxy, and verify `ScrollTrigger.refresh()` timing after `usePathname()` changes. Do not assume the pattern works until tested.

3. **Alkemia Vimeo account and video asset** — The homepage hero requires a Vimeo video URL. Phase 4 can proceed with a poster image placeholder, but Phase 5 (animation layer) is blocked without the actual Vimeo video.

4. **Contentful space creation and localization setup** — Phase 2 requires an active Contentful space with `it-IT` and `en-US` locales configured and a `CONTENTFUL_SPACE_ID`. This is a non-technical dependency that must be resolved before Phase 2 begins.

5. **Font licensing** — `theme.ts` uses `'Inter'` as a substitute. HG Capital may use a licensed font. Confirm Alkemia's typography decision before Phase 1 completes.

---

## Sources (Aggregated)

### HIGH Confidence
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Next.js 16 Breaking Changes](https://nextjs.org/blog/next-16)
- [Contentful + Next.js App Router (official guide)](https://www.contentful.com/blog/integrate-contentful-next-js-app-router/)
- [styled-components v6.3 + Next.js 15 App Router](https://github.com/vercel/next.js/discussions/66820)
- [Next.js CSS-in-JS official docs](https://nextjs.org/docs/app/guides/css-in-js)
- [next-intl v4.0 release](https://next-intl.dev/blog/next-intl-4-0)
- [next-intl App Router with i18n routing](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing)
- [Vimeo background embed parameters](https://help.vimeo.com/hc/en-us/articles/12426285089681-About-embedding-background-and-Chromeless-videos)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Next.js ISR with Contentful](https://www.contentful.com/blog/nextjs-isr/)
- [Content modeling patterns (Contentful Help Center)](https://www.contentful.com/help/content-models/content-modeling-patterns/)
- [Italian Garante cookie consent enforcement (Didomi)](https://www.didomi.io/blog/italian-garante-new-guidelines)
- [Lenis npm v1.3.18](https://www.npmjs.com/package/lenis)
- hgcapital.com live analysis (homepage, portfolio, team, insights, approach, contact) — 2026-03-14

### MEDIUM Confidence
- [GSAP ScrollTrigger + Lenis pattern](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap)
- [GSAP + Next.js 15 init and cleanup](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232)
- [Contentful GraphQL pain points](https://medium.com/@nicholasrussellconsulting/contentful-graphql-api-pain-points-with-next-js-why-i-resurrected-rest-6cfdf3537e4c)
- [2025 PE/VC website design trends (MVP Design)](https://mvpdesign.com/blog/2025s-top-ten-trends-in-private-equity-and-investment-banking-website-design/)
- [PE/VC website must-haves (TBH Creative)](https://www.tbhcreative.com/blog/family-office-websites-and-private-equity-web-design/)
