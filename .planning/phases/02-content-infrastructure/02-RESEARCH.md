# Phase 2: Content Infrastructure - Research

**Researched:** 2026-03-14
**Domain:** Contentful CMS (REST API) - Content Modeling - TypeScript Types - Migration Scripts - ISR Webhooks
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Content Source & Translation Strategy:**
- Primary source: `alkemiacapital-site.md` (25k-line scrape of alkemiacapital.com) -- contains both IT and EN versions
- English translations: Exist for main pages but some portfolio descriptions are still in Italian on the EN version
- Claude handles all text: Claude autonomously translates missing EN content and improves IT text quality during seeding
- Portfolio companies with sparse data: Insert available fields with minimal placeholder description -- user completes later
- Team member bios: Use existing detailed bio pages from scrape as base

**Image Assets:**
- Download all images from current WordPress site URLs (`alkemiacapital.com/wp-content/uploads/...`)
- Grab maximum resolution (strip WordPress thumbnail suffixes like `-1024x683`)
- Blank profile placeholders: Replace `Blank_Profile_M.png` with generated avatars using person's initials
- Destination: Upload to Contentful Assets (CDN + automatic optimization)

**Content Seeding Strategy:**
- Fully automated via script -- creates all 8 content models, parses content, downloads images, creates entries with both locales, scrapes full news articles
- No manual Contentful editor work required for initial data population
- Content volume: ~18 portfolio companies, 15 team members, 5 funds, 3 investment platforms, ~10+ news articles, static pages, site config, 2 offices

**Contentful Space Setup (User Action Required):**
- User creates Contentful space with `it-IT` (default) and `en-US` locales before Phase 2 execution
- Tokens needed: CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_PREVIEW_TOKEN, CONTENTFUL_MANAGEMENT_TOKEN

**News Articles:**
- Script scrapes full article content from individual news URLs
- Both IT and EN versions scraped where available
- Stores title, date, category, full body (rich text), featured image, related news references

**Specific Ideas (from CONTEXT.md):**
- Migration script must be idempotent -- safe to re-run without creating duplicates
- Portfolio companies need a `slug` field derived from company name
- Team members need a `sortOrder` field for ordering control
- News dates parsed from DD/MM/YYYY scrape format to ISO dates
- Avatar generation: simple colored circles with initials (CSS-based in frontend, placeholder image in Contentful)

### Claude's Discretion
- Content model field names and exact validation rules
- TypeScript type structure and API client organization
- Migration script implementation (Node.js/Python, parsing strategy)
- Rich text field format (Contentful Rich Text JSON structure)
- Error handling and retry logic in migration script
- Fetch function signatures and caching strategy
- How to map `it`/`en` route params to `it-IT`/`en-US` Contentful locale codes

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-04 | Contentful REST API integration with TypeScript types for all content models | `contentful` v11 SDK with EntrySkeletonType pattern, typed fetch functions per content type, locale mapping |
| FOUND-08 | Contentful webhook for on-demand ISR (no time-based revalidation) | Next.js 15 `revalidateTag(tag)` in POST route handler, Contentful webhook config, secret validation |
</phase_requirements>

---

## Summary

Phase 2 builds the entire content layer: 8 Contentful content models, a migration script that seeds all Alkemia data (portfolio companies, team, funds, news, pages, offices), and a TypeScript client layer that Phase 4 pages consume directly. The biggest technical surface is the migration script -- it must parse a 25k-line markdown scrape, download images from WordPress, upload them to Contentful, create localized entries in both `it-IT` and `en-US`, and be idempotent so it can safely re-run.

The Contentful JavaScript SDK (`contentful` v11) uses an `EntrySkeletonType` pattern for TypeScript types. Each content type gets a skeleton interface defining its `contentTypeId` and `fields`, then `getEntries<MySkeleton>()` returns fully typed responses. The `contentful-management` SDK (v11) handles model creation and data seeding with built-in retry logic for 429 rate limits (CMA limit is 7 req/s). For ISR, Next.js 15.5 uses the single-argument `revalidateTag(tag)` which immediately expires the cache -- the two-argument form with `profile` is a Next.js 16 feature not available in our version.

