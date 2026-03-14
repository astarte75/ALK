# Phase 4: Core Pages - Research

**Researched:** 2026-03-14
**Domain:** Next.js 15 App Router pages, dynamic routes, client-side filtering, contact form, image optimization, Contentful data consumption
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Homepage (Phase 4 -- no animations):**
- Hero: Static poster image (`/images/hero-poster.jpg`) with dark overlay
- Headline IT: "Passione per l'impresa" / EN: "A Passion for Enterprise"
- Stats section: 4 stats displayed statically (~20 anni, EUR270M AUM, 29 operazioni, 18 aziende)
- News preview: Latest 3 news cards from Contentful
- Newsletter strip: UI only (form not functional)
- No video, no scroll animations, no Lenis -- deferred to Phase 5

**Portfolio:**
- Grid: 1col mobile / 2col tablet / 3col desktop
- Filters: Pill/tag, two rows -- Area (PE/VC/PIPE) + Settore (ICT, Digital Services, Food, Agri-tech, Cybersecurity, Automotive & Mobility, Industrial, Energy, Other)
- Card: Logo + nome + settore + shortDescription + anno + badge investmentType
- Hover effects: CSS only (color transition, subtle zoom)
- Detail pages via `[slug]` dynamic route

**Team:**
- Portrait 3:4 photos, category filters (Tutti/Partners/Investment Team/Operations)
- Detail pages via `[slug]`
- Board members: `isBoard: true` flag -- also on Governance page

**News:**
- Card grid, newest first, category pills (Tutti/News/Insights/Events)
- Pagination: Load more button (batch loading), not numbered pages
- Detail pages via `[slug]` with rich text body

**Investment Platforms:**
- Overview page + sub-pages via `[slug]`
- Fund details within each platform: name, fund size, status, investment period

**Societa (About):**
- Sections: Chi Siamo, Storia (stacked timeline), Mission, Approccio, Valori
- Stats: Same 4 as homepage
- Content from Contentful: `getPageBySlug('societa', locale)`

**Corporate Governance:**
- CdA from `teamMember` entries with `isBoard: true` -- photos, names, roles
- Collegio Sindacale + Funzioni di Controllo from `page` entry's `sections` JSON
- Shareholder description from page body

**ESG / Sostenibilita:**
- ESG policy overview, SFDR disclosure text
- Downloadable PDFs from Contentful Assets
- UN SDGs image/reference
- Content from `getPageBySlug('sostenibilita', locale)`

**Contatti:**
- Office locations from `getOffices()`
- Form fields: Nome, Cognome, Email, Telefono (required), Tipo richiesta (select), Messaggio
- API route sends email to segreteria@alkemiacapital.com
- reCAPTCHA v3 invisible: structure predisposed but NOT activated (no API key yet)
- No map embed

**Culture / Life at Alkemia:**
- Full page with values and photos, editable via Contentful as `page` entry

### Claude's Discretion
- Page component structure and routing
- Grid layouts and spacing
- Filter interaction pattern (URL params vs client state)
- Card hover effect specifics
- Contact form API route implementation
- Newsletter strip UI structure
- Pagination UX for news (load more button style)
- Static page section components

