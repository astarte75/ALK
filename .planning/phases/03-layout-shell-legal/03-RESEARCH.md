# Phase 3: Layout Shell & Legal - Research

**Researched:** 2026-03-14
**Domain:** Next.js App Router layout shell, scroll-aware header, mobile menu, GDPR cookie consent (Italian Garante), custom cursor, styled-components patterns
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Navigation Structure:**
- Menu items (in order): Societa, Investment Platforms, Portfolio, Team, News, Sostenibilita, Contatti
- Sub-menu: Societa -> Corporate Governance (sub-item, not separate top-level)
- Header: transparent on hero, becomes opaque dark (#1A1E22) on scroll -- same as HG Capital
- Mobile menu: fullscreen overlay with animated sequential reveal of menu items, dark background
- Logo: from Contentful `siteConfig`, links to homepage
- Language switcher: IT/EN toggle in header

**Cookie Consent (GDPR Italy):**
- Custom banner (no third-party service for now)
- Modal that blocks interaction until choice is made
- Accept and Reject with equal visual prominence (same size, same styling weight -- Garante requirement)
- Only "Tecnici/Funzionali" cookies for now (no analytics, no marketing scripts)
- Accept -> set preference cookie, close. Reject -> set preference cookie (decline), close. No non-essential scripts either way.
- Single `cookie_consent` cookie (technical, 1-year expiry)
- Architecture must support future category-based consent

**Legal Pages:**
- Privacy Notice: adapted from existing site content, stored in Contentful as `page` entry (slug: `privacy`)
- Cookie Policy: adapted from existing site content, stored in Contentful as `page` entry (slug: `cookie-policy`)
- Data controller: Alkemia SGR S.p.A., Piazza Cavour 4, 35122 Padova, segreteria@alkemiacapital.com
- Both IT and EN versions in Contentful

**Footer:**
- Legal links: Privacy Notice, Cookie Policy (Accessibility Statement added in Phase 7)
- Social links: LinkedIn, X/Twitter (URLs from Contentful `siteConfig`)
- Office addresses: Milano (HQ) and Padova from Contentful `office` entries
- Copyright: (c) {year} Alkemia SGR S.p.A.

**Custom Cursor (NAV-04):**
- Desktop only -- scales/morphs on interactive elements (links, buttons)
- Hidden on mobile/tablet (touch devices)

### Claude's Discretion
- Header height and scroll threshold for transparent -> opaque transition
- Mobile menu animation timing and easing
- Cookie consent modal exact layout and copy
- Footer layout (columns, spacing)
- Custom cursor implementation approach (CSS vs canvas)
- How to adapt legal texts (what to remove, what to update)
- Styled-component organization for layout components

### Deferred Ideas (OUT OF SCOPE)
- Accessibility Statement (LEGAL-04): deferred to Phase 7
- Third-party consent management (Iubenda/Cookiebot): evaluate for production launch
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Fixed header with Alkemia logo, navigation links, hamburger menu on mobile | Scroll-aware header pattern, IntersectionObserver sentinel, styled-components transient props |
| NAV-02 | Footer with legal links (Privacy, Cookie, Legal, Governance, Accessibility) | Server Component footer fetching siteConfig + offices, next-intl Link |
| NAV-03 | Footer with social links (LinkedIn, X) | siteConfig.socialLinkedIn / socialTwitter from Contentful |
| NAV-04 | Custom cursor that scales on interactive elements | CSS custom cursor with mix-blend-mode, JS mousemove + data attribute detection |
| LEGAL-01 | Cookie consent banner with equal prominence Accept/Reject (GDPR Italy) | Italian Garante 2021 guidelines, localStorage/cookie consent API pattern |
| LEGAL-02 | Privacy Notice page with data controller info | getPageBySlug('privacy', locale) + renderRichText, legal page route |
| LEGAL-03 | Cookie Notice page with cookie categories | getPageBySlug('cookie-policy', locale) + renderRichText, legal page route |
| LEGAL-04 | Accessibility statement page | DEFERRED to Phase 7 -- out of scope |
</phase_requirements>

---

## Summary

Phase 3 builds the persistent layout shell (header + footer) that wraps every page, plus cookie consent and legal pages. The header is the most complex component: it must be transparent over the hero section and transition to an opaque dark background on scroll, it must include a desktop navigation with dropdown for Societa, a mobile hamburger that triggers a fullscreen overlay, and a language switcher. The footer is simpler -- a Server Component fetching data from Contentful. The cookie consent modal must comply with Italian Garante 2021 guidelines, which mandate equal visual prominence for Accept and Reject actions.

The key architectural decision is where to place Header and Footer in the component tree. Since both need locale-aware data (translations, Contentful fetches), they belong in the locale layout (`src/app/[locale]/layout.tsx`), not the root layout. The Header requires client-side interactivity (scroll detection, mobile menu toggle) so it will be a Client Component receiving server-fetched data as props. The Footer can be a Server Component since it has no interactivity. The custom cursor is a standalone Client Component in the root or locale layout, hidden on touch devices via media query and JS detection.

**Primary recommendation:** Use an IntersectionObserver sentinel element (invisible div at top of page) for scroll detection instead of scroll event listeners -- it is more performant, avoids throttling complexity, and works cleanly with SSR. Build cookie consent as a self-contained Client Component with a simple cookie-based consent API that can be extended with category support later. Legal pages use the existing `getPageBySlug` + `renderRichText` pipeline with no new infrastructure needed.

---

## Standard Stack

### Core (already installed -- no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.5.x | App Router layout system | Already installed. Layout nesting handles header/footer placement |
| styled-components | 6.3.x | Component styling | Already installed. Transient props ($isScrolled) for conditional styles |
| next-intl | 4.8.x | Navigation labels, legal page translations | Already installed. useTranslations for nav items, Link for locale-aware routing |
| @contentful/rich-text-react-renderer | 16.x | Legal page content rendering | Already installed. renderRichText for Privacy/Cookie pages |

### Supporting (no new installs needed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| js-cookie | -- | NOT needed | Native `document.cookie` is sufficient for a single consent cookie |
| react-cookie | -- | NOT needed | Overkill for one cookie. Native API is simpler |
| framer-motion | -- | NOT needed | GSAP comes in Phase 5. Use CSS transitions for Phase 3 animations |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| IntersectionObserver sentinel | scroll event listener | Scroll listener requires throttle/debounce, fires on every pixel, worse perf |
| Native document.cookie | js-cookie / react-cookie | One cookie does not justify a dependency. Native API is 3 lines |
| CSS transitions for menu | Framer Motion | Project uses GSAP (Phase 5). Adding Framer Motion would conflict. CSS is fine for basic sequential reveal |
| Custom cursor in JS | cursor: url() CSS | CSS cursor cannot scale/morph dynamically on hover. JS needed for smooth scaling |

**Installation:**
```bash
# No new packages needed for Phase 3
# Everything is already in package.json
```

---

## Architecture Patterns

### Recommended Component Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx           # Add Header + Footer here (locale-aware)
│   │   ├── privacy/
│   │   │   └── page.tsx         # Privacy Notice page
│   │   ├── cookie-policy/
│   │   │   └── page.tsx         # Cookie Policy page
│   │   └── page.tsx             # Existing homepage
│   └── layout.tsx               # Root layout (unchanged -- registry, GlobalStyle)
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # 'use client' -- scroll detection, mobile menu
│   │   ├── Header.styles.ts     # Styled components for header
│   │   ├── MobileMenu.tsx       # 'use client' -- fullscreen overlay
│   │   ├── MobileMenu.styles.ts
│   │   ├── Footer.tsx           # Server Component -- no interactivity
│   │   ├── Footer.styles.ts
│   │   ├── NavigationLinks.tsx  # Shared nav items (desktop + mobile)
│   │   └── LanguageSwitcher.tsx # 'use client' -- IT/EN toggle
│   ├── cookie/
│   │   ├── CookieConsent.tsx    # 'use client' -- modal with Accept/Reject
│   │   └── CookieConsent.styles.ts
│   ├── cursor/
│   │   └── CustomCursor.tsx     # 'use client' -- desktop only cursor
│   └── providers/
│       └── StyledComponentsRegistry.tsx  # Existing
├── lib/
│   └── cookies.ts               # Consent cookie read/write utility
└── messages/
    ├── it.json                  # Add: nav, footer, cookie, legal sections
    └── en.json
```

### Pattern 1: Scroll-Aware Header with IntersectionObserver Sentinel

**What:** Place an invisible sentinel `<div>` at the top of the page content. When it exits the viewport (user scrolled past it), the header becomes opaque. This avoids scroll event listeners entirely.

**When to use:** Any fixed/sticky header that changes appearance based on scroll position.

**Example:**
```tsx
// src/components/layout/Header.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { HeaderWrapper, Nav, Logo } from './Header.styles'

interface HeaderProps {
  logoUrl: string
  logoAlt: string
  navItems: { label: string; href: string; subItems?: { label: string; href: string }[] }[]
}

export default function Header({ logoUrl, logoAlt, navItems }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is NOT intersecting (scrolled past), header is opaque
        setIsScrolled(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Invisible sentinel at top of viewport */}
      <div ref={sentinelRef} style={{ position: 'absolute', top: 0, height: '1px', width: '100%' }} />
      <HeaderWrapper $isScrolled={isScrolled}>
        <Nav>
          <Logo src={logoUrl} alt={logoAlt} />
          {/* Desktop navigation, hamburger button, language switcher */}
        </Nav>
      </HeaderWrapper>
    </>
  )
}
```

```ts
// src/components/layout/Header.styles.ts
import styled, { css } from 'styled-components'
import { mq } from '@/styles/breakpoints'

