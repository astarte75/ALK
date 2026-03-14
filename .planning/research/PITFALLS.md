# Domain Pitfalls: Next.js + Contentful + Styled Components Corporate PE/VC Site

**Domain:** Animated PE/VC corporate website (hgcapital.com replica)
**Stack:** Next.js App Router, Contentful, Styled Components v6, GSAP/Framer Motion, next-intl, Vercel
**Researched:** 2026-03-14
**Confidence:** HIGH (most pitfalls verified via official docs, GSAP docs, or multiple independent sources)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken deploys, or Lighthouse scores below 70.

---

### Pitfall 1: Styled Components SSR Hydration Mismatch

**What goes wrong:** Server-rendered HTML has one set of CSS class hashes, the client generates different hashes during hydration. React throws a hydration error. In worst cases the entire page renders without styles for a flash before hydration completes.

**Why it happens:** Styled Components generates class names at runtime. Without SSR configuration, server and client generate independently, producing mismatches. This is exacerbated with the App Router because the old `_document.js` approach (Pages Router) no longer applies.

**Consequences:** Broken styling on first load, React hydration warnings in console, possible layout shifts that destroy LCP score.

**Prevention:**
- Use Styled Components v6.3.0+ which has native RSC support with zero configuration.
- For the App Router, implement a `StyledComponentsRegistry` in `app/layout.tsx` using `useServerInsertedHTML` to inject collected styles into `<head>` before hydration.
- Add `babel-plugin-styled-components` with `"ssr": true` to ensure deterministic class name generation.
- Use CSS custom properties for theme values rather than ThemeProvider — `ThemeProvider` is a no-op in React Server Components and forces entire component trees to be Client Components.

**Detection:** React devtools hydration warnings. Visible flash of unstyled page on hard refresh. Class name mismatch in browser inspector (server-rendered vs hydrated class differ).

**Phase:** Foundation (Phase 1) — set up before writing any components.

---

### Pitfall 2: GSAP ScrollTrigger Not Cleaning Up in SPA Navigation

**What goes wrong:** ScrollTrigger instances are created on mount but not destroyed on unmount. When Next.js navigates between pages (App Router link transitions), old ScrollTrigger instances remain, stacking on top of new ones. Result: animations fire at wrong scroll positions, duplicate triggers, memory leaks that degrade performance over time.

**Why it happens:** GSAP is a global singleton. ScrollTrigger is not bound to React's component lifecycle. SPAs do not fully unmount the DOM like page reloads do.

**Consequences:** "Ghost" animations from previous pages, incorrect trigger positions on return navigation, increasing memory usage the longer the session continues.

**Prevention:**
- Always use GSAP's official `useGSAP()` hook (from `@gsap/react`) instead of raw `useEffect`. It handles cleanup automatically via the returned context.
- Return a cleanup function: `return () => { ctx.revert(); }` to kill all ScrollTriggers created in that context.
- Centralize GSAP plugin registration in a single `gsap.config.ts` file imported once at the app root — never register plugins inside components.
- Call `ScrollTrigger.refresh()` after dynamic content loads (e.g., after images resolve, after Contentful data populates).

**Detection:** Open browser devtools Memory panel. Navigate to an animated page, back, then to the animated page again. If `ScrollTrigger.getAll().length` doubles each visit, cleanup is missing.

**Phase:** Animations (whichever phase implements scroll animations — likely Phase 2-3).

---

### Pitfall 3: GSAP ScrollTrigger Mobile Jank and Dynamic Viewport Height

**What goes wrong:** ScrollTrigger calculates element bounds at creation time using static viewport dimensions. On mobile, the browser URL bar shrinks and expands while scrolling, changing the viewport height mid-scroll. Animations trigger at wrong positions or jump unexpectedly. Touch scroll inertia also causes ScrollTrigger to miss trigger boundaries.

**Why it happens:** `window.innerHeight` and `document.documentElement.clientHeight` differ. The mobile address bar is not accounted for in GSAP's default scroll position calculations.

