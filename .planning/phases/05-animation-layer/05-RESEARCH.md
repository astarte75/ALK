# Phase 5: Animation Layer - Research

**Researched:** 2026-03-15
**Domain:** GSAP scroll animations, Lenis smooth scroll, video hero, Next.js 15 App Router integration
**Confidence:** HIGH

## Summary

Phase 5 migrates a working POC (at `/homepage-v2`) to the production homepage. The POC already validates the core integration: GSAP 3.14 + @gsap/react useGSAP hook + Lenis 1.3 smooth scroll + ScrollTrigger. The existing code is solid but has two fixable issues: (1) Lenis is constructed without `autoRaf: false`, causing a double RAF loop, and (2) the ticker cleanup references `lenis.raf` incorrectly instead of the actual callback added to `gsap.ticker`. Additionally, `lenis.on('scroll', ScrollTrigger.update)` is missing, which is needed to keep ScrollTrigger in sync.

The migration itself is straightforward: replace the current homepage's static components with their animated counterparts, wrapped in a client boundary with LenisProvider. The main risks are (a) ScrollTrigger position recalculation after Next.js soft navigations, (b) mobile performance with 4 fullscreen parallax panels, and (c) proper cleanup to avoid memory leaks on route changes.

**Primary recommendation:** Fix the LenisProvider's RAF sync pattern (add `autoRaf: false`, store ticker callback in a variable for proper cleanup, add `ScrollTrigger.update` listener), then use `gsap.matchMedia()` to unify responsive breakpoints and `prefers-reduced-motion` in a single API instead of scattered `window.matchMedia` checks.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Video hero: local MP4 (`/videos/hero-bg.mp4`), no poster overlay, dark bg fallback
- Split-text animation: manual word-wrapping in `<span>`, GSAP timeline stagger (no SplitText plugin)
- Scroll narrative: 4 panels with static images + parallax, not video
- Animation style: premium but not excessive, matching HG Capital quality
- Scope: homepage only, no animation changes to internal pages, card hovers, or custom cursor
- Tech: GSAP Core + ScrollTrigger (free plugins only), @gsap/react useGSAP, Lenis smooth scroll
- No SplitText plugin (paid GSAP Club), no ScrollSmoother (paid)
- gsap-init.ts for plugin registration, LenisProvider as client component
- prefers-reduced-motion: all animations instant/disabled

### Claude's Discretion
- Exact easing curves and durations (within premium feel)
- ScrollTrigger start/end positions
- Parallax intensity values
- LenisProvider placement (page-level vs layout-level)
- Whether to keep homepage-v2 route or replace original homepage
- Mobile breakpoint for disabling pin animations if needed

### Deferred Ideas (OUT OF SCOPE)
- Internal page scroll reveals (Phase 5.1)
- Custom cursor GSAP migration
- Vimeo integration
- Narrative panel videos
- Mobile menu GSAP upgrade
- Move narrative content to Contentful
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Full-screen video hero with poster fallback, muted autoplay | Video autoplay policies, 100svh viewport units, VideoHero component pattern |
| HOME-02 | Bold headline with split-text staggered reveal (GSAP) | useGSAP hook with scope, manual word-splitting pattern (no SplitText plugin) |
| HOME-03 | 4-5 full-height scroll sections with background images and text overlay | ScrollNarrative component, parallax via ScrollTrigger scrub, gsap.matchMedia for mobile |
| HOME-04 | Scroll-triggered fade/reveal animations on all sections | useGSAP + ScrollTrigger patterns, toggleActions, gsap.matchMedia for reduced-motion |
| HOME-05 | Insights preview showing latest 3 news cards | AnimatedNewsPreview staggered fade-up pattern |
| HOME-06 | Animated stat counters | AnimatedStats counter pattern with ScrollTrigger.create + once:true |
| HOME-07 | Newsletter signup strip | AnimatedNewsletterStrip fade-up pattern |
| HOME-08 | Smooth scroll experience (Lenis) | Lenis + GSAP ticker sync, autoRaf:false, cleanup pattern |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | 3.14.2 | Animation engine | Industry standard for scroll animations, GPU-accelerated transforms |
| @gsap/react | latest | useGSAP hook | Official React integration, automatic cleanup via gsap.context() |
| lenis | 1.3.18 | Smooth scroll | Community standard for smooth scroll (Darkroom Engineering), lightweight |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| gsap/ScrollTrigger | (bundled) | Scroll-triggered animations | Every scroll-based animation |
| next/image | (bundled) | Optimized images in panels | Parallax panel backgrounds |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Lenis | ScrollSmoother (GSAP) | ScrollSmoother is paid (GSAP Club); Lenis is free and well-supported |
| Manual word split | SplitText (GSAP) | SplitText is paid; manual `<span>` wrapping works fine for headlines |
| gsap.matchMedia() | Per-component window.matchMedia | matchMedia() provides automatic cleanup and unified conditions |

