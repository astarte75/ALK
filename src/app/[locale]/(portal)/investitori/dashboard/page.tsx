import { redirect } from 'next/navigation'
import styled from 'styled-components'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import PortalHeader from '@/components/portal/PortalHeader'
import DashboardTable from '@/components/portal/DashboardTable'
import type { FundPosition, Fund } from '@/lib/supabase/types'

type PositionWithFund = FundPosition & {
  fund: Pick<Fund, 'name' | 'slug' | 'fund_type'>
}

export const dynamic = 'force-dynamic'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const WelcomeHeading = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
`

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const t = await getTranslations('portal.dashboard')

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(locale === 'en' ? '/en/investitori' : '/investitori')
  }

  // Fetch investor record
  const { data: investorData } = await supabase
    .from('investors')
    .select('id, full_name, is_admin')
    .eq('auth_user_id', user.id)
    .single()
  const investor = investorData as { id: string; full_name: string; is_admin: boolean } | null

  // Fetch only this investor's positions (not all — admin RLS would return everything)
  const { data: positionsData } = await supabase
    .from('fund_positions')
    .select('*, fund:funds(name, slug, fund_type)')
    .eq('investor_id', investor?.id ?? '')
    .order('fund_id')
  const positions = (positionsData ?? []) as PositionWithFund[]

  return (
    <>
      <PortalHeader showLogout isAdmin={investor?.is_admin ?? false} />
      <Container>
        <WelcomeHeading>
          {t('welcome', { name: investor?.full_name ?? '' })}
        </WelcomeHeading>
        <SectionTitle>{t('title')}</SectionTitle>
        <DashboardTable
          positions={positions}
          locale={locale}
        />
      </Container>
    </>
  )
}