**Primary recommendation:** Use `contentful` v11 for delivery, `contentful-management` v11 for the migration script, `@contentful/rich-text-react-renderer` for rich text rendering. Write one Node.js (TypeScript) migration script that handles model creation + data seeding + image upload. Define TypeScript types manually (not auto-generated) since we control both the models and the code. Tag all fetches with content-type-specific tags for granular ISR.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| contentful | ^11.10.x | Content Delivery API client | Official Contentful JS SDK. v11 has EntrySkeletonType for full TypeScript safety. REST API (locked decision) |
| contentful-management | ^11.74.x | Content Management API client | Creates content types, entries, and assets programmatically. Built-in 429 retry logic |
| @contentful/rich-text-react-renderer | ^16.1.x | Render Contentful rich text to React | Official renderer. Supports embedded entries/assets via custom node renderers |
| @contentful/rich-text-types | ^17.2.x | Rich text type definitions | TypeScript types for rich text document nodes (BLOCKS, INLINES, MARKS) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| node-fetch | built-in (Node 18+) | Download images from WordPress | Migration script only -- uses native fetch |
| slugify | ^1.6.x | Generate URL slugs from company/article names | Migration script: `slugify('Ermes Browser Security') => 'ermes-browser-security'` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual TS types | cf-content-types-generator | Auto-gen adds build step complexity; we create the models ourselves so manual types are simpler and always in sync |
| contentful-management SDK | Contentful Migration CLI | Migration CLI is designed for schema changes on existing spaces; SDK gives more control for combined model creation + data seeding |
| REST API (contentful SDK) | GraphQL API | Locked decision: REST API. GraphQL has no official JS client, adds query complexity |

**Installation:**
```bash
# Delivery + rich text (production dependencies)
npm install contentful @contentful/rich-text-react-renderer @contentful/rich-text-types

# Migration script (dev dependency -- not deployed)
npm install -D contentful-management slugify
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── lib/
│   └── contentful/
│       ├── client.ts              # Contentful CDA client factory
│       ├── types.ts               # EntrySkeletonType definitions for all 8 models
│       ├── fetchers.ts            # Typed fetch functions (getPortfolioCompanies, getTeamMembers, etc.)
│       ├── richText.tsx           # Rich text render options (embedded assets/entries)
│       └── locale.ts              # Locale mapping: 'it' => 'it-IT', 'en' => 'en-US'
├── app/
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts           # Contentful webhook handler
│   └── [locale]/
│       └── ...                    # Pages consume fetchers
scripts/
├── migrate.ts                     # Content model creation + data seeding
└── tsconfig.json                  # Script-specific TS config (module: commonjs for tsx)
```

### Pattern 1: Contentful Client Factory (FOUND-04)

**What:** Create typed Contentful clients for delivery and preview, configured with environment variables. Single source of truth for client creation.

**When to use:** Every server component or fetch function that needs Contentful data.

```typescript
// src/lib/contentful/client.ts
// Source: https://www.contentful.com/developers/docs/javascript/tutorials/typescript-in-javascript-client-library/
import { createClient } from 'contentful'

// Delivery client -- published content, cached
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

// Preview client -- draft content, not cached
export const contentfulPreviewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  host: 'preview.contentful.com',
})

// Select client based on draft mode
export function getClient(preview = false) {
  return preview ? contentfulPreviewClient : contentfulClient
}
```

### Pattern 2: EntrySkeletonType for TypeScript Safety (FOUND-04)

**What:** Define skeleton types matching each Contentful content model. Pass as generic to `getEntries<Skeleton>()` for fully typed responses with autocompletion on query parameters.

**When to use:** Every content type needs a corresponding skeleton.