**Installation:** Already installed. No new packages needed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/gsap-init.ts                          # Plugin registration (singleton)
├── components/providers/LenisProvider.tsx     # Lenis + GSAP ticker sync (page-level)
├── components/sections/animated/             # All animated homepage sections
│   ├── VideoHero.tsx                         # Video background + split-text reveal
│   ├── ScrollNarrative.tsx                   # 4-panel fullscreen scroll narrative
│   ├── AnimatedStats.tsx                     # Counter animation
│   ├── AnimatedNewsPreview.tsx               # Staggered card reveals
│   └── AnimatedNewsletterStrip.tsx           # Fade-in on scroll
├── app/[locale]/page.tsx                     # Production homepage (server component)
└── app/[locale]/HomepageClient.tsx           # Client boundary with LenisProvider
```

### Pattern 1: Correct Lenis + GSAP Ticker Sync
**What:** Single RAF loop driven by GSAP, Lenis synced as consumer
**When to use:** Always — this is the only correct pattern for Lenis + GSAP coexistence
**Example:**
```typescript
// Source: https://github.com/darkroomengineering/lenis README + GSAP forum recommendations
'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      autoRaf: false, // CRITICAL: prevent double RAF loop
    })
    lenisRef.current = lenis

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP ticker (single RAF loop)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000) // GSAP time is seconds, Lenis expects ms
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0) // Prevents scroll jumps on tab refocus

    return () => {
      gsap.ticker.remove(tickerCallback) // Correct cleanup: same function reference
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
```

### Pattern 2: useGSAP with Scope and gsap.matchMedia
**What:** Unified responsive + accessibility handling via gsap.matchMedia inside useGSAP
**When to use:** Every animated component — replaces scattered window.matchMedia checks
**Example:**
```typescript
// Source: https://gsap.com/docs/v3/GSAP/gsap.matchMedia/
useGSAP(() => {
  const mm = gsap.matchMedia()

  mm.add({
    isDesktop: '(min-width: 768px)',
    isMobile: '(max-width: 767px)',
    reduceMotion: '(prefers-reduced-motion: reduce)',
  }, (context) => {
    const { isDesktop, isMobile, reduceMotion } = context.conditions!

    if (reduceMotion) {
      // Instant reveal — no animations
      gsap.set('[data-word-inner]', { y: 0 })
      gsap.set('[data-subtitle]', { opacity: 1 })
      return
    }

    // Desktop: full animation suite
    if (isDesktop) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to('[data-word-inner]', { y: 0, duration: 0.9, stagger: 0.08 })
      // ...
    }

    // Mobile: simplified (no pin, shorter distances)
    if (isMobile) {
      gsap.from('[data-panel-title]', {
        y: 30, opacity: 0, duration: 0.6,
        scrollTrigger: { trigger: panel, start: 'top 85%' }
      })
    }
  })
}, { scope: containerRef })
```

### Pattern 3: Server Component + Client Boundary
**What:** Data fetching in server component, animations in client wrapper
**When to use:** Homepage (and any page needing GSAP)
**Example:**
```typescript
// page.tsx (Server Component — fetches data)
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [page, articles] = await Promise.all([...])
  return <HomepageClient locale={locale} sections={s} newsCards={newsCards} />
}

