---
phase: 03-layout-shell-legal
plan: 02
subsystem: cookie-consent-legal-pages
tags: [gdpr, cookie-consent, privacy, legal, contentful]
dependency_graph:
  requires: [03-01]
  provides: [cookie-consent-modal, privacy-page, cookie-policy-page, cookie-utility]
  affects: [locale-layout]
tech_stack:
  added: []
  patterns: [gdpr-blocking-modal, contentful-legal-pages, cookie-consent-utility]
key_files:
  created:
    - src/lib/cookies.ts
    - src/components/cookie/CookieConsent.tsx
    - src/components/cookie/CookieConsent.styles.ts
    - src/styles/legalPage.ts
    - src/app/[locale]/privacy/page.tsx
    - src/app/[locale]/cookie-policy/page.tsx
  modified:
    - src/app/[locale]/layout.tsx
decisions:
  - Used t.rich() for inline Cookie Policy link in modal description
  - Shared legal page styles in src/styles/legalPage.ts (not duplicated per page)
  - Secure flag conditional on production environment to avoid localhost issues
metrics:
  duration: 2m15s
  completed: "2026-03-14T17:49:08Z"
  tasks_completed: 2
  tasks_total: 2
---

# Phase 3 Plan 02: Cookie Consent & Legal Pages Summary

GDPR-compliant cookie consent modal with equal-prominence Accept/Reject (Italian Garante 2021) plus Privacy Notice and Cookie Policy pages fetching rich text from Contentful.

## Tasks Completed

| Task | Name | Commit | Status |
|------|------|--------|--------|
| 1 | Cookie consent utility and GDPR-compliant modal | 9aaba0c | Done |
| 2 | Privacy and Cookie Policy pages, CookieConsent in layout | c3e8b53 | Done |

## What Was Built

### Cookie Consent System
- **`src/lib/cookies.ts`**: Utility with `getConsent()` / `setConsent()` functions using native `document.cookie`. Sets `cookie_consent` cookie with 1-year max-age, SameSite=Lax, conditionally Secure. Exports `ConsentCategories` interface for future category-based consent.
- **`src/components/cookie/CookieConsent.tsx`**: Client component with blocking modal overlay. Initializes `isVisible=false` (hydration-safe), checks cookie in `useEffect`. Uses `t.rich()` for inline Cookie Policy link in description.
- **`src/components/cookie/CookieConsent.styles.ts`**: Styled components using z-index 2000 from `zIndex.cookieOverlay`. Accept and Reject buttons share identical `flex:1`, padding, font-size, font-weight (Garante compliance). Only fill color differs.

### Legal Pages
- **`src/app/[locale]/privacy/page.tsx`**: Server Component fetching from Contentful via `getPageBySlug('privacy', locale)`. Renders rich text with `renderRichText()`. Returns 404 if content not yet seeded. Includes `generateMetadata`.
- **`src/app/[locale]/cookie-policy/page.tsx`**: Same pattern with slug `cookie-policy`.
- **`src/styles/legalPage.ts`**: Shared styled components (`LegalPageWrapper`, `LegalPageTitle`, `LegalPageContent`) with rich text element styling (headings, lists, links, paragraphs).

### Layout Integration
- CookieConsent added to locale layout after Footer, before closing NextIntlClientProvider.

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **Shared legal styles**: Created `src/styles/legalPage.ts` as shared module rather than duplicating per-page styles (plan suggested either approach).
2. **t.rich() for cookie description**: Used next-intl's `t.rich()` to render the `{cookiePolicy}` placeholder as a Link component inside the description text.
3. **Secure flag conditional**: `Secure` cookie flag only added in production to prevent localhost development issues (as specified in plan).

## Verification Results

- `npx tsc --noEmit`: 0 errors
- `npm run build`: Successful, both `/[locale]/privacy` and `/[locale]/cookie-policy` routes generated
- Build output: ~115 kB first load JS for legal pages

## Notes

- Legal page content must be created in Contentful with slugs `privacy` and `cookie-policy` in both `it-IT` and `en-US` locales. Pages will 404 until content exists.
- The cookie consent modal uses the translation keys already present in `it.json` and `en.json` from plan 03-01.