```typescript
// src/lib/contentful/types.ts
// Source: https://www.contentful.com/developers/docs/javascript/tutorials/typescript-in-javascript-client-library/
import type { EntryFieldTypes, EntrySkeletonType, Entry, Asset } from 'contentful'

// Portfolio Company
export type PortfolioCompanySkeleton = EntrySkeletonType<
  'portfolioCompany',
  {
    name: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    description: EntryFieldTypes.RichText
    sector: EntryFieldTypes.Text
    investmentType: EntryFieldTypes.Text
    year: EntryFieldTypes.Integer
    logo: EntryFieldTypes.AssetLink
    website: EntryFieldTypes.Text
    fundRef: EntryFieldTypes.EntryLink<FundSkeleton>
    sortOrder: EntryFieldTypes.Integer
  }
>

// Team Member
export type TeamMemberSkeleton = EntrySkeletonType<
  'teamMember',
  {
    name: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    role: EntryFieldTypes.Text
    category: EntryFieldTypes.Text
    bio: EntryFieldTypes.RichText
    photo: EntryFieldTypes.AssetLink
    linkedIn: EntryFieldTypes.Text
    sortOrder: EntryFieldTypes.Integer
  }
>

// Fund
export type FundSkeleton = EntrySkeletonType<
  'fund',
  {
    name: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    description: EntryFieldTypes.RichText
    strategy: EntryFieldTypes.Text
    status: EntryFieldTypes.Text
    fundSize: EntryFieldTypes.Text
    investmentPeriod: EntryFieldTypes.Text
    platformRef: EntryFieldTypes.EntryLink<InvestmentPlatformSkeleton>
  }
>

// News Article
export type NewsArticleSkeleton = EntrySkeletonType<
  'newsArticle',
  {
    title: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    date: EntryFieldTypes.Date
    category: EntryFieldTypes.Text
    excerpt: EntryFieldTypes.Text
    body: EntryFieldTypes.RichText
    featuredImage: EntryFieldTypes.AssetLink
    relatedArticles: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<NewsArticleSkeleton>>
  }
>

// Investment Platform
export type InvestmentPlatformSkeleton = EntrySkeletonType<
  'investmentPlatform',
  {
    name: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    description: EntryFieldTypes.RichText
    strategy: EntryFieldTypes.Text
    funds: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<FundSkeleton>>
  }
>

// Page (static pages: societa, governance, ESG, contatti)
export type PageSkeleton = EntrySkeletonType<
  'page',
  {
    title: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    body: EntryFieldTypes.RichText
    sections: EntryFieldTypes.Object  // JSON for structured page sections
  }
>

// Site Config (singleton)
export type SiteConfigSkeleton = EntrySkeletonType<
  'siteConfig',
  {
    siteName: EntryFieldTypes.Text
    tagline: EntryFieldTypes.Text
    logo: EntryFieldTypes.AssetLink
    socialLinkedIn: EntryFieldTypes.Text
    socialTwitter: EntryFieldTypes.Text
    contactEmail: EntryFieldTypes.Text
  }
>

// Office
export type OfficeSkeleton = EntrySkeletonType<
  'office',
  {
    city: EntryFieldTypes.Text
    address: EntryFieldTypes.Text
    phone: EntryFieldTypes.Text
    isHeadquarters: EntryFieldTypes.Boolean
    sortOrder: EntryFieldTypes.Integer
  }
>

// Resolved entry types (what fetchers return)
export type PortfolioCompany = Entry<PortfolioCompanySkeleton, undefined, string>
export type TeamMember = Entry<TeamMemberSkeleton, undefined, string>
export type Fund = Entry<FundSkeleton, undefined, string>
export type NewsArticle = Entry<NewsArticleSkeleton, undefined, string>
export type InvestmentPlatform = Entry<InvestmentPlatformSkeleton, undefined, string>
export type Page = Entry<PageSkeleton, undefined, string>
export type SiteConfig = Entry<SiteConfigSkeleton, undefined, string>
export type Office = Entry<OfficeSkeleton, undefined, string>
```

### Pattern 3: Locale Mapping (FOUND-04)

**What:** Map next-intl route locale codes (`it`, `en`) to Contentful locale codes (`it-IT`, `en-US`). All fetch functions use this mapping.

```typescript
// src/lib/contentful/locale.ts
const LOCALE_MAP: Record<string, string> = {
  it: 'it-IT',
  en: 'en-US',
}

export function toContentfulLocale(routeLocale: string): string {
  return LOCALE_MAP[routeLocale] ?? 'it-IT'
}
```

### Pattern 4: Typed Fetch Functions with Cache Tags (FOUND-04, FOUND-08)

**What:** Each content type gets a dedicated fetch function that returns typed data and tags the fetch for ISR invalidation. Batch fetches per content type (not per page) to avoid 429 rate limits at build time.

```typescript
// src/lib/contentful/fetchers.ts
import { getClient } from './client'
import { toContentfulLocale } from './locale'
import type {
  PortfolioCompanySkeleton,
  PortfolioCompany,
  TeamMemberSkeleton,
  TeamMember,
} from './types'

export async function getPortfolioCompanies(
  locale: string,
  preview = false
): Promise<PortfolioCompany[]> {
  const client = getClient(preview)
  const res = await client.getEntries<PortfolioCompanySkeleton>({
    content_type: 'portfolioCompany',
    locale: toContentfulLocale(locale),
    order: ['fields.sortOrder'],
    include: 2, // resolve fund references
    limit: 100,
  })
  return res.items
}

export async function getPortfolioCompanyBySlug(
  slug: string,
  locale: string,
  preview = false
): Promise<PortfolioCompany | null> {
  const client = getClient(preview)
  const res = await client.getEntries<PortfolioCompanySkeleton>({
    content_type: 'portfolioCompany',
    'fields.slug': slug,
    locale: toContentfulLocale(locale),
    include: 2,
    limit: 1,
  })
  return res.items[0] ?? null
}

export async function getTeamMembers(
  locale: string,
  preview = false
): Promise<TeamMember[]> {
  const client = getClient(preview)
  const res = await client.getEntries<TeamMemberSkeleton>({
    content_type: 'teamMember',
    locale: toContentfulLocale(locale),
    order: ['fields.sortOrder'],
    limit: 100,
  })
  return res.items
}

// Same pattern for: getFunds, getNewsArticles, getInvestmentPlatforms,
// getPageBySlug, getSiteConfig, getOffices
```