// HomepageClient.tsx (Client Component — wraps with LenisProvider)
'use client'
export default function HomepageClient({ locale, sections, newsCards }) {
  return (
    <LenisProvider>
      <VideoHero ... />
      <ScrollNarrative ... />
      <AnimatedStats ... />
      ...
    </LenisProvider>
  )
}
```

### Anti-Patterns to Avoid
- **Double RAF loop:** Never create Lenis without `autoRaf: false` when syncing to GSAP ticker — causes jank and double updates
- **useEffect for GSAP:** Always use `useGSAP()` hook, never `useEffect` for animations — `useGSAP` provides automatic cleanup via gsap.context()
- **Animating layout properties:** Never animate `top`, `left`, `width`, `height` with GSAP — use `x`, `y`, `scale`, `opacity` (GPU-composited)
- **Cleanup by wrong reference:** Store the ticker callback in a variable, don't try to remove `lenis.raf` — the reference won't match
- **Scattered prefers-reduced-motion:** Don't check `window.matchMedia` in every component — use `gsap.matchMedia()` conditions once per component

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered animations | IntersectionObserver + CSS classes | GSAP ScrollTrigger | Precise scrub, pin, progress tracking, responsive breakpoints |
| Smooth scroll | Custom RAF loop + lerp | Lenis | Touch handling, momentum, native scroll events preserved, accessibility |
| Responsive animation toggling | Manual resize listeners | gsap.matchMedia() | Auto-cleanup, revert on mismatch, handles multiple conditions |
| Split text animation | DOM manipulation + CSS keyframes | GSAP timeline with manual `<span>` wrapping | Precise stagger control, easing, sequencing |
| Counter animation | setInterval + state updates | GSAP .to() with onUpdate | Single RAF loop, easing, no React re-renders |
| Parallax effect | Scroll listener + transform | ScrollTrigger scrub: true | Correct position calc, responsive, auto-cleanup |

**Key insight:** GSAP's value is unified timing, cleanup, and GPU acceleration. Any hand-rolled solution will miss edge cases (tab visibility, RAF sync, mobile touch, reduced motion).

## Common Pitfalls

### Pitfall 1: Lenis Double RAF Loop
**What goes wrong:** Smooth scroll feels "doubled" or jittery; animations stutter
**Why it happens:** Lenis defaults to running its own RAF. When GSAP ticker also drives lenis.raf(), there are two competing loops
**How to avoid:** Always set `autoRaf: false` in Lenis constructor when using GSAP ticker sync
**Warning signs:** Scroll speed seems doubled, console shows higher CPU usage

### Pitfall 2: ScrollTrigger Position Stale After Route Change
**What goes wrong:** ScrollTrigger markers/triggers reference wrong positions after navigating away and back
**Why it happens:** Next.js App Router preserves layout, but page content changes without full remount. ScrollTrigger positions are cached from first calculation
**How to avoid:** useGSAP hook handles cleanup automatically when component unmounts. For the homepage, since LenisProvider is page-scoped (not in layout), all ScrollTriggers are killed on navigation. On return, they are recreated fresh
**Warning signs:** Animations trigger at wrong scroll positions, pins are offset

### Pitfall 3: Ticker Callback Cleanup Mismatch
**What goes wrong:** Memory leak — Lenis RAF keeps running after component unmount
**Why it happens:** `gsap.ticker.remove()` requires the exact same function reference that was added. If you pass `lenis.raf` directly but try to remove a different reference, it silently fails
**How to avoid:** Store callback in a named variable: `const cb = (time) => lenis.raf(time * 1000)`, then `gsap.ticker.add(cb)` / `gsap.ticker.remove(cb)`
**Warning signs:** Console logs or performance profiler showing animation frames after leaving homepage

### Pitfall 4: Missing ScrollTrigger.update on Lenis Scroll
**What goes wrong:** ScrollTrigger animations lag behind or don't fire during smooth scroll
**Why it happens:** Lenis intercepts native scroll events. Without `lenis.on('scroll', ScrollTrigger.update)`, ScrollTrigger only updates on GSAP ticker ticks, not on actual scroll position changes
**How to avoid:** Always add `lenis.on('scroll', ScrollTrigger.update)` alongside the ticker sync
**Warning signs:** ScrollTrigger animations delayed, fire late or not at all

### Pitfall 5: Video Autoplay Blocked Silently on iOS
**What goes wrong:** Hero shows dark background with no video, no error
**Why it happens:** iOS Safari requires BOTH `muted` AND `playsinline` attributes for autoplay. Missing either silently blocks playback
**How to avoid:** Always include `autoPlay muted loop playsInline` on video element. The POC already does this correctly
**Warning signs:** Video works on desktop but not mobile Safari

### Pitfall 6: 100vh vs 100svh on iOS Safari
**What goes wrong:** Hero/panels extend behind Safari's address bar, content is cropped
**Why it happens:** `100vh` equals the "large viewport" on iOS (address bar retracted). `100svh` equals the "small viewport" (address bar expanded)
**How to avoid:** Use `100svh` for fullscreen sections. The POC already uses this correctly. Add `100vh` as fallback for older browsers: `height: 100vh; height: 100svh;`
**Warning signs:** Bottom of hero content hidden behind Safari toolbar on first load

### Pitfall 7: GSAP from() Gotcha — Flash of Final State
**What goes wrong:** Element briefly shows in its final position before animating "from" the starting position
**Why it happens:** `gsap.from()` sets the starting values immediately but the element may have already rendered in its final CSS state for a frame
**How to avoid:** Set initial CSS state to match the "from" values (e.g., `opacity: 0` in styled-components), or use `gsap.fromTo()` for explicit control. The POC handles this well with CSS initial states like `opacity: 0` and `transform: translateY(110%)`
**Warning signs:** Brief flash of content before animation starts

### Pitfall 8: will-change Memory Overhead
**What goes wrong:** Excessive memory consumption, especially on mobile
**Why it happens:** `will-change: transform` promotes elements to GPU layers. Too many layers = high memory
**How to avoid:** GSAP's `force3D: "auto"` (default) handles this — it promotes during animation and demotes after. Don't add `will-change` to CSS permanently
**Warning signs:** Mobile performance degradation, high GPU memory in DevTools

## Code Examples

### Correct Video Element for Cross-Browser Autoplay
```html
<!-- Source: MDN Autoplay Guide + Chrome Autoplay Policy -->
<video
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
>
  <source src="/videos/hero-bg.mp4" type="video/mp4" />
