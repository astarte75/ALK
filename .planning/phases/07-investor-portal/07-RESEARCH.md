# Phase 7: Investor Portal - Research

**Researched:** 2026-03-15
**Domain:** Supabase Auth + PostgreSQL + Storage with Next.js 15 App Router
**Confidence:** HIGH

## Summary

The Investor Portal requires integrating Supabase (Auth, PostgreSQL, Storage) into an existing Next.js 15 App Router site that uses styled-components and next-intl. The `@supabase/ssr` package (v0.9.x) provides cookie-based server-side authentication that integrates cleanly with Next.js middleware. Row-Level Security (RLS) on PostgreSQL tables ensures each investor sees only their own data without any application-level filtering logic. Supabase Storage with private buckets and RLS policies protects PDF documents.

The key integration challenge is combining the existing next-intl middleware with Supabase auth session refresh. This is a well-documented pattern: run next-intl routing first to get the response object, then pass it to the Supabase session updater. For the NAV chart, Recharts 3.x is the recommended choice -- it is React-native, composable, and trivially themed via CSS custom properties.

**Primary recommendation:** Use `@supabase/ssr` + `@supabase/supabase-js` for auth and data, Recharts for the NAV chart, private Supabase Storage bucket with signed URLs for documents.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Data Source:** Supabase (PostgreSQL) for all investor/fund position data
- **Schema:** `investors`, `fund_positions`, `capital_calls`, `nav_history`, `documents` tables
- **Authentication:** Supabase Auth with email+password, server-side sessions via `@supabase/ssr`
- **Account creation:** Admin creates accounts via Supabase dashboard (no admin panel in v1)
- **Session management:** Server-side with httpOnly cookies, verified in middleware
- **RLS:** On all investor tables -- each investor sees only their own data
- **Storage:** Supabase Storage for PDF documents with RLS
- **Dashboard scope:** Summary table, fund drill-down, NAV chart, document downloads
- **Scale:** ~100 investors, quarterly updates
- **Portal routes:** `/investitori` (IT) / `/en/investors` (EN)
- **NOT statically generated:** Always server-rendered or client-fetched behind auth
- **Env vars:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Password reset:** Deferred to Phase 10
- **Magic link auth:** Deferred to Phase 10

### Claude's Discretion
- Chart library for NAV graph (research concluded: Recharts)
- Specific RLS policy patterns
- Database schema details (indexes, types, constraints)
- Middleware integration approach

