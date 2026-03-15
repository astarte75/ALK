import { redirect, notFound } from 'next/navigation'
import styled from 'styled-components'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import PortalHeader from '@/components/portal/PortalHeader'
import DashboardTable from '@/components/portal/DashboardTable'
import { Link } from '@/i18n/navigation'
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

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-accent-teal);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;

  &:hover {
    text-decoration: underline;
  }
`

const WelcomeHeading = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
`

const ViewAsLabel = styled.p`
  color: var(--color-accent-gold);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
`

export default async function AdminInvestorViewPage({
  params,
}: {
  params: Promise<{ locale: string; investorId: string }>
}) {
  const { locale, investorId } = await params
  const supabase = await createClient()
  const t = await getTranslations('portal')
  const tAdmin = await getTranslations('portal.admin')

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

  // Fetch target investor
  const { data: targetInvestor } = await supabase
    .from('investors')
    .select('id, full_name')
    .eq('id', investorId)
    .single()

  if (!targetInvestor) notFound()

  // Fetch this investor's positions
  const { data: positionsData } = await supabase
    .from('fund_positions')
    .select('*, fund:funds(name, slug, fund_type)')
    .eq('investor_id', investorId)
    .order('fund_id')
  const positions = (positionsData ?? []) as PositionWithFund[]

  return (
    <>
      <PortalHeader showLogout isAdmin />
      <Container>
        <BackLink href="/investitori/admin">
          &larr; {tAdmin('backToAdmin')}
        </BackLink>

        <ViewAsLabel>{tAdmin('viewAsInvestor')}</ViewAsLabel>
        <WelcomeHeading>
          {t('dashboard.welcome', { name: targetInvestor.full_name })}
        </WelcomeHeading>
        <SectionTitle>{t('dashboard.title')}</SectionTitle>
        <DashboardTable
          positions={positions}
          locale={locale}
          fundLinkPrefix={`/investitori/admin/investitore/${investorId}/fondi`}
        />
      </Container>
    </>
  )
}
