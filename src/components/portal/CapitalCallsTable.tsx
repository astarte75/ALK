'use client'

import { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import type { CapitalCall } from '@/lib/supabase/types'

const ScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

const Table = styled.table`
  width: 100%;
  min-width: 500px;
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

const TypeBadge = styled.span<{ $callType: string }>`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  background: ${({ $callType }) => {
    switch ($callType) {
      case 'capital_call': return 'var(--color-accent-teal)'
      case 'distribution': return 'var(--color-accent-gold)'
      case 'management_fee': return '#5B8DEF'
      case 'expense': return '#8B95A5'
      case 'setup_cost': return '#8B95A5'
      default: return '#9B59B6'
    }
  }};
`

const EmptyState = styled.p`
  color: var(--color-text-secondary);
  padding: 2rem;
  text-align: center;
`

interface CapitalCallsTableProps {
  calls: CapitalCall[]
  locale: string
  currency: string
}

export default function CapitalCallsTable({ calls, locale, currency }: CapitalCallsTableProps) {
  const t = useTranslations('portal.fundDetail')

  const sorted = useMemo(
    () => [...calls].sort((a, b) => new Date(b.call_date).getTime() - new Date(a.call_date).getTime()),
    [calls]
  )

  if (sorted.length === 0) {
    return <EmptyState>{t('noCalls')}</EmptyState>
  }

  const fmtCurrency = (value: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'it-IT', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const fmtDate = (dateStr: string) =>
    new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))

  return (
    <ScrollWrapper>
      <Table>
        <Thead>
          <tr>
            <Th>{t('date')}</Th>
            <Th>{t('type')}</Th>
            <Th $align="right">{t('amount')}</Th>
            <Th>{t('description')}</Th>
          </tr>
        </Thead>
        <tbody>
          {sorted.map((call) => (
            <Tr key={call.id}>
              <Td>{fmtDate(call.call_date)}</Td>
              <Td>
                <TypeBadge $callType={call.call_type}>
                  {t(`callTypes.${call.call_type}`)}
                </TypeBadge>
              </Td>
              <Td $align="right">{fmtCurrency(call.amount)}</Td>
              <Td>{call.description ?? '—'}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </ScrollWrapper>
  )
}
