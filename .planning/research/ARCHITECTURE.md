# Architecture Patterns

**Domain:** PE/VC corporate website (Next.js + Contentful + Styled Components)
**Project:** Alkemia Capital — replica of hgcapital.com aesthetic and structure
**Researched:** 2026-03-14
**Confidence:** HIGH (Next.js/Contentful official docs + verified patterns)

---

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel Edge                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Next.js App                        │  │
│  │                                                        │  │
│  │   RSC Data Layer          Client Animation Layer       │  │
│  │   (fetch + cache)         (GSAP / Framer Motion)       │  │
│  │         │                         │                    │  │
│  │   ┌─────▼──────┐         ┌────────▼────────┐          │  │
│  │   │  Page RSC  │         │  'use client'   │          │  │
│  │   │  (async)   │──────▶  │  AnimSection    │          │  │
│  │   └─────┬──────┘         └─────────────────┘          │  │
│  │         │                                              │  │
│  │   ┌─────▼──────┐                                       │  │
│  │   │ Contentful │  GraphQL / REST                       │  │
│  │   │   Client   │◀────────────────────────────────────  │  │
│  │   └────────────┘                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
   Contentful Space              Contentful Webhooks
   (Content Delivery API)        (on-demand revalidation)
```

---

## App Router Folder Structure

```
src/
├── app/
│   ├── [locale]/                        # i18n root — all routes live here
│   │   ├── layout.tsx                   # Root layout with StyledRegistry + fonts
│   │   ├── page.tsx                     # Homepage (RSC, fetches Contentful)
│   │   ├── approach/
│   │   │   ├── page.tsx
│   │   │   └── creating-value/page.tsx
│   │   ├── portfolio/
│   │   │   ├── page.tsx                 # Portfolio grid (SSG + ISR)
│   │   │   └── [slug]/page.tsx          # Portfolio company detail
│   │   ├── team/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── insights/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── sustainability/page.tsx
│   │   ├── investors/page.tsx
│   │   └── contact/page.tsx
│   ├── api/
│   │   ├── revalidate/route.ts          # Contentful webhook endpoint
│   │   └── draft/route.ts               # Draft Mode for previews
│   └── [...not-found]/page.tsx
│
├── components/
│   ├── ui/                              # Atoms: Button, Tag, Icon, Badge
│   ├── layout/                          # Header, Footer, Navigation, MobileMenu
│   ├── sections/                        # Organisms: HeroSection, NewsCarousel,
│   │   ├── HeroVideo/                   #   TeamGrid, PortfolioGrid, etc.
│   │   ├── PortfolioGrid/
│   │   ├── TeamGrid/
│   │   ├── NewsCarousel/
│   │   └── StatsBar/
│   ├── cards/                           # PortfolioCard, TeamCard, NewsCard
│   └── animations/                      # AnimatedSection, ParallaxWrapper,
│       ├── AnimatedSection.tsx          #   CounterAnimation, etc.
│       └── gsap-init.ts                 # Centralized GSAP plugin registration
│
├── lib/
│   ├── contentful/
│   │   ├── client.ts                    # Contentful SDK / GraphQL client
│   │   ├── queries/                     # GraphQL query files per content type
│   │   │   ├── portfolio.graphql
│   │   │   ├── team.graphql
│   │   │   ├── news.graphql
│   │   │   └── page.graphql
│   │   └── mappers/                     # Raw API response → typed domain objects
│   └── seo/
│       └── structured-data.ts           # JSON-LD schema generators
│
├── styles/
│   ├── GlobalStyle.ts                   # Styled Components global styles
│   ├── theme.ts                         # Design tokens: colors, spacing, fonts
│   └── StyledRegistry.tsx              # SSR flush registry for App Router
│
├── i18n/
│   ├── routing.ts                       # defineRouting(['it', 'en'], 'it')
│   ├── navigation.ts                    # Locale-aware Link, redirect, useRouter
│   └── request.ts                       # getRequestConfig for RSC locale
│
├── messages/
│   ├── it.json                          # Italian UI strings
│   └── en.json                          # English UI strings
│
├── middleware.ts                         # next-intl locale detection + routing
└── types/
    └── contentful.ts                    # TypeScript types mirroring content models
