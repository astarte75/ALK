# Phase 7 Context: Investor Portal

**Phase goal:** Authenticated investors can log in to a dedicated area and view their fund positions, drill down into operations, download documents, and track NAV over time.

**Requirements:** PORTAL-01, PORTAL-02, PORTAL-03, PORTAL-04, PORTAL-05, PORTAL-06

---

## Decisions

### A. Data Source — Supabase (PostgreSQL)

- **Choice:** Supabase as dedicated database for all investor/fund position data
- **Schema scope:** `investors` (linked to Supabase Auth users), `fund_positions` (per-investor per-fund summary), `capital_calls` (individual operations/calls), `nav_history` (NAV time series per fund per investor), `documents` (metadata + Supabase Storage for PDFs)
- **Update frequency:** Quarterly, manual by Team Alkemia initially (automation deferred)
- **Scale:** ~100 investors
- **Data entry:** Team Alkemia manages data directly via Supabase dashboard (no custom admin panel in v1)
- **NOT Contentful:** Investor data is confidential and requires row-level security — Contentful has no ACL for this

### B. Authentication — Supabase Auth

- **Provider:** Supabase Auth (built-in, same project as database)
- **Login method:** Email + password (magic link deferred to Phase 10)
- **Account creation:** Admin creates accounts via Supabase dashboard
- **Session management:** Server-side with `@supabase/ssr` — httpOnly cookies, verified in Next.js middleware
- **Protected routes:** Middleware redirects unauthenticated users to login page
- **CSRF:** Handled by Supabase SSR cookie strategy (SameSite + httpOnly)
- **Password reset:** Deferred to Phase 10 (todo added)
- **No client-side tokens:** JWT never exposed in localStorage or client JS

### C. Dashboard Scope

**Summary view (landing after login):**
- Table showing all funds where investor has positions
- Columns: fund name, committed capital, invested capital, distributions, current NAV
- Each row links to fund drill-down

**Fund drill-down:**
- Individual operations / capital calls listed chronologically
- Details per operation (date, type, amount)

**NAV chart:**
- Line chart showing NAV over time per fund
- Data from `nav_history` table (quarterly data points)
- Library TBD by researcher (lightweight, SSR-compatible — likely Recharts or Chart.js)

**Documents:**
- Downloadable PDFs per fund (quarterly reports, investor letters, tax documents)
- Files stored in Supabase Storage with RLS policies
- Organized by fund and document type

**Portal UI:**
- Dark premium aesthetic matching rest of site
- Bilingual (IT default at `/investitori`, EN at `/en/investors`)
- Responsive (mobile-friendly tables/charts)

---

## Architecture Constraints

- Portal pages are **NOT statically generated** — always server-rendered or client-fetched behind auth
- Supabase client uses **server-side only** for data fetching (no `NEXT_PUBLIC_` keys for investor data)
- Row-Level Security (RLS) on all investor tables — each investor sees only their own data
- Supabase project URL and anon key needed as env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (never exposed to client)

---

## Deferred Items

- Magic link authentication → Phase 10
- Password reset flow → Phase 10
- Custom admin panel for investor management → Future (v2)
- Automated data import from gestionale → Future (when gestionale exists)
- Email notifications for new reports → Future (v2)

---

## Code Context

**Existing patterns to follow:**
- `src/app/[locale]/` — all routes under locale segment (portal routes follow same pattern)
- `src/lib/contentful/` — data layer pattern (create equivalent `src/lib/supabase/` for portal)
- `src/components/cards/` — card components (reuse pattern for fund position cards)
- `src/styles/` — theme tokens, breakpoints (portal uses same design system)
- Middleware exists at `src/middleware.ts` (next-intl) — extend for auth checks on portal routes

**New dependencies:**
- `@supabase/supabase-js` — Supabase client
- `@supabase/ssr` — Next.js SSR integration (cookie-based sessions)
- Chart library (TBD — Recharts or Chart.js for NAV graph)

---

*Created: 2026-03-15*
*Decisions made with: Ricky (project owner)*
