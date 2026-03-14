'use client'

import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${spacing[8]};
  gap: ${spacing[6]};
`

const Title = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 800;
  color: ${colors.accentTeal};
  letter-spacing: -0.02em;

  ${mq.md} {
    font-size: 3.5rem;
  }

  ${mq.lg} {
    font-size: 4.5rem;
  }
`

const Subtitle = styled.h2`
  font-family: ${fonts.heading};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  letter-spacing: 0.05em;
  text-transform: uppercase;

  ${mq.md} {
    font-size: 1.5rem;
  }
`

const Description = styled.p`
  font-family: ${fonts.body};
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  max-width: 40ch;
  text-align: center;
  line-height: 1.6;

  ${mq.md} {
    font-size: 1.25rem;
  }
`

const GoldAccent = styled.span`
  display: inline-block;
  width: 3rem;
  height: 3px;
  background-color: ${colors.accentGold};
  border-radius: 2px;
`

const LocaleBadge = styled.span`
  display: inline-block;
  padding: ${spacing[1]} ${spacing[4]};
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.bg};
  background-color: ${colors.accentGold};
  border-radius: 9999px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export default function HomePage() {
  const t = useTranslations('home')
  const tc = useTranslations('common')

  return (
    <Main>
      <Title>{t('title')}</Title>
      <GoldAccent />
      <Subtitle>{t('subtitle')}</Subtitle>
      <Description>{t('description')}</Description>
      <LocaleBadge>{tc('language')}</LocaleBadge>
    </Main>
  )
}