</video>
```
All four attributes are required for reliable autoplay:
- `autoPlay`: starts playback
- `muted`: required by all browsers for autoplay
- `playsInline`: prevents iOS Safari fullscreen takeover
- `loop`: continuous background loop

### gsap.matchMedia() for Responsive + Accessibility
```typescript
// Source: https://gsap.com/docs/v3/GSAP/gsap.matchMedia/
const mm = gsap.matchMedia()

mm.add({
  isDesktop: '(min-width: 768px)',
  isMobile: '(max-width: 767px)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
}, (context) => {
  const { isDesktop, isMobile, reduceMotion } = context.conditions!

  if (reduceMotion) {
    // Set final states immediately, no animation
    gsap.set('.hero-content', { opacity: 1, y: 0 })
    return // No ScrollTrigger cleanup needed — matchMedia handles it
  }

  if (isDesktop) {
    ScrollTrigger.create({
      trigger: '.panel',
      pin: true,
      start: 'top top',
      end: '+=100%',
      scrub: true,
    })
  }

  // isMobile: simpler fade-ups, no pin
  if (isMobile) {
    gsap.from('.panel-content', {
      y: 30,
      opacity: 0,
      scrollTrigger: { trigger: '.panel', start: 'top 80%' },
    })
  }

  // Cleanup function (optional, called when conditions change)
  return () => {
    // Remove event listeners added in this scope
  }
})
```

### Viewport Units Fallback Pattern
```css
/* Source: https://www.bram.us/2021/07/08/the-large-small-and-dynamic-viewports/ */
.fullscreen-section {
  height: 100vh;   /* Fallback for older browsers */
  height: 100svh;  /* Modern browsers: accounts for mobile address bar */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| useEffect + gsap.context() | useGSAP() hook from @gsap/react | 2024 | Automatic cleanup, scope, dependencies built-in |
| ScrollTrigger.matchMedia() | gsap.matchMedia() | GSAP 3.11+ | More powerful, supports non-ScrollTrigger animations too |
| Custom RAF + Lenis.raf() | GSAP ticker + autoRaf:false | Lenis 1.x | Single unified RAF loop, eliminates sync issues |
| 100vh on mobile | 100svh | 2023 (Safari 15.4+) | Correctly accounts for dynamic address bar |
| will-change: transform (permanent) | GSAP force3D:"auto" (default) | GSAP 3.x | Auto-promotes during animation, demotes after — prevents memory bloat |

**Deprecated/outdated:**
- `ScrollTrigger.matchMedia()` — use `gsap.matchMedia()` instead (more powerful, not just for ScrollTrigger)
- `lenis/react` ReactLenis wrapper — community reports mobile performance issues; direct Lenis initialization is preferred

## Open Questions

1. **LenisProvider Scope: Page-level or Layout-level?**
   - What we know: Currently in HomepageV2Client (page-level). This means Lenis is destroyed/recreated on every homepage visit. Internal pages don't get smooth scroll.
   - What's unclear: Whether the user wants smooth scroll only on homepage or globally
   - Recommendation: Keep page-level for Phase 5 (homepage only). If smooth scroll is desired globally later, move to layout. Page-level is safer — guarantees clean ScrollTrigger state.

2. **Replace homepage or keep homepage-v2 as staging?**
   - What we know: The current homepage (`page.tsx`) uses static components. The POC at `/homepage-v2` has all animated versions.
   - Recommendation: Replace the homepage directly. Delete `/homepage-v2` route after migration. No need for parallel routes.

3. **ScrollTrigger.refresh() timing with dynamic content**
   - What we know: If images load asynchronously and change page height, ScrollTrigger positions can be wrong
   - Recommendation: next/image with `fill` + fixed aspect-ratio containers prevents layout shift. No explicit refresh needed if containers have stable dimensions.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (via @playwright/test) |
| Config file | `playwright.config.ts` |
| Quick run command | `npx playwright test tests/smoke.spec.ts` |
| Full suite command | `npx playwright test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Video hero renders with autoplay attributes | e2e | `npx playwright test tests/homepage-hero.spec.ts -x` | No — Wave 0 |
| HOME-02 | Split-text headline renders words in spans | e2e | `npx playwright test tests/homepage-hero.spec.ts -x` | No — Wave 0 |
| HOME-03 | 4 scroll narrative panels render | e2e | `npx playwright test tests/homepage-sections.spec.ts -x` | No — Wave 0 |
| HOME-04 | Sections have ScrollTrigger data attributes | e2e | `npx playwright test tests/homepage-sections.spec.ts -x` | No — Wave 0 |
| HOME-05 | News preview section shows 3 cards | e2e | `npx playwright test tests/homepage-sections.spec.ts -x` | No — Wave 0 |
| HOME-06 | Stat counters render with data attributes | e2e | `npx playwright test tests/homepage-sections.spec.ts -x` | No — Wave 0 |
| HOME-07 | Newsletter strip renders | e2e | `npx playwright test tests/homepage-sections.spec.ts -x` | No — Wave 0 |
| HOME-08 | Page loads without JS errors (Lenis init) | e2e | `npx playwright test tests/smoke.spec.ts -x` | Yes (partial) |

### Sampling Rate
- **Per task commit:** `npx playwright test tests/smoke.spec.ts`
- **Per wave merge:** `npx playwright test`
- **Phase gate:** Full suite green + manual visual check of animations

### Wave 0 Gaps
- [ ] `tests/homepage-hero.spec.ts` — covers HOME-01, HOME-02 (video element attributes, word spans)
- [ ] `tests/homepage-sections.spec.ts` — covers HOME-03 through HOME-07 (section rendering, card count, stat values)
- [ ] Update `tests/smoke.spec.ts` — ensure homepage still returns 200 after migration

*(Note: GSAP animations themselves cannot be meaningfully tested with Playwright — they are visual/timing-based. Tests verify DOM structure and element presence.)*

## Sources

### Primary (HIGH confidence)
- [GSAP React Integration Guide](https://gsap.com/resources/React/) — useGSAP hook API, scope, cleanup, contextSafe
- [gsap.matchMedia() Docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) — responsive + prefers-reduced-motion conditions
- [Lenis GitHub README](https://github.com/darkroomengineering/lenis) — constructor API, autoRaf, destroy, GSAP sync pattern
- [Chrome Autoplay Policy](https://developer.chrome.com/blog/autoplay/) — muted autoplay requirements
- [MDN Autoplay Guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) — cross-browser autoplay rules
- [New Viewport Units (Bram.us)](https://www.bram.us/2021/07/08/the-large-small-and-dynamic-viewports/) — svh/lvh/dvh explained

### Secondary (MEDIUM confidence)
- [GSAP Forum: Lenis + ScrollTrigger sync](https://gsap.com/community/forums/topic/40426-patterns-for-synchronizing-scrolltrigger-and-lenis-in-reactnext/) — community patterns, GSAP team advises ScrollSmoother but acknowledges Lenis works
- [GSAP Forum: ScrollTrigger refresh on route change](https://gsap.com/community/forums/topic/34287-scrolltriggerrefresh-not-working-upon-changing-route-in-nextjs/) — useGSAP auto-cleanup resolves most issues
- [devdreaming: Lenis + GSAP in Next.js](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap) — implementation walkthrough

### Tertiary (LOW confidence)
- None — all findings verified with primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and working in POC
- Architecture: HIGH — POC validates the pattern, only needs minor fixes (autoRaf, cleanup)
- Pitfalls: HIGH — well-documented issues with known solutions, verified across multiple sources

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable libraries, no breaking changes expected)
