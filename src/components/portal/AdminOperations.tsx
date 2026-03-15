'use client'

import { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

// ============================================================
// TYPES
// ============================================================

interface CallRow {
  id: string
  date: string
  callType: string
  amount: number
  description: string | null
  investorName: string
  fundName: string
  fundId: string
}

interface FundOption {
  id: string
  name: string
}

interface AdminOperationsProps {
  calls: CallRow[]
  fundOptions: FundOption[]
  callTypes: string[]
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

const PageTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
`

const PageSubtitle = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
`

const FiltersBar = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  align-items: flex-end;
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

const FilterLabel = styled.label`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`

const Select = styled.select`
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  min-width: 180px;

  &:focus {
    outline: none;
    border-color: var(--color-accent-teal);
  }
`

const DateInput = styled.input`
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: var(--color-accent-teal);
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(0.7);
  }
`

const ResetButton = styled.button`
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: var(--color-accent-teal);
    border-color: var(--color-accent-teal);
  }
`

const ResultCount = styled.div`
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
`

const ScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

const Table = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  font-size: 0.85rem;
`

const Thead = styled.thead`
  background: var(--color-surface);
`

const Th = styled.th<{ $align?: string }>`
  padding: 0.65rem 1rem;
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
  padding: 0.65rem 1rem;
  white-space: nowrap;
  text-align: ${({ $align }) => $align || 'left'};
  font-variant-numeric: tabular-nums;
  color: var(--color-text-primary);
`

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  background: ${({ $type }) => {
    switch ($type) {
      case 'capital_call': return 'var(--color-accent-teal)'
      case 'distribution': return '#27ae60'
      case 'management_fee': return 'var(--color-accent-gold)'
      case 'setup_cost': return '#9B59B6'
      case 'expense': return '#e67e22'
      default: return 'var(--color-text-secondary)'
    }
  }};
`

const AmountCell = styled.span<{ $negative: boolean }>`
  color: ${({ $negative }) => $negative ? '#e74c3c' : 'var(--color-text-primary)'};
`

const TotalRow = styled.tr`
  background: var(--color-surface);
  font-weight: 600;
  border-top: 2px solid var(--color-border);

  td {
    padding: 0.75rem 1rem;
    color: var(--color-text-primary);
  }
`

// ============================================================
// COMPONENT
// ============================================================

export default function AdminOperations({
  calls,
  fundOptions,
  callTypes,
  locale,
}: AdminOperationsProps) {
  const t = useTranslations('portal.admin')
  const tCall = useTranslations('portal.fundDetail.callTypes')

  const [fundFilter, setFundFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  const filtered = useMemo(() => {
    return calls.filter(c => {
      if (fundFilter && c.fundId !== fundFilter) return false
      if (typeFilter && c.callType !== typeFilter) return false
      if (dateFrom && c.date < dateFrom) return false
      if (dateTo && c.date > dateTo) return false
      return true
    })
  }, [calls, fundFilter, typeFilter, dateFrom, dateTo])

  const totalAmount = useMemo(
    () => filtered.reduce((sum, c) => sum + c.amount, 0),
    [filtered]
  )

  const resetFilters = () => {
    setFundFilter('')
    setTypeFilter('')
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters = fundFilter || typeFilter || dateFrom || dateTo

  const fmtCurrency = (value: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'it-IT', {
      style: 'currency',
      currency: 'EUR',
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
    <Container>
      <BackLink href="/investitori/admin">
        &larr; {t('backToAdmin')}
      </BackLink>

      <PageTitle>{t('operationsTitle')}</PageTitle>
      <PageSubtitle>{t('operationsSubtitle')}</PageSubtitle>

      <FiltersBar>
        <FilterGroup>
          <FilterLabel>{t('filterFund')}</FilterLabel>
          <Select value={fundFilter} onChange={e => setFundFilter(e.target.value)}>
            <option value="">{t('allFunds')}</option>
            {fundOptions.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t('filterType')}</FilterLabel>
          <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">{t('allTypes')}</option>
            {callTypes.map(ct => (
              <option key={ct} value={ct}>{tCall(ct)}</option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t('filterDateFrom')}</FilterLabel>
          <DateInput type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t('filterDateTo')}</FilterLabel>
          <DateInput type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </FilterGroup>

        {hasActiveFilters && (
          <ResetButton onClick={resetFilters}>{t('resetFilters')}</ResetButton>
        )}
      </FiltersBar>

      <ResultCount>
        {filtered.length} / {calls.length} {t('operationsCount')}
      </ResultCount>

      <ScrollWrapper>
        <Table>
          <Thead>
            <tr>
              <Th>{t('operationDate')}</Th>
              <Th>{t('operationFund')}</Th>
              <Th>{t('operationInvestor')}</Th>
              <Th>{t('operationType')}</Th>
              <Th $align="right">{t('operationAmount')}</Th>
              <Th>{t('operationDescription')}</Th>
            </tr>
          </Thead>
          <tbody>
            {filtered.map(c => (
              <Tr key={c.id}>
                <Td>{fmtDate(c.date)}</Td>
                <Td>{c.fundName}</Td>
                <Td>{c.investorName}</Td>
                <Td><TypeBadge $type={c.callType}>{tCall(c.callType)}</TypeBadge></Td>
                <Td $align="right">
                  <AmountCell $negative={c.amount < 0}>{fmtCurrency(c.amount)}</AmountCell>
                </Td>
                <Td>{c.description ?? '—'}</Td>
              </Tr>
            ))}
            {filtered.length > 0 && (
              <TotalRow>
                <td colSpan={4} style={{ textAlign: 'right' }}>{t('total')}</td>
                <Td $align="right">{fmtCurrency(totalAmount)}</Td>
                <td />
              </TotalRow>
            )}
          </tbody>
        </Table>
      </ScrollWrapper>
    </Container>
  )
}