**Important:** In Next.js 15, `fetch` inside `getEntries` is automatically cached by the framework. The Contentful SDK uses `fetch` internally. To tag these for ISR, wrap calls in React Server Component `fetch` with `next.tags`, or use `unstable_cache` with tags:

```typescript
// Alternative: wrap with unstable_cache for explicit tag control
import { unstable_cache } from 'next/cache'

export const getPortfolioCompanies = unstable_cache(
  async (locale: string) => {
    const client = getClient()
    const res = await client.getEntries<PortfolioCompanySkeleton>({
      content_type: 'portfolioCompany',
      locale: toContentfulLocale(locale),
      order: ['fields.sortOrder'],
      include: 2,
      limit: 100,
    })
    return res.items
  },
  ['portfolioCompanies'],
  { tags: ['portfolioCompany'] }
)
```

### Pattern 5: ISR Webhook Route Handler (FOUND-08)

**What:** POST endpoint that receives Contentful webhook payloads, validates a shared secret, extracts the content type, and calls `revalidateTag()` for that content type.

**Critical:** Next.js 15.5 uses `revalidateTag(tag)` with a single argument. The two-argument form (`revalidateTag(tag, 'max')`) is Next.js 16 only.

```typescript
// src/app/api/revalidate/route.ts
// Source: https://nextjs.org/docs/app/api-reference/functions/revalidateTag
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Validate webhook secret
  const secret = request.headers.get('x-contentful-webhook-secret')
  if (secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    // Contentful webhook payload has sys.contentType.sys.id
    const contentTypeId = body?.sys?.contentType?.sys?.id

    if (contentTypeId) {
      // Revalidate the specific content type tag
      revalidateTag(contentTypeId)
      return NextResponse.json({
        revalidated: true,
        contentType: contentTypeId,
        now: Date.now(),
      })
    }

    // For asset changes, revalidate all content
    if (body?.sys?.type === 'Asset') {
      revalidateTag('contentful-asset')
      return NextResponse.json({ revalidated: true, tag: 'contentful-asset', now: Date.now() })
    }

    return NextResponse.json({ revalidated: false, message: 'No content type found' })
  } catch {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
  }
}
```

### Pattern 6: Rich Text Rendering (FOUND-04)

**What:** Render Contentful Rich Text JSON to React components using `documentToReactComponents` with custom renderers for embedded assets and entries.

```tsx
// src/lib/contentful/richText.tsx
// Source: https://www.contentful.com/developers/docs/javascript/tutorials/rendering-contentful-rich-text-with-javascript/
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, Document } from '@contentful/rich-text-types'
import Image from 'next/image'

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { title, file } = node.data.target.fields
      if (file?.contentType?.startsWith('image/')) {
        return (
          <Image
            src={`https:${file.url}`}
            alt={title || ''}
            width={file.details?.image?.width || 800}
            height={file.details?.image?.height || 600}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )
      }
      return null
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      // Handle embedded entries based on content type
      const contentType = node.data.target.sys.contentType?.sys.id
      // Extend as needed for specific embedded content types
      return null
    },
    [INLINES.HYPERLINK]: (node, children) => {
      return (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  },
}

export function renderRichText(document: Document) {
  return documentToReactComponents(document, renderOptions)
}
```

### Pattern 7: Migration Script Structure

**What:** A single Node.js script that creates content types, downloads images, and seeds entries. Must be idempotent (safe to re-run).

