# Phase 1: Foundation - Research

**Researched:** 2026-03-14
**Domain:** Next.js 15 App Router · styled-components v6 SSR · next-intl v4 · CSS custom properties · Vercel CI/CD
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Color Palette:**
- Background (dark base): #1A1E22
- Primary accent (teal): #2EC4B6 — CTAs, links, hover states, active indicators
- Secondary accent (gold): #D4A843 — highlights, badges, decorative elements, stat counters
- Text primary: #F9FAFB — near-white
- Text secondary: derived from primary at ~60% opacity or mid-gray
- Surface colors: ~#242A30 for cards and elevated elements
- Both accent colors must pass WCAG 2.1 AA contrast against #1A1E22

**Typography:**
- Headings: Plus Jakarta Sans (Google Fonts) via `next/font/google`
- Body text: Inter via `next/font/google`
- Weight scale: 400, 500, 600, 700, 800

**Technical Foundation (non-negotiable):**
- Next.js 15 App Router (NOT Pages Router, NOT Next.js 16)
- styled-components v6.3+ with `StyledComponentsRegistry` using `useServerInsertedHTML` in root layout
- `compiler: { styledComponents: true }` in next.config.js
- All theme colors as CSS custom properties on `:root` in GlobalStyle — no JS ThemeProvider for colors
- next-intl v4.8 with middleware; IT as defaultLocale (no prefix), EN with `/en/` prefix
- Both fonts loaded via `next/font/google`
- Vercel deployment with auto-deploy on push to main

### Claude's Discretion
- Exact folder structure within App Router conventions
- Breakpoint values for responsive design (standard or tailored)
- GlobalStyle reset patterns
- Development tooling (ESLint, Prettier config)
- CSS custom property naming convention
- Exact surface/border/shadow color derivations from the palette
- Visual tone (premium PE/VC approach — subtle grain texture vs. clean flat)
- Typography size scale (modular scale 1.25 recommended)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Next.js 15 App Router with SSR/SSG | App Router folder structure, create-next-app flags, next.config.js compiler option |
| FOUND-02 | Styled Components v6 with proper SSR registry (no hydration mismatch) | Official Next.js docs StyledComponentsRegistry pattern with useServerInsertedHTML |
| FOUND-03 | Dark premium theme via CSS custom properties (not JS ThemeProvider) | GlobalStyle + :root pattern, CSS var naming convention, WCAG contrast verification |
| FOUND-05 | i18n with next-intl (IT default without prefix, EN with /en/ prefix) | next-intl v4 defineRouting + localePrefix as-needed, middleware.ts, [locale] segment |
| FOUND-06 | Responsive design 320px to 2560px | Breakpoint system, CSS custom property breakpoints, GlobalStyle media queries |
| FOUND-07 | Vercel deployment with CI/CD | vercel.json, GitHub/Gitea integration, environment variables on Vercel dashboard |
</phase_requirements>

---

## Summary

Phase 1 establishes the project skeleton that all subsequent phases build on. The stack is fully locked — Next.js 15 (not 16), styled-components v6.3+, next-intl v4, and Vercel. The biggest risk in this phase is getting the styled-components SSR registry wrong, which causes hydration mismatches that are extremely hard to debug later. The second risk is the next-intl folder structure: the `app/[locale]/` segment must be the entry point for all routes, and the middleware matcher must be configured correctly or the IT default locale will not work as intended.

The approach is greenfield (no existing code). The project uses `src/` directory convention with App Router. All theme values live in CSS custom properties on `:root`, never in a JS ThemeProvider, which eliminates FOUC on dark mode. Plus Jakarta Sans and Inter are loaded as CSS variables via `next/font/google` so they integrate cleanly with styled-components without className coupling.

