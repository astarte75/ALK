'use client'

import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const Section = styled.section`
  background: ${colors.surface};
  padding: ${spacing[16]} ${spacing[6]};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[8]};
  max-width: 1000px;
  margin: 0 auto;

  ${mq.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const StatItem = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.accentTeal};
  line-height: 1.2;

  ${mq.md} {
    font-size: 3rem;
  }
`

const StatLabel = styled.div`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin-top: ${spacing[2]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const stats = [
  { value: '~20', prefix: '', suffix: '', labelKey: 'stats.years' },
  { value: '270', prefix: 'EUR', suffix: 'M', labelKey: 'stats.aum' },
  { value: '29', prefix: '', suffix: '', labelKey: 'stats.operations' },
  { value: '18', prefix: '', suffix: '', labelKey: 'stats.companies' },
] as const

export default function StatsSection() {
  const t = useTranslations('home')

  return (
    <Section>
      <Grid>
        {stats.map((stat) => (
          <StatItem key={stat.labelKey}>
            <StatValue data-stat-value={stat.value}>
              {stat.prefix}
              {stat.value}
              {stat.suffix}
            </StatValue>
            <StatLabel>{t(stat.labelKey)}</StatLabel>
          </StatItem>
        ))}
      </Grid>
    </Section>
  )
}