**Consequences:** Animations that work perfectly on desktop appear broken or "jumpy" on iOS Safari and Android Chrome. Parallax effects are particularly bad.

**Prevention:**
- Use CSS `svh` (small viewport height) units for full-screen sections rather than `100vh`.
- Avoid pinning animations on mobile — pin-based ScrollTriggers are extremely fragile with dynamic viewports. Use `matchMedia` to disable or simplify animations below 768px.
- Do not combine GSAP ScrollTrigger with a smooth scroll library (e.g., Lenis) without reading GSAP's explicit integration guide for that library.
- Add `invalidateOnRefresh: true` to ScrollTrigger configs so bounds recalculate on resize.
- Test on physical devices, not just Chrome DevTools mobile emulation.

**Detection:** Test on a real iPhone with Safari before any milestone sign-off. Animations that work in DevTools may fail on device.

**Phase:** Animations phase, and again during QA / mobile polish phase.

---

### Pitfall 4: Styled Components Dark Theme Flash (FOUC)

**What goes wrong:** The site loads, briefly flashes as light-colored (or with incorrect colors) before the theme is applied. Even with SSR, if theme logic runs on the client via JS, there is a paint frame between HTML render and JS execution.

**Why it happens:** Using ThemeProvider with a JS-controlled theme value means the initial server-rendered HTML has no color scheme applied. The browser paints the HTML, then JS runs and applies colors, causing a flash.

**Consequences:** Visible white/light flash before dark theme renders. Particularly ugly on a premium dark PE/VC site. Fails the "feels premium" requirement.

**Prevention:**
- Define the entire dark palette as CSS custom properties on `:root` in a global stylesheet, not as JavaScript theme object values. This means colors are present from the first CSS parse, before any JS executes.
- Use a `<script>` tag in the document `<head>` (before `<body>`) to apply a `data-theme` attribute synchronously — this is how `next-themes` prevents flashing.
- Avoid reading `localStorage` for theme preference on a purely dark site — if the design is always dark, no theme toggle = no flash problem.
- If a light/dark toggle is ever added, use `next-themes` which handles the synchronous script injection correctly.

**Detection:** In Chrome devtools, throttle CPU 6x and do a hard refresh. If there is any light flash before dark paint, the FOUC is present.

**Phase:** Foundation (Phase 1) — CSS architecture decision before any page is built.

---

### Pitfall 5: Contentful API Calls During Build Exhausting Rate Limits

**What goes wrong:** `getStaticProps` / `generateStaticParams` calls Contentful for every page during `next build`. A site with 18 portfolio companies, 15 team members, multiple news articles, and bilingual content (IT + EN) can fire 50-100+ concurrent API requests. Contentful's Content Delivery API limit is 78 req/sec on paid plans. Build fails or returns 429 errors mid-build.

**Why it happens:** Next.js parallelizes static generation. Each page's data fetching runs concurrently without any throttling by default.

**Consequences:** Intermittent build failures. Partial builds with some pages missing data. Flaky CI/CD.

**Prevention:**
- Use the official `contentful` JS SDK — it has built-in automatic retry with exponential backoff for 429 responses.
- Prefer fetching all entries of a type in a single API call and deriving individual pages from the result, rather than fetching per-page (e.g., fetch all portfolio companies once, then generate all `/portfolio/[slug]` pages from that dataset).
- Cache Contentful responses at build time using Next.js `fetch` with `{ next: { revalidate: false } }` so repeated calls within a build are served from cache.
- Implement ISR (Incremental Static Regeneration) for content that changes frequently (news articles) so not every page rebuilds on every deploy.

**Detection:** Build logs showing `429` errors from `ctfassets.net`. Build time over 5 minutes for a site this size.

**Phase:** CMS integration phase (whichever introduces Contentful fetching).

---

### Pitfall 6: Contentful Content Model Too Flat or Too Deep

**What goes wrong:** Either (a) every field is on a single content type making it impossible to reuse components (flat), or (b) references are nested 5+ levels deep making GraphQL queries unmanageable and the editor UI confusing.