### Deferred Ideas (OUT OF SCOPE)
- Newsletter form integration (Mailchimp/Sendinblue) -- post-launch
- reCAPTCHA v3 activation -- post-launch when API key is ready
- Contact form email routing per request type -- post-launch
- Map embed on contacts page -- V2
- Masonry/variable card layout for news -- V2
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Full-screen video hero (Phase 4: static poster only, video in Phase 5) | Static poster hero with dark overlay, `next/image` fill + aspect-ratio container |
| HOME-05 | Insights preview: latest 3 news cards | `getNewsArticles(locale, 3)` fetcher already exists, NewsCard component pattern |
| HOME-06 | Animated stat counters (Phase 4: static display, animation Phase 5) | Static stat display with semantic markup ready for GSAP counters |
| HOME-07 | Newsletter signup strip | UI-only form component, no backend integration |
| PORT-01 | Responsive portfolio grid (1/2/3 col) | CSS Grid with `mq` breakpoints, `getPortfolioCompanies()` fetcher |
| PORT-02 | Filter by sector | Client-side pill filter with React state, no URL params needed |
| PORT-03 | Filter by fund type (PE/VC/PIPE) | Same client-side filter pattern, multi-row pills |
| PORT-04 | Company cards with logo, name, description, sector, year, fund type | Rich card component with `next/image` for logos, badge for investmentType |
| PORT-05 | Individual company detail pages | `generateStaticParams` with both locales, `getPortfolioCompanyBySlug()` |
| PORT-06 | Hover effects on cards | CSS-only transitions (transform, background-color), no GSAP |
| TEAM-01 | Responsive team grid with photos, names, roles | 3:4 aspect-ratio containers with `next/image` fill, `getTeamMembers()` |
| TEAM-02 | Individual profile pages | `generateStaticParams` + `getTeamMemberBySlug()` |
| TEAM-03 | Filter by role category | Client-side pill filter, same pattern as portfolio |
| NEWS-01 | Card grid layout for news | NewsCard component with `next/image` for featuredImage |
| NEWS-02 | Chronological ordering (newest first) | Already handled: `getNewsArticles` orders by `-fields.date` |
| NEWS-03 | Individual article pages with full content | `generateStaticParams` + `getNewsArticleBySlug()` + `renderRichText()` |
| NEWS-04 | Category filter | Client-side pill filter |
| NEWS-05 | Pagination or batch loading | Client-side "load more" with Contentful `skip`/`limit` params |
| INVP-01 | Overview page explaining PE, VC, PIPE strategies | `getInvestmentPlatforms()` + `renderRichText()` |
| INVP-02 | Individual sub-pages per platform | `generateStaticParams` + `getInvestmentPlatformBySlug()` |
| INVP-03 | Fund detail sections within each platform | `getFunds()` filtered by `platformRef`, card/table layout |
| INVP-04 | Fund metrics display | Structured card component with size, status, period |
| ABOUT-01 | Company history timeline | Stacked sections from `page.sections` JSON, no timeline graphic |
| ABOUT-02 | Mission statement section | Rich text from `getPageBySlug('societa', locale)` |
| ABOUT-03 | Approach and values sections | Page sections rendering |
| ABOUT-04 | Key statistics | Reusable StatsSection component (same as homepage) |
| GOV-01 | Board of Directors section | `getTeamMembers()` filtered by `isBoard: true`, photo cards |
| GOV-02 | Board of Statutory Auditors | Structured data from `page.sections` JSON |
| GOV-03 | Control Functions section | Structured data from `page.sections` JSON |
| GOV-04 | Shareholder structure | Rich text from page body |
| ESG-01 | ESG policy overview (E, S, G sections) | Page sections from Contentful |
| ESG-02 | SFDR disclosure text | Rich text body from page entry |
| ESG-03 | Downloadable PDF documents | Contentful Asset links with `download` attribute |
| ESG-04 | UN SDGs image/reference | `next/image` for SDG icons from Contentful Assets |
| CONT-01 | Office locations (Milano, Padova) | `getOffices()` fetcher, card layout |
| CONT-02 | Contact form with request type | Client Component with form state, POST to `/api/contact` |
| CONT-03 | reCAPTCHA integration | Structure predisposed, env var check, activate later |
| CULT-01 | Culture/values narrative page | `getPageBySlug('culture', locale)` + `renderRichText()` |
| CULT-02 | Photo-heavy layout | Grid of `next/image` with Contentful assets |
</phase_requirements>

---

## Summary

Phase 4 is the largest phase of the project -- 39 requirements spanning 10 page types. The foundational work is done: all Contentful fetchers, types, rich text renderer, layout shell, header, footer, and i18n are in place. This phase focuses purely on building pages that consume these existing APIs.

The core technical patterns are: (1) Server Components for data fetching with `generateStaticParams` for dynamic routes across both locales, (2) Client Components for interactivity (filters, contact form, load more), (3) `next/image` with Contentful's CDN for all images, and (4) a single API route handler for the contact form email. The filtering pattern should use React state (not URL search params) since filters are ephemeral UI state on statically generated pages -- using `useSearchParams` would force dynamic rendering.

The main architectural decision is how to structure reusable components: a shared `FilterPills` component for portfolio/team/news filters, a shared `StatsSection` for homepage and societa page, and consistent card patterns across portfolio, team, and news. The contact form requires `nodemailer` for server-side email sending via SMTP, with reCAPTCHA v3 structure prepared but not activated.

**Primary recommendation:** Use React `useState` for all client-side filters (not URL params). Use `nodemailer` v8 for the contact form API route. Structure reCAPTCHA as an optional wrapper that checks for `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` before activating. Build all dynamic routes with `generateStaticParams` returning both `it` and `en` locale variants.

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.5.12 | Framework, SSG, route handlers | Already installed, App Router with `generateStaticParams` |
| contentful | ^11.10.6 | Content delivery (all page data) | Already installed, all fetchers ready |
| @contentful/rich-text-react-renderer | ^16.1.6 | Rich text rendering | Already installed, `renderRichText()` ready |
| styled-components | ^6.3.11 | Component styling | Already installed, SSR registry configured |
| next-intl | ^4.8.3 | i18n translations | Already installed, messages files ready |

