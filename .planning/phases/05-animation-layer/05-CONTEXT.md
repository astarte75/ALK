# Phase 5: Animation Layer - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

GSAP scroll-triggered animations, Lenis smooth scroll, video hero with MP4 background, 4-panel scroll narrative with parallax images, animated stat counters, staggered reveals on all homepage sections. Scope: homepage only. No animation changes to internal pages, card hovers, or custom cursor.

</domain>

<decisions>
## Implementation Decisions

### Video Hero
- **Video source:** Local MP4 (`/videos/hero-bg.mp4`) — stock video, not Vimeo
- **No poster flash:** Video element only, no `<Image>` poster overlay. Background is dark (#1A1E22) while video loads — seamless with theme
- **Fallback:** If autoplay blocked, user sees dark bg + animated text (acceptable)
- **Split-text animation:** Words wrapped in `<span>` with staggered `translateY` reveal (like HG Capital's `split__text` pattern), using GSAP timeline
- **Parallax on scroll:** Hero content moves up + fades as user scrolls down

### Scroll Narrative (4 panels)
- **Panel 1:** "Oltre il capitale" — mission, partner approach (image: hero-about.jpg)
- **Panel 2:** "Piattaforme di investimento" — PE/VC/PIPE strategies (image: hero-platforms.jpg)
- **Panel 3:** "Creazione di valore" — portfolio track record (image: hero-portfolio.jpg)
- **Panel 4:** "La nostra squadra" — team/culture (image: hero-team.jpg)
- **English equivalents:** "Beyond Capital", "Investment Platforms", "Value Creation", "Our Team"
- **Each panel:** Fullscreen (100svh), static image with parallax effect, dark gradient overlay, fade-up content reveal on scroll, large faded panel number (01-04) in corner
- **No video in panels:** Static images with parallax — video only in hero. Videos can be added later when available.
- **Mobile:** Same images, same animations (GSAP handles performance). Pin animations disabled via ScrollTrigger.matchMedia if needed.

### Animation Style & Intensity
- **Approach:** Premium but not excessive — matching HG Capital quality
- **Hero:** Split-text stagger (0.08s per word), logo fade-in, gold accent bar grows, subtitle fade-in — total sequence ~2.5s
- **Scroll reveals:** fade-up (y: 40-60px → 0, opacity: 0 → 1) with power3.out easing
- **Stats:** Counter animation counting from 0 to value over 2s on scroll enter
- **News cards:** Staggered fade-up (0.15s between cards)
- **Newsletter strip:** Simple fade-up on scroll
- **Scroll indicator:** Pulsing line at hero bottom
- **prefers-reduced-motion:** All animations instant/disabled — fully respected

### Animation Scope (Phase 5)
- **Homepage only** — all animations scoped to homepage-v2
- **Internal pages:** No scroll reveals added (can be Phase 5.1 if desired)
- **Card hovers:** Stay CSS transitions (already working well)
- **Custom cursor:** Stays as-is with useEffect + rAF (not converted to GSAP)
- **Header/Footer:** No animation changes
- **Mobile menu:** Stays CSS transition-delay stagger (already works)

### Technical Stack
- **GSAP:** Core + ScrollTrigger (free plugins only)
- **@gsap/react:** useGSAP hook for all animations
- **Lenis:** Smooth scroll with RAF synced to gsap.ticker
- **No SplitText plugin:** Manual word-splitting (SplitText is paid GSAP Club)
- **No ScrollSmoother:** Using Lenis instead (ScrollSmoother is paid)
- **gsap-init.ts:** Plugin registration once at import
- **LenisProvider:** Client component wrapping homepage content

### Proof-of-Concept Status
- **COMPLETED:** Lenis + GSAP + video hero + scroll narrative + animated stats + staggered reveals all working in `/homepage-v2` route
- **Validated:** TypeScript compiles, page renders 200, animations run smoothly
- **Remaining:** Migrate from test route to production homepage, cleanup, edge cases

### Claude's Discretion
- Exact easing curves and durations (within premium feel)
- ScrollTrigger start/end positions
- Parallax intensity values
- How to handle LenisProvider placement (page-level vs layout-level)
- Whether to keep homepage-v2 route or replace original homepage
- Mobile breakpoint for disabling pin animations if needed

</decisions>

<specifics>
## Specific Ideas

- HG Capital uses 5 Vimeo videos (1 hero + 4 narrative panels) — Alkemia uses 1 MP4 hero + 4 static images with parallax. When Alkemia has its own videos, swap image → video in Contentful without code changes.
- The "Oltre il capitale" title differentiates from the hero headline "Passione per l'impresa" — each narrative panel has its own identity
- Panel numbers (01-04) in large faded text add depth without cluttering
- The gold accent bar growing animation in the hero ties back to the brand identity

</specifics>

<code_context>
## Existing Code Insights

### New Files Created (Phase 5 POC)
- `src/lib/gsap-init.ts` — GSAP + ScrollTrigger plugin registration
- `src/components/providers/LenisProvider.tsx` — Lenis smooth scroll with GSAP ticker sync
- `src/components/sections/animated/VideoHero.tsx` — Video hero with split-text reveal
- `src/components/sections/animated/ScrollNarrative.tsx` — 4-panel fullscreen scroll narrative
- `src/components/sections/animated/AnimatedStats.tsx` — Counter animation on scroll
- `src/components/sections/animated/AnimatedNewsPreview.tsx` — Staggered card reveals
- `src/components/sections/animated/AnimatedNewsletterStrip.tsx` — Fade-in on scroll
- `src/app/[locale]/homepage-v2/page.tsx` — Test route (server component, data fetching)
- `src/app/[locale]/homepage-v2/HomepageV2Client.tsx` — Client wrapper with LenisProvider
- `public/videos/hero-bg.mp4` — Stock video for hero background

### Dependencies Added
- `gsap` — animation engine
- `@gsap/react` — useGSAP hook
- `lenis` — smooth scroll

### Integration Points
- Homepage data still from Contentful (`getPageBySlug('homepage', locale)`)
- News cards reuse existing `NewsCard` component
- All theme tokens and breakpoints from existing system
- Scroll narrative default content hardcoded in component (IT + EN) — can be moved to Contentful later

</code_context>

<deferred>
## Deferred Ideas

- **Internal page scroll reveals:** Fade-up animations on portfolio, team, news pages — could be Phase 5.1
- **Custom cursor GSAP migration:** Convert from useEffect+rAF to GSAP ticker for smoother feel
- **Vimeo integration:** When Alkemia has a Vimeo account, replace local MP4 with Vimeo embed (facade pattern)
- **Narrative panel videos:** Replace static images with looping video backgrounds when videos are available
- **Mobile menu GSAP:** Upgrade CSS transition-delay stagger to proper GSAP timeline
- **Move narrative content to Contentful:** Currently hardcoded defaults, could be `page.sections` field

</deferred>

---

*Phase: 05-animation-layer*
*Context gathered: 2026-03-15*