```

**Key convention:** All pages are RSC by default (no `'use client'`). Animation wrappers and interactive elements are the only client components.

---

## Contentful Content Models

### Model 1: `page` (Generic Page)
Used for Approach, Sustainability, Investors, Contact.

| Field | Type | Notes |
|-------|------|-------|
| title | Short Text | Page H1, also used for `<title>` |
| slug | Short Text | Unique URL identifier |
| seoTitle | Short Text | Override for `<title>` if different |
| seoDescription | Short Text | Meta description |
| ogImage | Media | Open Graph image |
| sections | References (many) | Links to `section*` content types |
| locale | Built-in Contentful | IT / EN via localization |

### Model 2: `portfolioCompany`
| Field | Type | Notes |
|-------|------|-------|
| name | Short Text | Company name |
| slug | Short Text | URL slug |
| logo | Media | SVG or PNG |
| sector | Short Text | e.g. "Private Equity", "Venture" |
| platform | Reference → `investmentPlatform` | PE / VC / PIPE |
| description | Rich Text | Company summary |
| website | Short Text | External URL |
| featured | Boolean | Show on homepage section |
| order | Integer | Sort order in grid |

### Model 3: `teamMember`
| Field | Type | Notes |
|-------|------|-------|
| name | Short Text | Full name |
| slug | Short Text | URL slug for profile page |
| role | Short Text | Job title |
| photo | Media | Headshot image |
| bio | Rich Text | Full biography |
| linkedIn | Short Text | LinkedIn URL |
| board | Boolean | Is CdA member |
| order | Integer | Sort order |

### Model 4: `newsArticle`
| Field | Type | Notes |
|-------|------|-------|
| title | Short Text | Article headline |
| slug | Short Text | URL slug |
| publishDate | Date | Used for sorting |
| category | Short Text | "News", "Insights", "Press" |
| heroImage | Media | Article cover |
| body | Rich Text | Full article content |
| excerpt | Short Text | For card preview (max 160 chars) |
| externalUrl | Short Text | If linking to external press |

### Model 5: `investmentPlatform`
| Field | Type | Notes |
|-------|------|-------|
| name | Short Text | "Private Equity", "Venture Capital", "PIPE" |
| slug | Short Text | |
| description | Rich Text | Platform overview |
| funds | References (many) | Links to `fund` entries |
| heroImage | Media | |

### Model 6: `fund`
| Field | Type | Notes |
|-------|------|-------|
| name | Short Text | "Amarone", "Food Excellence I", etc. |
| platform | Reference → `investmentPlatform` | Parent platform |
| vintage | Integer | Year of fund |
| status | Short Text | "Active", "Closed" |
| description | Short Text | Brief description |

### Model 7: `siteConfig` (singleton)
| Field | Type | Notes |
|-------|------|-------|
| siteName | Short Text | "Alkemia Capital" |
| defaultOgImage | Media | Fallback OG image |
| heroVideoUrl | Short Text | Vimeo URL for homepage hero |
| contactEmail | Short Text | |
| officeLocations | References (many) | Links to `office` entries |
| footerLinks | References (many) | Legal/policy pages |
| navItems | References (many) | Top-level navigation |

### Model 8: `office`
| Field | Type | Notes |
|-------|------|-------|
| city | Short Text | "Milan", "Padova" |
| address | Short Text | Full street address |
| mapEmbedUrl | Short Text | Google Maps embed |

**Nesting rule:** Max 3 levels deep (page → section → component). Never nest content models more than 4 levels. Source: Contentful official best practices.

---

## Component Boundaries

### What talks to what

```
Page RSC (app/[locale]/portfolio/page.tsx)
   │
   ├── fetches via lib/contentful/client.ts
   │   └── returns typed PortfolioCompany[]
   │
   ├── renders <PortfolioGrid> (RSC, no animation)
   │   └── renders <PortfolioCard> × N (RSC)
   │
   └── wraps grid in <AnimatedSection> ('use client')
       └── GSAP ScrollTrigger fires on mount