```typescript
// scripts/migrate.ts (executed with tsx: npx tsx scripts/migrate.ts)
import { createClient } from 'contentful-management'

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
})

async function main() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const env = await space.getEnvironment('master')

  // Step 1: Create content types (idempotent -- check if exists first)
  await createContentTypes(env)

  // Step 2: Upload images from WordPress
  const assetMap = await uploadAssets(env)

  // Step 3: Create entries with both locales
  await createEntries(env, assetMap)

  console.log('Migration complete!')
}

async function createContentTypes(env: Environment) {
  // Check if type exists, skip if so (idempotent)
  try {
    await env.getContentType('portfolioCompany')
    console.log('portfolioCompany already exists, skipping...')
  } catch {
    const ct = await env.createContentTypeWithId('portfolioCompany', {
      name: 'Portfolio Company',
      fields: [
        { id: 'name', name: 'Name', type: 'Symbol', required: true, localized: true },
        { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false,
          validations: [{ unique: true }] },
        { id: 'description', name: 'Description', type: 'RichText', localized: true },
        { id: 'sector', name: 'Sector', type: 'Symbol', localized: false,
          validations: [{ in: ['ICT', 'Automotive & Mobility', 'Agri-tech', 'Food & Beverage', 'Other'] }] },
        { id: 'investmentType', name: 'Investment Type', type: 'Symbol', localized: false,
          validations: [{ in: ['Private Equity', 'Venture Capital', 'PIPE'] }] },
        { id: 'year', name: 'Year', type: 'Integer', localized: false },
        { id: 'logo', name: 'Logo', type: 'Link', linkType: 'Asset', localized: false },
        { id: 'website', name: 'Website', type: 'Symbol', localized: false },
        { id: 'fundRef', name: 'Fund', type: 'Link', linkType: 'Entry', localized: false,
          validations: [{ linkContentType: ['fund'] }] },
        { id: 'sortOrder', name: 'Sort Order', type: 'Integer', localized: false },
      ],
    })
    await ct.publish()
  }
  // Repeat for all 8 content types...
}

async function uploadAssets(env: Environment) {
  const assetMap = new Map<string, string>() // originalUrl -> assetId

  // Download image from WordPress
  const imageUrl = 'https://www.alkemiacapital.com/wp-content/uploads/2024/10/ermes-logo-1.png'
  // Strip thumbnail suffix for max resolution
  const fullResUrl = imageUrl.replace(/-\d+x\d+\./, '.')

  const response = await fetch(fullResUrl)
  const buffer = await response.arrayBuffer()

  // Upload to Contentful
  const upload = await env.createUpload({ file: Buffer.from(buffer) })
  const asset = await env.createAsset({
    fields: {
      title: { 'it-IT': 'Ermes Logo', 'en-US': 'Ermes Logo' },
      file: {
        'it-IT': {
          contentType: 'image/png',
          fileName: 'ermes-logo.png',
          uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
        },
        'en-US': {
          contentType: 'image/png',
          fileName: 'ermes-logo.png',
          uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
        },
      },
    },
  })
  await asset.processForAllLocales()
  // Wait for processing to complete
  let processedAsset = await env.getAsset(asset.sys.id)
  while (!processedAsset.fields.file['it-IT']?.url) {
    await new Promise((r) => setTimeout(r, 1000))
    processedAsset = await env.getAsset(asset.sys.id)
  }
  await processedAsset.publish()

  assetMap.set(imageUrl, asset.sys.id)
  return assetMap
}

async function createEntries(env: Environment, assetMap: Map<string, string>) {
  // Check if entry with slug exists (idempotent)
  const existing = await env.getEntries({
    content_type: 'portfolioCompany',
    'fields.slug': 'ermes-browser-security',
    limit: 1,
  })
  if (existing.items.length > 0) {
    console.log('ermes-browser-security already exists, skipping...')
    return
  }

  const entry = await env.createEntry('portfolioCompany', {
    fields: {
      name: { 'it-IT': 'Ermes Browser Security', 'en-US': 'Ermes Browser Security' },
      slug: { 'it-IT': 'ermes-browser-security' }, // slug not localized
      description: {
        'it-IT': { /* Rich Text JSON */ },
        'en-US': { /* Rich Text JSON */ },
      },
      sector: { 'it-IT': 'ICT' },
      investmentType: { 'it-IT': 'Venture Capital' },
      year: { 'it-IT': 2020 },
      logo: { 'it-IT': { sys: { type: 'Link', linkType: 'Asset', id: assetMap.get('...')! } } },
    },
  })
  await entry.publish()
}
```

### Anti-Patterns to Avoid

