# Phase 2: Content Infrastructure - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

All Contentful content models defined and seeded with Alkemia data; TypeScript types and fetch functions exist for every content type so Phase 4 pages can query data immediately. Includes: model creation via Management API, migration script for data seeding (portfolio, team, funds, news, pages), image download from current site, bilingual content (IT + EN).

</domain>

<decisions>
## Implementation Decisions

### Content Source & Translation Strategy
- **Primary source:** `alkemiacapital-site.md` (25k-line scrape of alkemiacapital.com) — contains both IT and EN versions
- **English translations:** Exist for main pages (Company, Governance, Team, Sustainability, Contacts) but some portfolio descriptions are still in Italian on the EN version
- **Claude handles all text:** Claude autonomously translates missing EN content and improves IT text quality during seeding
- **Portfolio companies with sparse data:** Insert available fields (name, logo, sector, year, investment type) with minimal placeholder description — user completes later
- **Team member bios:** Use existing detailed bio pages from scrape as base — user will update if needed later

### Image Assets
- **Source:** Download all images from current WordPress site URLs (`alkemiacapital.com/wp-content/uploads/...`)
- **Strategy:** Grab maximum resolution available (strip WordPress thumbnail suffixes like `-1024x683` from URLs)
- **Alkemia logo:** Download from current site (no separate vector file available)
- **Blank profile placeholders:** Replace `Blank_Profile_M.png` with generated avatars using person's initials
- **Destination:** Upload to Contentful Assets (CDN + automatic optimization)

### Content Seeding Strategy
- **Fully automated via script** — Claude writes a migration script that:
  1. Creates all 8 content models via Contentful Management API (fields, validations, localization)
  2. Parses `alkemiacapital-site.md` to extract structured content
  3. Downloads images from current site and uploads to Contentful Assets
  4. Creates all content entries with both IT and EN localized fields
  5. Scrapes full article content from individual news page URLs (not just excerpts)
- **No manual Contentful editor work required** for initial data population
- **Content volume:** ~18 portfolio companies, 15 team members, 5 funds, 3 investment platforms, ~10+ news articles, static pages (società, governance, ESG, contatti), site config, 2 offices

### Contentful Space Setup (User Action Required)
The user needs to create a Contentful space before Phase 2 can execute. Step-by-step instructions:

1. Go to [app.contentful.com](https://app.contentful.com) → Sign up or log in
2. Create a new **Space** (free Community tier is fine to start)
3. **Add locales:**
   - Go to Settings → Locales
   - Default locale should be `Italian (Italy)` — code `it-IT`
   - Add locale `English (United States)` — code `en-US`
   - Enable "Allow editing" and "Allow empty fields" for `en-US`
4. **Generate API tokens:**
   - Go to Settings → API keys
   - Create a new API key → copy **Space ID**, **Content Delivery API access token**, **Content Preview API access token**
   - Go to Settings → CMA tokens (Content Management API)
   - Generate a **Personal access token** → copy it (shown only once!)
5. **Provide these values** (to be set in `.env.local` and Vercel):
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN` (Delivery)
   - `CONTENTFUL_PREVIEW_TOKEN`
   - `CONTENTFUL_MANAGEMENT_TOKEN` (for migration script only, not deployed)

### News Articles
- Script scrapes full article content from individual news URLs found in `alkemiacapital-site.md`
- Both IT and EN versions scraped where available
- Stores title, date, category, full body (rich text), featured image, related news references

### Claude's Discretion
- Content model field names and exact validation rules
- TypeScript type structure and API client organization
- Migration script implementation (Node.js/Python, parsing strategy)
- Rich text field format (Contentful Rich Text JSON structure)
- Error handling and retry logic in migration script
- Fetch function signatures and caching strategy
- How to map `it`/`en` route params to `it-IT`/`en-US` Contentful locale codes

</decisions>

<specifics>
## Specific Ideas

- The migration script should be idempotent — safe to re-run without creating duplicates
- Portfolio companies should have a `slug` field derived from company name for URL routing
- Team member order should be controllable via a `sortOrder` field in Contentful
- News article dates should be parsed from the scrape format (DD/MM/YYYY) to ISO dates
- The avatar generation for blank profiles can be done as simple colored circles with initials (CSS-based in frontend, placeholder image in Contentful)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `next.config.js` already has `images.remotePatterns` configured for `images.ctfassets.net` (Contentful CDN)
- TypeScript strict mode enabled with `@/*` path alias
- i18n routing established: `it` (default, no prefix) and `en` (`/en/` prefix) via next-intl

### Established Patterns
- CSS custom properties for theming (GlobalStyle.ts)
- styled-components SSR via StyledComponentsRegistry
- next-intl v4 with `localePrefix: 'as-needed'`
- Playwright test suite for smoke, i18n, responsive, and theme tests

### Integration Points
- Locale mapping needed: route `it` → Contentful `it-IT`, route `en` → Contentful `en-US`
- `.env.local` exists with `NEXT_PUBLIC_SITE_URL` — add Contentful vars here
- Vercel environment variables must be set for production deployment
- ISR webhook endpoint (`/api/revalidate`) must accept Contentful webhook payload and call `revalidateTag`

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-content-infrastructure*
*Context gathered: 2026-03-14*
