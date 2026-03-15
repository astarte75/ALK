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
  investorId: string
  fundName: string
  fundId: string
}

interface FilterOption {
  id: string
  name: string
}

interface AdminOperationsProps {
  calls: CallRow[]
  fundOptions: FilterOption[]
  investorOptions: FilterOption[]
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
  align-items: end;
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

const filterInputStyles = `
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  height: 38px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--color-accent-teal);
  }
`

const Select = styled.select`
  ${filterInputStyles}
  min-width: 180px;
`

const DateInput = styled.input`
  ${filterInputStyles}

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
  height: 38px;
  box-sizing: border-box;
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

const Th = styled.th<{ $align?: string; $fixedWidth?: string }>`
  padding: 0.65rem 1rem;
  text-align: ${({ $align }) => $align || 'left'};
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-border);
  ${({ $fixedWidth }) => $fixedWidth ? `width: ${$fixedWidth}; min-width: ${$fixedWidth}; max-width: ${$fixedWidth};` : ''}
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

const FixedTd = styled(Td)<{ $fixedWidth?: string }>`
  ${({ $fixedWidth }) => $fixedWidth ? `width: ${$fixedWidth}; min-width: ${$fixedWidth}; max-width: ${$fixedWidth};` : ''}
  overflow: hidden;
  text-overflow: ellipsis;
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
  investorOptions,
  callTypes,
  locale,
}: AdminOperationsProps) {
  const t = useTranslations('portal.admin')
  const tCall = useTranslations('portal.fundDetail.callTypes')

  const [fundFilter, setFundFilter] = useState<string>('')
  const [investorFilter, setInvestorFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  const filtered = useMemo(() => {
    return calls.filter(c => {
      if (fundFilter && c.fundId !== fundFilter) return false
      if (investorFilter && c.investorId !== investorFilter) return false
      if (typeFilter && c.callType !== typeFilter) return false
      if (dateFrom && c.date < dateFrom) return false
      if (dateTo && c.date > dateTo) return false
      return true
    })
  }, [calls, fundFilter, investorFilter, typeFilter, dateFrom, dateTo])

  const totalAmount = useMemo(
    () => filtered.reduce((sum, c) => sum + c.amount, 0),
    [filtered]
  )

  const resetFilters = () => {
    setFundFilter('')
    setInvestorFilter('')
    setTypeFilter('')
    setDateFrom('')
    setDateTo('')
  }

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

  // Fixed column widths based on max content across ALL data (not just filtered)
  const colWidths = useMemo(() => {
    const maxDate = Math.max(...calls.map(c => fmtDate(c.date).length), t('operationDate').length)
    const maxFund = Math.max(...calls.map(c => c.fundName.length), t('operationFund').length)
    const maxInvestor = Math.max(...calls.map(c => c.investorName.length), t('operationInvestor').length)
    const maxType = Math.max(...calls.map(c => tCall(c.callType).length), t('operationType').length)
    const maxAmount = Math.max(...calls.map(c => fmtCurrency(c.amount).length), t('operationAmount').length)

    return {
      date: `${maxDate + 3}ch`,
      fund: `${maxFund + 3}ch`,
      investor: `${maxInvestor + 3}ch`,
      type: `${maxType + 3}ch`,
      amount: `${maxAmount + 3}ch`,
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls, locale])

  const hasActiveFilters = fundFilter || investorFilter || typeFilter || dateFrom || dateTo

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
          <FilterLabel>{t('operationInvestor')}</FilterLabel>
          <Select value={investorFilter} onChange={e => setInvestorFilter(e.target.value)}>
            <option value="">{t('allInvestors')}</option>
            {investorOptions.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
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
              <Th $fixedWidth={colWidths.date}>{t('operationDate')}</Th>
              <Th $fixedWidth={colWidths.fund}>{t('operationFund')}</Th>
              <Th $fixedWidth={colWidths.investor}>{t('operationInvestor')}</Th>
              <Th $fixedWidth={colWidths.type}>{t('operationType')}</Th>
              <Th $fixedWidth={colWidths.amount} $align="right">{t('operationAmount')}</Th>
              <Th>{t('operationDescription')}</Th>
            </tr>
          </Thead>
          <tbody>
            {filtered.map(c => (
              <Tr key={c.id}>
                <FixedTd $fixedWidth={colWidths.date}>{fmtDate(c.date)}</FixedTd>
                <FixedTd $fixedWidth={colWidths.fund}>{c.fundName}</FixedTd>
                <FixedTd $fixedWidth={colWidths.investor}>{c.investorName}</FixedTd>
                <FixedTd $fixedWidth={colWidths.type}><TypeBadge $type={c.callType}>{tCall(c.callType)}</TypeBadge></FixedTd>
                <FixedTd $fixedWidth={colWidths.amount} $align="right">
                  <AmountCell $negative={c.amount < 0}>{fmtCurrency(c.amount)}</AmountCell>
                </FixedTd>
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
