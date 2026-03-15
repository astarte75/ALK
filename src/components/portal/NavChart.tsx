'use client'

import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;

  @media (max-width: 768px) {
    height: 250px;
  }
`

const EmptyState = styled.p`
  color: var(--color-text-secondary);
  padding: 2rem;
  text-align: center;
`

const TooltipBox = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
`

const TooltipLabel = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
  text-align: left;
`

const TooltipValue = styled.p`
  color: var(--color-accent-teal);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  text-align: left;
`

interface NavChartProps {
  data: { date: string; nav: number }[]
  locale: string
  currency: string
}

function abbreviateValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`
  return value.toString()
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  locale: string
  currency: string
}

function CustomTooltip({ active, payload, label, locale, currency }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const fmtCurrency = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'it-IT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <TooltipBox>
      <TooltipLabel>{label}</TooltipLabel>
      <TooltipValue>{fmtCurrency.format(payload[0].value)}</TooltipValue>
    </TooltipBox>
  )
}

export default function NavChart({ data, locale, currency }: NavChartProps) {
  const t = useTranslations('portal.fundDetail')

  if (data.length === 0) {
    return <EmptyState>{t('noNavData')}</EmptyState>
  }

  const textSecondary = 'rgba(249,250,251,0.6)'
  const borderColor = '#2E363F'
  const teal = '#2EC4B6'
  const gold = '#D4A843'

  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
          <XAxis
            dataKey="date"
            stroke={textSecondary}
            tick={{ fill: textSecondary, fontSize: 11 }}
            tickLine={false}
            interval="preserveStartEnd"
            angle={-30}
            dy={8}
            height={50}
          />
          <YAxis
            stroke={textSecondary}
            tick={{ fill: textSecondary, fontSize: 12 }}
            tickFormatter={abbreviateValue}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip locale={locale} currency={currency} />} />
          <Line
            type="monotone"
            dataKey="nav"
            stroke={teal}
            strokeWidth={2}
            dot={{ fill: teal, r: 3 }}
            activeDot={{ fill: gold, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
