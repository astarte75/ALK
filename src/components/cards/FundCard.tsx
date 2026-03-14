'use client'

import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import type { Fund } from '@/lib/contentful/types'

const Card = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: ${spacing[6]};
`

const FundName = styled.h4`
  font-family: ${fonts.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[4]};
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[4]};

  ${mq.sm} {
    grid-template-columns: 1fr 1fr;
  }
`

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`

const MetricLabel = styled.span`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const MetricValue = styled.span`
  font-family: ${fonts.body};
  font-size: 1rem;
  color: ${colors.textPrimary};
`

const StatusValue = styled.span<{ $active: boolean }>`
  font-family: ${fonts.body};
  font-size: 1rem;
  color: ${({ $active }) => ($active ? colors.accentTeal : colors.textSecondary)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`

export default function FundCard({ fund }: { fund: Fund }) {
  const t = useTranslations('investmentPlatforms')
  const { name, fundSize, status, investmentPeriod, strategy } = fund.fields
  const isActive = status?.toLowerCase() === 'active'

  return (
    <Card>
      <FundName>{name}</FundName>
      <MetricsGrid>
        {fundSize && (
          <Metric>
            <MetricLabel>{t('fundSize')}</MetricLabel>
            <MetricValue>{fundSize}</MetricValue>
          </Metric>
        )}
        {status && (
          <Metric>
            <MetricLabel>{t('status')}</MetricLabel>
            <StatusValue $active={isActive}>{status}</StatusValue>
          </Metric>
        )}
        {investmentPeriod && (
          <Metric>
            <MetricLabel>{t('investmentPeriod')}</MetricLabel>
            <MetricValue>{investmentPeriod}</MetricValue>
          </Metric>
        )}
        {strategy && (
          <Metric>
            <MetricLabel>{t('strategy')}</MetricLabel>
            <MetricValue>{strategy}</MetricValue>
          </Metric>
        )}
      </MetricsGrid>
    </Card>
  )
}
