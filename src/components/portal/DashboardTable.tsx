'use client'

import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { FundPosition, Fund } from '@/lib/supabase/types'

const ScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

const Table = styled.table`
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 0.9rem;
`

const Thead = styled.thead`
  background: var(--color-surface);
`

const Th = styled.th<{ $align?: string }>`
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

const Tr = styled.tr`
  background: var(--color-bg);
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-surface);
  }

  &:not(:last-child) td {
    border-bottom: 1px solid var(--color-border);
  }
`

const Td = styled.td<{ $align?: string }>`
  padding: 0.75rem 1rem;
  white-space: nowrap;
  text-align: ${({ $align }) => $align || 'left'};
  font-variant-numeric: tabular-nums;
`

const FundLink = styled(Link)`
  color: var(--color-accent-teal);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`

const TypeBadge = styled.span<{ $type: 'PE' | 'VC' | 'PIPE' }>`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
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

const EmptyState = styled.p`
  color: var(--color-text-secondary);
  padding: 2rem;
  text-align: center;
`

type PositionWithFund = FundPosition & {
  fund: Pick<Fund, 'name' | 'slug' | 'fund_type'>
}

interface DashboardTableProps {
  positions: PositionWithFund[]
  locale: string
  fundLinkPrefix?: string
}

export default function DashboardTable({ positions, locale, fundLinkPrefix }: DashboardTableProps) {
  const basePath = fundLinkPrefix ?? '/investitori/fondi'
  const t = useTranslations('portal.dashboard')

  if (positions.length === 0) {
    return <EmptyState>{t('noPositions')}</EmptyState>
  }

  const fmtCurrency = (value: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const fmtDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  return (
    <ScrollWrapper>
      <Table>
        <Thead>
          <tr>
            <Th>{t('fund')}</Th>
            <Th>{t('type')}</Th>
            <Th>{t('quotaClass')}</Th>
            <Th $align="right">{t('committedCapital')}</Th>
            <Th $align="right">{t('investedCapital')}</Th>
            <Th $align="right">{t('distributions')}</Th>
            <Th $align="right">{t('residualCommitment')}</Th>
            <Th $align="right">{t('currentNav')}</Th>
            <Th>{t('navDate')}</Th>
            <Th $align="right">{t('calledPercent')}</Th>
            <Th $align="right">{t('tvpi')}</Th>
          </tr>
        </Thead>
        <tbody>
          {positions.map((pos) => (
            <Tr key={pos.id}>
              <Td>
                <FundLink href={`${basePath}/${pos.fund.slug}`}>
                  {pos.fund.name}
                </FundLink>
              </Td>
              <Td>
                <TypeBadge $type={pos.fund.fund_type}>{pos.fund.fund_type}</TypeBadge>
              </Td>
              <Td>{pos.quota_class ?? '—'}</Td>
              <Td $align="right">{fmtCurrency(pos.committed_capital)}</Td>
              <Td $align="right">{fmtCurrency(pos.invested_capital)}</Td>
              <Td $align="right">{fmtCurrency(pos.distributions)}</Td>
              <Td $align="right">{fmtCurrency(pos.residual_commitment)}</Td>
              <Td $align="right">{fmtCurrency(pos.current_nav)}</Td>
              <Td>{fmtDate(pos.nav_date)}</Td>
              <Td $align="right">
                {pos.committed_capital > 0
                  ? `${Math.round((pos.invested_capital / pos.committed_capital) * 100)}%`
                  : '—'}
              </Td>
              <Td $align="right">
                {pos.invested_capital > 0
                  ? `${((pos.current_nav + pos.distributions) / pos.invested_capital).toFixed(2)}x`
                  : '—'}
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </ScrollWrapper>
  )
}