- **Per-page Contentful fetches at build time:** Fetching one entry per page (e.g., `getEntry(id)` for each portfolio company) causes N+1 requests and hits the 55 req/s CDA limit. Use batch `getEntries` with `content_type` filter.
- **`NEXT_PUBLIC_` prefix on Contentful tokens:** These are server-only secrets. `NEXT_PUBLIC_` exposes them in client bundles. Use `process.env.CONTENTFUL_ACCESS_TOKEN` in Server Components only.
- **Nested includes > 3 levels:** Contentful `include` parameter goes up to 10 but deep nesting bloats payloads. Keep to max 2-3 levels as per project constraint.
- **Time-based revalidation (`revalidate: 60`):** Locked decision is on-demand ISR only. Do not set `revalidate` on fetch options -- use `revalidateTag` via webhook.
- **Using contentful-migration CLI for data seeding:** The migration CLI (`contentful-migration`) is designed for schema changes, not bulk data creation. Use `contentful-management` SDK directly for combined model+data work.
- **Creating assets without waiting for processing:** `asset.processForAllLocales()` is async. You must poll until `file.url` is populated before publishing or linking to entries.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich text rendering | Custom rich text parser/renderer | `@contentful/rich-text-react-renderer` | Contentful rich text has 20+ node types including embedded entries, inline entries, and hyperlinks. Custom renderers miss edge cases |
| Image optimization | Manual srcset/webp generation | Contentful Images API + `next/image` | Contentful CDN serves optimized images with URL query params (`?w=800&fm=webp&q=80`). Combined with `next/image` loader, this is zero-config |
| TypeScript type generation | Custom Contentful-to-TS script | Manual EntrySkeletonType definitions | With only 8 models (max 20 fields each), manual types are faster and more maintainable than adding a code generation build step |
| Webhook secret validation | Custom HMAC/JWT validation | Simple shared secret comparison | Contentful webhooks support custom headers. A shared secret in a custom header is the standard pattern |
| Rate limit handling (CDA) | Custom retry/backoff logic | Contentful SDK built-in retry | `contentful` and `contentful-management` SDKs have built-in retry with exponential backoff for 429 responses |
| Slug generation | Custom slug function | `slugify` npm package | Handles unicode, diacritics, special characters. Italian company names have accents |

**Key insight:** Contentful's SDK ecosystem handles most infrastructure concerns (retries, pagination, type safety, rich text). The real complexity in this phase is the migration script's data extraction from the 25k-line markdown scrape -- that is where effort should focus.

---

## Common Pitfalls

### Pitfall 1: CMA Rate Limit (7 req/s) During Migration
**What goes wrong:** Migration script creates entries too fast, gets 429 errors, some entries fail silently.
**Why it happens:** CMA rate limit is 7 requests/second (not 55 like CDA). Creating 18 companies + 15 team members + assets burns through this quickly.
**How to avoid:** Use `contentful-management` SDK which has built-in retry. Additionally, add a small delay (200ms) between entry creation batches. Process assets sequentially, not in parallel.
**Warning signs:** Console errors with status 429, entries missing after migration completes.

### Pitfall 2: Asset Processing Race Condition
**What goes wrong:** Script creates an asset, immediately tries to publish it, gets "asset not processed" error.
**Why it happens:** `asset.processForAllLocales()` starts processing asynchronously. The asset URL is not available until processing completes.
**How to avoid:** Poll the asset with `env.getAsset(id)` until `fields.file['it-IT'].url` is defined before publishing.
**Warning signs:** Assets published without URLs, broken images in entries.

### Pitfall 3: Non-Localized Fields Still Need Default Locale Key
**What goes wrong:** Migration script sets non-localized fields with `{ 'it-IT': value, 'en-US': value }` but should only use default locale key.
**Why it happens:** Non-localized fields in Contentful are stored only in the default locale (`it-IT`). Setting values under `en-US` for non-localized fields is silently ignored or causes errors.
**How to avoid:** For `localized: false` fields, always use `{ 'it-IT': value }` only. For `localized: true` fields, use both `{ 'it-IT': '...', 'en-US': '...' }`.
**Warning signs:** Non-localized field values appearing as null in EN locale queries.

### Pitfall 4: Contentful SDK fetch Not Tagged for ISR
**What goes wrong:** Content updates via webhook call `revalidateTag('portfolioCompany')` but pages still serve stale data.
**Why it happens:** The `contentful` SDK uses `fetch` internally but does not add `next.tags` to the request options. The tag is not associated with the cached response.
**How to avoid:** Wrap Contentful SDK calls in `unstable_cache` with explicit tags, or use the SDK's `adapter` option to inject `next: { tags: [...] }` into fetch calls.
**Warning signs:** Webhook returns `{ revalidated: true }` but pages don't update.

### Pitfall 5: Rich Text Fields Created as Plain Text
**What goes wrong:** Migration script inserts string content into RichText fields. Contentful rejects or stores malformed data.
**Why it happens:** Rich text fields require Contentful's specific JSON format (Document > Paragraph > Text nodes), not raw strings.
**How to avoid:** Construct proper rich text document objects. Minimal example for a paragraph:
```typescript
{
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [
        { nodeType: 'text', value: 'Hello world', marks: [], data: {} }
      ]
    }
  ]
}
```
**Warning signs:** Contentful API returns validation errors on entry creation, or body fields render as empty.

