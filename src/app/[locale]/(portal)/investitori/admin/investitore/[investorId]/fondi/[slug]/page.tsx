import { redirect, notFound } from 'next/navigation'
import styled from 'styled-components'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import PortalHeader from '@/components/portal/PortalHeader'
import CapitalCallsTable from '@/components/portal/CapitalCallsTable'
import NavChart from '@/components/portal/NavChartClient'
import DocumentList from '@/components/portal/DocumentList'
import { Link } from '@/i18n/navigation'
import type { Fund, FundPosition, CapitalCall, NavHistory, InvestorDocument, FundHolding } from '@/lib/supabase/types'

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

const ViewAsLabel = styled.p`
  color: var(--color-accent-gold);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const InfoLine = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  margin-bottom: 2.5rem;
  font-variant-numeric: tabular-nums;
`

const HoldingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 0.9rem;
`

const HoldingsThead = styled.thead`
  background: var(--color-surface);
`

const HoldingsTh = styled.th<{ $align?: string }>`
  padding: 0.75rem 1rem;
  text-align: ${({ $align }) => $align || 'left'};
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-border);
`

const HoldingsTr = styled.tr`
  background: var(--color-bg);
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-surface);
  }

  &:not(:last-child) td {
    border-bottom: 1px solid var(--color-border);
  }
`

const HoldingsTd = styled.td<{ $align?: string }>`
  padding: 0.75rem 1rem;
  white-space: nowrap;
  text-align: ${({ $align }) => $align || 'left'};
  font-variant-numeric: tabular-nums;
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

const StatValue = styled.span<{ $accent?: 'teal' | 'gold' | boolean }>`
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ $accent }) =>
    $accent === 'teal' || $accent === true
      ? 'var(--color-accent-teal)'
      : $accent === 'gold'
        ? 'var(--color-accent-gold)'
        : 'var(--color-text-primary)'};
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

export default async function AdminFundDetailPage({
  params,
}: {
  params: Promise<{ locale: string; investorId: string; slug: string }>
}) {
  const { locale, investorId, slug } = await params
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

  // Fetch target investor name
  const { data: targetInvestor } = await supabase
    .from('investors')
    .select('full_name')
    .eq('id', investorId)
    .single()

  if (!targetInvestor) notFound()

  // Fetch fund
  const { data: fundData } = await supabase
    .from('funds')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!fundData) notFound()
  const fund = fundData as Fund

  // Fetch related data — scoped to target investor
  const [positionResult, callsResult, navResult, docsResult, holdingsResult] = await Promise.all([
    supabase.from('fund_positions').select('*').eq('fund_id', fund.id).eq('investor_id', investorId).single(),
    supabase.from('capital_calls').select('*').eq('fund_id', fund.id).eq('investor_id', investorId).order('call_date', { ascending: false }),
    supabase.from('nav_history').select('*').eq('fund_id', fund.id).eq('investor_id', investorId).order('report_date', { ascending: true }),
    supabase.from('investor_documents').select('*').eq('fund_id', fund.id).eq('investor_id', investorId).order('uploaded_at', { ascending: false }),
    supabase.from('fund_holdings').select('*').eq('fund_id', fund.id).order('cost', { ascending: false }),
  ])

  const position = positionResult.data as FundPosition | null
  const calls = (callsResult.data ?? []) as CapitalCall[]
  const navHistory = (navResult.data ?? []) as NavHistory[]
  const documents = (docsResult.data ?? []) as InvestorDocument[]
  const holdings = (holdingsResult.data ?? []) as FundHolding[]

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
      <PortalHeader showLogout isAdmin />
      <Container>
        <BackLink href={`/investitori/admin/investitore/${investorId}`}>
          &larr; {t('fundDetail.backToDashboard')} ({targetInvestor.full_name})
        </BackLink>

        <ViewAsLabel>{tAdmin('viewAsInvestor')}: {targetInvestor.full_name}</ViewAsLabel>

        <FundHeader>
          <FundName>{fund.name}</FundName>
          <TypeBadge $type={fund.fund_type}>{fund.fund_type}</TypeBadge>
          {fund.vintage_year && <VintageYear>{fund.vintage_year}</VintageYear>}
        </FundHeader>

        {position && (
          <>
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
                <StatLabel>{t('fundDetail.residualCommitment')}</StatLabel>
                <StatValue>{fmtCurrency(position.residual_commitment)}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>{t('dashboard.distributions')}</StatLabel>
                <StatValue>{fmtCurrency(position.distributions)}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>{t('dashboard.currentNav')}</StatLabel>
                <StatValue $accent="teal">{fmtCurrency(position.current_nav)}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>{t('fundDetail.tvpi')}</StatLabel>
                <StatValue $accent="gold">
                  {position.invested_capital > 0
                    ? `${((position.current_nav + position.distributions) / position.invested_capital).toFixed(2)}x`
                    : '—'}
                </StatValue>
              </StatCard>
            </StatsGrid>
            <InfoLine>
              {position.quota_class && <>{t('dashboard.quotaClass')}: {position.quota_class} | </>}
              {t('fundDetail.calledPercent')}:{' '}
              {position.committed_capital > 0
                ? `${Math.round((position.invested_capital / position.committed_capital) * 100)}%`
                : '—'}
              {fund.irr != null && <> | {t('fundDetail.irr')}: {fund.irr.toFixed(2)}%</>}
            </InfoLine>
          </>
        )}

        {holdings.length > 0 && (
          <Section>
            <SectionHeading>{t('fundDetail.portfolio')}</SectionHeading>
            <HoldingsTable>
              <HoldingsThead>
                <tr>
                  <HoldingsTh>{t('fundDetail.holding')}</HoldingsTh>
                  <HoldingsTh $align="right">{t('fundDetail.cost')}</HoldingsTh>
                  <HoldingsTh $align="right">{t('fundDetail.fairValue')}</HoldingsTh>
                </tr>
              </HoldingsThead>
              <tbody>
                {holdings.map((h) => (
                  <HoldingsTr key={h.id}>
                    <HoldingsTd>{h.name}</HoldingsTd>
                    <HoldingsTd $align="right">{fmtCurrency(h.cost)}</HoldingsTd>
                    <HoldingsTd $align="right">{h.fair_value != null ? fmtCurrency(h.fair_value) : '—'}</HoldingsTd>
                  </HoldingsTr>
                ))}
              </tbody>
            </HoldingsTable>
          </Section>
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
