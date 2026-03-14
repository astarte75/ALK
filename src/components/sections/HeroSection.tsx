'use client'

import styled from 'styled-components'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const HeroWrapper = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(26, 30, 34, 0.4) 0%,
    rgba(26, 30, 34, 0.8) 100%
  );
  z-index: 1;
`

const Content = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${spacing[6]};
  max-width: 800px;
`

const Logo = styled.div`
  margin-bottom: ${spacing[8]};
`

const Headline = styled.h1`
  font-family: ${fonts.heading};
  font-size: 3rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;

  ${mq.md} {
    font-size: 4rem;
  }

  ${mq.lg} {
    font-size: 5.5rem;
  }
`

const GoldAccent = styled.span`
  display: block;
  width: 3rem;
  height: 3px;
  background-color: ${colors.accentGold};
  border-radius: 2px;
  margin: ${spacing[6]} auto;
`

const Subtitle = styled.p`
  font-family: ${fonts.body};
  font-size: 1rem;
  color: ${colors.textSecondary};
  max-width: 600px;
  line-height: 1.7;
  margin: 0;

  ${mq.md} {
    font-size: 1.125rem;
  }
`

export default function HeroSection() {
  const t = useTranslations('home')

  return (
    <HeroWrapper>
      <Image
        src="/images/hero-poster.jpg"
        alt=""
        fill
        priority
        quality={90}
        style={{ objectFit: 'cover' }}
      />
      <Overlay />
      <Content>
        <Logo>
          <Image
            src="/images/alkemia-logo-white.png"
            alt="Alkemia Capital"
            width={180}
            height={60}
            style={{ height: 'auto' }}
          />
        </Logo>
        <Headline>{t('headline')}</Headline>
        <GoldAccent />
        <Subtitle>{t('subtitle')}</Subtitle>
      </Content>
    </HeroWrapper>
  )
}