export const HeaderWrapper = styled.header<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;

  ${({ $isScrolled }) =>
    $isScrolled
      ? css`
          background-color: var(--color-bg);
          backdrop-filter: blur(12px);
        `
      : css`
          background-color: transparent;
        `}

  ${mq.lg} {
    padding: 0 var(--space-12);
  }
`
```

**Key details:**
- `$isScrolled` uses styled-components transient prop ($ prefix) so it does not leak to DOM
- `backdrop-filter: blur(12px)` gives the premium glass effect mentioned in CONTEXT.md
- 80px header height is standard for corporate sites (HG Capital uses ~80px)
- The sentinel div is `position: absolute` within the page flow -- not fixed

### Pattern 2: Mobile Fullscreen Overlay Menu with CSS Transitions

**What:** A fullscreen overlay that slides in from right (or fades in) with menu items appearing sequentially using `transition-delay` on each item. No JS animation library needed.

**When to use:** Phase 3 mobile menu. GSAP-enhanced animations come in Phase 5.

**Example:**
```tsx
// src/components/layout/MobileMenu.tsx
'use client'

import { MobileOverlay, MenuList, MenuItem } from './MobileMenu.styles'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: { label: string; href: string }[]
}

export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  return (
    <MobileOverlay $isOpen={isOpen}>
      <MenuList>
        {navItems.map((item, index) => (
          <MenuItem
            key={item.href}
            $isOpen={isOpen}
            $index={index}
          >
            <a href={item.href} onClick={onClose}>
              {item.label}
            </a>
          </MenuItem>
        ))}
      </MenuList>
    </MobileOverlay>
  )
}
```