**Why it happens:** Developers design the content model to mirror the page layout rather than the content structure. PE/VC sites have complex reusable elements (team cards, portfolio cards, stat blocks, quote sections) that are re-used across pages.

**Consequences:** (Flat) Duplicated content when the same portfolio company appears in multiple contexts. (Deep) GraphQL queries that hit Contentful's response size limits. Editors confused about where to edit what.

**Prevention:**
- Model reusable pieces as separate content types with references: `TeamMember`, `PortfolioCompany`, `StatBlock`, `QuoteSection`, `NewsArticle`.
- Keep page-level content types (`HomePage`, `ApproachPage`) as shallow orchestrators that reference these components.
- Maximum 3 levels of nesting. Flatten anything beyond that.
- Contentful's recommended limit is 50 fields per content type — stay well below it (20 is a practical ceiling).
- For localization: use field-level localization (enable per-field) rather than duplicate content types per language. Contentful handles locale fallback automatically when field-level localization is enabled.

**Detection:** If writing a GraphQL query requires more than 5 nested `{ ... }` levels, the content model is too deep. If the same text appears in 3 different content entries, the model is too flat.

**Phase:** CMS architecture phase — must be designed before content entry begins. Changes to content types later require content migration.

---

### Pitfall 7: next-intl Locale Routing Conflicting with Contentful Locale Fetching

**What goes wrong:** next-intl manages URL-based locale routing (`/it/...` vs `/en/...`). Contentful delivers locale-specific content via the `locale` parameter in API calls. If these two systems are not wired together, users see Italian URLs but English content (or vice versa), or locale switching triggers a full page reload instead of a soft navigation.

**Why it happens:** next-intl handles UI string translations. Contentful handles CMS content translations. They are independent systems that must be explicitly connected. Developers often wire one but forget the other.

**Consequences:** Italian users see English Contentful content. Locale switcher changes URL but not CMS content. SEO issues with hreflang pointing to wrong content.

**Prevention:**
- Read the `locale` from next-intl's routing in every Contentful API call: `const locale = useLocale()` (client) or from params (server). Map `it` → `it-IT` and `en` → `en-US` for Contentful's locale codes (they differ).
- Generate static paths for both locales: in `generateStaticParams`, return `[{ locale: 'it', slug: '...' }, { locale: 'en', slug: '...' }]` for every dynamic route.
- Set up Contentful's locale fallback: for fields not yet translated, fall back from `it-IT` to `en-US` in the Contentful space settings — do not let empty Italian fields break the page.
- In `next.config.ts`, do not use Next.js built-in `i18n` config alongside next-intl — they conflict. next-intl's middleware handles all routing.
- Delete the `NEXT_LOCALE` cookie in devtools when testing fresh locale detection, otherwise cached locale masks bugs.

**Detection:** Build with `next build` and check that `/_next/static/chunks/` contains separate bundles for each page per locale. Run `next-intl`'s built-in type checker: `npx next-intl check`.

**Phase:** Routing/i18n foundation phase — must be set up before any page content is wired.

---

## Moderate Pitfalls

Mistakes that cause significant rework but not full rewrites.

---

### Pitfall 8: Video Hero Blocking LCP and Failing Core Web Vitals

