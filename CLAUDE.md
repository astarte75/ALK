# Alkemia Capital Website — v1.0

Premium PE/VC corporate site inspired by hgcapital.com, adapted for Alkemia Capital.

## Stack

- **Framework:** Next.js 15 App Router (NOT 16 — breaks styled-components)
- **CMS:** Contentful REST API (not GraphQL) — ALL content from Contentful
- **Styling:** styled-components v6 with SSR Registry + CSS custom properties
- **i18n:** next-intl v4 — IT default (no prefix), EN with `/en/` prefix
- **Animations:** GSAP 3 + @gsap/react (useGSAP) + Lenis smooth scroll — NOT Framer Motion
- **Email:** nodemailer (contact form)
- **Deployment:** Vercel with on-demand ISR via Contentful webhooks

## Architecture Rules

- All theme colors as CSS custom properties on `:root` — NO JS ThemeProvider (prevents FOUC)
- `StyledComponentsRegistry` must wrap all children in root layout
- Contentful tokens are server-only — NEVER use `NEXT_PUBLIC_` prefix
- Locale mapping: route `it` → Contentful `it-IT`, route `en` → Contentful `en-US`
- Fetchers use `unstable_cache` with content-type tags for ISR (`revalidateTag`)
- All images via `next/image` with `fill` + aspect-ratio container (no CLS)
- Team/governance photos use `object-position: top` to avoid head cropping
- Batch Contentful fetches per content type (not per page) — avoid 429 rate limits
- `await params` in all page/layout components (Next.js 15 Promise params)
- Filters use React `useState` (NOT `useSearchParams` — breaks SSG)
- Header/Footer in locale layout (`src/app/[locale]/layout.tsx`), not root layout
- Never use `max-width` on text content unless strictly needed for design
- Body text uses `text-align: justify`
- Always update Contentful when making content changes — never leave code and CMS out of sync
- GSAP animations use `useGSAP()` hook (never `useEffect`) with `gsap.matchMedia()` for responsive + `prefers-reduced-motion`
- GSAP plugins registered once in `src/lib/gsap-init.ts` — import from there, not from `gsap` directly
- Lenis initialized with `autoRaf: false` and driven by `gsap.ticker` (single RAF loop)
- `lenis.on('scroll', ScrollTrigger.update)` required for ScrollTrigger sync
- Fullscreen sections use `height: 100vh; height: 100svh;` (fallback + iOS Safari)
- No paid GSAP plugins (SplitText, ScrollSmoother) — manual alternatives only
- Admin routes protected by `is_admin` flag on `investors` table + middleware check
- Admin RLS policies via `is_admin()` SQL function — admin sees all investor data
- Investor dashboard/fund-detail queries must filter by `investor_id` explicitly (admin RLS would expose all)
- Admin impersonation routes mirror investor routes under `/admin/investitore/[investorId]/`

## Key Paths