### New Dependencies

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| nodemailer | ^8.0.2 | Send contact form emails via SMTP | API route `app/api/contact/route.ts` only (server-side) |
| @types/nodemailer | ^7.0.11 | TypeScript definitions for nodemailer | Dev dependency |

### Not Needed

| Library | Why Not |
|---------|---------|
| react-google-recaptcha-v3 | reCAPTCHA NOT activated yet. Predispose structure with vanilla `grecaptcha` script loading. Add library post-launch when API key is ready |
| nuqs (URL search params) | Filters are ephemeral UI state. React state is simpler and keeps pages statically generated |
| react-hook-form | Contact form has 6 fields -- native form handling with `useState` is sufficient |

**Installation:**
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/app/[locale]/
├── page.tsx                          # Homepage (Server + Client sections)
├── portfolio/
│   ├── page.tsx                      # Portfolio grid with filters
│   └── [slug]/
│       └── page.tsx                  # Company detail
├── team/
│   ├── page.tsx                      # Team grid with filters
│   └── [slug]/
│       └── page.tsx                  # Member profile
├── news/
│   ├── page.tsx                      # News grid with load more
│   └── [slug]/
│       └── page.tsx                  # Article detail
├── investment-platforms/
│   ├── page.tsx                      # Platforms overview
│   └── [slug]/
│       └── page.tsx                  # Platform detail with funds
├── societa/
│   └── page.tsx                      # About (history, mission, values)
├── corporate-governance/
│   └── page.tsx                      # Governance (CdA, Collegio, Funzioni)
├── sostenibilita/
│   └── page.tsx                      # ESG / Sustainability
├── contatti/
│   └── page.tsx                      # Contact form + offices
├── culture/
│   └── page.tsx                      # Culture / Life at Alkemia
src/app/api/
└── contact/
    └── route.ts                      # POST handler for contact form
src/components/
├── sections/                         # Page section components
│   ├── HeroSection.tsx               # Homepage hero (poster)
│   ├── StatsSection.tsx              # 4 stats (reused: home + societa)
│   ├── NewsPreview.tsx               # Latest 3 news cards (homepage)
│   └── NewsletterStrip.tsx           # Newsletter UI strip (homepage)
├── cards/                            # Card components
│   ├── PortfolioCard.tsx             # Company card with logo, badge
│   ├── TeamCard.tsx                  # Team member card (3:4 photo)
│   ├── NewsCard.tsx                  # News article card
│   └── FundCard.tsx                  # Fund metrics card
├── filters/
│   └── FilterPills.tsx               # Reusable pill filter (Client Component)
├── forms/
│   └── ContactForm.tsx               # Contact form (Client Component)
└── content/
    ├── PageSections.tsx              # Renders page.sections JSON
    ├── Timeline.tsx                  # Stacked timeline for history
    └── PdfDownloadList.tsx           # PDF download links
```

### Pattern 1: generateStaticParams with Dual Locales

**What:** Generate static paths for both IT and EN locales for all dynamic routes. Uses the Contentful fetcher to get all slugs, then cross-products with locales.

**When to use:** Every `[slug]` page under `[locale]`.

```typescript
// src/app/[locale]/portfolio/[slug]/page.tsx
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getPortfolioCompanies, getPortfolioCompanyBySlug } from '@/lib/contentful/fetchers'
import { notFound } from 'next/navigation'

// Generate paths for all companies x all locales
export async function generateStaticParams() {
  // Fetch all companies in default locale (slugs are not localized)
  const companies = await getPortfolioCompanies('it')
  return routing.locales.flatMap((locale) =>
    companies.map((company) => ({
      locale,
      slug: company.fields.slug as string,
    }))
  )
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const company = await getPortfolioCompanyBySlug(slug, locale)
  if (!company) notFound()

  return (
    // ... render company detail
  )
}
```

### Pattern 2: Client-Side Filtering with React State

**What:** Use React `useState` for filter state. All data is fetched server-side and passed as props. Filtering happens in the client without re-fetching.

**Why not URL params:** Using `useSearchParams` would opt the page into dynamic rendering, breaking SSG. Filters are ephemeral -- no need to bookmark filter state.

```tsx
// src/components/filters/FilterPills.tsx
'use client'

import { useState } from 'react'
import styled from 'styled-components'

interface FilterPillsProps {
  label: string
  options: { value: string; label: string; count?: number }[]
  value: string
  onChange: (value: string) => void
}

const PillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
`

const Pill = styled.button<{ $active: boolean }>`
  padding: var(--space-2) var(--space-4);
  border-radius: 9999px;
  border: 1px solid ${({ $active }) => $active ? 'var(--color-accent-teal)' : 'var(--color-border)'};
  background: ${({ $active }) => $active ? 'var(--color-accent-teal)' : 'transparent'};
  color: ${({ $active }) => $active ? 'var(--color-bg)' : 'var(--color-text-secondary)'};
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-accent-teal);
    color: ${({ $active }) => $active ? 'var(--color-bg)' : 'var(--color-text-primary)'};
  }
`

export default function FilterPills({ label, options, value, onChange }: FilterPillsProps) {
  return (
    <PillContainer role="group" aria-label={label}>
      {options.map((opt) => (
        <Pill
          key={opt.value}
          $active={value === opt.value}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
        >
          {opt.label}{opt.count !== undefined ? ` (${opt.count})` : ''}
        </Pill>
      ))}
    </PillContainer>
  )
}
```

```tsx
// src/app/[locale]/portfolio/page.tsx -- Server Component fetches, Client filters
import { setRequestLocale } from 'next-intl/server'
import { getPortfolioCompanies } from '@/lib/contentful/fetchers'
import PortfolioGrid from './PortfolioGrid' // Client Component

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const companies = await getPortfolioCompanies(locale)

  return <PortfolioGrid companies={companies} />
}
```

```tsx
// src/app/[locale]/portfolio/PortfolioGrid.tsx -- Client Component
'use client'

import { useState, useMemo } from 'react'
import type { PortfolioCompany } from '@/lib/contentful/types'
import FilterPills from '@/components/filters/FilterPills'

export default function PortfolioGrid({ companies }: { companies: PortfolioCompany[] }) {
  const [area, setArea] = useState('all')
  const [sector, setSector] = useState('all')

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (area !== 'all' && c.fields.investmentType !== area) return false
      if (sector !== 'all' && c.fields.sector !== sector) return false
      return true
    })
  }, [companies, area, sector])

  // Build sector options with counts
  const sectorOptions = useMemo(() => {
    const counts = new Map<string, number>()
    const areaFiltered = area === 'all'
      ? companies
      : companies.filter((c) => c.fields.investmentType === area)
    areaFiltered.forEach((c) => {
      const s = c.fields.sector as string
      counts.set(s, (counts.get(s) || 0) + 1)
    })
    return [
      { value: 'all', label: 'Tutti', count: areaFiltered.length },
      ...Array.from(counts.entries()).map(([value, count]) => ({
        value, label: value, count,
      })),
    ]
  }, [companies, area])

  return (
    <>
      <FilterPills label="Area" options={areaOptions} value={area} onChange={setArea} />
      <FilterPills label="Settore" options={sectorOptions} value={sector} onChange={setSector} />
      {/* Grid of PortfolioCard */}
    </>
  )
}
```

### Pattern 3: Contact Form API Route with Nodemailer

**What:** POST route handler that validates form data, sends email via SMTP, and returns JSON response. reCAPTCHA verification is predisposed but gated on env var.

```typescript
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  requestType: string
  message: string
  recaptchaToken?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactPayload = await request.json()

    // Validate required fields
    const { firstName, lastName, email, phone, requestType, message } = body
    if (!firstName || !lastName || !email || !phone || !requestType || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // reCAPTCHA verification (only if configured)
    if (process.env.RECAPTCHA_SECRET_KEY && body.recaptchaToken) {
      const recaptchaRes = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${body.recaptchaToken}`,
        { method: 'POST' }
      )
      const recaptchaData = await recaptchaRes.json()
      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 403 })
      }
    }

    // Create SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Alkemia Capital Website" <${process.env.SMTP_FROM || 'noreply@alkemiacapital.com'}>`,
      to: 'segreteria@alkemiacapital.com',
      replyTo: email,
      subject: `[Contatto Web] ${requestType} - ${firstName} ${lastName}`,
      html: `
        <h2>Nuova richiesta dal sito web</h2>
        <p><strong>Nome:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone}</p>
        <p><strong>Tipo richiesta:</strong> ${requestType}</p>
        <p><strong>Messaggio:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
```

### Pattern 4: next/image with Contentful and Aspect Ratio Containers

**What:** Use `next/image` with `fill` prop inside a styled container with fixed `aspect-ratio`. The Contentful images CDN handles format conversion and resizing. This project already has `images.ctfassets.net` in `remotePatterns`.

```tsx
// Aspect ratio container for team photos (3:4 portrait)
const PhotoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 8px;
  background: var(--color-surface);
`