**Primary recommendation:** Scaffold with `create-next-app` using the exact flags below, then layer styled-components + next-intl + GlobalStyle in the order documented, exactly following the official Next.js StyledComponentsRegistry pattern. Do not deviate from the locked patterns — each one exists because alternatives cause production bugs.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | ^15.3.x | Framework with App Router SSR/SSG | Locked. v16 breaks styled-components integration with async params and Turbopack default |
| react | ^18.x | UI runtime | Next.js 15 + styled-components is most stable on React 18 (v6 RSC support still maturing on React 19) |
| typescript | ^5.x | Type safety | Standard for premium projects; next-intl and Contentful SDK have native TS types |
| styled-components | ^6.3.x | CSS-in-JS component styling | Matches HG Capital. v6.3.0+ supports RSC natively. Locked |
| next-intl | ^4.8.x | i18n routing (IT default + EN) | Native App Router i18n, TypeScript strict, simplified v4 API. Locked |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sharp | latest (devDep) | Next.js Image optimization | Required by `next/image` on Vercel production |
| eslint | ^9.x | Linting | Included via `eslint-config-next`, extends recommended rules |
| prettier | ^3.x | Code formatting | Claude's discretion — standard config with single quotes, 2-space indent |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Next.js 15 | Next.js 16 | v16 has mandatory async params, Turbopack default — breaks styled-components integration |
| CSS custom properties on :root | JS ThemeProvider | ThemeProvider causes FOUC on SSR dark themes; :root vars are available before JS |
| next-intl localePrefix: as-needed | Prefixing all locales | /it/ prefix on default locale is ugly; as-needed gives clean Italian URLs |
| next/font/google as CSS variable | className directly on html | CSS variable approach decouples font from styled-components class management |

**Installation:**
```bash
# Scaffold (say NO to Tailwind, YES to TypeScript, YES to ESLint, YES to src/, YES to App Router)
npx create-next-app@15 alkemia-capital --typescript --eslint --src-dir --app --no-tailwind

# Styling
npm install styled-components
# Note: @types/styled-components NOT needed — included in v6

# i18n
npm install next-intl

# Dev tooling
npm install -D prettier sharp
```

---

## Architecture Patterns

### Recommended Project Structure

```
alkemia-capital/
├── src/
│   ├── app/
│   │   ├── [locale]/               # All routes under locale segment
│   │   │   ├── layout.tsx          # Locale layout (NextIntlClientProvider, fonts)
│   │   │   └── page.tsx            # Homepage (placeholder for Phase 4)
│   │   └── layout.tsx              # Root layout (StyledComponentsRegistry, GlobalStyle)
│   ├── components/
│   │   └── providers/
│   │       └── StyledComponentsRegistry.tsx   # SSR style registry
│   ├── styles/
│   │   ├── GlobalStyle.ts          # CSS reset + :root CSS custom properties
│   │   └── theme.ts                # Typed theme constants (mirrors CSS vars, for TS usage)
│   ├── i18n/
│   │   ├── routing.ts              # defineRouting config
│   │   └── request.ts              # getRequestConfig (locale from params)
│   └── messages/
│       ├── it.json                 # Italian translations (default)
│       └── en.json                 # English translations
├── middleware.ts                   # next-intl middleware
├── next.config.js                  # compiler: { styledComponents: true }
├── vercel.json                     # Region, security headers
└── .env.local                      # NEVER committed — env vars
```

### Pattern 1: StyledComponentsRegistry (FOUND-02)

**What:** Client component that collects SSR styles and injects them before hydration via `useServerInsertedHTML`. Eliminates hydration mismatch between server-rendered and client styles.

**When to use:** Always. Must wrap `children` in root layout before any styled-component is used.

**Example (official Next.js source):**
```tsx
// src/components/providers/StyledComponentsRegistry.tsx
// Source: https://nextjs.org/docs/app/guides/css-in-js#styled-components
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Lazy initial state — creates stylesheet exactly once
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  // On the client, return children directly (hydration takes over)
  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

```tsx
// src/app/layout.tsx — root layout
import StyledComponentsRegistry from '@/components/providers/StyledComponentsRegistry'
import GlobalStyle from '@/styles/GlobalStyle'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