```
src/app/[locale]/              # Locale root layout (NextIntlClientProvider only)
src/app/[locale]/(site)/       # Route group: public site pages (Header + Footer)
src/app/[locale]/(site)/layout.tsx # Site layout with Header, Footer, CookieConsent, CustomCursor
src/app/[locale]/(site)/portfolio/    # Portfolio grid + [slug] detail pages
src/app/[locale]/(site)/team/         # Team grid + [slug] detail pages
src/app/[locale]/(site)/news/         # News list + [slug] detail pages
src/app/[locale]/(site)/investment-platforms/  # Unified platforms page (PE, VC, PIPE + funds)
src/app/[locale]/(site)/investment-platforms/fondi/[slug]/ # Fund detail pages
src/app/[locale]/(site)/societa/      # Chi Siamo (timeline, mission, values)
src/app/[locale]/(site)/corporate-governance/ # Board, sindaci, control functions
src/app/[locale]/(site)/sostenibilita/ # ESG pillars, SFDR, roadmap, PDFs
src/app/[locale]/(site)/contatti/     # Contact form + office locations
src/app/[locale]/(site)/culture/      # Life at Alkemia
src/app/[locale]/(site)/privacy/      # Privacy Notice
src/app/[locale]/(site)/cookie-policy/ # Cookie Policy
src/app/[locale]/(portal)/     # Route group: investor portal (PortalHeader only, no site chrome)
src/app/[locale]/(portal)/investitori/          # Login page
src/app/[locale]/(portal)/investitori/dashboard/ # Fund positions dashboard
src/app/[locale]/(portal)/investitori/fondi/[slug]/ # Fund drill-down (calls, NAV chart, docs)
src/app/[locale]/(portal)/investitori/admin/    # Admin dashboard (summary, consistency checks)
src/app/[locale]/(portal)/investitori/admin/operazioni/ # Admin operations view (all capital calls, filters)
src/app/[locale]/(portal)/investitori/admin/investitore/[investorId]/ # Impersonate investor dashboard
src/app/[locale]/(portal)/investitori/admin/investitore/[investorId]/fondi/[slug]/ # Impersonate fund detail
src/app/api/revalidate/        # Contentful webhook handler
src/app/api/contact/           # Contact form email handler (nodemailer + SMTP)
src/app/api/portal/documents/[id]/ # Authenticated document download (signed URLs)
src/lib/contentful/            # CMS client, types, fetchers, rich text renderer
src/lib/supabase/              # Supabase client (server, browser), middleware, DB types
src/components/layout/         # Header, Footer, MobileMenu, NavigationLinks, LanguageSwitcher
src/components/sections/       # HeroSection, StatsSection, NewsPreview, NewsletterStrip (static originals)
src/components/sections/animated/ # VideoHero, ScrollNarrative, AnimatedStats, AnimatedNewsPreview, AnimatedNewsletterStrip
src/components/animations/     # ScrollReveal (reusable scroll wrapper), AnimatedPageHero (parallax hero)
src/components/providers/      # StyledComponentsRegistry, LenisProvider
src/components/cards/          # NewsCard, PortfolioCard, TeamCard, FundCard
src/components/filters/        # FilterPills (reusable pill filter)
src/components/cookie/         # CookieConsent modal (GDPR Italy)
src/components/cursor/         # CustomCursor (desktop only, ref-based)
src/components/forms/          # ContactForm
src/components/portal/         # PortalHeader, LoginForm, DashboardTable, NavChart, CapitalCallsTable, DocumentList, AdminDashboard, AdminOperations
src/components/content/        # PageSections, PdfDownloadList
src/styles/                    # GlobalStyle, theme tokens, breakpoints, zIndex
scripts/                       # Migration scripts (migrate.ts, add-fund-fields.ts, upload-news-images.js, import-fund-data.ts)
src/lib/gsap-init.ts           # GSAP + ScrollTrigger plugin registration (singleton)
src/app/[locale]/HomepageClient.tsx # Animated homepage client wrapper (LenisProvider + all sections)
src/app/[locale]/homepage-static/  # Backup of original static homepage (no animations)
public/images/                 # Hero images, white logo
public/videos/                 # Hero background video (hero-bg.mp4)
.planning/                     # GSD project planning (roadmap, phases, state)
```

## Content Architecture

All editorial content is managed via Contentful — editable without deploy.

### Contentful Models
8 content types: `portfolioCompany`, `teamMember`, `fund`, `newsArticle`, `investmentPlatform`, `page`, `siteConfig`, `office`

### Fund model extended fields
- `targetSectors` — comma-separated target sectors
- `documents` — array of asset links (PDF: prospetto CONSOB, etc.)
- `teamMembers` — array of references to dedicated team members

### Team model extended fields
- `office` — "Milano" or "Padova" (filterable on team page)

### Pages using `page.sections` JSON (structured layout from Contentful)
- **Homepage** (slug: `homepage`) — hero headline/subtitle, stats, newsletter text. Animated version with video hero, 4-panel scroll narrative (Oltre il capitale, Piattaforme, Creazione di valore, La nostra squadra), GSAP scroll reveals, Lenis smooth scroll
- **Società** (slug: `societa`) — intro, timeline, mission, approach, values, LinkedIn CTA
- **Sostenibilità** (slug: `sostenibilita`) — intro, pillars, SFDR, roadmap, documents
- **Corporate Governance** (slug: `corporate-governance`) — shareholding, board members, sindaci, control functions