### Deferred Ideas (OUT OF SCOPE)
- Magic link authentication (Phase 10)
- Password reset flow (Phase 10)
- Custom admin panel for investor management (v2)
- Automated data import from gestionale (v2)
- Email notifications for new reports (v2)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PORTAL-01 | Login page at `/investitori` (IT) / `/en/investors` (EN) with authentication | Supabase Auth + @supabase/ssr server client, login form with `signInWithPassword` |
| PORTAL-02 | Personalized investor dashboard showing fund positions | RLS policies on `fund_positions` table, server component data fetching with `getUser()` |
| PORTAL-03 | Protected routes -- unauthenticated users redirected to login | Middleware combining next-intl + Supabase auth, `getUser()` check in middleware |
| PORTAL-04 | Portal UI matches dark premium aesthetic | CSS custom properties (existing theme), styled-components, Recharts dark theme |
| PORTAL-05 | Secure session management (httpOnly cookies, CSRF, session expiry) | `@supabase/ssr` handles httpOnly cookies + SameSite automatically, PKCE flow |
| PORTAL-06 | Portal works in both Italian and English | next-intl translations for portal UI, locale-aware routing already in place |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@supabase/supabase-js` | ^2.99.x | Supabase client (auth, database, storage) | Official SDK, typed, isomorphic |
| `@supabase/ssr` | ^0.9.x | Server-side auth with cookie-based sessions | Official SSR package, replaces deprecated auth-helpers |
| `recharts` | ^3.8.x | NAV line chart | React-native, composable, easy dark theming, no canvas (SVG) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `styled-components` | 6.x (existing) | Portal UI styling | All portal components |
| `next-intl` | 4.x (existing) | Bilingual portal labels | All user-facing text |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts | Chart.js (react-chartjs-2) | Canvas-based, harder to theme with CSS vars, extra wrapper needed |
| Recharts | Nivo | Heavier bundle, more features than needed for single line chart |
| Recharts | Lightweight-charts (TradingView) | Overkill for quarterly NAV, financial-specific |

**Installation:**
```bash
npm install @supabase/supabase-js @supabase/ssr recharts
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/supabase/
│   ├── client.ts          # Browser client (createBrowserClient)
│   ├── server.ts          # Server client (createServerClient + cookies)
│   ├── middleware.ts       # updateSession helper for middleware
│   └── types.ts           # Database types (generated or manual)
├── app/[locale]/
│   ├── investitori/        # IT portal routes
│   │   ├── page.tsx        # Login page (public)
│   │   ├── layout.tsx      # Portal layout (auth check wrapper)
│   │   ├── dashboard/
│   │   │   └── page.tsx    # Summary table (protected)
│   │   ├── fondi/
│   │   │   └── [slug]/
│   │   │       └── page.tsx # Fund drill-down (protected)
│   │   └── documenti/
│   │       └── page.tsx    # Documents list (protected)
│   └── ...
├── components/portal/
│   ├── LoginForm.tsx       # Email+password form (client component)
│   ├── DashboardTable.tsx  # Fund positions summary
│   ├── FundDetail.tsx      # Capital calls list
│   ├── NavChart.tsx        # Recharts line chart (client component)
│   ├── DocumentList.tsx    # PDF download links
│   └── PortalLayout.tsx    # Sidebar/nav for portal area
```

### Pattern 1: Supabase Server Client (Next.js 15)
**What:** Create a server-side Supabase client that reads/writes cookies via `next/headers`
**When to use:** All Server Components, Server Actions, Route Handlers

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component -- middleware will handle cookie writes
          }
        },
      },
    }
  )
}
```

### Pattern 2: Supabase Browser Client
**What:** Singleton browser client for Client Components (login form, chart interactions)
**When to use:** `'use client'` components that need auth actions (login, logout)

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Pattern 3: Combined Middleware (next-intl + Supabase)
**What:** Extend existing next-intl middleware to also refresh Supabase auth sessions
**When to use:** Every request -- handles both i18n routing and auth token refresh

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware({
  ...routing,
  localeDetection: false,
})

// Portal paths that require authentication
const PORTAL_PATHS = ['/investitori/dashboard', '/investitori/fondi', '/investitori/documenti',
                      '/investors/dashboard', '/investors/fondi', '/investors/documenti']

function isPortalPath(pathname: string): boolean {
  return PORTAL_PATHS.some(p => pathname.includes(p))
}