### Pitfall 6: WordPress Image URLs with Thumbnail Suffixes
**What goes wrong:** Downloaded images are low-resolution thumbnails (300x200) instead of full-size originals.
**Why it happens:** WordPress generates thumbnail URLs like `image-1024x683.png`. The scrape captures these.
**How to avoid:** Strip the dimension suffix with regex: `url.replace(/-\d+x\d+\./, '.')`. Verify the full-resolution URL exists (HEAD request) before downloading; fallback to the thumbnail URL if 404.
**Warning signs:** Logos and team photos appear pixelated on the site.

---

## Code Examples

### Contentful Images API with next/image

```tsx
// Contentful images URL: https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.jpg
// Query params: ?w=800&h=600&fm=webp&q=80&fit=fill&f=faces
// Source: https://www.contentful.com/developers/docs/references/images-api/

import Image from 'next/image'

// Custom loader for Contentful images (optional -- next/image handles optimization)
function contentfulLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src.startsWith('//') ? `https:${src}` : src)
  url.searchParams.set('w', width.toString())
  url.searchParams.set('fm', 'webp')
  url.searchParams.set('q', (quality || 80).toString())
  return url.toString()
}

// Usage in a component
function CompanyLogo({ asset }: { asset: Asset }) {
  const file = asset.fields.file
  if (!file) return null

  return (
    <Image
      loader={contentfulLoader}
      src={`https:${file.url}`}
      alt={asset.fields.title || ''}
      width={file.details?.image?.width || 200}
      height={file.details?.image?.height || 200}
    />
  )
}
```

### Environment Variables (.env.local)

```bash
# Contentful (server-only -- NO NEXT_PUBLIC_ prefix)
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_PREVIEW_TOKEN=your_preview_token
CONTENTFUL_MANAGEMENT_TOKEN=your_cma_token  # for migration script only
CONTENTFUL_WEBHOOK_SECRET=your_webhook_secret  # for ISR webhook validation

# Existing
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Contentful Webhook Configuration (in Contentful Dashboard)

```
URL: https://your-domain.com/api/revalidate
Method: POST
Triggers: Entry.publish, Entry.unpublish, Entry.archive, Asset.publish, Asset.unpublish
Headers:
  x-contentful-webhook-secret: {same value as CONTENTFUL_WEBHOOK_SECRET}
Content type: application/json
Payload: default (includes sys.contentType.sys.id)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `contentful` v9 with manual types | `contentful` v11 with EntrySkeletonType | v10 (2023) | Full type safety with skeletons; query params are type-checked |
| `revalidate: 60` (time-based ISR) | `revalidateTag(tag)` (on-demand ISR) | Next.js 13.4 | Content updates are instant via webhook instead of waiting for timer |
| `getStaticProps` + `revalidate` | Server Components + `unstable_cache` with tags | Next.js 14+ App Router | No page-level data fetching; caching is per-function with tags |
| contentful-migration CLI | contentful-management SDK | Concurrent | Migration CLI is for schema-only changes; SDK is better for combined schema + data operations |
| Manual rich text HTML parsing | `@contentful/rich-text-react-renderer` v16 | 2024 | Handles all node types including embedded entries/assets with custom renderers |

**Deprecated/outdated:**
- `contentful` v9 typing pattern: Pre-skeleton types required manual casting. v10+ EntrySkeletonType is the standard.
- `pages/api/revalidate.ts`: Pages Router pattern. App Router uses `src/app/api/revalidate/route.ts`.
- `res.revalidate()`: Pages Router ISR pattern. App Router uses `revalidateTag()` from `next/cache`.
- `revalidateTag(tag, 'max')`: Next.js 16 two-argument form. Our Next.js 15.5 uses single-argument `revalidateTag(tag)`.

---

## Open Questions

1. **`unstable_cache` vs native fetch tagging for Contentful SDK calls**
   - What we know: Contentful SDK uses `fetch` internally but does not expose `next.tags` injection. `unstable_cache` wraps any async function with cache tags. As of Next.js 15.5, `unstable_cache` is still the recommended pattern for SDK-based fetching.
   - What's unclear: Whether Next.js 15.5 provides a way to inject `next: { tags: [...] }` into SDK-internal fetch calls.
   - Recommendation: Use `unstable_cache` with tags. It is stable in practice despite the name. If it causes issues, fall back to `revalidatePath('/', 'layout')` in the webhook handler as a blanket invalidation.

2. **`contentful-management` SDK v11 Upload API**
   - What we know: `createUpload` + `createAsset` with `uploadFrom` link is the documented pattern. Processing is async.
   - What's unclear: Exact error handling if WordPress source image returns 404 (some companies may have been removed).
   - Recommendation: Migration script should wrap each image download in try/catch and log failures without stopping. Use a placeholder image for missing logos.

