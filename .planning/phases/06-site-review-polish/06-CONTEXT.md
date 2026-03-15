# Phase 6: Site Review & Layout Polish - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Systematic page-by-page review and polish of the entire site. Add GSAP scroll reveals to all internal pages, upgrade card hover effects, add hero animations to internal pages, upgrade mobile menu to GSAP, verify and optimize content on detail pages (text completeness, image availability), and ensure responsive quality on mobile matches desktop premium feel. No new pages, no new features — only polish of what exists.

</domain>

<decisions>
## Implementation Decisions

### Review Method
- **Approach:** Systematic page-by-page review, not ad-hoc
- **Benchmark:** HG Capital as reference but NOT pixel-perfect copy — current direction is good, adopt further ideas where they add value
- **Quality bar:** Practically perfect polish — no compromises
- **Judge:** User approves each page. No external reviewers for now.
- **Page order:** To be determined during planning (likely: homepage → portfolio → team → news → then content pages)

### Scroll Reveals on ALL Pages
- **Scope:** Every page gets GSAP scroll-triggered reveals (fade-up/fade-in)
- **Includes:** Portfolio grid, team grid, news list, investment platforms, società, governance, ESG, contatti, culture, privacy, cookie policy
- **Pattern:** Reuse gsap.matchMedia() + useGSAP() pattern from Phase 5 animated components
- **Reduced motion:** Respected on all new animations (same as Phase 5)

### Card Hover Effects Upgrade
- **Current:** Basic CSS translateY(-4px) + image scale(1.03)
- **Target:** More sophisticated hovers matching premium PE/VC feel (color wipe, image zoom, overlay transitions)
- **Applies to:** PortfolioCard, TeamCard, NewsCard, FundCard
- **Approach:** CSS-first where possible, GSAP only if CSS can't achieve the desired effect

### Internal Page Hero Animations
- **Current:** Static image + overlay + title
- **Target:** Add parallax effect on scroll + text reveal animation (like homepage hero but lighter)
- **Applies to:** All pages with hero banners (portfolio, team, news, about, sustainability, platforms)
- **Keep it lighter than homepage** — no split-text stagger, just clean fade-in + parallax

### Detail Pages Polish
- **Same polish level** as listing pages — not "simple and clean"
- **Content verification:** Check for missing text, incomplete descriptions, placeholder content
- **Images:** Portfolio company images are missing — will be sourced together with user during execution
- **Text optimization:** Review and improve copy in both IT and EN where needed

### Mobile Menu Upgrade
- **Current:** CSS transition-delay stagger
- **Target:** GSAP timeline animation for smoother, more premium feel
- **Follow Phase 5 patterns:** useGSAP(), gsap.matchMedia()

### Responsive Quality
- **Mobile as important as desktop** — investors may browse from phone
- **Desktop is primary verification device** (user's main screen)
- **Breakpoints to check:** 320px, 768px, 1024px, 1440px, 2560px
- **All pages must work flawlessly at every breakpoint**

### Portfolio Company Images
- **Status:** Missing — not currently in Contentful or public/images
- **Plan:** User will source images together with Claude during execution
- **This may require Contentful updates** (upload images, link to entries)
- **Blocking:** Detail page polish depends on having images available

### Claude's Discretion
- Exact animation timings and easings for internal page reveals
- Specific hover effect designs for each card type
- How to structure the review (all animations first, then content, or page-by-page)
- Which detail pages need the most content attention
- How to handle pages where images aren't available yet (placeholder vs. skip)

</decisions>

<specifics>
## Specific Ideas

- The review should feel like a "final walkthrough before the client sees it"
- Card hovers should feel intentional and premium — not just "a thing moves"
- Internal page heroes should have just enough animation to feel alive, not compete with homepage
- Detail pages for portfolio companies are the "money pages" for investors — they need to be complete and polished
- Mobile menu GSAP upgrade should feel as smooth as HG Capital's fullscreen menu overlay

</specifics>

<code_context>
## Existing Code Insights

### Components to Upgrade
- `src/components/cards/PortfolioCard.tsx` — hover: translateY(-4px), image scale(1.03)
- `src/components/cards/TeamCard.tsx` — hover: translateY, image scale(1.05)
- `src/components/cards/NewsCard.tsx` — hover: translateY(-4px), image scale(1.03)
- `src/components/cards/FundCard.tsx` — hover effects TBD
- `src/components/layout/MobileMenu.tsx` — CSS transition-delay stagger

### Pages to Add Scroll Reveals
- `src/app/[locale]/portfolio/page.tsx` + `[slug]/page.tsx`
- `src/app/[locale]/team/page.tsx` + `[slug]/page.tsx`
- `src/app/[locale]/news/page.tsx` + `[slug]/page.tsx`
- `src/app/[locale]/investment-platforms/page.tsx` + `[slug]/page.tsx`
- `src/app/[locale]/societa/page.tsx`
- `src/app/[locale]/corporate-governance/page.tsx`
- `src/app/[locale]/sostenibilita/page.tsx`
- `src/app/[locale]/contatti/page.tsx`
- `src/app/[locale]/culture/page.tsx`
- `src/app/[locale]/privacy/page.tsx`
- `src/app/[locale]/cookie-policy/page.tsx`

### Reusable Patterns from Phase 5
- `src/lib/gsap-init.ts` — GSAP + ScrollTrigger registration
- `gsap.matchMedia()` with reduceMotion condition
- `useGSAP()` hook with scope
- `ScrollTrigger` for scroll-triggered reveals
- LenisProvider for smooth scroll (currently homepage-only — may extend to layout)

### Hero Components
- `src/components/sections/HeroSection.tsx` — static hero (used by internal pages)
- `src/components/sections/animated/VideoHero.tsx` — animated hero (homepage only)
- Internal pages use HeroSection or custom hero markup

### Established Patterns
- Server Components for data fetching, Client Components for interactivity
- styled-components with CSS custom properties
- next-intl useTranslations() for UI labels
- Contentful fetchers for all content

</code_context>

<deferred>
## Deferred Ideas

- **Lenis smooth scroll on all pages** — Currently homepage-only. Could extend to layout-level in Phase 8 if desired.
- **Portfolio company images** — User will source during execution. If not all available, defer remaining to Phase 8.
- **Page transition animations** — Cross-page transitions (fade between routes). Not in Phase 6 scope.

</deferred>

---

*Phase: 06-site-review-polish*
*Context gathered: 2026-03-15*