```ts
// src/components/layout/MobileMenu.styles.ts
import styled from 'styled-components'

export const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: var(--color-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.4s ease, visibility 0.4s ease;
`

export const MenuItem = styled.li<{ $isOpen: boolean; $index: number }>`
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '20px')});
  transition: opacity 0.4s ease, transform 0.4s ease;
  transition-delay: ${({ $isOpen, $index }) =>
    $isOpen ? `${0.1 + $index * 0.08}s` : '0s'};

  a {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-decoration: none;
    &:hover { color: var(--color-accent-teal); }
  }
`
```

**Key details:**
- Sequential reveal via `transition-delay` calculated from item index (0.1s base + 0.08s per item)
- `visibility: hidden` (not `display: none`) enables CSS transitions
- Menu items translate up 20px as they appear, creating a natural stagger effect
- Phase 5 will replace CSS transitions with GSAP SplitText / timeline for richer animations

### Pattern 3: Cookie Consent Modal (GDPR Italy Compliant)

**What:** A blocking modal shown on first visit if no consent cookie exists. Accept and Reject buttons have identical visual weight. Sets a `cookie_consent` cookie with value `accepted` or `rejected`.

**When to use:** On every page load when no consent cookie is found.

**Example:**
```ts
// src/lib/cookies.ts
export type ConsentValue = 'accepted' | 'rejected'

export function getConsent(): ConsentValue | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)cookie_consent=(\w+)/)
  return (match?.[1] as ConsentValue) ?? null
}

export function setConsent(value: ConsentValue): void {
  const maxAge = 365 * 24 * 60 * 60 // 1 year in seconds
  document.cookie = `cookie_consent=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`
}