3. **Rich text JSON construction from markdown scrape**
   - What we know: Contentful rich text uses a specific JSON AST format. The scrape content is markdown-like.
   - What's unclear: Whether to convert markdown to Contentful rich text JSON manually or use a library.
   - Recommendation: Use `@contentful/rich-text-from-markdown` (unofficial but available on npm) or write a simple converter that handles paragraphs, headings, bold, italic, links, and images -- the scrape content is not deeply nested.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright (existing from Phase 1) + Node.js script validation |
| Config file | `playwright.config.ts` (existing) |
| Quick run command | `npx tsc --noEmit` |
| Full suite command | `npx playwright test && npx tsx scripts/validate-content.ts` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-04 | TypeScript types compile without errors for all content models | unit (type check) | `npx tsc --noEmit` | Existing tsconfig |
| FOUND-04 | `getPortfolioCompanies('it')` returns typed `PortfolioCompany[]` | integration | `npx tsx scripts/validate-content.ts` | Wave 0 |
| FOUND-04 | All 18 portfolio companies, 15 team members, 5 funds queryable | integration | `npx tsx scripts/validate-content.ts` | Wave 0 |
| FOUND-08 | POST `/api/revalidate` with valid secret returns 200 + revalidated:true | e2e | `npx playwright test tests/revalidate.spec.ts` | Wave 0 |
| FOUND-08 | POST `/api/revalidate` with invalid secret returns 401 | e2e | `npx playwright test tests/revalidate.spec.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (type check -- fast)
- **Per wave merge:** `npx tsc --noEmit && npx tsx scripts/validate-content.ts`
- **Phase gate:** Full suite green + content validation script passes before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `scripts/validate-content.ts` -- validates all content types are queryable with correct counts and TypeScript types
- [ ] `tests/revalidate.spec.ts` -- tests the `/api/revalidate` route handler (valid secret, invalid secret, missing payload)
- [ ] Framework install: `npm install -D contentful-management slugify` (dev deps for migration)

*(Existing test infrastructure from Phase 1 covers smoke, i18n, responsive, and theme tests)*

---

## Sources

### Primary (HIGH confidence)
- [Contentful TypeScript in JS client library](https://www.contentful.com/developers/docs/javascript/tutorials/typescript-in-javascript-client-library/) -- EntrySkeletonType pattern, typed getEntries
- [Next.js revalidateTag API reference](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) -- Function signature, route handler usage, tag assignment
- [Contentful Content Delivery API reference](https://www.contentful.com/developers/docs/references/content-delivery-api/) -- locale parameter, include levels, rate limits (55 req/s CDA)
- [Contentful Images API reference](https://www.contentful.com/developers/docs/references/images-api/) -- Query parameters: w, h, fm, q, fit, f
- [Contentful + Next.js App Router integration guide](https://www.contentful.com/blog/integrate-contentful-next-js-app-router/) -- Revalidation route handler, draft mode, webhook setup
- [contentful-management.js GitHub](https://github.com/contentful/contentful-management.js/) -- createContentType, createEntry, createAsset, createUpload patterns
- [@contentful/rich-text-react-renderer npm](https://www.npmjs.com/package/@contentful/rich-text-react-renderer) -- documentToReactComponents, Options, custom node renderers
- Installed Next.js 15.5.12 source code verification -- confirmed single-argument `revalidateTag(tag)` signature

### Secondary (MEDIUM confidence)
- [Contentful localization docs](https://www.contentful.com/developers/docs/tutorials/general/setting-locales/) -- Field-level localization configuration
- [Contentful Management API rate limits](https://timmarsh.co.uk/2025/05/25/contentful-api-limits-and-strategies-of-how-to-protect-itself/) -- CMA 7 req/s, built-in SDK retry
- [cf-content-types-generator](https://github.com/contentful-userland/cf-content-types-generator) -- Evaluated and rejected in favor of manual types for this project size

### Tertiary (LOW confidence)
- Rich text from markdown conversion: `@contentful/rich-text-from-markdown` exists but is community-maintained. Needs validation before use.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries are official Contentful SDKs with stable APIs, verified against npm and official docs
- Architecture: HIGH -- patterns sourced from official Contentful + Next.js integration guide and TypeScript docs
- Pitfalls: HIGH -- rate limits, asset processing, locale key behavior all verified from official documentation
- Migration script: MEDIUM -- the data extraction from markdown scrape is custom work; patterns are sound but implementation details depend on scrape structure

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (Contentful SDK and Next.js 15 are both stable; 30-day window safe)
