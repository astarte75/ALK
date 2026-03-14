# Alkemia Capital Website

Premium PE/VC corporate site — faithful replica of hgcapital.com adapted for Alkemia Capital.

## Stack

- **Framework:** Next.js 15 App Router (NOT 16 — breaks styled-components)
- **CMS:** Contentful REST API (not GraphQL)
- **Styling:** styled-components v6 with SSR Registry + CSS custom properties
- **i18n:** next-intl v4 — IT default (no prefix), EN with `/en/` prefix
- **Animations:** GSAP + Lenis (Phase 5) — NOT Framer Motion
- **Deployment:** Vercel with on-demand ISR via Contentful webhooks

## Architecture Rules

- All theme colors as CSS custom properties on `:root` — NO JS ThemeProvider (prevents FOUC)
- `StyledComponentsRegistry` must wrap all children in root layout
- Contentful tokens are server-only — NEVER use `NEXT_PUBLIC_` prefix
- Locale mapping: route `it` → Contentful `it-IT`, route `en` → Contentful `en-US`
- Fetchers use `unstable_cache` with content-type tags for ISR (`revalidateTag`)
- All images via `next/image` with `fill` + aspect-ratio container (no CLS)
- Batch Contentful fetches per content type (not per page) — avoid 429 rate limits
- `await params` in all page/layout components (Next.js 15 Promise params)

## Key Paths

```
src/lib/contentful/       # CMS client, types, fetchers, rich text renderer
src/styles/               # GlobalStyle, theme tokens, breakpoints
src/app/[locale]/          # All routes under locale segment
src/app/api/revalidate/    # Contentful webhook handler
scripts/                   # Migration script (npx tsx scripts/migrate.ts)
.planning/                 # GSD project planning (roadmap, phases, state)
```

## Contentful Models

8 content types: `portfolioCompany`, `teamMember`, `fund`, `newsArticle`, `investmentPlatform`, `page`, `siteConfig`, `office`

Types defined in `src/lib/contentful/types.ts`, fetchers in `src/lib/contentful/fetchers.ts`.

## Design Tokens

- Background: `#1A1E22` | Surface: `#242A30`
- Accent teal: `#2EC4B6` (CTAs, links) | Accent gold: `#D4A843` (highlights, badges)
- Text: `#F9FAFB` (primary), `rgba(249,250,251,0.6)` (secondary)
- Fonts: Plus Jakarta Sans (headings), Inter (body)

## Commands

```bash
npm run dev              # Local dev server
npm run build            # Production build
npx tsc --noEmit         # Type check
npx playwright test      # E2E tests
npx tsx scripts/migrate.ts          # Seed Contentful (idempotent)
npx tsx scripts/validate-content.ts # Validate content
```

## Conventions

- Commit format: `<type>(<scope>): <description>` (English)
- Code comments in English
- Respond in Italian unless asked otherwise
- No over-engineering — simple, readable solutions
- Never commit secrets (.env.local is gitignored)
