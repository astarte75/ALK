---
phase: "07"
plan: "04"
subsystem: investor-portal
tags: [navigation, responsive, polish, animation]
dependency_graph:
  requires: [07-01, 07-02, 07-03]
  provides: [portal-nav-integration, responsive-portal]
  affects: [header, footer, mobile-menu, login-form]
tech_stack:
  added: []
  patterns: [gold-accent-portal-link, css-fade-in, mobile-horizontal-scroll]
key_files:
  created: []
  modified:
    - src/components/layout/Header.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/NavigationLinks.tsx
    - src/components/layout/MobileMenu.tsx
    - src/components/layout/MobileMenu.styles.ts
    - src/components/portal/LoginForm.tsx
    - src/components/portal/DashboardTable.tsx
    - src/components/portal/CapitalCallsTable.tsx
    - src/components/portal/NavChart.tsx
    - src/components/portal/DocumentList.tsx
    - src/messages/it.json
    - src/messages/en.json
decisions:
  - Portal nav link uses gold accent with border to visually distinguish from public nav items
  - Download button in DocumentList gets border styling for better tap target on mobile
  - X-axis labels angled at -30deg with preserveStartEnd to prevent overlap
metrics:
  duration: "5m 23s"
  completed: "2026-03-15"
  tasks_completed: 5
  tasks_total: 5
---

# Phase 7 Plan 4: Portal Nav & Polish Summary

Portal navigation integrated into site header/footer/mobile with gold accent styling, responsive polish across all portal components, and login fade-in animation.

## What Was Done

### Task 1: Portal Link in Site Navigation
- Added `nav.investitori` translation key to both IT ("Area Investitori") and EN ("Investor Portal")
- Added portal link as last nav item in Header with `isPortal: true` flag
- Created `PortalLink` styled component in NavigationLinks with gold border + gold text
- Created `MobilePortalItem` styled component in MobileMenu.styles with gold bordered button
- Added portal link to Footer legal section with `footer.investitori` translation key

### Task 2: Responsive Polish
- **LoginForm**: Added `100svh` fallback for iOS Safari, responsive padding (1.5rem mobile, 2.5rem desktop)
- **DashboardTable**: Added `min-width: 700px` to table for proper horizontal scroll on mobile
- **CapitalCallsTable**: Added `min-width: 500px` for horizontal scroll
- **NavChart**: Angled X-axis labels -30deg with `preserveStartEnd` interval to prevent overlap, increased axis height to 50px
- **DocumentList**: Made download link a bordered button, full-width on mobile for better tap target

### Task 3: Number Formatting Consistency
- Verified all components use identical `Intl.NumberFormat` patterns (EUR, 0 decimals, locale-aware)
- Verified all date formatting uses `Intl.DateTimeFormat` with en-GB/it-IT, 2-digit day, short month, numeric year
- No changes needed -- formatting was already consistent

### Task 4: Login Page Fade-in Animation
- Added CSS `@keyframes fadeIn` with opacity 0->1 and translateY 10px->0
- Applied `animation: fadeIn 0.6s ease-out` to login Card
- Added `prefers-reduced-motion: reduce` media query to disable animation for accessibility

### Task 5: Production Build Verification
- `npm run build` passed cleanly (122 static pages generated)
- `npx tsc --noEmit` passed with zero errors

## Deviations from Plan

None -- plan executed exactly as written.

## Commits

| Hash | Message |
|------|---------|
| f4e2aa9 | feat(07-04): portal nav integration, responsive polish, login animation |