function TeamPhoto({ photo }: { photo: Asset }) {
  const file = photo?.fields?.file
  if (!file) return <PhotoContainer /> // placeholder

  return (
    <PhotoContainer>
      <Image
        src={`https:${file.url}`}
        alt={photo.fields.title as string || ''}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        style={{ objectFit: 'cover' }}
      />
    </PhotoContainer>
  )
}
```

### Pattern 5: Load More Pagination for News

**What:** Initial page renders first batch (e.g., 9 articles). Client Component handles "load more" by fetching additional batches directly from Contentful CDA.

**Important:** Since `unstable_cache` wraps the fetcher, we need a separate client-callable endpoint or pass all data at build time. For a site with ~10-20 articles, pass all articles and paginate client-side.

```tsx
// src/app/[locale]/news/NewsGrid.tsx
'use client'

import { useState, useMemo } from 'react'
import type { NewsArticle } from '@/lib/contentful/types'

const BATCH_SIZE = 9

export default function NewsGrid({
  articles,
  loadMoreLabel,
}: {
  articles: NewsArticle[]
  loadMoreLabel: string
}) {
  const [category, setCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)

  const filtered = useMemo(() => {
    if (category === 'all') return articles
    return articles.filter((a) => a.fields.category === category)
  }, [articles, category])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <>
      {/* FilterPills for category */}
      {/* Grid of NewsCard */}
      {hasMore && (
        <LoadMoreButton onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}>
          {loadMoreLabel}
        </LoadMoreButton>
      )}
    </>
  )
}
```

**Decision rationale:** With ~10-20 news articles total, fetching all at build time and paginating client-side is simpler and faster than implementing a separate API endpoint for pagination. If the article count grows past 50+, switch to a server-side pagination API.

### Pattern 6: PDF Download Links from Contentful Assets

**What:** Contentful Assets with PDF files have a `file.url` that can be used as a direct download link. Add the `download` attribute for browser download behavior.

```tsx
// PDF download from Contentful Asset
function PdfDownloadLink({ asset, label }: { asset: Asset; label: string }) {
  const file = asset?.fields?.file
  if (!file || file.contentType !== 'application/pdf') return null

  return (
    <a
      href={`https:${file.url}`}
      download={file.fileName as string}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  )
}
```

### Pattern 7: Page Sections JSON Renderer

**What:** The `page` content type has a `sections` JSON field for structured data (governance roles, ESG sections, timeline events). Render these with a typed component.

```typescript
// Type for page sections JSON
interface PageSection {
  type: 'timeline' | 'people' | 'text' | 'stats'
  title?: string
  items: Array<{
    title: string
    subtitle?: string
    description?: string
    year?: string
    role?: string
    name?: string
  }>
}

// Usage in governance page for Collegio Sindacale
function PeopleList({ section }: { section: PageSection }) {
  return (
    <div>
      <h3>{section.title}</h3>
      {section.items.map((person, i) => (
        <div key={i}>
          <strong>{person.name}</strong>
          {person.role && <span> - {person.role}</span>}
        </div>
      ))}
    </div>
  )
}
```

### Pattern 8: reCAPTCHA v3 Predisposed Structure

**What:** Load reCAPTCHA script only if site key is set. Execute token generation before form submit. Backend verifies only if secret key is set.

```tsx
// src/components/forms/ContactForm.tsx (excerpt)
'use client'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

// Only load script if env var is set
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