### Pattern 2: CSS Custom Properties Dark Theme (FOUND-03)

**What:** All design tokens defined as CSS custom properties on `:root` in a GlobalStyle component. No JS ThemeProvider for colors. Eliminates FOUC on SSR dark theme.

**When to use:** Always. Styled-components can read CSS vars directly in template literals.

```ts
// src/styles/GlobalStyle.ts
// Source: CSS custom properties pattern, verified against MDN and styled-components docs
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root {
    /* Color tokens */
    --color-bg:           #1A1E22;
    --color-surface:      #242A30;
    --color-border:       #2E363F;
    --color-text-primary: #F9FAFB;
    --color-text-secondary: rgba(249, 250, 251, 0.6);
    --color-accent-teal:  #2EC4B6;
    --color-accent-gold:  #D4A843;

    /* Typography tokens */
    --font-heading: var(--font-plus-jakarta-sans), system-ui, sans-serif;
    --font-body:    var(--font-inter), system-ui, sans-serif;

    /* Spacing scale (8px base) */
    --space-1: 0.25rem;   /* 4px */
    --space-2: 0.5rem;    /* 8px */
    --space-3: 0.75rem;   /* 12px */
    --space-4: 1rem;      /* 16px */
    --space-6: 1.5rem;    /* 24px */
    --space-8: 2rem;      /* 32px */
    --space-12: 3rem;     /* 48px */
    --space-16: 4rem;     /* 64px */
    --space-24: 6rem;     /* 96px */

    /* Breakpoints (for reference — use in media queries) */
    --bp-sm: 640px;
    --bp-md: 768px;
    --bp-lg: 1024px;
    --bp-xl: 1280px;
    --bp-2xl: 1536px;
  }

  /* Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text-primary);
    font-family: var(--font-body);
    line-height: 1.6;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    line-height: 1.2;
    font-weight: 700;
  }
`

export default GlobalStyle
```

### Pattern 3: Font Loading as CSS Variables (FOUND-01, FOUND-03)

**What:** Load both fonts via `next/font/google` using `variable` option to expose as CSS custom properties. Apply variables to `<html>` element so all descendant CSS vars work.

**When to use:** Root layout, before StyledComponentsRegistry.

```tsx
// src/app/layout.tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

### Pattern 4: next-intl v4 Routing with IT Default (FOUND-05)

**What:** `localePrefix: 'as-needed'` gives clean Italian URLs (`/portfolio`) and English with prefix (`/en/portfolio`). The `[locale]` segment handles all actual routes.

**When to use:** Foundation of the entire routing system.

```ts
// src/i18n/routing.ts
// Source: https://next-intl.dev/docs/routing/configuration
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['it', 'en'],
  defaultLocale: 'it',
  localePrefix: 'as-needed', // IT: /portfolio — EN: /en/portfolio
})
```

```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'it' | 'en')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

```ts
// middleware.ts (project root)
// Source: https://next-intl.dev/docs/routing/middleware
import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except /api, /_next, /_vercel, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'it' | 'en')) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

### Pattern 5: Responsive Breakpoints (FOUND-06)

**What:** Breakpoint system covering 320px to 2560px. Five breakpoints, mobile-first media queries defined as constants used in styled-components.

```ts
// src/styles/breakpoints.ts
export const bp = {
  sm:  '640px',   // Small tablets, landscape phones
  md:  '768px',   // Tablets
  lg:  '1024px',  // Small desktops, landscape tablets
  xl:  '1280px',  // Standard desktops
  '2xl': '1536px', // Large desktops
  '3xl': '2560px', // Ultra-wide (max-width container)
} as const

// Reusable media query helpers for styled-components
export const mq = {
  sm:  `@media (min-width: ${bp.sm})`,
  md:  `@media (min-width: ${bp.md})`,
  lg:  `@media (min-width: ${bp.lg})`,
  xl:  `@media (min-width: ${bp.xl})`,
  '2xl': `@media (min-width: ${bp['2xl']})`,
} as const
```