export async function middleware(request: NextRequest) {
  // Step 1: Run next-intl routing first
  const response = handleI18nRouting(request)

  // Step 2: Refresh Supabase auth session (updates cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Step 3: Protect portal routes
  if (isPortalPath(request.nextUrl.pathname) && !user) {
    // Determine locale from URL
    const isEn = request.nextUrl.pathname.startsWith('/en/')
    const loginPath = isEn ? '/en/investors' : '/investitori'
    const url = request.nextUrl.clone()
    url.pathname = loginPath
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/', '/(it|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)', ],
}
```

### Pattern 4: Protecting Server Components
**What:** Always verify auth in Server Components that fetch investor data
**When to use:** Every portal page component

```typescript
// src/app/[locale]/investitori/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(locale === 'en' ? '/en/investors' : '/investitori')
  }

  // RLS automatically filters to this user's data
  const { data: positions } = await supabase
    .from('fund_positions')
    .select('*, fund:funds(name, slug)')
    .order('fund_name')

  return <DashboardTable positions={positions} />
}
```

### Anti-Patterns to Avoid
- **Never trust `getSession()` on server:** Always use `getUser()` -- `getSession()` reads from cookies without revalidation and can be spoofed
- **Never use `NEXT_PUBLIC_` for service role key:** `SUPABASE_SERVICE_ROLE_KEY` must be server-only
- **Never use `get`/`set`/`remove` cookie methods:** Only use `getAll`/`setAll` with `@supabase/ssr`
- **Never skip middleware session refresh:** Without it, expired tokens cause silent auth failures
- **Never do client-side data filtering for security:** RLS on the database is the security boundary, not JS code

## Database Schema Design

### Complete Schema

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Investors table (linked to Supabase Auth users)
create table investors (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  company text,
  fiscal_code text,          -- Italian codice fiscale
  language text default 'it' check (language in ('it', 'en')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_investors_auth_user on investors(auth_user_id);

-- Funds table (reference data, not per-investor)
create table funds (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  fund_type text not null check (fund_type in ('PE', 'VC', 'PIPE')),
  vintage_year integer,
  currency text default 'EUR',
  status text default 'active' check (status in ('active', 'closed', 'fundraising')),
  created_at timestamptz default now()
);

-- Fund positions (per investor, per fund)
create table fund_positions (
  id uuid primary key default uuid_generate_v4(),
  investor_id uuid not null references investors(id) on delete cascade,
  fund_id uuid not null references funds(id) on delete cascade,
  committed_capital numeric(15,2) not null default 0,
  invested_capital numeric(15,2) not null default 0,
  distributions numeric(15,2) not null default 0,
  current_nav numeric(15,2) not null default 0,
  nav_date date,             -- Date of last NAV valuation
  updated_at timestamptz default now(),
  unique(investor_id, fund_id)
);

create index idx_fund_positions_investor on fund_positions(investor_id);
create index idx_fund_positions_fund on fund_positions(fund_id);

-- Capital calls (individual operations per investor per fund)
create table capital_calls (
  id uuid primary key default uuid_generate_v4(),
  investor_id uuid not null references investors(id) on delete cascade,
  fund_id uuid not null references funds(id) on delete cascade,
  call_date date not null,
  call_type text not null check (call_type in ('capital_call', 'distribution', 'recallable')),
  amount numeric(15,2) not null,
  description text,
  created_at timestamptz default now()
);

create index idx_capital_calls_investor on capital_calls(investor_id);
create index idx_capital_calls_fund_date on capital_calls(fund_id, call_date);

-- NAV history (time series per investor per fund, quarterly)
create table nav_history (
  id uuid primary key default uuid_generate_v4(),
  investor_id uuid not null references investors(id) on delete cascade,
  fund_id uuid not null references funds(id) on delete cascade,
  report_date date not null,
  nav_value numeric(15,2) not null,
  created_at timestamptz default now(),
  unique(investor_id, fund_id, report_date)
);

create index idx_nav_history_investor_fund on nav_history(investor_id, fund_id);
create index idx_nav_history_date on nav_history(report_date);

-- Documents metadata (files stored in Supabase Storage)
create table investor_documents (
  id uuid primary key default uuid_generate_v4(),
  investor_id uuid not null references investors(id) on delete cascade,
  fund_id uuid references funds(id) on delete set null,
  title text not null,
  document_type text not null check (document_type in (
    'quarterly_report', 'annual_report', 'investor_letter',
    'tax_document', 'capital_call_notice', 'distribution_notice', 'other'
  )),
  storage_path text not null,  -- Path in Supabase Storage bucket
  file_size integer,
  uploaded_at timestamptz default now()
);

create index idx_documents_investor on investor_documents(investor_id);
create index idx_documents_fund on investor_documents(fund_id);
```

### Schema Design Rationale