// Future extension point for category-based consent
export interface ConsentCategories {
  technical: boolean     // always true
  analytics: boolean     // future
  marketing: boolean     // future
}
```

```tsx
// src/components/cookie/CookieConsent.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { getConsent, setConsent } from '@/lib/cookies'
import {
  Overlay, Modal, Title, Description, ButtonRow, AcceptButton, RejectButton
} from './CookieConsent.styles'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('cookie')

  useEffect(() => {
    // Only show if no consent cookie exists
    if (getConsent() === null) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setConsent('accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    setConsent('rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <Overlay>
      <Modal role="dialog" aria-modal="true" aria-labelledby="cookie-title">
        <Title id="cookie-title">{t('title')}</Title>
        <Description>{t('description')}</Description>
        <ButtonRow>
          {/* GDPR Italy: both buttons MUST have equal visual prominence */}
          <RejectButton onClick={handleReject}>{t('reject')}</RejectButton>
          <AcceptButton onClick={handleAccept}>{t('accept')}</AcceptButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  )
}
```

```ts
// src/components/cookie/CookieConsent.styles.ts
import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
`

export const Modal = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--space-8);
  max-width: 520px;
  width: 100%;
`

// GDPR: Accept and Reject must have EQUAL visual prominence
// Same size, same font weight, same padding -- only color differs slightly
const BaseButton = styled.button`
  flex: 1;
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover { opacity: 0.85; }
`

export const AcceptButton = styled(BaseButton)`
  background-color: var(--color-accent-teal);
  color: var(--color-bg);
  border: 2px solid var(--color-accent-teal);
`

export const RejectButton = styled(BaseButton)`
  background-color: transparent;
  color: var(--color-text-primary);
  border: 2px solid var(--color-text-secondary);
`

export const ButtonRow = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-6);
`
```

**Garante compliance notes:**
- Both buttons use `flex: 1` so they are the same width
- Both use the same font-size, font-weight, and padding
- Reject is outlined, Accept is filled -- this is the maximum difference allowed. Some interpretations require completely identical styling. To be safe, both could be solid-fill buttons in different colors. The planner should evaluate.
- The modal blocks interaction (overlay with no close button except the two choices)
- Link to full cookie policy should be included in the description text

### Pattern 4: Custom Cursor (Desktop Only)

**What:** A small circle that follows the mouse cursor, scaling up when hovering over interactive elements. Uses `position: fixed`, `pointer-events: none`, and `transform` for GPU-accelerated movement.

**When to use:** Desktop viewports only. Hidden on touch devices.

**Example:**
```tsx
// src/components/cursor/CustomCursor.tsx
'use client'

import { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { mq } from '@/styles/breakpoints'

const CursorDot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-accent-teal);
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.15s ease, opacity 0.15s ease;
  mix-blend-mode: difference;
  will-change: transform;

  /* Hide on touch devices */
  display: none;
  ${mq.lg} {
    display: block;
  }
  @media (hover: none) {
    display: none !important;
  }
`

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!cursorRef.current) return
    cursorRef.current.style.transform =
      `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`
  }, [])

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    document.addEventListener('mousemove', onMouseMove, { passive: true })

    // Scale on interactive elements
    const handleOver = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.matches('a, button, [data-cursor-hover], input, textarea, select')) {
        cursorRef.current?.classList.add('cursor-hover')
      }
    }
    const handleOut = () => {
      cursorRef.current?.classList.remove('cursor-hover')
    }

    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [onMouseMove])

  return <CursorDot ref={cursorRef} />
}
```

**Add to GlobalStyle:**
```css
/* Hide default cursor on desktop when custom cursor is active */
@media (hover: hover) {
  body { cursor: none; }
  a, button, input, textarea, select { cursor: none; }
}