### Anti-Patterns to Avoid

- **JS ThemeProvider for colors:** Using ThemeProvider to pass color values causes FOUC on SSR dark theme because JS must execute before styles are applied. Use CSS custom properties instead.
- **`@types/styled-components` install:** The package is not needed in v6 — types are included. Installing it causes conflicts.
- **GlobalStyle outside registry:** Placing `<GlobalStyle />` outside `<StyledComponentsRegistry>` means CSS reset is not captured in the SSR pass, causing flash.
- **params without await in locale layout:** Next.js 15 makes `params` a Promise. `const { locale } = params` without `await` causes silent bugs.
- **Middleware matcher too broad:** Including `api` routes in the matcher will route API calls through next-intl and break them.
- **`NEXT_PUBLIC_` prefix on Contentful tokens:** Never. These keys are server-only. Even in Phase 1 setup, establish this convention in `.env.local`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSR style injection | Custom style extraction | `StyledComponentsRegistry` pattern (official) | Race conditions, ordering bugs, missing chunks in streaming |
| Font optimization | Manual `<link rel="preload">` | `next/font/google` | Automatic subsetting, self-hosting, no CLS, no Google DNS request |
| i18n routing | Custom middleware locale detection | `next-intl` middleware + `defineRouting` | Cookie handling, accept-language fallback, redirects — all handled |
| CSS reset | Custom reset from scratch | Modern CSS reset in GlobalStyle | Box-sizing inheritance, list resets, and form normalization have edge cases |
| Type-safe translations | Manual JSON import and key lookup | `next-intl` typed messages | Type inference from message structure, missing key errors at compile time |

**Key insight:** The styled-components SSR problem is notoriously subtle. Missing or incorrect `useServerInsertedHTML` usage produces hydration errors that only appear in production with streaming, not in dev mode. Use the exact official pattern — no simplification.

---

## Common Pitfalls

### Pitfall 1: styled-components Hydration Mismatch
**What goes wrong:** Server renders component with one class name, client generates a different one. React throws hydration error. In streaming mode, can silently produce style flashes.
**Why it happens:** `StyledComponentsRegistry` missing, or `typeof window !== 'undefined'` guard omitted so server and client both try to register.
**How to avoid:** Use the exact official pattern. The `if (typeof window !== 'undefined') return <>{children}</>` line is mandatory — it prevents double-registration on client.
**Warning signs:** Console warning "Prop `className` did not match. Server: `sc-abc` Client: `sc-xyz`"

### Pitfall 2: FOUC on Dark Theme
**What goes wrong:** Page renders white/unstyled for a flash before background color applies.
**Why it happens:** If colors are in JS ThemeProvider, the JS must download and execute before styles are available.
**How to avoid:** CSS custom properties on `:root` in GlobalStyle, which is injected into `<head>` before any content via the registry.
**Warning signs:** Visible white flash in production, even if dev mode looks fine.

### Pitfall 3: next-intl Locale Segment — Missing `await params`
**What goes wrong:** Locale is `undefined` or stale, all translations fail, `notFound()` triggers for valid routes.
**Why it happens:** Next.js 15 makes route `params` a Promise. The old pattern `const { locale } = params` is now wrong.
**How to avoid:** Always `const { locale } = await params` in locale layout and page components.
**Warning signs:** `notFound()` triggering for `/portfolio`, or `useLocale()` returning `undefined`.

### Pitfall 4: Middleware Matcher Includes API Routes
**What goes wrong:** API route handlers (for future webhook, ISR) are routed through next-intl middleware and return i18n redirects instead of JSON.
**Why it happens:** Matcher pattern too broad (e.g., `'/(.*)'`).
**How to avoid:** Use the negative-lookahead pattern: `/((?!api|_next|_vercel|.*\\..*).*)` — excludes API, Next.js internal, Vercel internal, and static files.
**Warning signs:** `POST /api/revalidate` returns 307 redirect.

