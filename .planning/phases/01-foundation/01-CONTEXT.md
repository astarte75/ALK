# Phase 1: Foundation - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffolding with Next.js 15 App Router, styled-components v6 SSR, dark premium theme via CSS custom properties, next-intl i18n routing (IT default + EN), responsive design 320-2560px, and Vercel deployment with CI/CD. No pages, no content, no animations — just the stable base every subsequent phase builds on.

</domain>

<decisions>
## Implementation Decisions

### Color Palette
- **Background (dark base):** #1A1E22 — same depth as HG Capital, warm enough for readability
- **Primary accent (teal):** #2EC4B6 — used for CTAs, links, hover states, active indicators
- **Secondary accent (gold):** #D4A843 — used for highlights, badges, decorative elements, stat counters
- **Text primary:** #F9FAFB — near-white, maximum contrast on dark background
- **Text secondary:** to be derived from primary at ~60% opacity or a mid-gray
- **Surface colors:** slightly lighter than background (#242A30 or similar) for cards, elevated elements
- Both accent colors must pass WCAG 2.1 AA contrast check against #1A1E22 background (verify during implementation)

### Typography
- **Headings:** Plus Jakarta Sans (Google Fonts, free) — geometric, modern, strong character on large sizes
- **Body text:** Inter (built into Next.js via `next/font`) — excellent screen readability, clean pairing with Plus Jakarta
- **Weight scale:** 400 (body), 500 (emphasis), 600 (subheadings), 700 (headings), 800 (hero)
- **Size scale:** Claude's discretion — derive from a modular scale (1.25 ratio recommended)

### Visual Tone
- **Claude's Discretion** — choose between subtle noise/grain texture, gradient transitions between sections, or clean flat approach based on what works best with teal+gold palette on #1A1E22. Lean toward the premium PE/VC aesthetic seen in HG Capital — sophisticated, not flashy.

### Technical Foundation (locked from research)
- Next.js 15 App Router (NOT Pages Router)
- styled-components v6.3+ with `StyledComponentsRegistry` using `useServerInsertedHTML` in root layout
- `compiler: { styledComponents: true }` in next.config.js
- All theme colors as CSS custom properties on `:root` in GlobalStyle — no JS ThemeProvider for colors
- next-intl v4.8 with middleware; IT as defaultLocale (no prefix), EN with `/en/` prefix
- Both fonts loaded via `next/font/google` for automatic optimization
- Vercel deployment with auto-deploy on push to main

### Claude's Discretion
- Exact folder structure within App Router conventions
- Breakpoint values for responsive design (standard or tailored)
- GlobalStyle reset patterns
- Development tooling (ESLint, Prettier config)
- CSS custom property naming convention
- Exact surface/border/shadow color derivations from the palette

</decisions>

<specifics>
## Specific Ideas

- "Teal + Oro = alchimia moderna" — the palette intentionally evokes the alchemy theme of the brand name
- HG Capital reference: #1A1E22 background, #F8495E red accent, split-text animations, full-screen sections — Alkemia should feel equally premium but with its own identity
- The teal (#2EC4B6) differentiates clearly from HG's red while still providing strong visual contrast on dark backgrounds
- Gold (#D4A843) adds warmth and a classic finance/Italian luxury feel

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None — patterns will be established in this phase

### Integration Points
- `alkemiacapital-site.md` in project root contains all content for future phases
- `.firecrawl/` directory has scraped HG Capital reference material (HTML, markdown, URLs) for visual reference

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-14*
