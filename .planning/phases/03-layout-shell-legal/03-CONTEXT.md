# Phase 3: Layout Shell & Legal - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Fixed header with navigation, footer with legal/social links, cookie consent modal (GDPR Italy), Privacy Notice page, Cookie Policy page. Accessibility Statement deferred to Phase 7. Custom cursor on desktop. No page content, no animations — just the persistent shell that wraps every page.

</domain>

<decisions>
## Implementation Decisions

### Navigation Structure
- **Menu principale (ordine):** Società, Investment Platforms, Portfolio, Team, News, Sostenibilità, Contatti
- **Sub-menu:** Società → Corporate Governance (sotto-voce, non voce separata)
- **Header behavior:** Transparent on hero, becomes opaque dark (#1A1E22) on scroll — same as HG Capital
- **Mobile menu:** Fullscreen overlay with animated sequential reveal of menu items, dark background — same as HG Capital
- **Logo:** Alkemia logo from Contentful `siteConfig`, links to homepage
- **Language switcher:** In header (IT/EN toggle)

### Cookie Consent (GDPR Italy)
- **Approach:** Custom banner (no third-party service for now — may integrate Iubenda/Cookiebot later in production)
- **Display:** Modal centrale (blocks interaction until choice is made)
- **Buttons:** Accept and Reject with equal visual prominence (same size, same styling weight — Garante requirement)
- **Cookie categories:** Only "Tecnici/Funzionali" for now (no analytics, no marketing scripts)
- **Behavior:** Accept → set preference cookie, close modal. Reject → set preference cookie (decline), close modal. No non-essential scripts loaded in either case for now.
- **Preference storage:** Single `cookie_consent` cookie (technical, no expiry beyond session/1 year)
- **Future-proofing:** When analytics/marketing scripts are added later, the banner will block them until consent is given. Architecture should support category-based consent.

### Legal Pages Content
- **Privacy Notice:** Adapt existing "Dichiarazione sulla Privacy (UE)" from alkemiacapital-site.md — remove WordPress/Complianz/Elementor references, update for new tech stack
- **Cookie Policy:** Adapt existing "Cookie Policy (UE)" from alkemiacapital-site.md — remove Elementor, Complianz, and WordPress-specific cookie entries, keep structure
- **Accessibility Statement:** DEFERRED to Phase 7 (when WCAG audit is complete)
- **Data controller:** Alkemia SGR S.p.A., Piazza Cavour 4, 35122 Padova, segreteria@alkemiacapital.com
- **Content management:** Both pages stored in Contentful as `page` entries (slug: `privacy`, `cookie-policy`) — editable without deploy
- **Languages:** Both IT and EN versions in Contentful

### Footer
- **Legal links:** Privacy Notice, Cookie Policy (Accessibility Statement added in Phase 7)
- **Social links:** LinkedIn, X/Twitter (URLs from Contentful `siteConfig`)
- **Office addresses:** Milano (HQ) and Padova from Contentful `office` entries
- **Copyright:** © {year} Alkemia SGR S.p.A.

### Custom Cursor (NAV-04)
- Desktop only — scales/morphs when hovering interactive elements (links, buttons)
- Hidden on mobile/tablet (touch devices)
- Claude's discretion on exact visual style (dot, circle, blend mode)

### Claude's Discretion
- Header height and scroll threshold for transparent → opaque transition
- Mobile menu animation timing and easing
- Cookie consent modal exact layout and copy
- Footer layout (columns, spacing)
- Custom cursor implementation approach (CSS vs canvas)
- How to adapt legal texts (what to remove, what to update)
- Styled-component organization for layout components

</decisions>

<specifics>
## Specific Ideas

- HG Capital's header has a subtle backdrop-blur when transitioning to opaque — consider this for Alkemia
- The mobile menu overlay in HG has staggered text animations — Phase 3 should include basic CSS transitions for menu items; GSAP-level animations come in Phase 5
- Cookie consent modal should match the dark premium aesthetic (dark surface, teal accent for Accept, outlined for Reject)
- Footer should feel substantial (like HG's) — not a thin strip

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `getSiteConfig(locale)` — fetches logo, social links, contact email from Contentful
- `getOffices(locale)` — fetches office addresses for footer
- `getPageBySlug(slug, locale)` — fetches Privacy/Cookie pages from Contentful
- `renderRichText(document)` — renders Contentful rich text (for legal page content)
- `toContentfulLocale(locale)` — locale mapping for all fetchers
- Dark theme CSS custom properties already defined in GlobalStyle.ts
- Breakpoint system in breakpoints.ts (mq.sm, mq.md, mq.lg, etc.)
- Theme tokens in theme.ts (colors, fonts, spacing)

### Established Patterns
- styled-components with SSR Registry
- next-intl for translations (useTranslations hook)
- Server Components for data fetching, Client Components for interactivity
- CSS custom properties for all colors

### Integration Points
- Root layout (`src/app/layout.tsx`) — header/footer wrap all pages here
- Locale layout (`src/app/[locale]/layout.tsx`) — NextIntlClientProvider
- Legal pages route: `src/app/[locale]/privacy/page.tsx`, `src/app/[locale]/cookie-policy/page.tsx`
- Messages files (`messages/it.json`, `messages/en.json`) — navigation labels, cookie consent copy

</code_context>

<deferred>
## Deferred Ideas

- **Accessibility Statement (LEGAL-04):** Deferred to Phase 7 — needs WCAG audit results before writing meaningful content
- **Third-party consent management (Iubenda/Cookiebot):** Evaluate for production launch — custom banner sufficient for development

</deferred>

---

*Phase: 03-layout-shell-legal*
*Context gathered: 2026-03-14*