```

```
Layout (app/[locale]/layout.tsx)
   │
   ├── <StyledRegistry> ('use client') — SSR style flush
   ├── <Header> (RSC shell + 'use client' MobileMenu)
   └── <Footer> (RSC — fetches footerLinks from siteConfig)
```

### Component types

| Component | Type | Reason |
|-----------|------|--------|
| Page files (`page.tsx`) | RSC | Data fetching, no interactivity |
| `<Header>` shell | RSC | Static nav structure |
| `<MobileMenu>` | Client | State for open/close |
| `<AnimatedSection>` | Client | GSAP needs DOM access |
| `<HeroVideo>` | Client | Vimeo embed, intersection observer |
| `<NewsCarousel>` | Client | Swiper/touch interaction |
| `<PortfolioGrid>` | RSC | Static filtered grid |
| `<FilterBar>` (portfolio) | Client | Filter state |
| `<CounterAnimation>` | Client | Intersection + counting |
| `<StyledRegistry>` | Client | `useServerInsertedHTML` hook |
| All card components | RSC | Pure presentation |
| JSON-LD scripts | RSC | In page.tsx `<script>` tag |

---

## Data Flow

### Read path (public user)

```
User request
    │
    ▼
Vercel Edge (CDN cache hit?) ──yes──▶ Serve static HTML
    │ no
    ▼
Next.js RSC render
    │
    ▼
lib/contentful/client.ts
    │  GraphQL query with `next: { tags: ['portfolio'] }`
    ▼
Contentful Content Delivery API
    │  JSON response
    ▼
lib/contentful/mappers/ (raw → typed domain object)
    │
    ▼
Page component renders HTML
    │
    ▼
Styled Components SSR registry flushes CSS to <head>
    │
    ▼
HTML + inline CSS served to user
    │
    ▼
Client hydration: GSAP init, Vimeo embed, interactive components
```

### Content update path (editor)

```
Editor publishes in Contentful
    │
    ▼
Contentful Webhook → POST /api/revalidate?secret=xxx
    │
    ▼
revalidateTag('portfolio') — targeted ISR invalidation
    │
    ▼
Next request regenerates only affected pages
```

### i18n data flow

```
Request hits /it/portfolio or /en/portfolio
    │
    ▼
middleware.ts (next-intl) detects locale
    │
    ▼
app/[locale]/portfolio/page.tsx receives locale param
    │
    ├── Contentful query includes locale filter (it-IT / en-US)
    │   Contentful natively handles localized fields
    │
    └── getTranslations('portfolio') from messages/it.json
        (for UI strings not in Contentful)