### Pages using `page.body` rich text
- Privacy Notice, Cookie Policy, Culture, Contatti

### Navigation Structure
- **Chi siamo** (dropdown) → Società, Corporate Governance
- Investment Platforms, Portfolio, Team, News, Sostenibilità, Life at Alkemia, Contatti

### Portfolio Companies
18 companies, all with descriptions (IT+EN), logos, and websites on Contentful. Sectors: ICT, Digital Services, Food, Agri-tech, Cybersecurity, Mobility, Industrial, Energy, Fintech, Other

### Offices
- Padova — Sede Legale (Registered Office)
- Milano — Direzione Generale

## Design Tokens

- Background: `#1A1E22` | Surface: `#242A30` | Border: `#2E363F`
- Accent teal: `#2EC4B6` (CTAs, links) | Accent gold: `#D4A843` (highlights, badges)
- Text: `#F9FAFB` (primary), `rgba(249,250,251,0.6)` (secondary)
- Fonts: Plus Jakarta Sans (headings), Inter (body)

## Hero Images

| Page | Image |
|------|-------|
| Homepage | `/videos/hero-bg.mp4` (video bg) + `/images/hero-poster.jpg` (fallback) |
| Chi Siamo | `/images/hero-about.jpg` (Duomo Milano B&W) |
| Sostenibilità | `/images/hero-sustainability-3.jpg` (lake dock) |
| Investment Platforms | `/images/hero-platforms.jpg` (investment letters) |

## Commands

```bash
npm run dev              # Local dev server
npm run build            # Production build
npx tsc --noEmit         # Type check
npx playwright test      # E2E tests
npx tsx scripts/migrate.ts          # Seed Contentful (idempotent)
npx tsx scripts/validate-content.ts # Validate content
npx tsx --env-file=.env.local scripts/import-fund-data.ts  # Import fund data from Excel
npx tsx --env-file=.env.local scripts/import-fund-data.ts --dry-run  # Preview import
```

## Footer Structure

- **Brand column**: Logo + "Alkemia SGR S.p.A." in teal + company legal info (cap. sociale, cod. fisc., R.E.A., albo SGR, Kite Holding)
- **Offices**: Padova (sede legale), Milano
- **Legal**: Privacy Notice, Cookie Policy, Whistleblowing (external: whistleblowing.alkemiacapital.com)
- **Partners**: AIFI, Italian Tech Alliance (logos with teal hover)
- **Social**: LinkedIn icon
- **Copyright**: bottom bar

## Pending (post-launch)

- Accessibility Statement page (Phase 10)
- Contact form email routing per request type
- reCAPTCHA v3 activation (key needed)
- Newsletter form backend integration
- SMTP credentials for contact form email sending
- Upload fund documents (prospetto CONSOB) to Contentful (Phase 8)
- Populate fund targetSectors and teamMembers in Contentful (Phase 8)
- Portfolio company images to source with user (Phase 8)
- E2E verification: real investor login test (Plan 08-04, deferred post-launch)
- Amarone management fees/setup costs not detailed per investor in Excel report
- All 18 portfolio companies have descriptions and websites populated on Contentful
- Hero/panel heights capped for 4K: narrative panels min(100svh, 800px), internal heroes min(50vh, 500px)
- Homepage headline uses clamp(2.25rem, 7vw, 5.5rem) with white-space: nowrap for single-line display
- Life at Alkemia content on Contentful (page.sections JSON), SVG icons in code

## Conventions

- Commit format: `<type>(<scope>): <description>` (English)
- Code comments in English
- Respond in Italian unless asked otherwise
- No over-engineering — simple, readable solutions
- Never commit secrets (.env.local is gitignored)
- Always sync Contentful when making content changes
- No references to old alkemiacapital.com site (all content migrated to new site)
- ScrollReveal wrapper for scroll-triggered reveals on all pages
- AnimatedPageHero for internal page heroes with parallax
