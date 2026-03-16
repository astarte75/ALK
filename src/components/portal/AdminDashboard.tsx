'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

// ============================================================
// TYPES
// ============================================================

interface SummaryData {
  totalFunds: number
  totalInvestors: number
  totalPositions: number
  totalCommitted: number
  totalNav: number
  totalCalls: number
  totalNavEntries: number
  totalHoldings: number
}

interface FundInvestor {
  name: string
  investorId: string
  email: string | null
  hasAuth: boolean
  quotaClass: string | null
  committed: number
  invested: number
  nav: number
}

interface FundBreakdown {
  id: string
  name: string
  slug: string
  fundType: string
  vintageYear: number | null
  status: string
  irr: number | null
  investorCount: number
  totalCommitted: number
  totalInvested: number
  totalNav: number
  callCount: number
  navEntries: number
  holdingCount: number
  investors: FundInvestor[]
}

interface ConsistencyCheck {
  label: string
  count: number
  isWarning: boolean
  records: string[]
}

interface AdminDashboardProps {
  summary: SummaryData
  fundBreakdown: FundBreakdown[]
  checks: ConsistencyCheck[]
  locale: string
}

// ============================================================
// STYLES
// ============================================================

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`

const PageTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
`

const PageSubtitle = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
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

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
`

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-text-primary);
`

const SectionLink = styled(Link)`
  font-size: 0.85rem;
  color: var(--color-accent-teal);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.5fr 1.5fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const Card = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
`

const CardValue = styled.div`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-accent-teal);
  font-variant-numeric: tabular-nums;
  margin-bottom: 0.25rem;
`

const CardLabel = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

// Fund breakdown
const FundCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
`

const FundHeaderBtn = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
  font-family: var(--font-heading);
  font-size: 1.1rem;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`

const FundMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 0 1.5rem 1rem;
`

const MetaItem = styled.span`
  font-size: 0.85rem;
  color: var(--color-text-secondary);

  strong {
    color: var(--color-text-primary);
  }
`

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  margin-left: 0.75rem;
  background: ${({ $type }) =>
    $type === 'PE'
      ? 'var(--color-accent-teal)'
      : $type === 'VC'
        ? 'var(--color-accent-gold)'
        : '#9B59B6'};
`

const ChevronIcon = styled.span<{ $open: boolean }>`
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  font-size: 0.8rem;
  color: var(--color-text-secondary);
`

const InvestorTableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

const Table = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  font-size: 0.85rem;
`

const Thead = styled.thead`
  background: var(--color-bg);
`

const Th = styled.th<{ $align?: string }>`
  padding: 0.6rem 1rem;
  text-align: ${({ $align }) => $align || 'left'};
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-border);
`

const Tr = styled.tr`
  &:not(:last-child) td {
    border-bottom: 1px solid var(--color-border);
  }
`

const TotalRow = styled.tr`
  background: var(--color-bg);
  font-weight: 600;
  border-top: 2px solid var(--color-border);

  td {
    padding: 0.6rem 1rem;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
  }
`

const Td = styled.td<{ $align?: string }>`
  padding: 0.6rem 1rem;
  white-space: nowrap;
  text-align: ${({ $align }) => $align || 'left'};
  font-variant-numeric: tabular-nums;
  color: var(--color-text-primary);
`

const InvestorLink = styled(Link)`
  color: var(--color-accent-teal);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const StatusDot = styled.span<{ $ok: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $ok }) => ($ok ? 'var(--color-accent-teal)' : 'var(--color-text-secondary)')};
`

// Consistency checks
const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const CheckItemWrapper = styled.div`
  background: var(--color-surface);
  border-radius: 6px;
  overflow: hidden;
`

const CheckHeader = styled.button<{ $warning: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: 1px solid ${({ $warning }) => ($warning ? 'var(--color-accent-gold)' : 'var(--color-border)')};
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text-primary);
  font-family: var(--font-body);
  text-align: left;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`

const CheckIcon = styled.span<{ $warning: boolean }>`
  font-size: 1rem;
  min-width: 1.5rem;
  text-align: center;
  color: ${({ $warning }) => ($warning ? 'var(--color-accent-gold)' : 'var(--color-accent-teal)')};
`