```

---

## Data Fetching Patterns

### RSC pages: fetch with cache tags

```typescript
// lib/contentful/client.ts
const data = await fetch(
  `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    body: JSON.stringify({ query: PORTFOLIO_QUERY }),
    next: { tags: ['portfolio'], revalidate: false }  // Static until webhook fires
  }
)
```

### On-demand revalidation via webhook

```typescript
// app/api/revalidate/route.ts
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.REVALIDATION_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  const { contentType } = await req.json()
  revalidateTag(contentType)  // e.g. 'portfolio', 'teamMember', 'newsArticle'
  return new Response('Revalidated', { status: 200 })
}
```

### generateStaticParams for detail pages

```typescript
// app/[locale]/portfolio/[slug]/page.tsx
export async function generateStaticParams() {
  const companies = await getAllPortfolioSlugs()
  const locales = ['it', 'en']
  return locales.flatMap(locale =>
    companies.map(slug => ({ locale, slug }))
  )
}
```

### Rendering strategy per page type

| Page | Strategy | Revalidation |
|------|----------|--------------|
| Homepage | SSG + on-demand ISR | Webhook on siteConfig/news publish |
| Portfolio grid | SSG + on-demand ISR | Webhook on portfolioCompany publish |
| Portfolio detail | SSG + on-demand ISR | Webhook on specific company |
| Team grid | SSG + on-demand ISR | Webhook on teamMember publish |
| News listing | SSG + on-demand ISR | Webhook on newsArticle publish |
| News article | SSG + on-demand ISR | Per-article tag |
| Contact | SSG (rarely changes) | Manual or 24h revalidate |

---

## i18n Routing Architecture

### Routing configuration

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['it', 'en'],
  defaultLocale: 'it',         // Italian is default (Alkemia is Italian firm)
  localePrefix: 'as-needed'    // /portfolio (IT), /en/portfolio (EN)
})
```

### Middleware (locale detection)

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

### Static rendering with i18n

All pages must call `setRequestLocale(locale)` before any async operations to enable static rendering. Without this, next-intl defaults to dynamic rendering.

### Content strategy: Contentful localization vs. JSON messages

| Content | Where |
|---------|-------|
| Page content, articles, team bios | Contentful localized fields (IT + EN) |
| UI strings (nav labels, CTAs, form labels) | `messages/it.json` + `messages/en.json` |
| SEO metadata | Contentful per entry, per locale |

---

## Animation System Architecture

### Core principle
GSAP and all DOM-dependent animation code lives exclusively in `'use client'` components. RSC pages render static HTML shells. Client components hydrate and attach animations.

### GSAP initialization (centralized)

```typescript
// src/components/animations/gsap-init.ts
// Called once in root layout client wrapper
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// One instance across the entire app — critical to avoid conflicts
```

### AnimatedSection component pattern

```typescript
// 'use client'
// Wraps any RSC-rendered content with scroll-triggered reveal
// useGSAP hook handles cleanup on unmount (no memory leaks)
import { useGSAP } from '@gsap/react'

export function AnimatedSection({ children, animation = 'fadeUp' }) {
  const containerRef = useRef(null)
  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 60, opacity: 0, duration: 0.8,
      scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
    })
  }, { scope: containerRef })

  return <div ref={containerRef}>{children}</div>
}
```

### After navigation: ScrollTrigger.refresh()

Next.js App Router soft navigation does not unmount/remount the full page. After route transitions, call `ScrollTrigger.refresh()` in a `useEffect` listening to `usePathname()` to recalculate trigger positions.

### Animation component inventory

| Component | Animation Type | Trigger |
|-----------|---------------|---------|
| `<HeroSection>` | Video autoplay + title stagger | On mount |
| `<AnimatedSection>` | fadeUp / fadeIn / slideLeft | ScrollTrigger |
| `<StatsBar>` | Counter increment | ScrollTrigger enter |
| `<ParallaxImage>` | Y-axis parallax | ScrollTrigger scrub |
| `<NewsCarousel>` | Drag/swipe (Swiper.js or Embla) | Touch/mouse |
| `<NavBar>` | Hide on scroll down, show on scroll up | Scroll direction |
| `<PageTransition>` | Fade in/out on route change | `usePathname` change |

---

## Styled Components SSR Setup

Styled Components v6.3+ supports RSC with zero config. For App Router, a registry is still needed to prevent FOUC (flash of unstyled content) on first paint.

```typescript
// src/styles/StyledRegistry.tsx
'use client'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export function StyledRegistry({ children }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())
  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return styles
  })
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

Place `<StyledRegistry>` in `app/[locale]/layout.tsx` wrapping all children.

