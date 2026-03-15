import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import PortalHeader from '@/components/portal/PortalHeader'
import AdminDashboard from '@/components/portal/AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const t = await getTranslations('portal.admin')

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(locale === 'en' ? '/en/investitori' : '/investitori')
  }

  // Admin check (also enforced in middleware, but double-check)
  const { data: currentInvestor } = await supabase
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()

  if (!currentInvestor?.is_admin) {
    redirect(locale === 'en' ? '/en/investitori/dashboard' : '/investitori/dashboard')
  }

  // Fetch all data for admin overview using service-level queries via RLS bypass
  // Since the user is admin, RLS should allow full access — but we use specific queries

  // Funds
  const { data: funds } = await supabase
    .from('funds')
    .select('id, name, slug, fund_type, vintage_year, status, irr')
    .order('name')

  // All investors
  const { data: investors } = await supabase
    .from('investors')
    .select('id, full_name, email, auth_user_id, is_admin')
    .order('full_name')

  // All positions with fund info
  const { data: positions } = await supabase
    .from('fund_positions')
    .select('id, investor_id, fund_id, committed_capital, invested_capital, distributions, current_nav, quota_class')

  // Counts
  const { count: callCount } = await supabase
    .from('capital_calls')
    .select('id', { count: 'exact', head: true })

  const { count: navCount } = await supabase
    .from('nav_history')
    .select('id', { count: 'exact', head: true })

  const { count: holdingCount } = await supabase
    .from('fund_holdings')
    .select('id', { count: 'exact', head: true })

  // Per-fund call counts
  const { data: callsPerFund } = await supabase
    .from('capital_calls')
    .select('fund_id')

  // Per-fund NAV counts
  const { data: navPerFund } = await supabase
    .from('nav_history')
    .select('fund_id')

  // Per-fund holding counts
  const { data: holdingsPerFund } = await supabase
    .from('fund_holdings')
    .select('fund_id')

  // Build lookup maps
  const investorNameMap: Record<string, string> = {}
  for (const inv of investors ?? []) {
    investorNameMap[inv.id] = inv.full_name
  }
  const fundNameMap: Record<string, string> = {}
  for (const f of funds ?? []) {
    fundNameMap[f.id] = f.name
  }

  // Identify real investors: those with at least one position with committed > 0
  const realPositions = (positions ?? []).filter(p => p.committed_capital > 0)
  const investorIdsWithCommitment = new Set(realPositions.map(p => p.investor_id))
  const realInvestors = (investors ?? []).filter(i => investorIdsWithCommitment.has(i.id))

  // Investors without any real commitment (empty records from import)
  const emptyInvestorRecords = (investors ?? [])
    .filter(i => !investorIdsWithCommitment.has(i.id) && !i.is_admin)
    .map(i => i.full_name)

  // Consistency checks — only on real investors
  const noAuthRecords = realInvestors.filter(i => !i.auth_user_id).map(i => i.full_name)
  const noEmailRecords = realInvestors.filter(i => !i.email).map(i => i.full_name)
  const noNavRecords = (positions ?? []).filter(p => p.current_nav === 0 && p.committed_capital > 0).map(p => {
    const invName = investorNameMap[p.investor_id] ?? '?'
    const fundName = fundNameMap[p.fund_id] ?? '?'
    return `${invName} — ${fundName}`
  })

  // Duplicate positions check
  const positionKeys = (positions ?? []).map(p => `${p.investor_id}:${p.fund_id}`)
  const seen = new Set<string>()
  const duplicateRecords: string[] = []
  for (let i = 0; i < positionKeys.length; i++) {
    if (seen.has(positionKeys[i])) {
      const p = (positions ?? [])[i]
      const invName = investorNameMap[p.investor_id] ?? '?'
      const fundName = fundNameMap[p.fund_id] ?? '?'
      duplicateRecords.push(`${invName} — ${fundName}`)
    }
    seen.add(positionKeys[i])
  }

  // Build per-fund call/nav/holding count maps
  const callCountByFund: Record<string, number> = {}
  for (const c of callsPerFund ?? []) {
    callCountByFund[c.fund_id] = (callCountByFund[c.fund_id] || 0) + 1
  }
  const navCountByFund: Record<string, number> = {}
  for (const n of navPerFund ?? []) {
    navCountByFund[n.fund_id] = (navCountByFund[n.fund_id] || 0) + 1
  }
  const holdingCountByFund: Record<string, number> = {}
  for (const h of holdingsPerFund ?? []) {
    holdingCountByFund[h.fund_id] = (holdingCountByFund[h.fund_id] || 0) + 1
  }

  // Build fund breakdown
  const fundBreakdown = (funds ?? []).map(fund => {
    const fundPositions = (positions ?? []).filter(p => p.fund_id === fund.id)
    const fundInvestors = fundPositions.map(p => {
      const inv = (investors ?? []).find(i => i.id === p.investor_id)
      return {
        investorId: p.investor_id,
        name: inv?.full_name ?? '—',
        email: inv?.email ?? null,
        hasAuth: !!inv?.auth_user_id,
        quotaClass: p.quota_class,
        committed: p.committed_capital,
        invested: p.invested_capital,
        nav: p.current_nav,
      }
    })

    return {
      id: fund.id,
      name: fund.name,
      slug: fund.slug,
      fundType: fund.fund_type,
      vintageYear: fund.vintage_year,
      status: fund.status,
      irr: fund.irr,
      investorCount: fundPositions.filter(p => p.committed_capital > 0).length,
      totalCommitted: fundPositions.reduce((s, p) => s + p.committed_capital, 0),
      totalInvested: fundPositions.reduce((s, p) => s + p.invested_capital, 0),
      totalNav: fundPositions.reduce((s, p) => s + p.current_nav, 0),
      callCount: callCountByFund[fund.id] || 0,
      navEntries: navCountByFund[fund.id] || 0,
      holdingCount: holdingCountByFund[fund.id] || 0,
      investors: fundInvestors,
    }
  })

  const summaryData = {
    totalFunds: (funds ?? []).length,
    totalInvestors: realInvestors.length,
    totalPositions: realPositions.length,
    totalCommitted: realPositions.reduce((s, p) => s + p.committed_capital, 0),
    totalNav: realPositions.reduce((s, p) => s + p.current_nav, 0),
    totalCalls: callCount ?? 0,
    totalNavEntries: navCount ?? 0,
    totalHoldings: holdingCount ?? 0,
  }

  const checks = [
    { label: t('checkInvestorsNoAuth'), count: noAuthRecords.length, isWarning: noAuthRecords.length > 0, records: noAuthRecords },
    { label: t('checkInvestorsNoEmail'), count: noEmailRecords.length, isWarning: noEmailRecords.length > 0, records: noEmailRecords },
    { label: t('checkPositionsNoNav'), count: noNavRecords.length, isWarning: noNavRecords.length > 0, records: noNavRecords },
    { label: t('checkDuplicatePositions'), count: duplicateRecords.length, isWarning: duplicateRecords.length > 0, records: duplicateRecords },
    { label: t('checkEmptyInvestors'), count: emptyInvestorRecords.length, isWarning: emptyInvestorRecords.length > 0, records: emptyInvestorRecords },
  ]

  return (
    <>
      <PortalHeader showLogout isAdmin />
      <AdminDashboard
        summary={summaryData}
        fundBreakdown={fundBreakdown}
        checks={checks}
        locale={locale}
      />
    </>
  )
}