function useRecaptcha() {
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  const getToken = async (): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) return null
    return new Promise((resolve) => {
      window.grecaptcha!.ready(async () => {
        const token = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: 'contact' })
        resolve(token)
      })
    })
  }

  return { getToken, isEnabled: !!RECAPTCHA_SITE_KEY }
}
```

### Anti-Patterns to Avoid

- **Using `useSearchParams` for filters on SSG pages:** Forces dynamic rendering. Use React `useState` for ephemeral filter state. Filters do not need to be bookmarkable on a corporate PE site.
- **Fetching Contentful data in Client Components:** All data fetching must happen in Server Components. Pass data as serializable props to Client Components.
- **Forgetting `await params` in page components:** Next.js 15 requires `await params` -- destructuring directly from function args throws a runtime error.
- **Missing `setRequestLocale(locale)` in pages:** Without this, `next-intl` falls back to reading from headers, which breaks static generation.
- **Using `next/image` without `sizes` prop when using `fill`:** Without `sizes`, the browser downloads the largest image. Always specify viewport-relative sizes.
- **Creating API routes under `[locale]`:** API routes must be at `app/api/`, not `app/[locale]/api/`. The contact route goes at `app/api/contact/route.ts`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email sending | Custom SMTP socket handling | `nodemailer` v8 | SMTP protocol has auth, TLS, connection pooling, retries. Nodemailer handles all edge cases |
| Image optimization | Manual srcset/webp transforms | `next/image` + Contentful CDN | Contentful serves `?fm=webp&w=800` automatically. `next/image` handles responsive sizing |
| Rich text rendering | Custom Contentful JSON parser | `renderRichText()` (already built) | Already handles embedded assets, hyperlinks, all block types |
| Form validation (server) | Custom regex validators | Basic field presence checks | Contact form has 6 simple fields. Full validation library is overkill |
| Static path generation | Hardcoded slug arrays | `generateStaticParams` with fetchers | Slugs come from Contentful. Hardcoding would go stale |
| Spam protection | Custom honeypot/rate limiting | reCAPTCHA v3 (when activated) | Google's ML-based scoring is far more effective than custom solutions |

**Key insight:** Phase 4 is a page-building phase, not an infrastructure phase. All infrastructure (fetchers, types, rich text, layout) is done. Focus effort on component design, content layout, and user experience -- not on reinventing data layer patterns.

---

## Common Pitfalls

### Pitfall 1: generateStaticParams Missing Locales
**What goes wrong:** Dynamic route pages 404 for one locale because `generateStaticParams` only returns slugs for `it`.
**Why it happens:** Forgetting to cross-product slugs with both locales.
**How to avoid:** Always use `routing.locales.flatMap()` pattern. Slugs are not localized in this project -- the same slug works for both locales.
**Warning signs:** Pages work in IT but 404 in EN, or vice versa.

### Pitfall 2: Passing Non-Serializable Props to Client Components
**What goes wrong:** Hydration errors or runtime crashes when passing Contentful Entry objects to Client Components.
**Why it happens:** Contentful Entry objects contain circular references (`sys.space`, `sys.environment`). React Server Components serialize props across the server/client boundary.
**How to avoid:** Extract plain data from entries before passing to Client Components. Map entries to simple objects: `{ name: company.fields.name, slug: company.fields.slug, ... }`.
**Warning signs:** "Cannot serialize" errors in dev, hydration mismatch warnings.

### Pitfall 3: Contentful Asset URL Missing `https:` Protocol
**What goes wrong:** Images fail to load, `next/image` throws "invalid src" error.
**Why it happens:** Contentful returns asset URLs as `//images.ctfassets.net/...` (protocol-relative). `next/image` requires absolute URLs.
**How to avoid:** Always prefix with `https:` -- `\`https:${file.url}\``. The existing `richText.tsx` already does this correctly.
**Warning signs:** Broken images, console errors about invalid image src.

### Pitfall 4: Contact Form SMTP Credentials Not Configured
**What goes wrong:** Contact form silently fails in development because SMTP env vars are not set.
**Why it happens:** SMTP credentials are deployment-specific and not available in local dev.
**How to avoid:** Check for SMTP env vars at the top of the route handler. Return a clear error message if not configured. In dev, log the email content to console instead of sending.
**Warning signs:** Form appears to submit successfully but no email arrives.

### Pitfall 5: Filter Counts Not Updating Cross-Dimensionally
**What goes wrong:** Sector filter shows incorrect counts when an area filter is active.
**Why it happens:** Counting all companies per sector regardless of the active area filter.
**How to avoid:** Recalculate sector counts based on the currently area-filtered set (see Pattern 2 code example).
**Warning signs:** Filter shows "ICT (6)" but only 2 ICT companies appear in the filtered grid.

### Pitfall 6: Missing `notFound()` for Invalid Slugs
**What goes wrong:** Dynamic route pages crash with unhandled null when fetcher returns null for an invalid slug.
**Why it happens:** Not checking the fetcher return value before rendering.
**How to avoid:** Call `notFound()` from `next/navigation` immediately after the fetcher if result is null.
**Warning signs:** 500 errors on pages with non-existent slugs instead of clean 404.

---

## Code Examples

### Reusable Stats Section (Homepage + Societa)

```tsx
// src/components/sections/StatsSection.tsx
'use client'

import styled from 'styled-components'
import { mq } from '@/styles/breakpoints'

interface Stat {
  value: string
  label: string
}

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-8);
  padding: var(--space-16) var(--space-8);

  ${mq.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const StatValue = styled.div`
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-accent-teal);
  line-height: 1;

  ${mq.md} {
    font-size: 3.5rem;
  }
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

// Use data- attribute for Phase 5 GSAP counter animation hook
export default function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <Grid>
      {stats.map((stat, i) => (
        <div key={i}>
          <StatValue data-stat-value={stat.value}>{stat.value}</StatValue>
          <StatLabel>{stat.label}</StatLabel>
        </div>
      ))}
    </Grid>
  )
}
```

### Portfolio Card with Hover Effects

```tsx
// src/components/cards/PortfolioCard.tsx
'use client'

import styled from 'styled-components'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { mq } from '@/styles/breakpoints'

const Card = styled(Link)`
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: border-color 0.3s ease, transform 0.3s ease;

  &:hover {
    border-color: var(--color-accent-teal);
    transform: translateY(-4px);
  }
`

const LogoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--color-bg);
  overflow: hidden;

  img {
    transition: transform 0.3s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }
`

const Badge = styled.span`
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background: var(--color-accent-gold);
  color: var(--color-bg);
  text-transform: uppercase;
  letter-spacing: 0.03em;
`

const CardBody = styled.div`
  padding: var(--space-6);
`
```

### Responsive Grid Pattern

```tsx
// Reusable grid for portfolio, team, news
const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);

  ${mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`
```

### Contact Form Client Component

```tsx
// src/components/forms/ContactForm.tsx
'use client'

import { useState, FormEvent } from 'react'
import styled from 'styled-components'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm({ labels }: { labels: Record<string, string> }) {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setError('')

    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send')
      }

      setState('success')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (state === 'success') {
    return <SuccessMessage>{labels.successMessage}</SuccessMessage>
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <Input name="firstName" placeholder={labels.firstName} required />
        <Input name="lastName" placeholder={labels.lastName} required />
      </FormRow>
      <Input name="email" type="email" placeholder={labels.email} required />
      <Input name="phone" type="tel" placeholder={labels.phone} required />
      <Select name="requestType" required>
        <option value="">{labels.selectType}</option>
        <option value="Investitore">{labels.investor}</option>
        <option value="Opportunità">{labels.opportunity}</option>
        <option value="Segreteria">{labels.secretary}</option>
      </Select>
      <Textarea name="message" placeholder={labels.message} rows={5} required />
      {error && <ErrorText>{error}</ErrorText>}
      <SubmitButton type="submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? labels.sending : labels.send}
      </SubmitButton>
    </Form>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getStaticPaths` + `getStaticProps` | `generateStaticParams` + Server Components | Next.js 13+ App Router | No page-level data functions; direct async in components |
| URL search params for filters | React state for SSG-compatible filters | Next.js 14+ | `useSearchParams` forces dynamic rendering; state preserves SSG |
| `nodemailer` v6 | `nodemailer` v8 | 2025 | ESM support, modern Node.js features, async/await patterns |
| reCAPTCHA v2 checkbox | reCAPTCHA v3 invisible | 2018 | No user interaction required; score-based bot detection |
| `next/image` with `width`/`height` | `next/image` with `fill` + `aspect-ratio` container | Next.js 13+ | Better for CMS images with unknown dimensions; no CLS |
| `params` as sync props | `params` as `Promise` (must `await`) | Next.js 15 | Breaking change; all pages/layouts must `await params` |

**Deprecated/outdated:**
- `unstable_setRequestLocale()`: Renamed to `setRequestLocale()` in next-intl v4. Use the non-prefixed version.
- `getStaticPaths()`: Pages Router pattern. App Router uses `generateStaticParams()`.
- `pages/api/*`: Pages Router API routes. App Router uses `app/api/*/route.ts` with named HTTP method exports.

---

## Open Questions

1. **SMTP provider for contact form**
   - What we know: Nodemailer needs SMTP credentials. Common choices: direct SMTP (company mail server), Mailtrap (testing), SendGrid/SES (transactional).
   - What's unclear: Which SMTP provider Alkemia will use.
   - Recommendation: Build with generic SMTP env vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`). Works with any provider. In dev, log email to console if SMTP vars are not set.

2. **Page sections JSON schema for Governance/ESG**
   - What we know: `page.sections` is a JSON object field. Governance needs CdA (from teamMember), Collegio, and Funzioni (from sections JSON).
   - What's unclear: Exact JSON schema used in the migration script (Phase 2).
   - Recommendation: Define a TypeScript interface for sections. Check actual Contentful data during implementation and adapt.

3. **Newsletter strip form behavior**
   - What we know: UI only, no backend. Deferred to post-launch.
   - What's unclear: Should it show a "coming soon" state or silently accept input?
   - Recommendation: Render the input + button UI. On submit, show a toast/message "Grazie! Ti contatteremo presto." without actually doing anything.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright (existing) + TypeScript type checking |
