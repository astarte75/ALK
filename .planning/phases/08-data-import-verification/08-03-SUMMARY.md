---
phase: "08"
plan: "03"
subsystem: admin-dashboard
tags: [admin, dashboard, operations, impersonation, rls]
key_files:
  created:
    - src/app/[locale]/(portal)/investitori/admin/page.tsx
    - src/app/[locale]/(portal)/investitori/admin/operazioni/page.tsx
    - src/app/[locale]/(portal)/investitori/admin/investitore/[investorId]/page.tsx
    - src/app/[locale]/(portal)/investitori/admin/investitore/[investorId]/fondi/[slug]/page.tsx
    - src/components/portal/AdminDashboard.tsx
    - src/components/portal/AdminOperations.tsx
  modified:
    - src/lib/supabase/types.ts
    - src/lib/supabase/middleware.ts
    - src/components/portal/PortalHeader.tsx
    - src/components/portal/DashboardTable.tsx
    - src/app/[locale]/(portal)/investitori/dashboard/page.tsx
    - src/app/[locale]/(portal)/investitori/fondi/[slug]/page.tsx
decisions:
  - is_admin boolean column on investors table (default false)
  - is_admin() SQL function (SECURITY DEFINER) for RLS policies
  - Admin RLS policies on investors, fund_positions, capital_calls, nav_history, investor_documents
  - Summary counts exclude investors with zero commitment (not real investors)
  - Investor impersonation via /admin/investitore/[id] mirrors real investor routes
  - Fixed column widths in operations table based on max content length across full dataset
metrics:
  completed: "2026-03-15"
  tasks_completed: 9
  tasks_total: 9
---

# Phase 8 Plan 3: Admin Dashboard — Summary

Built complete admin area for data verification and investor management.

## What Was Done

### Database & Auth
- Added `is_admin` column to investors table via Supabase migration
- Created `is_admin()` SQL helper function (SECURITY DEFINER)
- Added admin SELECT policies on 5 tables (investors, fund_positions, capital_calls, nav_history, investor_documents)
- Middleware admin route protection with is_admin check

### Admin Dashboard (/investitori/admin)
- Summary cards: funds, investors, positions, committed capital, NAV, operations, NAV entries, holdings
- Per-fund breakdown: expandable cards with investor table + totals row
- Consistency checks (expandable with affected records):
  - Investors without Auth account
  - Investors without email
  - Positions with NAV = 0 (only if committed > 0)
  - Duplicate positions
  - Empty investor records (zero commitment)
- Link to operations page

### Operations Page (/investitori/admin/operazioni)
- Full table of all capital calls with filters: fund, investor, type, date range
- Fixed column widths based on max content length (stable across filter changes)
- Running total row
- Color-coded type badges

### Investor Impersonation
- /admin/investitore/[id] — dashboard view as investor
- /admin/investitore/[id]/fondi/[slug] — fund detail with stats, holdings, calls, NAV chart, documents
- Gold "Vedi come investitore" label
- DashboardTable accepts fundLinkPrefix prop for admin routing

### Portal Fixes
- Dashboard and fund detail queries now filter by investor_id (admin RLS was exposing all records)
- PortalHeader shows gold "Admin" button for admin users

## Commits
| Hash | Message |
|------|---------|
| cd1a75f | feat(portal): admin dashboard with operations view and investor impersonation |
| 8c34b57 | feat(portal): full fund detail in admin investor impersonation view |
| 0113099 | feat(portal): investor filter in operations, fixed column widths, docs update |
