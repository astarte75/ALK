'use client'

import styled from 'styled-components'
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

interface StatItem {
  value: string
  label: string
}

interface StatsSectionProps {
  stats?: StatItem[]
}

const DEFAULT_STATS: StatItem[] = [
  { value: '~20', label: 'Years' },
  { value: '€270M', label: 'AUM' },
  { value: '29', label: 'Transactions' },
  { value: '18', label: 'Companies' },
]

export default function StatsSection({ stats }: StatsSectionProps) {
  const data = stats && stats.length > 0 ? stats : DEFAULT_STATS

  return (
    <Section>
      <Grid>
        {data.map((stat, i) => (
          <StatItem key={i}>
            <StatValue data-stat-value={stat.value}>
              {stat.value}
            </StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatItem>
        ))}
      </Grid>
    </Section>
  )
}