- **`investors.auth_user_id`** links to Supabase Auth -- this is the FK that RLS policies use via `auth.uid()`
- **`funds` table** is shared reference data (not per-investor) -- admin populates this
- **`fund_positions`** has a unique constraint on `(investor_id, fund_id)` -- one row per investor per fund
- **`nav_history`** has unique on `(investor_id, fund_id, report_date)` -- quarterly snapshots
- **`numeric(15,2)`** for monetary values -- handles up to 9,999,999,999,999.99 EUR
- **All investor-facing tables** have `investor_id` FK for RLS filtering

## Row-Level Security (RLS) Policies

### Enable RLS on All Tables

```sql
alter table investors enable row level security;
alter table fund_positions enable row level security;
alter table capital_calls enable row level security;
alter table nav_history enable row level security;
alter table investor_documents enable row level security;
alter table funds enable row level security;

-- Funds are readable by all authenticated users (reference data)
create policy "Authenticated users can read funds"
  on funds for select
  to authenticated
  using (true);

-- Investors can only see their own profile
create policy "Investors can view own profile"
  on investors for select
  to authenticated
  using (auth_user_id = auth.uid());

-- Fund positions: investor sees only their own
create policy "Investors can view own fund positions"
  on fund_positions for select
  to authenticated
  using (
    investor_id in (
      select id from investors where auth_user_id = auth.uid()
    )
  );

-- Capital calls: investor sees only their own
create policy "Investors can view own capital calls"
  on capital_calls for select
  to authenticated
  using (
    investor_id in (
      select id from investors where auth_user_id = auth.uid()
    )
  );

-- NAV history: investor sees only their own
create policy "Investors can view own NAV history"
  on nav_history for select
  to authenticated
  using (
    investor_id in (
      select id from investors where auth_user_id = auth.uid()
    )
  );

-- Documents: investor sees only their own
create policy "Investors can view own documents"
  on investor_documents for select
  to authenticated
  using (
    investor_id in (
      select id from investors where auth_user_id = auth.uid()
    )
  );
```

### RLS Performance Optimization

For ~100 investors with quarterly updates, the subquery pattern `investor_id in (select id from investors where auth_user_id = auth.uid())` is perfectly adequate. The index on `investors.auth_user_id` ensures the subquery is fast. For larger scale, consider a helper function:

```sql
-- Optional: helper function for cleaner policies
create or replace function get_investor_id()
returns uuid
language sql
security definer
stable
as $$
  select id from investors where auth_user_id = auth.uid() limit 1;
$$;

-- Then policies become:
create policy "Investors can view own fund positions"
  on fund_positions for select
  to authenticated
  using (investor_id = get_investor_id());
```

## Supabase Storage + RLS for Documents

### Setup

```sql
-- Create a private bucket for investor documents
-- (Done via Supabase dashboard or SQL)
insert into storage.buckets (id, name, public)
values ('investor-documents', 'investor-documents', false);

-- RLS policy: investors can only read their own files
-- Files organized as: {investor_id}/{fund_slug}/{filename}
create policy "Investors can read own documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'investor-documents'
    and (storage.foldername(name))[1] in (
      select id::text from investors where auth_user_id = auth.uid()
    )
  );
```

### Downloading Files via Signed URLs

```typescript
// Server Action or Route Handler for document download
// src/app/api/documents/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RLS ensures only owner can query this document
  const { data: doc } = await supabase
    .from('investor_documents')
    .select('storage_path, title')
    .eq('id', id)
    .single()

  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Generate signed URL (expires in 60 seconds)
  const { data: signedUrl } = await supabase.storage
    .from('investor-documents')
    .createSignedUrl(doc.storage_path, 60)

  if (!signedUrl) {
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })
  }

  return NextResponse.redirect(signedUrl.signedUrl)
}
```

**Alternative: Direct download from server** (avoids exposing signed URL to client):