const CheckLabel = styled.span`
  flex: 1;
  font-size: 0.9rem;
`

const CheckCount = styled.span<{ $warning: boolean }>`
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ $warning }) => ($warning ? 'var(--color-accent-gold)' : 'var(--color-accent-teal)')};
`

const RecordsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.5rem 1rem 0.75rem 2.75rem;
  border-top: 1px solid var(--color-border);
`

const RecordItem = styled.li`
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  padding: 0.25rem 0;

  &::before {
    content: '—';
    margin-right: 0.5rem;
    color: var(--color-accent-gold);
  }
`

// ============================================================
// COMPONENT
// ============================================================

export default function AdminDashboard({
  summary,
  fundBreakdown,
  checks,
  locale,
}: AdminDashboardProps) {
  const t = useTranslations('portal.admin')
  const [openFunds, setOpenFunds] = useState<Set<string>>(new Set())
  const [openChecks, setOpenChecks] = useState<Set<number>>(new Set())

  const toggleFund = (id: string) => {
    setOpenFunds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleCheck = (idx: number) => {
    setOpenChecks(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const fmtCurrency = (value: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: 'always',
    }).format(value)

  const fmtNumber = (value: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'it-IT', {
      useGrouping: 'always',
    }).format(value)

  return (
    <Container>
      <BackLink href="/investitori/dashboard">
        &larr; {t('backToDashboard')}
      </BackLink>

      <PageTitle>{t('title')}</PageTitle>
      <PageSubtitle>{t('subtitle')}</PageSubtitle>

      {/* Summary Cards */}
      <SectionHeader>
        <SectionTitle>{t('summary')}</SectionTitle>
      </SectionHeader>
      <CardsGrid>
        <Card>
          <CardValue>{summary.totalFunds}</CardValue>
          <CardLabel>{t('totalFunds')}</CardLabel>
        </Card>
        <Card>
          <CardValue>{summary.totalInvestors}</CardValue>
          <CardLabel>{t('totalInvestors')}</CardLabel>
        </Card>
        <Card>
          <CardValue>{summary.totalPositions}</CardValue>
          <CardLabel>{t('totalPositions')}</CardLabel>
        </Card>
        <Card>
          <CardValue>{fmtCurrency(summary.totalCommitted)}</CardValue>
          <CardLabel>{t('totalCommitted')}</CardLabel>
        </Card>
        <Card>
          <CardValue>{fmtCurrency(summary.totalNav)}</CardValue>
          <CardLabel>{t('totalNav')}</CardLabel>
        </Card>
        <Card>
          <CardValue>{fmtNumber(summary.totalCalls)}</CardValue>
          <CardLabel>{t('totalCalls')}</CardLabel>
        </Card>
        <Card>
          <CardValue>{fmtNumber(summary.totalNavEntries)}</CardValue>
          <CardLabel>{t('totalNavEntries')}</CardLabel>
        </Card>
        <Card>
          <CardValue>{summary.totalHoldings}</CardValue>
          <CardLabel>{t('totalHoldings')}</CardLabel>
        </Card>
      </CardsGrid>

      {/* Fund Breakdown */}
      <SectionHeader>
        <SectionTitle>{t('fundBreakdown')}</SectionTitle>
        <SectionLink href="/investitori/admin/operazioni">
          {t('viewOperations')} &rarr;
        </SectionLink>
      </SectionHeader>
      {fundBreakdown.map(fund => {
        const isOpen = openFunds.has(fund.id)
        return (
          <FundCard key={fund.id}>
            <FundHeaderBtn onClick={() => toggleFund(fund.id)}>
              <span>
                {fund.name}
                <TypeBadge $type={fund.fundType}>{fund.fundType}</TypeBadge>
              </span>
              <ChevronIcon $open={isOpen}>&#x25BC;</ChevronIcon>
            </FundHeaderBtn>
            <FundMeta>
              <MetaItem><strong>{fund.investorCount}</strong> {t('totalInvestors')}</MetaItem>
              <MetaItem><strong>{fmtCurrency(fund.totalCommitted)}</strong> {t('committed')}</MetaItem>
              <MetaItem><strong>{fmtCurrency(fund.totalNav)}</strong> NAV</MetaItem>
              <MetaItem><strong>{fund.callCount}</strong> {t('totalCalls')}</MetaItem>
              <MetaItem><strong>{fund.navEntries}</strong> {t('totalNavEntries')}</MetaItem>
              <MetaItem><strong>{fund.holdingCount}</strong> {t('totalHoldings')}</MetaItem>
              {fund.irr != null && (
                <MetaItem>IRR: <strong>{(fund.irr * 100).toFixed(1)}%</strong></MetaItem>
              )}
            </FundMeta>
            {isOpen && (
              <InvestorTableWrap>
                <Table>
                  <Thead>
                    <tr>
                      <Th>{t('investorName')}</Th>
                      <Th>{t('quotaClass')}</Th>
                      <Th $align="right">{t('committed')}</Th>
                      <Th $align="right">{t('invested')}</Th>
                      <Th $align="right">{t('nav')}</Th>
                      <Th $align="center">{t('hasEmail')}</Th>
                      <Th $align="center">{t('hasAuth')}</Th>
                    </tr>
                  </Thead>
                  <tbody>
                    {fund.investors.map((inv, i) => (
                      <Tr key={i}>
                        <Td>
                          <InvestorLink href={`/investitori/admin/investitore/${inv.investorId}`}>
                            {inv.name}
                          </InvestorLink>
                        </Td>
                        <Td>{inv.quotaClass ?? '—'}</Td>
                        <Td $align="right">{fmtCurrency(inv.committed)}</Td>
                        <Td $align="right">{fmtCurrency(inv.invested)}</Td>
                        <Td $align="right">{fmtCurrency(inv.nav)}</Td>
                        <Td $align="center"><StatusDot $ok={!!inv.email} /></Td>
                        <Td $align="center"><StatusDot $ok={inv.hasAuth} /></Td>
                      </Tr>
                    ))}
                    <TotalRow>
                      <td colSpan={2} style={{ textAlign: 'right', fontWeight: 600 }}>Totale</td>
                      <Td $align="right">{fmtCurrency(fund.totalCommitted)}</Td>
                      <Td $align="right">{fmtCurrency(fund.totalInvested)}</Td>
                      <Td $align="right">{fmtCurrency(fund.totalNav)}</Td>
                      <td colSpan={2} />
                    </TotalRow>
                  </tbody>
                </Table>
              </InvestorTableWrap>
            )}
          </FundCard>
        )
      })}

      {/* Consistency Checks */}
      <SectionHeader>
        <SectionTitle>{t('consistencyChecks')}</SectionTitle>
      </SectionHeader>
      <CheckList>
        {checks.map((check, i) => {
          const isOpen = openChecks.has(i)
          return (
            <CheckItemWrapper key={i}>
              <CheckHeader
                $warning={check.isWarning}
                onClick={() => check.isWarning && check.records.length > 0 && toggleCheck(i)}
                style={{ cursor: check.isWarning && check.records.length > 0 ? 'pointer' : 'default' }}
              >
                <CheckIcon $warning={check.isWarning}>
                  {check.isWarning ? '!' : '\u2713'}
                </CheckIcon>
                <CheckLabel>{check.label}</CheckLabel>
                <CheckCount $warning={check.isWarning}>
                  {check.count} {check.isWarning ? t('checkFailed') : t('checkPassed')}
                </CheckCount>
                {check.isWarning && check.records.length > 0 && (
                  <ChevronIcon $open={isOpen}>&#x25BC;</ChevronIcon>
                )}
              </CheckHeader>
              {isOpen && check.records.length > 0 && (
                <RecordsList>
                  {check.records.map((record, j) => (
                    <RecordItem key={j}>{record}</RecordItem>
                  ))}
                </RecordsList>
              )}
            </CheckItemWrapper>
          )
        })}
      </CheckList>
    </Container>
  )
}
