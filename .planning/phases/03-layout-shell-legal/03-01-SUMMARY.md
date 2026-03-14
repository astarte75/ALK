---
phase: "03-layout-shell-legal"
plan: "01"
subsystem: "layout-shell"
tags: [header, footer, navigation, mobile-menu, language-switcher, i18n]
dependency_graph:
  requires: [01-01, 01-02, 02-01]
  provides: [layout-shell, header-component, footer-component, navigation-helpers, z-index-scale]
  affects: [03-02, 03-03, 04-all]
tech_stack:
  added: []
  patterns: [IntersectionObserver-sentinel, CSS-transition-stagger, server-component-footer, transient-props]
key_files:
  created:
    - src/components/layout/Header.tsx
    - src/components/layout/Header.styles.ts
    - src/components/layout/MobileMenu.tsx
    - src/components/layout/MobileMenu.styles.ts
    - src/components/layout/NavigationLinks.tsx
    - src/components/layout/LanguageSwitcher.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/Footer.styles.ts
    - src/styles/zIndex.ts
    - src/i18n/navigation.ts
  modified:
    - src/app/[locale]/layout.tsx
    - src/styles/GlobalStyle.ts
    - src/messages/it.json
    - src/messages/en.json
decisions:
  - "Created next-intl navigation helpers (Link, useRouter, usePathname) via createNavigation in src/i18n/navigation.ts"
  - "Sentinel div placed inside Header component (not in layout) for self-contained scroll detection"
  - "Mobile menu flattens sub-items into sequential list for simpler mobile UX"
  - "Footer legal links use raw anchor tags with locale-prefix calculation (not next-intl Link) since Footer is a Server Component"
metrics:
  duration: "4m 17s"
  completed: "2026-03-14T17:44:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 10
  files_modified: 4
---

# Phase 3 Plan 01: Header + Footer Layout Shell Summary

Fixed header with IntersectionObserver scroll detection, desktop dropdown navigation, fullscreen mobile menu with CSS stagger, IT/EN language switcher, and server-component footer with Contentful offices/social/legal links.

## Completed Tasks

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Header, MobileMenu, NavigationLinks, LanguageSwitcher, z-index | a7948bb | Header.tsx, MobileMenu.tsx, NavigationLinks.tsx, LanguageSwitcher.tsx, zIndex.ts |
| 2 | Footer + locale layout wiring | 81787a6 | Footer.tsx, layout.tsx, GlobalStyle.ts |

## What Was Built

### Header (Client Component)
- Fixed position, 80px height, transparent by default
- IntersectionObserver sentinel pattern: invisible 1px div at page top; when scrolled past, header becomes opaque (#1A1E22) with backdrop-blur(12px)
- Desktop navigation (visible at lg+) with 7 menu items
- Societa item has hover dropdown with Corporate Governance sub-link
- Hamburger button (visible below lg) with CSS-animated three-line-to-X transform
- Body scroll locked when mobile menu is open

### Mobile Menu (Client Component)
- Fullscreen overlay with z-index 1050 (above header)
- Logo + close button in header area
- Flattened nav items displayed as large centered links
- Staggered CSS transitions: each item delays 0.1s + index * 0.08s for translateY + opacity reveal
- Language switcher at bottom

### Navigation Links (Client Component)
- Shared between desktop and mobile layouts
- Desktop: horizontal flex with dropdown on mouseenter/mouseleave
- Dropdown: absolutely positioned, border-radius 8px, surface background
- Chevron indicator on items with sub-menus

### Language Switcher (Client Component)
- Shows opposite locale label (EN when on IT, IT when on EN)
- Uses next-intl router.replace with locale parameter
- Preserves current pathname on switch

### Footer (Server Component)
- Fetches siteConfig and offices from Contentful via Promise.all
- Three-column grid (1-col on mobile, 3-col at lg+)
- Column 1: Offices with city, address, phone; HQ badge on headquarters
- Column 2: Legal links (Privacy Notice, Cookie Policy)
- Column 3: Social links (LinkedIn, X) with inline SVG icons
- Copyright bar with dynamic year
- Graceful degradation when Contentful data is null

### Infrastructure
- Z-index scale: header=1000, mobileMenu=1050, cookieOverlay=2000, cursor=9999
- next-intl navigation helpers: Link, useRouter, usePathname, redirect
- GlobalStyle: --header-height CSS variable, main padding-top, cursor-hover class placeholder
- Translation keys: nav (9 keys), footer (6 keys), cookie (5 keys) in both IT and EN

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created next-intl navigation helpers**
- **Found during:** Task 1
- **Issue:** Project had no `createNavigation` setup for next-intl v4 locale-aware Link/Router
- **Fix:** Created `src/i18n/navigation.ts` exporting Link, redirect, usePathname, useRouter
- **Files created:** src/i18n/navigation.ts

**2. [Rule 2 - Missing functionality] Footer legal links use raw hrefs**
- **Found during:** Task 2
- **Issue:** Footer is a Server Component; next-intl Link from navigation.ts is a Client Component helper. Used locale-prefixed anchor hrefs instead for server-side rendering compatibility.
- **Fix:** Constructed href with locale prefix directly
- **Files affected:** src/components/layout/Footer.tsx

## Verification

- `npx tsc --noEmit`: PASSED (zero errors)
- `npm run build`: PASSED (zero errors, all pages generated)

## Self-Check: PASSED

All 10 created files exist. Both task commits (a7948bb, 81787a6) verified in git log.