```typescript
// Download file bytes on server and stream to client
const { data: fileData, error } = await supabase.storage
  .from('investor-documents')
  .download(doc.storage_path)

if (error || !fileData) {
  return NextResponse.json({ error: 'Download failed' }, { status: 500 })
}

return new NextResponse(fileData, {
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${doc.title}.pdf"`,
  },
})
```

## NAV Chart with Recharts

### Why Recharts
- **React-native:** Built with React components, composable via JSX
- **SVG-based:** No canvas -- works naturally with CSS/styled-components theming
- **Lightweight enough:** ~45KB gzipped for what we need (LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer)
- **SSR note:** Must be rendered in a `'use client'` component (uses browser APIs), but this is fine since the chart is behind auth anyway
- **Tree-shakeable:** Import only LineChart components, not the entire library

### Code Example: NAV Chart Component

```typescript
'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import styled from 'styled-components'
import { colors } from '@/styles/theme'

interface NavDataPoint {
  date: string       // "2024-Q1", "2024-Q2", etc.
  nav: number
}

interface NavChartProps {
  data: NavDataPoint[]
  fundName: string
}

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  padding: 1rem 0;
`

const CustomTooltipWrapper = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.75rem 1rem;
  border-radius: 4px;

  p {
    margin: 0;
    color: var(--color-text-primary);
    font-family: var(--font-body);
    font-size: 0.875rem;
  }
`

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <CustomTooltipWrapper>
      <p>{label}</p>
      <p style={{ color: 'var(--color-accent-teal)' }}>
        NAV: {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}
      </p>
    </CustomTooltipWrapper>
  )
}

