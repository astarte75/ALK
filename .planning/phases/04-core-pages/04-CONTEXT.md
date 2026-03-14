# Phase 4: Core Pages - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

All site pages reachable with real Alkemia content — homepage shell (no animations), portfolio grid with filters, team grid with filters, news listing with pagination, investment platforms with fund details, società with history/mission/approach, governance, ESG with downloadable PDFs, contacts with form, culture page. Static HTML without scroll animations (those come in Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Homepage (Phase 4 — no animations)
- **Hero:** Static poster image (`/images/hero-poster.jpg` — skyscraper photo from current site) with dark overlay
- **Headline IT:** "Passione per l'impresa"
- **Headline EN:** "A Passion for Enterprise"
- **Subtitle:** "Alkemia SGR S.p.A. investe in aziende con potenziale di crescita trasformativa..." (from current site)
- **Stats section:** 4 stats displayed statically (animated counters in Phase 5):
  - ~20 anni di esperienza (since 2005)
  - €270M AUM
  - 29 operazioni completate
  - 18 aziende in portfolio
- **News preview:** Latest 3 news cards from Contentful (`getNewsArticles(locale, 3)`)
- **Newsletter strip:** UI only (form not functional), to be connected later
- **No video, no scroll animations, no Lenis** — all deferred to Phase 5

### Portfolio
- **Grid:** Responsive — 1col mobile / 2col tablet / 3col desktop
- **Filters:** Pill/tag orizzontali stile HG Capital, two filter rows:
  1. **Area (investmentType):** Tutti | Private Equity | Venture Capital | PIPE
  2. **Settore:** Tutti | ICT | Digital Services | Food | Agri-tech | Cybersecurity | Automotive & Mobility | Industrial | Energy | Other
- **Card content (ricca):** Logo + nome + settore + shortDescription + anno + badge tipo investimento (PE/VC/PIPE)
- **Hover effects:** Color transition, subtle image zoom (CSS only, no GSAP)
- **Detail pages:** Individual company pages via `[slug]` dynamic route
- **Sector corrections to apply in Contentful/migration:**
  - Glickon: HR Tech → Digital Services
  - Convivio: Food & Beverage → Food
  - Soplaya: Food & Beverage → Food
  - Pakelo: Other → Industrial
  - Redelfi: Other → Energy
  - All "Food & Beverage" → "Food"
  - Remove "HR Tech" from validation, add "Industrial" and "Energy"

### Team
- **Grid:** Responsive team grid with photos, names, roles
- **Photo format:** Rectangular portrait (3:4 aspect ratio) — like HG Capital
- **Filters:** Pill/tag by category: Tutti | Partners | Investment Team | Operations
- **Detail pages:** Individual profile via `[slug]` dynamic route
- **Board members:** `isBoard: true` flag — also shown on Governance page

### News
- **Grid:** Card layout with image, date, title, excerpt
- **Ordering:** Newest first (date desc)
- **Filters:** Category pills: Tutti | News | Insights | Events
- **Pagination:** Batch loading (load more button), not numbered pages
- **Detail pages:** Full article via `[slug]` dynamic route with rich text body

### Investment Platforms
- **Overview page:** Explains PE, VC, PIPE strategies
- **Sub-pages:** Individual page per platform via `[slug]`
- **Fund details:** Within each platform page, show associated funds with: name, fund size, status, investment period
- **Fund metrics:** Displayed as a clean card/table layout

### Società (About)
- **Sections:** Chi Siamo, Storia (timeline), Mission, Approccio, Valori
- **History timeline:** Sezioni impilate (stacked sections — year + title + description), no timeline graphic
- **Stats:** Same 4 stats as homepage (20 anni, €270M, 29 operazioni, 18 aziende)
- **Content from Contentful:** `getPageBySlug('societa', locale)`

### Corporate Governance
- **Board of Directors:** Uses `teamMember` entries with `isBoard: true` — photos, names, roles from Contentful
- **Collegio Sindacale + Funzioni di Controllo:** Structured data from `page` entry's `sections` JSON field (external figures, not team members)
- **Shareholder description:** From page body

### ESG / Sostenibilità
- **Sections:** ESG policy overview (Environment, Social, Governance), SFDR disclosure text
- **Downloadable PDFs:** Uploaded to Contentful Assets — download links on page
- **UN SDGs:** Image/reference section
- **Content from Contentful:** `getPageBySlug('sostenibilita', locale)`

### Contatti
- **Office locations:** Milano (HQ) + Padova from Contentful `getOffices()`
- **Contact form fields:** Nome, Cognome, Email, Telefono (required), Tipo richiesta (select: Investitore/Opportunità/Segreteria), Messaggio
- **Form submission:** API route sends email to segreteria@alkemiacapital.com (all types for now)
- **reCAPTCHA v3 invisible:** Structure predisposed but NOT activated — no API key yet. Activate post-launch.
- **No map embed** (deferred to V2)

### Culture / Life at Alkemia
- **Full page:** Claude creates content based on values from site (trasparenza, integrità, eccellenza) + available team/office photos
- **Photo-heavy layout:** Team photos, office photos from Contentful
- **Editable via Contentful** — stored as `page` entry

### Claude's Discretion
- Page component structure and routing
- Grid layouts and spacing
- Filter interaction pattern (URL params vs client state)
- Card hover effect specifics
- Contact form API route implementation
- How to structure the newsletter strip UI
- Pagination UX for news (load more button style)
- Static page section components

</decisions>

<specifics>
## Specific Ideas

- Portfolio filter pills should show count of matching companies (e.g., "ICT (6)")
- The homepage should feel substantial even without animations — use proper spacing, typography hierarchy, and the dark premium aesthetic
- Team photos should have consistent aspect ratio containers even if source photos vary
- News cards should match HG Capital's editorial feel — clean, minimal, date prominent
- Investment platform pages could use a tab or accordion for fund details within each platform
- Governance page should visually differentiate CdA (with photos) from Collegio Sindacale and Funzioni di Controllo (more compact, list-style)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- All Contentful fetchers ready: `getPortfolioCompanies`, `getTeamMembers`, `getFunds`, `getNewsArticles`, `getInvestmentPlatforms`, `getPageBySlug`, `getSiteConfig`, `getOffices`
- `renderRichText()` for Contentful rich text → React
- Header + Footer already in locale layout
- Dark theme tokens, breakpoints, z-index scale all established
- Hero poster image downloaded at `/public/images/hero-poster.jpg`

### Established Patterns
- Server Components for data fetching, Client Components for interactivity (filters, form)
- styled-components with CSS custom properties
- next-intl `useTranslations()` for UI labels
- `generateStaticParams()` for dynamic routes in both locales
- `toContentfulLocale()` for locale mapping in all fetchers

### Integration Points
- Dynamic routes: `[locale]/portfolio/[slug]`, `[locale]/team/[slug]`, `[locale]/news/[slug]`, `[locale]/investment-platforms/[slug]`
- Static routes: `[locale]/portfolio`, `[locale]/team`, `[locale]/news`, `[locale]/investment-platforms`, `[locale]/societa`, `[locale]/corporate-governance`, `[locale]/sostenibilita`, `[locale]/contatti`, `[locale]/culture`
- API route: `app/api/contact/route.ts` for form submission
- Messages files need all new page labels (filters, form fields, headings)
- `generateStaticParams` must generate both `it` and `en` paths for all dynamic routes

</code_context>

<deferred>
## Deferred Ideas

- Newsletter form integration (connect to Mailchimp/Sendinblue) — post-launch
- reCAPTCHA v3 activation — post-launch when API key is ready
- Contact form email routing per request type — post-launch
- Map embed on contacts page — V2
- Masonry/variable card layout for news — V2

</deferred>

---

*Phase: 04-core-pages*
*Context gathered: 2026-03-14*