.cursor-hover {
  transform: scale(2.5) !important;
}
```

**Key details:**
- `pointer-events: none` prevents the cursor element from capturing clicks
- `will-change: transform` hints GPU compositing
- `mix-blend-mode: difference` makes cursor visible on any background
- `@media (hover: none)` hides on touch devices (tablets, phones)
- Event delegation on `document` (mouseover/mouseout) avoids per-element listeners
- `{ passive: true }` on mousemove prevents jank
- Scale effect uses CSS class toggle, not React state, to avoid re-renders

### Pattern 5: Legal Pages with Contentful Rich Text

**What:** Server Component pages that fetch content from Contentful using existing `getPageBySlug()` and render with `renderRichText()`.

**When to use:** Privacy Notice and Cookie Policy pages.

**Example:**
```tsx
// src/app/[locale]/privacy/page.tsx
import { getPageBySlug } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { notFound } from 'next/navigation'
import type { Document } from '@contentful/rich-text-types'

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await getPageBySlug('privacy', locale)
  if (!page) notFound()

  return (
    <main>
      <h1>{page.fields.title}</h1>
      {renderRichText(page.fields.body as Document)}
    </main>
  )
}
```

### Pattern 6: Footer as Server Component

**What:** The footer fetches siteConfig (social links) and offices from Contentful at the server level. No client-side interactivity needed.

**Example:**
```tsx
// src/components/layout/Footer.tsx (Server Component -- no 'use client')
import { getSiteConfig, getOffices } from '@/lib/contentful/fetchers'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function Footer() {
  const locale = await getLocale()
  const [config, offices, t] = await Promise.all([
    getSiteConfig(locale),
    getOffices(locale),
    getTranslations('footer'),
  ])

  const currentYear = new Date().getFullYear()

  return (
    <footer>
      {/* Office addresses */}
      {/* Legal links: Privacy, Cookie Policy */}
      {/* Social links from config */}
      {/* Copyright */}
      <p>&copy; {currentYear} Alkemia SGR S.p.A.</p>
    </footer>
  )
}
```

### Pattern 7: Locale Layout Integration

**What:** Header and Footer are placed in the locale layout so they have access to translations and locale-specific Contentful data.

```tsx
// src/app/[locale]/layout.tsx -- UPDATED
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getSiteConfig } from '@/lib/contentful/fetchers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/cookie/CookieConsent'
import CustomCursor from '@/components/cursor/CustomCursor'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'it' | 'en')) notFound()

  const [messages, config] = await Promise.all([
    getMessages(),
    getSiteConfig(locale),
  ])

  // Serialize props for Client Components
  const logoUrl = config?.fields.logo
    ? `https:${(config.fields.logo as any).fields.file.url}`
    : '/logo.svg'

  return (
    <NextIntlClientProvider messages={messages}>
      <CustomCursor />
      <Header
        logoUrl={logoUrl}
        logoAlt="Alkemia Capital"
        navItems={[/* built from translations */]}
      />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </NextIntlClientProvider>
  )
}
```

### Anti-Patterns to Avoid

- **Header/Footer in root layout:** Root layout does not have access to locale or translations. Always place locale-dependent UI in the locale layout.
- **scroll event listener without throttle:** If you must use scroll events (avoid -- use IntersectionObserver), you MUST throttle with requestAnimationFrame or a 100ms debounce. Otherwise, 60+ state updates per second.
- **Blocking body scroll with overflow:hidden on mobile menu:** This causes scroll position to reset on iOS Safari. Use `position: fixed` on body with saved scroll position, or use CSS `overscroll-behavior: contain`.
- **Cookie consent rendered server-side:** The consent modal must be Client Component with useEffect check. Server-rendering it causes hydration mismatch because the server does not know the cookie value.
- **React state for cursor position:** Using `useState` for cursor x/y causes 60 re-renders per second. Use `ref.current.style.transform` directly.
- **Custom cursor on touch devices:** Always check `@media (hover: none)` and `window.matchMedia`. Touch devices do not have a persistent cursor.
- **Dark pattern in cookie buttons:** Italian Garante explicitly prohibits making Reject harder to find or less visually prominent than Accept. Both buttons must be same size, same weight, equally accessible.
- **Transient props without $ prefix:** styled-components v6 requires `$` prefix on transient props to prevent DOM leakage. `isScrolled` -> `$isScrolled`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale-aware links | Manual href construction with locale prefix | next-intl `Link` component or `useRouter` | Handles locale prefix, preserves search params, SSR-safe |
| Scroll detection | Custom scroll event with debounce | IntersectionObserver on sentinel element | Zero scroll events, native browser API, GPU-friendly |
| Cookie read/write | Full cookie parser library | Native `document.cookie` with simple regex | One cookie. Three lines of code. No dependency needed |
| Mobile menu body scroll lock | Custom scroll position save/restore | CSS `position: fixed; inset: 0` on overlay or `overscroll-behavior: contain` | CSS-only solution avoids iOS Safari scroll reset bugs |
| Rich text rendering | Custom Contentful document walker | Existing `renderRichText()` from Phase 2 | Already handles images, links, headings, all BLOCKS |
| Sequential animation | JS-based stagger library | CSS `transition-delay` with index calculation | Simple, performant, no dependency. GSAP replaces in Phase 5 |

**Key insight:** Phase 3 requires zero new npm dependencies. Every feature builds on existing infrastructure (styled-components, next-intl, Contentful fetchers, rich text renderer). The complexity is in composition and integration, not in new technology.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch on Cookie Consent
**What goes wrong:** Server renders "no modal" (cannot read cookies), client renders "show modal" (no consent cookie found). React throws hydration error.
**Why it happens:** `document.cookie` is not available during SSR. If you conditionally render based on cookie value without useEffect, server and client HTML will differ.
**How to avoid:** Always initialize `isVisible` to `false`. Use `useEffect` to check consent cookie after mount. The modal appears client-side only.
**Warning signs:** Console error "Hydration failed because the UI that was rendered on the server does not match."

### Pitfall 2: Fixed Header Covers Page Content
**What goes wrong:** First section of page content is hidden behind the fixed header.
**Why it happens:** `position: fixed` removes the header from document flow. Content starts at top of viewport.
**How to avoid:** Add `padding-top: 80px` (or header height) to the `<main>` wrapper. Or use a spacer div. The padding should match `--header-height` CSS variable.
**Warning signs:** Hero section title partially hidden on page load.

### Pitfall 3: Mobile Menu z-index Conflicts
**What goes wrong:** Mobile menu appears behind other fixed elements (cookie modal, header).
**Why it happens:** Stacking context created by parent transforms or z-index layering.
**How to avoid:** Establish clear z-index scale: header=1000, mobile menu=1050, cookie overlay=2000, cursor=9999.
**Warning signs:** Menu opens but appears behind cookie modal.

### Pitfall 4: IntersectionObserver Not Available During SSR
**What goes wrong:** Server-side error "IntersectionObserver is not defined."
**Why it happens:** IntersectionObserver is a browser API. If called outside useEffect, it runs on the server.
**How to avoid:** All IntersectionObserver setup must be inside `useEffect`. The component is already `'use client'`, but that does not mean it only runs on client -- it still SSRs.
**Warning signs:** Build error or runtime crash on server.

### Pitfall 5: Cookie Not Set with Secure Flag on Localhost
**What goes wrong:** Cookie is not set during local development.
**Why it happens:** `Secure` flag requires HTTPS. Localhost uses HTTP.
**How to avoid:** Omit `Secure` in development, or use `localhost` which is an exception in most browsers. Alternatively, only add `Secure` in production: `${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`.
**Warning signs:** Cookie consent modal reappears on every page load in dev.

### Pitfall 6: Italian Garante Non-Compliance
**What goes wrong:** Site receives a warning or fine from the Garante for cookie consent implementation.
**Why it happens:** Accept button is visually more prominent than Reject (larger, brighter, colored vs. gray).
**How to avoid:** Both buttons must be the same physical size (`flex: 1`), same font weight, same padding. Color difference is acceptable IF both are equally visible. Safest: both solid-fill in different colors.
**Warning signs:** Informal GDPR audit flags the banner. User complaints.

### Pitfall 7: next-intl Link vs next/link in Navigation
**What goes wrong:** Navigation links do not include locale prefix for English, or always include prefix for Italian.
**Why it happens:** Using `next/link` instead of next-intl's `Link` or `usePathname`.
**How to avoid:** Import `Link` from `next-intl/link` (or use the navigation helpers from next-intl). This automatically handles locale prefix based on `localePrefix: 'as-needed'` config.
**Warning signs:** Clicking "Portfolio" on English site goes to `/portfolio` (Italian) instead of `/en/portfolio`.

---

## Code Examples

### Cookie Consent Translation Keys

```json
// messages/it.json (add to existing)
{
  "nav": {
    "societa": "Societa",
    "corporateGovernance": "Corporate Governance",
    "investmentPlatforms": "Investment Platforms",
    "portfolio": "Portfolio",
    "team": "Team",
    "news": "News",
    "sostenibilita": "Sostenibilita",
    "contatti": "Contatti"
  },
  "footer": {
    "privacy": "Privacy Notice",
    "cookiePolicy": "Cookie Policy",
    "copyright": "Alkemia SGR S.p.A. Tutti i diritti riservati.",
    "headquarters": "Sede legale"
  },
  "cookie": {
    "title": "Informativa sui Cookie",
    "description": "Questo sito utilizza cookie tecnici necessari al funzionamento. Per maggiori informazioni, consulta la nostra {cookiePolicy}.",
    "accept": "Accetta",
    "reject": "Rifiuta",
    "cookiePolicyLink": "Cookie Policy"
  }
}
```

### Z-Index Scale (add to GlobalStyle or theme)

```ts
// src/styles/zIndex.ts
export const zIndex = {
  header: 1000,
  mobileMenu: 1050,
  cookieOverlay: 2000,
  cursor: 9999,
} as const
```

### Language Switcher Pattern

```tsx
// src/components/layout/LanguageSwitcher.tsx
'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next-intl/navigation'
import styled from 'styled-components'

const SwitcherButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  color: ${({ $isActive }) =>
    $isActive ? 'var(--color-accent-teal)' : 'var(--color-text-secondary)'};
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--font-body);
`

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = locale === 'it' ? 'en' : 'it'

  return (
    <SwitcherButton
      $isActive={false}
      onClick={() => router.replace(pathname, { locale: switchTo })}
    >
      {switchTo.toUpperCase()}
    </SwitcherButton>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| scroll event + throttle for header | IntersectionObserver sentinel | Widely adopted ~2020 | No scroll events fired. Zero-cost when idle. |
| jQuery cursor plugins | CSS transform + mousemove with passive listener | ~2022 | GPU-composited, no layout thrashing |
| Third-party cookie banners (OneTrust, Cookiebot) | Custom lightweight consent for simple sites | Ongoing | Full control over styling, no third-party JS, faster load |
| `overflow: hidden` for scroll lock | `overscroll-behavior: contain` or fixed positioning | 2021+ | Avoids iOS Safari scroll reset bug |
| JS animation for menu stagger | CSS `transition-delay` with index | Always valid for simple cases | Zero JS, composited by browser |

**Deprecated/outdated:**
- `scroll` event for header state: Performance-inferior to IntersectionObserver
- Cookie consent via implied consent (scrolling = accept): Explicitly prohibited by Italian Garante since Jan 2022
- `document.cookie` with `expires` (old format): Use `max-age` instead (seconds-based, simpler)

---

## Italian Garante Cookie Requirements Reference

Source: [Garante Guidelines July 2021](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876), effective January 10, 2022.

| Requirement | Implementation |
|-------------|----------------|
| Banner must be shown on first visit | `useEffect` check for `cookie_consent` cookie absence |
| Accept and Reject must have equal prominence | Same size, weight, padding on both buttons |
| Scrolling is NOT valid consent | Modal blocks interaction until explicit choice |
| X button = reject (technical cookies only) | Optional: include X button that sets `rejected` |
| Link to full cookie policy in banner | Include `<Link>` to `/cookie-policy` in description |
| Re-prompt after ~6 months | `max-age` of 6 months (15768000 seconds), or 1 year per context decision |
| Technical cookies exempt from consent | `cookie_consent` itself is a technical cookie -- no prior consent needed |
| Footer link to manage preferences | Footer includes "Cookie Policy" link. Future: add preference manager |
| No cookie wall (blocking content until Accept) | Modal must allow Reject. Reject does not block content access |

---

## Open Questions

1. **Societa dropdown on desktop**
   - What we know: Societa has a "Corporate Governance" sub-item
   - What's unclear: Whether this is a hover dropdown or click dropdown. HG Capital uses hover on desktop.
   - Recommendation: Implement as hover dropdown on desktop (mouseenter/mouseleave), tap-to-toggle on mobile menu. Hover dropdowns are standard for corporate navigation.

2. **Header logo asset from Contentful**
   - What we know: `siteConfig` has a `logo` field (AssetLink). `getSiteConfig(locale)` fetches it.
   - What's unclear: Whether the logo is uploaded to Contentful yet, and whether it is SVG or raster.
   - Recommendation: Use a fallback `/logo.svg` in `public/` directory. Fetch from Contentful when available. SVG preferred for crisp rendering at any size.

3. **Cookie consent button styling -- truly equal?**
   - What we know: Garante says "equal prominence." Outlined vs. filled is common but some interpretations say even that is a dark pattern.
   - What's unclear: Whether the current Italian enforcement considers outlined/filled to be sufficiently equal.
   - Recommendation: Use filled buttons for both (teal for Accept, neutral/gray for Reject). This is the safest interpretation. The planner can decide.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.58.x (already installed) |
| Config file | `playwright.config.ts` (already exists) |
| Quick run command | `npx playwright test tests/layout.spec.ts --reporter=line` |
| Full suite command | `npx playwright test` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | Header visible, fixed, becomes opaque on scroll | e2e | `npx playwright test tests/layout.spec.ts` | Wave 0 |
| NAV-01 | Hamburger menu visible on mobile, opens overlay | e2e | `npx playwright test tests/mobile-menu.spec.ts` | Wave 0 |
| NAV-02 | Footer contains legal links (Privacy, Cookie Policy) | e2e | `npx playwright test tests/layout.spec.ts` | Wave 0 |
| NAV-03 | Footer contains social links (LinkedIn, X) | e2e | `npx playwright test tests/layout.spec.ts` | Wave 0 |
| NAV-04 | Custom cursor visible on desktop, hidden on mobile | e2e | `npx playwright test tests/cursor.spec.ts` | Wave 0 |
| LEGAL-01 | Cookie consent modal shown on first visit, Accept/Reject equal size | e2e | `npx playwright test tests/cookie-consent.spec.ts` | Wave 0 |
| LEGAL-01 | Cookie consent not shown after accepting/rejecting | e2e | `npx playwright test tests/cookie-consent.spec.ts` | Wave 0 |
| LEGAL-02 | Privacy page renders with content from Contentful | e2e | `npx playwright test tests/legal-pages.spec.ts` | Wave 0 |
| LEGAL-03 | Cookie Policy page renders with content from Contentful | e2e | `npx playwright test tests/legal-pages.spec.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (type check)
- **Per wave merge:** `npx playwright test` (full suite)
- **Phase gate:** Full suite green + zero TypeScript errors