### Theme structure

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    background: '#0D1117',       // Alkemia dark (deeper than HG's #1A1E22)
    surface: '#161B22',
    accent: '#[TBD]',            // Alkemia brand accent — to define
    text: '#FFFFFF',
    textSecondary: '#8B949E',
    border: '#30363D',
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    // Confirm if HG uses a licensed font — may need substitute
  },
  spacing: { /* 4px base grid */ },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' }
}
```

---

## SEO Architecture

### Metadata generation per page

```typescript
// app/[locale]/portfolio/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const company = await getPortfolioCompany(params.slug, params.locale)
  return {
    title: `${company.name} | Alkemia Capital`,
    description: company.excerpt,
    openGraph: {
      images: [{ url: company.logo.url, width: 1200, height: 630 }],
      type: 'website',
      locale: params.locale === 'it' ? 'it_IT' : 'en_US',
    },
    alternates: {
      canonical: `https://alkemiacapital.com/${params.locale}/portfolio/${params.slug}`,
      languages: {
        'it': `/it/portfolio/${params.slug}`,
        'en': `/en/portfolio/${params.slug}`,
      }
    }
  }
}
```

### JSON-LD structured data

Injected as RSC `<script>` tags, not client-side. Types to implement:

| Page | Schema type |
|------|-------------|
| Homepage | `Organization` + `WebSite` |
| Team member | `Person` |
| News article | `NewsArticle` |
| Contact | `LocalBusiness` |
| Portfolio grid | `ItemList` |

### Sitemap and robots

Auto-generated via `src/app/sitemap.ts` (fetches all slugs from Contentful) and `src/app/robots.ts`. Both are static files built at deploy time, re-generated on rebuild.

---

## Image and Video Optimization

### Images (Next.js `<Image>`)

- `priority` prop on above-fold images (hero section, first card in grid)
- `sizes` attribute always specified to prevent over-fetching
- Contentful CDN delivers images — use `loader` to pass Contentful image transformations (width, format=webp)
- All team photos: fixed aspect ratio, 1:1 or 3:4
- Portfolio logos: contain fit, white/transparent background

```typescript
// Contentful image URL pattern
const src = `${asset.url}?w=800&fm=webp&q=80`
```

### Video (homepage hero)

Strategy: facade pattern to avoid blocking LCP.

1. Show static poster image on initial paint (priority load)
2. Load Vimeo iframe after `IntersectionObserver` fires (or after 2s delay)
3. Autoplay muted, loop, no controls for background video
4. Fallback: static image on mobile (video background skipped below `md` breakpoint)

```typescript
// HeroVideo component ('use client')
// Initial state: show <Image priority> poster
// After mount/intersection: swap to Vimeo iframe
```

No `next-video` needed — Vimeo handles CDN/transcoding. Direct iframe embed with facade pattern is sufficient.

---

## Deployment Pipeline

```
Developer pushes to main
    │
    ▼
Vercel detects push → triggers build
    │
    ├── next build
    │   ├── generateStaticParams() fetches all slugs from Contentful
    │   ├── Pre-renders all static pages (SSG)
    │   └── Bundles client components
    │
    ▼
Vercel deploys to global CDN
    │
    ▼
Content updates handled separately via:
    Contentful → Webhook → /api/revalidate → revalidateTag()
    (No full rebuild needed for content-only changes)
```

### Environment variables required

```bash
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=          # Delivery API (public)
CONTENTFUL_PREVIEW_ACCESS_TOKEN=  # Preview API (draft content)
CONTENTFUL_REVALIDATION_SECRET=   # Webhook auth token
NEXT_PUBLIC_SITE_URL=https://alkemiacapital.com
```

### Preview workflow (editors)

1. Editor creates/edits entry in Contentful (not published)
2. Clicks "Open Preview" → hits `/api/draft?secret=xxx&slug=portfolio/slug`
3. Next.js enables Draft Mode cookie → page re-renders with preview token
4. Editor reviews → publishes → webhook fires → ISR invalidates cache

---

## Suggested Build Order

Dependencies determine this order. Each phase unblocks the next.

```
Phase 1: Foundation
├── Project scaffolding (Next.js 15, TypeScript, ESLint)
├── Styled Components setup (theme, GlobalStyle, StyledRegistry)
├── next-intl setup (routing, middleware, message files)
└── Contentful space setup (env vars, client, base GraphQL query)

Phase 2: Content Infrastructure
├── Define all Contentful content models (8 types above)
├── Seed Contentful with Alkemia data from alkemiacapital-site.md
├── TypeScript types for all content models
├── GraphQL queries per content type
└── Mappers: raw API → typed domain objects