export default function NavChart({ data, fundName }: NavChartProps) {
  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            stroke="var(--color-text-secondary)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          />
          <YAxis
            stroke="var(--color-text-secondary)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="nav"
            stroke="#2EC4B6"
            strokeWidth={2}
            dot={{ fill: '#2EC4B6', r: 4 }}
            activeDot={{ r: 6, fill: '#D4A843' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auth session management | Custom JWT + cookie logic | `@supabase/ssr` | PKCE flow, token refresh, httpOnly cookies all handled |
| Row-level data filtering | Application-level WHERE clauses | PostgreSQL RLS policies | Security at database level, impossible to bypass from client |
| PDF access control | Custom auth middleware per download | Supabase Storage RLS + signed URLs | Integrated with auth, time-limited URLs |
| Cookie sync in middleware | Manual cookie read/write | `@supabase/ssr` `getAll`/`setAll` | Handles chunked cookies, encoding, options |
| Chart rendering | Custom SVG/Canvas chart | Recharts | Axes, tooltips, responsiveness, animations built-in |
| Number formatting | Custom currency formatters | `Intl.NumberFormat` | Browser-native, locale-aware, handles EUR formatting |

## Common Pitfalls

### Pitfall 1: Using `getSession()` Instead of `getUser()` in Server Code
**What goes wrong:** Session data read from cookies can be spoofed. An attacker could modify the JWT in cookies.
**Why it happens:** `getSession()` is more convenient and developers assume cookies are trustworthy.
**How to avoid:** Always call `supabase.auth.getUser()` in Server Components and Route Handlers. It makes a request to Supabase Auth server to verify the token.
**Warning signs:** Using `getSession()` anywhere in server-side code.

### Pitfall 2: Forgetting to Refresh Session in Middleware
**What goes wrong:** Expired auth tokens cause silent failures. Users appear logged out randomly.
**Why it happens:** Supabase tokens expire (default 1 hour). Without middleware refresh, Server Components get stale tokens.
**How to avoid:** Middleware MUST call `supabase.auth.getUser()` on every request to trigger token refresh.
**Warning signs:** Users report intermittent logouts, especially after idle periods.

### Pitfall 3: Using Old Cookie Methods (`get`/`set`/`remove`)
**What goes wrong:** Auth breaks silently. The `@supabase/ssr` package chunks large cookies and only `getAll`/`setAll` handle this correctly.
**Why it happens:** Older tutorials and the deprecated `@supabase/auth-helpers-nextjs` used individual cookie methods.
**How to avoid:** Only use `getAll()` and `setAll()` -- never `get()`, `set()`, or `remove()`.
**Warning signs:** Import of `CookieOptions` type from old package, individual cookie operations.

### Pitfall 4: RLS Policies Without Indexes
**What goes wrong:** Slow queries as the database does full table scans for policy checks.
**Why it happens:** RLS policies add implicit WHERE clauses, but developers forget to index the columns used in those clauses.
**How to avoid:** Always index `investor_id` on all investor-facing tables, and `auth_user_id` on the `investors` table.
**Warning signs:** Dashboard pages loading slowly despite small data volumes.

### Pitfall 5: Public Storage Bucket Bypassing RLS
**What goes wrong:** All PDFs become publicly accessible to anyone with the URL.
**Why it happens:** Creating a public bucket instead of private. Supabase allows both, and public buckets bypass all RLS.
**How to avoid:** Explicitly set `public: false` when creating the bucket. Use signed URLs for downloads.
**Warning signs:** Files accessible without auth token in the request.

### Pitfall 6: Exposing SUPABASE_SERVICE_ROLE_KEY
**What goes wrong:** The service role key bypasses all RLS -- anyone with it has full database access.
**Why it happens:** Accidentally using `NEXT_PUBLIC_` prefix, or using service role key in client components.
**How to avoid:** Never prefix with `NEXT_PUBLIC_`. Only use in server-side code (Route Handlers, Server Actions). The anon key + RLS is the correct pattern for authenticated user access.
**Warning signs:** Any import of `SUPABASE_SERVICE_ROLE_KEY` in a file with `'use client'` directive.

## Environment Variables

```bash
# .env.local
# Public (safe for client -- used with RLS, not admin access)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-only (NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Vercel deployment:** Add all three as Environment Variables in Vercel dashboard. `NEXT_PUBLIC_*` vars are automatically available at build time. `SUPABASE_SERVICE_ROLE_KEY` is only available server-side.

**Note on naming:** The CONTEXT.md specifies `SUPABASE_URL` and `SUPABASE_ANON_KEY` (without `NEXT_PUBLIC_`). However, `@supabase/ssr` requires the URL and anon key to be available in both server and browser contexts for the `createBrowserClient`. Using `NEXT_PUBLIC_` prefix is the standard Supabase pattern and is safe because the anon key is designed for client use (RLS enforces security, not the key). The service role key remains unprefixed.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | 2024 | Single package for all frameworks, `getAll`/`setAll` API |
| Individual cookie `get`/`set`/`remove` | Batch `getAll`/`setAll` | `@supabase/ssr` 0.4+ | Handles chunked cookies, prevents auth breakage |
| `getSession()` for server auth | `getUser()` for server auth | Supabase security update 2024 | Prevents JWT spoofing via cookies |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` naming | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Recent docs | Same key, renamed for clarity. Both work. |

**Note:** Some Supabase docs now reference `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`. They are the same key. The project can use either naming convention; `ANON_KEY` is still widely used and functional.

## Open Questions

1. **Supabase project region**
   - What we know: Vercel deploys to edge, Supabase projects are region-specific
   - What's unclear: Which Supabase region minimizes latency for Italian users
   - Recommendation: Use `eu-central-1` (Frankfurt) or `eu-south-1` (Milan if available) for GDPR compliance and low latency

2. **Login page routing structure**
   - What we know: Login at `/investitori`, dashboard at `/investitori/dashboard`
   - What's unclear: Whether login and dashboard should be separate routes or same route with conditional rendering
   - Recommendation: Separate routes. Login page is public (no auth required), dashboard routes are protected. Cleaner middleware logic.

3. **Data seeding for development**
   - What we know: Schema design is ready, ~100 investors
   - What's unclear: How to populate test data for development
   - Recommendation: Create a seed script (SQL file) with sample investors, funds, positions, and NAV data. Run via Supabase SQL editor or migration.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.58.x |
| Config file | `playwright.config.ts` |
| Quick run command | `npx playwright test tests/smoke.spec.ts` |
| Full suite command | `npx playwright test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PORTAL-01 | Login page renders at /investitori and /en/investors | e2e | `npx playwright test tests/portal-auth.spec.ts` | No -- Wave 0 |
| PORTAL-02 | Dashboard shows fund positions for logged-in user | e2e | `npx playwright test tests/portal-dashboard.spec.ts` | No -- Wave 0 |
| PORTAL-03 | Unauthenticated users redirected to login | e2e | `npx playwright test tests/portal-auth.spec.ts` | No -- Wave 0 |
| PORTAL-04 | Portal UI uses dark theme tokens | e2e (visual) | `npx playwright test tests/portal-theme.spec.ts` | No -- Wave 0 |
| PORTAL-05 | Session uses httpOnly cookies | e2e | `npx playwright test tests/portal-auth.spec.ts` | No -- Wave 0 |
| PORTAL-06 | Portal works in IT and EN | e2e | `npx playwright test tests/portal-i18n.spec.ts` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx playwright test tests/portal-auth.spec.ts --headed`
- **Per wave merge:** `npx playwright test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/portal-auth.spec.ts` -- covers PORTAL-01, PORTAL-03, PORTAL-05
- [ ] `tests/portal-dashboard.spec.ts` -- covers PORTAL-02
- [ ] `tests/portal-i18n.spec.ts` -- covers PORTAL-06
- [ ] Supabase test project or mock setup for e2e tests
- [ ] Test user credentials in `.env.test` (not committed)

## Sources

### Primary (HIGH confidence)
- [Supabase SSR - Creating a Client](https://supabase.com/docs/guides/auth/server-side/creating-a-client) -- server/browser client setup patterns
- [Supabase SSR - Next.js Setup](https://supabase.com/docs/guides/auth/server-side/nextjs) -- official Next.js integration guide
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) -- RLS policy syntax and patterns
- [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control) -- private buckets, RLS on storage.objects
- [next-intl + Supabase middleware discussion](https://github.com/amannn/next-intl/discussions/422) -- combined middleware pattern
- [@supabase/ssr npm](https://www.npmjs.com/package/@supabase/ssr) -- version 0.9.0
- [@supabase/supabase-js npm](https://www.npmjs.com/package/@supabase/supabase-js) -- version 2.99.1
- [recharts npm](https://www.npmjs.com/package/recharts) -- version 3.8.0

### Secondary (MEDIUM confidence)
- [Server-Side Auth in Next.js with Supabase](https://www.ryankatayi.com/blog/server-side-auth-in-next-js-with-supabase-my-setup) -- verified code patterns matching official docs
- [Best React Chart Libraries 2025](https://blog.logrocket.com/best-react-chart-libraries-2025/) -- Recharts comparison context

### Tertiary (LOW confidence)
- Bundle size for Recharts 3.8.0 -- could not extract from Bundlephobia (JS-rendered page). Estimated ~45KB gzipped based on older reports. Validate during implementation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- official Supabase docs, npm versions verified
- Architecture: HIGH -- combined middleware pattern verified from next-intl repo discussion and Supabase docs
- Database schema: MEDIUM -- designed from domain knowledge, standard PE/VC patterns. Not from an authoritative financial schema source.
- RLS policies: HIGH -- syntax verified from Supabase official docs
- Storage patterns: HIGH -- private bucket + signed URL pattern from Supabase docs
- Chart library: HIGH -- Recharts well-documented, React-native, suitable for use case
- Pitfalls: HIGH -- documented in official Supabase docs (getUser vs getSession, cookie methods)

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (Supabase packages move moderately fast, check versions before implementation)