| Config file | `playwright.config.ts` (existing) |
| Quick run command | `npx tsc --noEmit` |
| Full suite command | `npx tsc --noEmit && npx playwright test` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Homepage hero section renders with poster image | e2e | `npx playwright test tests/homepage.spec.ts` | Wave 0 |
| HOME-05 | Homepage shows 3 news cards | e2e | `npx playwright test tests/homepage.spec.ts` | Wave 0 |
| HOME-06 | Homepage shows 4 stat values | e2e | `npx playwright test tests/homepage.spec.ts` | Wave 0 |
| PORT-01 | Portfolio grid renders with companies | e2e | `npx playwright test tests/portfolio.spec.ts` | Wave 0 |
| PORT-05 | Portfolio detail page loads for valid slug | e2e | `npx playwright test tests/portfolio.spec.ts` | Wave 0 |
| TEAM-01 | Team grid renders with members | e2e | `npx playwright test tests/team.spec.ts` | Wave 0 |
| TEAM-02 | Team detail page loads for valid slug | e2e | `npx playwright test tests/team.spec.ts` | Wave 0 |
| NEWS-01 | News grid renders with articles | e2e | `npx playwright test tests/news.spec.ts` | Wave 0 |
| NEWS-03 | News detail page loads for valid slug | e2e | `npx playwright test tests/news.spec.ts` | Wave 0 |
| NEWS-05 | Load more button shows additional articles | e2e | `npx playwright test tests/news.spec.ts` | Wave 0 |
| INVP-01 | Investment platforms overview renders | e2e | `npx playwright test tests/platforms.spec.ts` | Wave 0 |
| INVP-02 | Platform detail page loads | e2e | `npx playwright test tests/platforms.spec.ts` | Wave 0 |
| ABOUT-01 | Societa page renders with timeline | e2e | `npx playwright test tests/pages.spec.ts` | Wave 0 |
| GOV-01 | Governance page shows board members | e2e | `npx playwright test tests/pages.spec.ts` | Wave 0 |
| ESG-03 | ESG page has PDF download links | e2e | `npx playwright test tests/pages.spec.ts` | Wave 0 |
| CONT-02 | Contact form submits successfully | e2e | `npx playwright test tests/contact.spec.ts` | Wave 0 |
| ALL | TypeScript compiles without errors | unit (tsc) | `npx tsc --noEmit` | Existing |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (fast type check)
- **Per wave merge:** `npx tsc --noEmit && npx playwright test`
- **Phase gate:** Full Playwright suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/homepage.spec.ts` -- hero, stats, news preview, newsletter strip
- [ ] `tests/portfolio.spec.ts` -- grid, filters, detail page
- [ ] `tests/team.spec.ts` -- grid, filters, detail page
- [ ] `tests/news.spec.ts` -- grid, filters, load more, detail page
- [ ] `tests/platforms.spec.ts` -- overview, detail, fund metrics
- [ ] `tests/pages.spec.ts` -- societa, governance, ESG, culture
- [ ] `tests/contact.spec.ts` -- form rendering, validation, submission
- [ ] `npm install nodemailer && npm install -D @types/nodemailer`

*(Existing test infrastructure from Phase 1 covers smoke, i18n, responsive, and theme tests)*

---

## Sources

### Primary (HIGH confidence)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- dynamic route pre-rendering with multiple params
- [Next.js Image Component (App Router)](https://nextjs.org/docs/app/api-reference/components/image) -- fill, sizes, remotePatterns, loaders
- [Next.js Route Handlers](https://nextjs.org/docs/15/app/getting-started/route-handlers-and-middleware) -- POST handler pattern for contact form
- [Next.js useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params) -- confirmed: forces dynamic rendering, needs Suspense boundary
- [next-intl setup with App Router](https://next-intl.dev/docs/routing/setup) -- `setRequestLocale`, `generateStaticParams` with locales
- [nodemailer npm](https://www.npmjs.com/package/nodemailer) -- v8.0.2, SMTP transport pattern
- Existing codebase: `src/lib/contentful/fetchers.ts`, `types.ts`, `richText.tsx` -- verified all patterns in place

### Secondary (MEDIUM confidence)
- [Contentful + Next.js Image optimization](https://www.contentful.com/blog/nextjs-image-component/) -- Contentful images API with next/image
- [reCAPTCHA v3 in Next.js](https://www.buildwithmatija.com/blog/recaptcha-v3-nextjs-guide) -- structure without dependency, script loading pattern
- [Next.js search params filtering discussion](https://github.com/vercel/next.js/discussions/56321) -- confirmed useState > useSearchParams for SSG pages

### Tertiary (LOW confidence)
- [Mailtrap Next.js email guide](https://mailtrap.io/blog/nextjs-send-email/) -- nodemailer patterns verified but SMTP provider choice project-specific

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all core libraries already installed, only adding nodemailer (stable, well-documented)
- Architecture: HIGH -- patterns verified against Next.js 15 docs, next-intl v4 docs, and existing codebase patterns
- Pitfalls: HIGH -- common Next.js 15 issues (async params, SSG constraints) well-documented
- Filtering approach: HIGH -- React state vs URL params tradeoff verified against Next.js docs (useSearchParams forces dynamic rendering)
- Contact form: MEDIUM -- nodemailer pattern is standard, but SMTP provider is project-specific

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (Next.js 15 and all dependencies are stable; 30-day window safe)