### Pitfall 5: Plus Jakarta Sans Not Found in next/font/google
**What goes wrong:** Build error — font name not found.
**Why it happens:** Font names in `next/font/google` use underscored names: `Plus_Jakarta_Sans` (not `Plus Jakarta Sans`).
**How to avoid:** Import as `import { Plus_Jakarta_Sans } from 'next/font/google'`.
**Warning signs:** `TypeError: Plus Jakarta Sans is not a function` at build time.

### Pitfall 6: WCAG AA Contrast Failure on Teal/Gold
**What goes wrong:** Accent colors fail accessibility audit, site cannot claim AA compliance.
**Why it happens:** #2EC4B6 and #D4A843 against #1A1E22 need verification — do not assume passing.
**How to avoid:** Run contrast ratio check before writing any CSS. Tools: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/). AA requires 4.5:1 for normal text, 3:1 for large text/UI components.
**Warning signs:** Lighthouse accessibility score below 90.

---

## Code Examples

### next.config.js — Mandatory Compiler Flag
```js
// next.config.js
// Source: https://nextjs.org/docs/app/guides/css-in-js#styled-components
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true, // Enables SSR + displayName in dev + minification
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // Contentful CDN (ready for Phase 2)
      },
    ],
  },
}

module.exports = nextConfig
```

### vercel.json — Region + Security Headers
```json
{
  "regions": ["cdg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### .env.local — Variable Structure (Phase 1 only — Contentful in Phase 2)
```bash
# Public site config
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Contentful (server-only — NO NEXT_PUBLIC_ prefix — added in Phase 2)
# CONTENTFUL_SPACE_ID=
# CONTENTFUL_ACCESS_TOKEN=
# CONTENTFUL_PREVIEW_ACCESS_TOKEN=
```

### Placeholder Homepage for Phase 1 Smoke Test
```tsx
// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')
  return (
    <main style={{ padding: '2rem' }}>
      <h1>{t('title')}</h1>
    </main>
  )
}
```

```json
// messages/it.json
{ "home": { "title": "Alkemia Capital" } }
```

```json
// messages/en.json
{ "home": { "title": "Alkemia Capital" } }
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| styled-components + `_document.tsx` | `StyledComponentsRegistry` + `useServerInsertedHTML` | Next.js 13 App Router | `_document.tsx` does not exist in App Router |
| `getStaticProps` / `getServerSideProps` | React Server Components + `fetch` | Next.js 13+ | All data fetching is now async functions in RSC |
| next-intl v3 with `createTranslator` | next-intl v4 with `getTranslations` | March 2025 | Simpler API, TypeScript strict, removed deprecated APIs |
| `pages/` router locale detection | Middleware + `[locale]` segment | Next.js 13 | App Router has no built-in i18n — middleware is the entry point |

**Deprecated/outdated:**
- `next-i18next`: Pages Router only, incompatible with App Router
- `styled-components` v5 patterns with `_document.js`: Does not work in App Router
- `params.locale` without `await`: Silent bug in Next.js 15 — params is now a Promise

---

## Open Questions

1. **Plus Jakarta Sans availability on Google Fonts**
   - What we know: The font is on Google Fonts and should be available via `next/font/google` as `Plus_Jakarta_Sans`
   - What's unclear: Not directly verified via Context7 (font list not indexed). The underscore naming convention for multi-word Google Fonts is verified as correct
   - Recommendation: Verify at `npx create-next-app` time — if not found, fallback is DM Sans (geometric, similar character)

2. **Vercel deployment method — GitHub vs Gitea**
   - What we know: Vercel natively integrates with GitHub. Project uses Gitea Actions per CLAUDE.md
   - What's unclear: Whether Vercel Gitea integration is available or requires Vercel CLI in CI
   - Recommendation: Use `vercel --prod` in Gitea Actions pipeline as deployment step, or connect via Vercel GitHub mirror. Verify during Phase 1 deployment task.

