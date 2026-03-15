# Phase 8: Data Import & Verification — Context

## Goal
The investor portal contains real Alkemia fund data, real investor accounts, and an admin dashboard to verify data integrity. The portal is ready for production use with real investors.

## Key Decisions
- Import from Excel reports (AMARONE_Report.xlsx, AFEX_Report.xlsx) — not from API
- Investors created without Auth accounts initially (email/auth linked later)
- `is_admin` flag on investors table for admin dashboard access
- Admin RLS policies via `is_admin()` SQL function
- Pro-rata NAV calculation for investors without explicit CTV NAV
- Amarone management fees/setup costs not detailed per investor in Excel — deferred
- Plan 08-04 (E2E verification with real investor) deferred to post-launch

## Data Imported
- **Amarone**: 14 investors, €20.9M committed, 93 capital calls, 7 NAV quarters, 3 holdings
- **Alkemia Food Excellence I**: 27 investors, €15.5M committed, 126 capital calls, NAV history, holdings
- **Total**: 40+ unique investors, 41 positions, 219 capital calls

## Dependencies
- Supabase project (eu-central-1) — already provisioned in Phase 7
- Excel reports from user — provided