Phase 3: Layout Shell
├── Header (navigation, locale switcher, mobile menu)
├── Footer (links, offices, legal)
└── Page transition wrapper

Phase 4: Core Pages (RSC data fetching + static presentation)
├── Homepage (structure only, no animations yet)
├── Portfolio grid + detail
├── Team grid + profile
├── News listing + article
└── Approach, Contact, Sustainability pages

Phase 5: Animation Layer
├── GSAP centralized init + useGSAP hook setup
├── AnimatedSection wrapper component
├── Homepage: HeroVideo facade + title animations
├── ScrollTrigger animations on all sections
├── Counter animations (stats)
└── NavBar scroll behavior

Phase 6: SEO + Performance
├── generateMetadata per page type
├── JSON-LD schemas
├── sitemap.ts + robots.ts
├── Image optimization (sizes, loader, priority flags)
└── Lighthouse audit + fixes

Phase 7: Production Hardening
├── Contentful webhook → /api/revalidate wiring
├── Draft Mode preview flow
├── Error boundaries + not-found pages
├── Accessibility audit (WCAG 2.1 AA)
└── Final Vercel deployment config
```

**Dependency chain:** Phase 2 (content models) must precede Phase 4 (pages). Phase 4 must precede Phase 5 (animations need DOM structure to target). Phase 5 and 6 can partially overlap.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Fetching in Client Components
**What:** `useEffect(() => fetch('/api/portfolio'))` in a client component
**Why bad:** Adds waterfall, exposes API, breaks SSG
**Instead:** Fetch in RSC page, pass data as props to client components

### Anti-Pattern 2: Global GSAP Registration in Each Component
**What:** `gsap.registerPlugin(ScrollTrigger)` in every animated component
**Why bad:** Multiple GSAP instances, conflicting scroll triggers, memory leaks
**Instead:** Register once in `gsap-init.ts`, import the initialized instance

### Anti-Pattern 3: Styled Components on RSC without Registry
**What:** Using `styled.div` in a Server Component without `StyledRegistry`
**Why bad:** FOUC on first paint, hydration mismatch
**Instead:** StyledRegistry in root layout, all RSC styled components pre-render correctly via v6.3+

### Anti-Pattern 4: Flat Contentful Content Model
**What:** One giant `page` content type with 40+ fields
**Why bad:** Editors overwhelmed, no reusability, impossible to query efficiently
**Instead:** Separate content types, reference fields to compose pages

### Anti-Pattern 5: Video in Hero without Facade
**What:** Loading Vimeo iframe in initial HTML
**Why bad:** Blocks LCP, crushes Lighthouse performance score
**Instead:** Static poster image first, swap to iframe after mount/intersection

### Anti-Pattern 6: Hardcoding Locale in Fetch
**What:** Always fetching `locale: 'it-IT'` regardless of route
**Why bad:** EN pages serve IT content
**Instead:** Pass `params.locale` from page component into all Contentful queries

---

## Sources

- [Next.js Contentful Integration (Vercel KB)](https://vercel.com/kb/guide/integrating-next-js-and-contentful-for-your-headless-cms) — HIGH confidence
- [How to Integrate Contentful and Next.js App Router (Contentful Blog)](https://www.contentful.com/blog/integrate-contentful-next-js-app-router/) — HIGH confidence
- [next-intl App Router with i18n routing (official docs)](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) — HIGH confidence
- [Next.js CSS-in-JS App Router (official docs)](https://nextjs.org/docs/app/building-your-application/styling/css-in-js) — HIGH confidence
- [GSAP with Next.js 15: init and cleanup](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232) — MEDIUM confidence
- [Content modeling patterns (Contentful Help Center)](https://www.contentful.com/help/content-models/content-modeling-patterns/) — HIGH confidence
- [Next.js ISR with Contentful (Contentful Blog)](https://www.contentful.com/blog/nextjs-isr/) — HIGH confidence
- [Next.js JSON-LD structured data (official docs)](https://nextjs.org/docs/app/guides/json-ld) — HIGH confidence
- [Next.js project structure best practices 2025](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji) — MEDIUM confidence