3. **WCAG AA contrast ratios for #2EC4B6 and #D4A843 on #1A1E22**
   - What we know: Both colors need verification before any CSS is written
   - What's unclear: Exact contrast ratios (not computed here — requires tool)
   - Recommendation: Run WebAIM contrast checker as first task before any theme CSS. If teal fails AA for body text (unlikely — high luminance), restrict it to large text / UI components only.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — greenfield project |
| Config file | None — Wave 0 must create |
| Quick run command | `npx playwright test --reporter=line` (post-setup) |
| Full suite command | `npx playwright test` |

**Rationale for Playwright (not Jest/Vitest):** Phase 1 requirements are infrastructure-level (SSR rendering, hydration, routing, deployment). Unit tests cannot verify hydration mismatches, SSR style injection, or i18n redirects. Playwright e2e smoke tests are the appropriate tool for this phase.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | App Router renders page with SSR | e2e smoke | `npx playwright test tests/smoke.spec.ts` | Wave 0 |
| FOUND-02 | No hydration mismatch in console | e2e smoke | `npx playwright test tests/smoke.spec.ts` | Wave 0 |
| FOUND-03 | Dark background #1A1E22 visible on page | e2e smoke | `npx playwright test tests/theme.spec.ts` | Wave 0 |
| FOUND-05 | / serves IT content, /en/ serves EN content | e2e smoke | `npx playwright test tests/i18n.spec.ts` | Wave 0 |
| FOUND-06 | Page renders at 320px and 2560px without layout break | e2e visual | `npx playwright test tests/responsive.spec.ts` | Wave 0 |
| FOUND-07 | Production URL returns HTTP 200 | e2e smoke | `npx playwright test tests/deploy.spec.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (type check only — fast, no Playwright needed for infra tasks)
- **Per wave merge:** `npx playwright test` (full smoke suite)
- **Phase gate:** Full suite green + zero TypeScript errors before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/smoke.spec.ts` — covers FOUND-01, FOUND-02
- [ ] `tests/theme.spec.ts` — covers FOUND-03
- [ ] `tests/i18n.spec.ts` — covers FOUND-05
- [ ] `tests/responsive.spec.ts` — covers FOUND-06
- [ ] `tests/deploy.spec.ts` — covers FOUND-07
- [ ] `playwright.config.ts` — shared config (baseURL from env)
- [ ] Framework install: `npm install -D @playwright/test && npx playwright install chromium`

---

## Sources

### Primary (HIGH confidence)
- [Next.js CSS-in-JS official docs](https://nextjs.org/docs/app/guides/css-in-js) — StyledComponentsRegistry exact pattern, useServerInsertedHTML usage
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) — next/font/google variable option, Plus_Jakarta_Sans naming
- [next-intl routing configuration](https://next-intl.dev/docs/routing/configuration) — defineRouting, localePrefix as-needed
- [next-intl middleware docs](https://next-intl.dev/docs/routing/middleware) — matcher pattern, middleware setup
- [next-intl App Router getting started](https://next-intl.dev/docs/getting-started/app-router) — folder structure, request.ts

### Secondary (MEDIUM confidence)
- [styled-components v6 + Next.js 15 discussion (vercel/next.js #66820)](https://github.com/vercel/next.js/discussions/66820) — Community-verified SSR pattern alignment
- [STACK.md research](/.planning/research/STACK.md) — Pre-existing stack research with verified sources

### Tertiary (LOW confidence)
- Vercel Gitea integration: Not directly verified. Official Vercel docs cover GitHub/GitLab/Bitbucket natively; Gitea requires CLI-based deployment. Needs validation.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries are locked decisions verified against official sources
- Architecture: HIGH — StyledComponentsRegistry and next-intl patterns pulled directly from official docs
- Pitfalls: HIGH — based on official docs, known Next.js 15 param changes, and pre-validated items from STATE.md
- Validation approach: MEDIUM — Playwright recommendation is reasonable for this phase type but framework choice is Claude's discretion

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable stack — next-intl and Next.js 15 both mature, 30-day window safe)