### Wave 0 Gaps
- [ ] `tests/layout.spec.ts` -- covers NAV-01, NAV-02, NAV-03 (header/footer presence, scroll behavior)
- [ ] `tests/mobile-menu.spec.ts` -- covers NAV-01 mobile (hamburger, overlay)
- [ ] `tests/cursor.spec.ts` -- covers NAV-04 (cursor element on desktop)
- [ ] `tests/cookie-consent.spec.ts` -- covers LEGAL-01 (modal, buttons, cookie persistence)
- [ ] `tests/legal-pages.spec.ts` -- covers LEGAL-02, LEGAL-03 (privacy and cookie-policy page rendering)

---

## Sources

### Primary (HIGH confidence)
- Project codebase: `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/lib/contentful/fetchers.ts`, `src/lib/contentful/types.ts` -- verified existing patterns, fetchers, types
- [MDN IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) -- sentinel pattern for scroll detection
- [MDN document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) -- native cookie API for consent storage
- [styled-components transient props](https://styled-components.com/docs/api#transient-props) -- $ prefix for DOM-safe props

### Secondary (MEDIUM confidence)
- [Italian Garante cookie guidelines (CookieYes summary)](https://www.cookieyes.com/blog/cookie-consent-requirements-in-italy/) -- equal prominence requirement, banner specifications, re-consent period
- [iubenda Italy cookie rules](https://www.iubenda.com/en/help/31246-italy-new-cookie-rules/) -- Garante 2021 guidelines interpretation
- [Didomi Italian Garante compliance](https://www.didomi.io/blog/italian-garante-new-guidelines) -- banner requirements, scrolling not valid consent
- [LogRocket custom cursor CSS](https://blog.logrocket.com/custom-cursor-css/) -- implementation patterns, pointer-events: none, performance tips

### Tertiary (LOW confidence)
- Custom cursor `mix-blend-mode: difference` approach: widely used in portfolio/agency sites but exact browser support edge cases on older Safari need runtime testing
- Garante enforcement of outlined vs. filled button distinction: no specific enforcement case found. Safest to use both filled.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies needed, all patterns build on Phase 1-2 infrastructure
- Architecture: HIGH -- layout placement in locale layout verified against Next.js App Router docs and existing codebase
- Scroll detection: HIGH -- IntersectionObserver is a stable browser API, widely documented
- Cookie consent GDPR: MEDIUM -- Garante requirements well-documented by compliance companies, but exact enforcement tolerance on button styling is uncertain
- Custom cursor: MEDIUM -- implementation is straightforward, but mix-blend-mode has minor cross-browser quirks
- Pitfalls: HIGH -- based on direct Next.js App Router experience and SSR hydration patterns

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable patterns, no fast-moving dependencies)
