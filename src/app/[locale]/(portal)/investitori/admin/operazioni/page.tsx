import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import PortalHeader from '@/components/portal/PortalHeader'
import AdminOperations from '@/components/portal/AdminOperations'

export const dynamic = 'force-dynamic'

export default async function AdminOperationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const t = await getTranslations('portal.admin')

  // Auth + admin check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(locale === 'en' ? '/en/investitori' : '/investitori')
  }

  const { data: currentInvestor } = await supabase
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()

  if (!currentInvestor?.is_admin) {
    redirect(locale === 'en' ? '/en/investitori/dashboard' : '/investitori/dashboard')
  }

  // Fetch all capital calls with investor and fund names
  const { data: calls } = await supabase
    .from('capital_calls')
    .select('id, call_date, call_type, amount, description, investor_id, fund_id')
    .order('call_date', { ascending: false })

  // Fetch investors and funds for name resolution and filter options
  const { data: investors } = await supabase
    .from('investors')
    .select('id, full_name')
    .order('full_name')

  const { data: funds } = await supabase
    .from('funds')
    .select('id, name, slug')
    .order('name')

  // Build lookup maps
  const investorMap: Record<string, string> = {}
  for (const inv of investors ?? []) {
    investorMap[inv.id] = inv.full_name
  }
  const fundMap: Record<string, string> = {}
  for (const f of funds ?? []) {
    fundMap[f.id] = f.name
  }

  // Enrich calls
  const enrichedCalls = (calls ?? []).map(c => ({
    id: c.id,
    date: c.call_date,
    callType: c.call_type,
    amount: c.amount,
    description: c.description,
    investorName: investorMap[c.investor_id] ?? '—',
    investorId: c.investor_id,
    fundName: fundMap[c.fund_id] ?? '—',
    fundId: c.fund_id,
  }))

  // Extract unique call types
  const callTypes = [...new Set(enrichedCalls.map(c => c.callType))].sort()

  // Filter options
  const fundOptions = (funds ?? []).map(f => ({ id: f.id, name: f.name }))
  const investorOptions = (investors ?? []).map(i => ({ id: i.id, name: i.full_name }))

  return (
    <>
      <PortalHeader showLogout isAdmin />
      <AdminOperations
        calls={enrichedCalls}
        fundOptions={fundOptions}
        investorOptions={investorOptions}
        callTypes={callTypes}
        locale={locale}
      />
    </>
  )
}
