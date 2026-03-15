import { redirect, notFound } from 'next/navigation'
import styled from 'styled-components'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import PortalHeader from '@/components/portal/PortalHeader'
import CapitalCallsTable from '@/components/portal/CapitalCallsTable'
import NavChart from '@/components/portal/NavChartClient'
import DocumentList from '@/components/portal/DocumentList'
import { Link } from '@/i18n/navigation'
import type { Fund, FundPosition, CapitalCall, NavHistory, InvestorDocument } from '@/lib/supabase/types'

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
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`

const FundHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`

const FundName = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: var(--color-text-primary);
`

const TypeBadge = styled.span<{ $type: 'PE' | 'VC' | 'PIPE' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  background: ${({ $type }) =>
    $type === 'PE'
      ? 'var(--color-accent-teal)'
      : $type === 'VC'
        ? 'var(--color-accent-gold)'
        : '#9B59B6'};
`

const VintageYear = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.95rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StatCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const StatLabel = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`

const StatValue = styled.span<{ $accent?: boolean }>`
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ $accent }) => ($accent ? 'var(--color-accent-teal)' : 'var(--color-text-primary)')};
  font-variant-numeric: tabular-nums;
`

const Section = styled.section`
  margin-bottom: 3rem;
`

const SectionHeading = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin-bottom: 1.25rem;
`

function formatQuarter(dateStr: string): string {
  const d = new Date(dateStr)
  const month = d.getMonth() + 1
  const quarter = Math.ceil(month / 3)
  return `Q${quarter} ${d.getFullYear()}`
}

export default async function FundDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const supabase = await createClient()
  const t = await getTranslations('portal')

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(locale === 'en' ? '/en/investitori' : '/investitori')
  }

  // Fetch fund
  const { data: fundData } = await supabase
    .from('funds')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!fundData) notFound()
  const fund = fundData as Fund

  // Fetch related data in parallel
  const [positionResult, callsResult, navResult, docsResult] = await Promise.all([
    supabase.from('fund_positions').select('*').eq('fund_id', fund.id).single(),
    supabase.from('capital_calls').select('*').eq('fund_id', fund.id).order('call_date', { ascending: false }),
    supabase.from('nav_history').select('*').eq('fund_id', fund.id).order('report_date', { ascending: true }),
    supabase.from('investor_documents').select('*').eq('fund_id', fund.id).order('uploaded_at', { ascending: false }),
  ])

  const position = positionResult.data as FundPosition | null
  const calls = (callsResult.data ?? []) as CapitalCall[]
  const navHistory = (navResult.data ?? []) as NavHistory[]
  const documents = (docsResult.data ?? []) as InvestorDocument[]

  // Transform NAV data for chart
  const chartData = navHistory.map((n) => ({
    date: formatQuarter(n.report_date),
    nav: n.nav_value,
  }))

  const fmtCurrency = (value: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'it-IT', {
      style: 'currency',
      currency: fund.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  return (
    <>
      <PortalHeader showLogout />
      <Container>
        <BackLink href="/investitori/dashboard">
          &larr; {t('fundDetail.backToDashboard')}
        </BackLink>

        <FundHeader>
          <FundName>{fund.name}</FundName>
          <TypeBadge $type={fund.fund_type}>{fund.fund_type}</TypeBadge>
          {fund.vintage_year && <VintageYear>{fund.vintage_year}</VintageYear>}
        </FundHeader>

        {position && (
          <StatsGrid>
            <StatCard>
              <StatLabel>{t('dashboard.committedCapital')}</StatLabel>
              <StatValue>{fmtCurrency(position.committed_capital)}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>{t('dashboard.investedCapital')}</StatLabel>
              <StatValue>{fmtCurrency(position.invested_capital)}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>{t('dashboard.distributions')}</StatLabel>
              <StatValue>{fmtCurrency(position.distributions)}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>{t('dashboard.currentNav')}</StatLabel>
              <StatValue $accent>{fmtCurrency(position.current_nav)}</StatValue>
            </StatCard>
          </StatsGrid>
        )}

        <Section>
          <SectionHeading>{t('fundDetail.capitalCalls')}</SectionHeading>
          <CapitalCallsTable calls={calls} locale={locale} currency={fund.currency} />
        </Section>

        <Section>
          <SectionHeading>{t('fundDetail.navChart')}</SectionHeading>
          <NavChart data={chartData} locale={locale} currency={fund.currency} />
        </Section>

        <Section>
          <SectionHeading>{t('fundDetail.documents')}</SectionHeading>
          <DocumentList documents={documents} locale={locale} />
        </Section>
      </Container>
    </>
  )
}