**What goes wrong:** The full-screen video hero (like hgcapital.com's homepage) embeds a Vimeo iframe or `<video>` tag that blocks paint. The browser waits for the video to initialize before the Largest Contentful Paint element renders. Lighthouse score tanks.

**Why it happens:** Vimeo's embed script loads third-party JS (`player.vimeo.com`). Even muted autoplay requires the browser to establish a connection, download the player SDK, and receive the first video frame before the element is "loaded."

**Consequences:** LCP scores of 5-10 seconds on mobile. Lighthouse performance below 70. Potential Core Web Vitals failure affecting SEO.

**Prevention:**
- Show a static poster image (dark, matching hero design) until the video loads. Use CSS `background-image` on the hero container with the poster, then swap to video once ready.
- Load the Vimeo SDK lazily: do not include `<iframe>` in the initial HTML. Inject it via JavaScript after `DOMContentLoaded` or after the poster image is visible.
- Add `dnt=1` to the Vimeo embed URL to disable tracking cookies and remove unnecessary Vimeo API overhead (~25 Lighthouse point improvement on mobile per community reports).
- For self-hosted video: use `<video autoplay muted loop playsinline>` with a compressed MP4 (max 5MB) and a WebM fallback. Host on Vercel CDN via `public/` for static or use a dedicated video CDN.
- Set `fetchPriority="high"` on the poster image so it renders immediately as LCP candidate.

**Detection:** Run Lighthouse on the homepage. Check LCP element in the report — if it's inside the video iframe, the video is blocking LCP.

**Phase:** Homepage build phase. Do not leave video optimization for a "polish" phase — it requires architectural decisions (iframe vs. self-hosted vs. poster).

---

### Pitfall 9: Framer Motion Forcing Entire Component Trees to Be Client Components

**What goes wrong:** Framer Motion's `motion.div` requires browser APIs. Wrapping a page-level layout component with `motion` forces that entire subtree to be a Client Component, disabling React Server Components benefits for all children.

**Why it happens:** The App Router's RSC model requires explicit `"use client"` boundaries. Framer Motion does not support RSC. If placed high in the component tree without a boundary, it opts out everything below.

**Consequences:** Loss of server-side rendering benefits, larger JS bundles sent to client, slower initial page load, reduced Lighthouse score.

**Prevention:**
- Use `LazyMotion` with `domAnimation` feature bundle (11KB) instead of full Framer Motion (34KB+) to reduce bundle size.
- Keep animation wrappers as small, leaf-level Client Components. Never wrap a layout or page-level Server Component with `motion`.
- Consider GSAP for complex scroll animations (it runs outside React's render cycle) and reserve Framer Motion for micro-interactions (hover, tap, enter/exit transitions).
- Pattern: `AnimatedSection.tsx` is a small `"use client"` component that wraps just the animated element, not the entire page content.

**Detection:** Run `next build` and check `.next/analyze/` (with `@next/bundle-analyzer`). If a large portion of the page appears in the client bundle, Client Component boundaries are too high.

**Phase:** Animations phase — establish the Client/Server component boundary strategy before building animated sections.

---

### Pitfall 10: Contentful Images Not Configured in `next.config.ts` remotePatterns

**What goes wrong:** Next.js `<Image>` component blocks external domains by default. Contentful assets are served from `images.ctfassets.net`. If this hostname is not in `remotePatterns`, every Contentful image throws an error in production.

**Why it happens:** Developers test with `<img>` tags locally, then switch to `<Image>` for optimization without checking Next.js configuration.

**Consequences:** All CMS images broken in production. 500 errors from Next.js image optimization endpoint.

**Prevention:**
```js
// next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.ctfassets.net' },
    { protocol: 'https', hostname: 'downloads.ctfassets.net' },
    { protocol: 'https', hostname: 'assets.ctfassets.net' },
  ]
}
```
- The Contentful image transform API (`?w=800&fm=webp&q=80`) works as a Contentful-side transformation. Use it to pre-optimize before Next.js also optimizes (avoid double-processing large images).
- Set `loading="eager"` and `fetchPriority="high"` on above-the-fold images (hero, first team photo). All other images use default lazy loading.
- Always provide `width` and `height` props to avoid CLS. For responsive images, use `fill` with a positioned container.

**Detection:** Run `next build` and check for "Invalid src prop" errors. Test all page types in staging.

**Phase:** CMS integration phase.

---

### Pitfall 11: Hard-Coded Animation Values Breaking on Viewport Resize

**What goes wrong:** GSAP ScrollTrigger `start` and `end` positions hard-coded as pixel values (`start: "top 300px"`) break when the viewport height changes (e.g., mobile rotation, browser zoom). Elements that should animate are already past their trigger point before the user scrolls.

**Why it happens:** Developers test at a single viewport size and hard-code what "looks right." Function-based values are not intuitive at first.

**Consequences:** Animations don't trigger on laptops with different screen heights. Rotate a phone and animations are stuck or already completed.

**Prevention:**
- Always use percentage-based or viewport-relative values: `start: "top 80%"`, `end: "bottom 20%"`.
- For values that must be calculated (e.g., element height + offset): use function-based values: `start: () => element.offsetTop - window.innerHeight * 0.2`.
- Call `ScrollTrigger.refresh()` on window resize (debounced to 250ms).
- Use `ScrollTrigger.matchMedia()` to define breakpoint-specific animation configurations.

**Detection:** Test at 1920px, 1440px, 1280px, 1024px, and 375px widths. If any animation appears already-triggered or never triggers, the values are hard-coded.

**Phase:** Animations phase.

---

### Pitfall 12: next-intl Type Errors with Next.js 15 Params as Promise

**What goes wrong:** In Next.js 15, dynamic route `params` are returned as a `Promise<{ locale: string; slug: string }>` rather than a plain object. Code written for Next.js 14 breaks with TypeScript errors during `next build`.

**Why it happens:** Next.js 15 changed the params type signature. next-intl documentation needs to be checked for the version-specific setup.

**Consequences:** Build failures on `next build`. TypeScript errors that block CI/CD.

**Prevention:**
- Follow next-intl's version-specific documentation for Next.js 15: use `const { locale, slug } = await params;` in async Server Components.
- Configure `messages` path and `routing` config in `i18n/routing.ts` per next-intl v3+ conventions.
- Run `npx next-intl check` as part of the CI pipeline to validate message key coverage.

**Detection:** `next build` TypeScript errors mentioning `params` not satisfying `LayoutProps`. Run build in CI, do not rely on `next dev` which is more permissive.

**Phase:** i18n routing setup phase.

---

### Pitfall 13: Cross-Browser Animation: Safari and scroll-driven CSS Animations

**What goes wrong:** Native CSS scroll-driven animations (`animation-timeline: scroll()`) were only added to Safari in Safari 26 (2025). Any scroll animations implemented with native CSS (not GSAP/Framer Motion) will silently fail in older Safari versions with no error, simply not animating.

**Why it happens:** Safari historically lags on CSS features. Developers test in Chrome, ship, then discover Safari users see no animations.

**Consequences:** PE/VC audience likely includes high macOS/iOS Safari users (finance sector tends toward Apple devices). Broken animations undermine the "premium" requirement.

**Prevention:**
- Use GSAP for all scroll animations — it is universally cross-browser and handles Safari quirks internally.
- If using CSS transitions/animations for hover effects, always test in Safari.
- Use `-webkit-` prefixes for older Safari versions on `transform` and `backface-visibility`.
- `will-change: transform` improves Safari GPU compositing for heavy animated elements.

**Detection:** Test the full site in Safari on macOS and Safari on iOS before any milestone sign-off. Use BrowserStack if physical Apple devices are not available.

**Phase:** All animation phases — treat Safari testing as mandatory, not optional QA.

---

## Minor Pitfalls

Issues that cause hours of debugging but are recoverable without rework.

---

### Pitfall 14: Vercel Serverless Function Cold Starts on Preview Deployments

**What goes wrong:** Preview deployments (PR branches) do not benefit from Vercel's Fluid Compute pre-warming (production-only). First request after a cold period takes 2-4 seconds. Stakeholders testing preview links experience slow page loads and conclude the site is slow.

**Why it happens:** Vercel's cold start optimizations (bytecode caching, function pre-warming) only apply to production deployments. Preview is effectively always cold.

**Prevention:**
- Maximize static generation: every page that can be static should be. This eliminates serverless function cold starts because static files are served from Vercel's CDN edge.
- Minimize the ISR revalidation period for pages that stakeholders preview frequently (homepage, team page).
- Educate stakeholders: preview links are cold, production is pre-warmed. Share production URL for performance evaluation.

**Detection:** Preview deployment first-load > 2 seconds. Check Vercel Function logs for cold start indicators.

**Phase:** Deployment setup — document this expectation early.

---

### Pitfall 15: Contentful Locale Fallback Only Works for Missing Fields, Not Empty Strings

**What goes wrong:** An Italian translation field is saved as an empty string `""`. Contentful does NOT fall back to English — it returns the empty string as the Italian content. The page displays blank text.

**Why it happens:** Contentful's fallback mechanism only triggers when the locale field is absent (null/undefined), not when it's empty.

**Consequences:** Italian pages with missing translations silently show blank text instead of English fallback.

**Prevention:**
- Enable "Allow empty fields" on required content type fields when setting up localization, so editors can save partial translations without publishing broken content.
- In the frontend code, add a null/empty check: `content.titleIT || content.titleEN || ''`.
- In the Contentful Space settings, configure locale fallback chain: `it-IT` → `en-US`. This handles the null case automatically on the API side.

**Detection:** Create a test entry with an empty Italian translation field. Fetch it with `locale: 'it-IT'` — if the response is `""`, add frontend fallback logic.

**Phase:** CMS integration and i18n wiring phase.

---

### Pitfall 16: WCAG 2.1 Contrast on Dark Background with Decorative Red Accent

**What goes wrong:** The dark palette (equivalent to HG's `#1A1E22` background) with a red accent color similar to `#F8495E` likely fails WCAG 2.1 AA contrast requirements for body text at red-on-dark combinations. Also, gray text used for secondary information on dark backgrounds often falls below the 4.5:1 ratio.

**Why it happens:** Designers choose palette for aesthetics without running contrast checks. Red on dark tends to have medium contrast, not sufficient for small text (requires 4.5:1).

**Consequences:** Accessibility audit failure. If the client has WCAG compliance requirements (the project spec mentions it), this is a blocker.

**Prevention:**
- Run every text color / background color combination through a contrast checker (WebAIM Contrast Checker) during palette definition.
- Reserve the accent red for large text, buttons, or decorative elements (3:1 requirement applies) — do not use red for body text.
- Use white or near-white (`#E8E8E8` minimum) for primary body text on dark backgrounds. Gray for secondary text must still achieve 4.5:1 — test the specific gray.
- Note: WCAG requires AA compliance on the default color scheme. Offering a dark mode as an alternative does NOT satisfy WCAG if the default dark theme itself fails contrast.

**Detection:** Run axe DevTools or Lighthouse Accessibility audit on every page. Automated tools catch ~40% of contrast issues; manual review with a contrast checker covers the rest.

**Phase:** Design/palette definition phase, before any CSS is written.

---

### Pitfall 17: Vercel Build Failing Due to Styled Components SSR Registry in App Router

**What goes wrong:** The `StyledComponentsRegistry` component uses `useServerInsertedHTML` which is a Next.js-specific hook. If improperly typed or placed, it causes build errors that don't appear in `next dev` but fail in `next build`.

**Why it happens:** `next dev` is more permissive than `next build`. TypeScript errors in the registry component are only caught at build time.

**Prevention:**
- Copy the registry implementation exactly from Next.js official CSS-in-JS documentation: https://nextjs.org/docs/app/guides/css-in-js
- The registry must be the first wrapper in `app/layout.tsx`, before any ThemeProvider or other providers.
- Test with `next build` locally, not just `next dev`, before pushing to CI.

**Detection:** `next build` fails with errors referencing `useServerInsertedHTML` or styled-components class collection.

**Phase:** Foundation phase.

---

### Pitfall 18: Portfolio/Team Grid Layout Shift from Unspecified Image Dimensions

**What goes wrong:** Portfolio company logos and team member photos loaded from Contentful have inconsistent aspect ratios. Without explicit width/height, the browser cannot reserve space, causing layout shift as images load. CLS score above 0.1.

**Why it happens:** Editors upload images of different dimensions. CSS `aspect-ratio` and `object-fit` are set but `width` and `height` HTML attributes are absent.

**Consequences:** CLS Core Web Vitals failure. Jarring layout jumps during page load, especially visible on slow connections.

**Prevention:**
- Use Next.js `<Image>` with `fill` prop inside a `position: relative` container with explicit `aspect-ratio` set via CSS.
- Alternatively, define standardized upload dimensions in the Contentful content model validation (e.g., team photos must be 400×400px) and use `width={400} height={400}` always.
- For logos with variable aspect ratios, use `objectFit: 'contain'` with a fixed container size.

**Detection:** Lighthouse CLS score above 0.1. Check the CLS element in the Lighthouse report — images are the most common cause.

**Phase:** Component build phase for grids (team, portfolio).

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Foundation / CSS architecture | FOUC from JS-controlled dark theme | CSS custom properties from day one |
| Foundation / Styled Components setup | SSR hydration mismatch | StyledComponentsRegistry + babel plugin in Phase 1 |
| Foundation / palette definition | WCAG contrast failures on dark theme | Contrast-check every color pair before writing CSS |
| i18n routing setup | next-intl + Next.js 15 params type errors | Follow next-intl v3 docs exactly, run `next build` early |
| CMS content model | Overly flat or deeply nested content types | 3-level max, model content not layout |
| CMS integration | Build-time 429 rate limit errors from Contentful | Batch fetches, use SDK retry, ISR for dynamic content |
| CMS + i18n wiring | Locale mismatch between next-intl and Contentful | Wire locale param explicitly to every Contentful call |
| Homepage / video hero | Video blocks LCP, Lighthouse < 70 | Poster image first, lazy-inject Vimeo, add dnt=1 |
| Scroll animations | ScrollTrigger not cleaned up on navigation | useGSAP() hook, centralized GSAP config |
| Scroll animations | Mobile jank from dynamic viewport height | svh units, disable pin on mobile, test on device |
| Animated sections | Framer Motion forcing Client Components too high | Keep motion wrappers as leaf components only |
| Portfolio/team grids | CLS from unspecified image dimensions | next/image with fill + aspect-ratio containers |
| Vercel deployment | Preview builds look slow (stakeholder concern) | Static-first architecture, document cold start expectations |
| QA / browser compatibility | Safari missing scroll animation support | GSAP only for scroll, test Safari every sprint |

---

## Sources

- GSAP ScrollTrigger Official Docs — Common Mistakes: https://gsap.com/resources/st-mistakes/
- Next.js CSS-in-JS App Router Guide: https://nextjs.org/docs/app/guides/css-in-js
- Styled Components v6 RSC Support: https://styled-components.com/docs/advanced
- Next.js Hydration Error Docs: https://nextjs.org/docs/messages/react-hydration-error
- Contentful Technical Limits (official): https://www.contentful.com/developers/docs/technical-limits/
- Contentful Localization Strategies: https://www.contentful.com/developers/docs/tutorials/general/setting-locales/
- next-intl Complete Guide (2025): https://www.buildwithmatija.com/blog/nextjs-internationalization-guide-next-intl-2025
- Vercel Cold Start & Fluid Compute: https://vercel.com/blog/scale-to-one-how-fluid-solves-cold-starts
- Vercel Function Size Limits: https://vercel.com/kb/guide/troubleshooting-function-250mb-limit
- GSAP + Next.js useGSAP integration: https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232
- Framer Motion + App Router: https://github.com/vercel/next.js/issues/49279
- WCAG 2.1 Contrast Requirements: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Dark Mode WCAG compliance: https://www.boia.org/blog/offering-a-dark-mode-doesnt-satisfy-wcag-color-contrast-requirements
- Contentful GraphQL API pain points with Next.js: https://medium.com/@nicholasrussellconsulting/contentful-graphql-api-pain-points-with-next-js-why-i-resurrected-rest-6cfdf3537e4c
- Safari Scroll Animation Support (Interop 2026): https://webkit.org/blog/17818/announcing-interop-2026/
- GSAP Mobile Performance Issues (community): https://gsap.com/community/forums/topic/45146-why-scroll-animation-is-sluggish-on-mobile-i-need-guidance/
- Contentful + next-intl localization integration: https://www.chaffe.dev/blog/localising-content-with-i18n-next-js-and-contentful
- Next.js App Router common mistakes (Vercel): https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them
