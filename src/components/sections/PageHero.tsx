import styled from 'styled-components'
import Image from 'next/image'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const HeroBanner = styled.section`
  position: relative;
  height: 50vh;
  min-height: 360px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--color-bg) 0%, transparent 60%);
    z-index: 1;
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: ${spacing[12]} ${spacing[4]};
`

const HeroTitle = styled.h1`
  font-family: ${fonts.heading};
  font-size: 3rem;
  font-weight: 800;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[3]};
  ${mq.lg} { font-size: 3.75rem; }
`

const HeroSubtitle = styled.p`
  font-family: ${fonts.body};
  font-size: 1.25rem;
  color: ${colors.textSecondary};
  margin: 0;
  line-height: 1.6;
`

interface PageHeroProps {
  imageSrc: string
  title: string
  subtitle?: string
  imagePosition?: string
}

export default function PageHero({ imageSrc, title, subtitle, imagePosition = 'center' }: PageHeroProps) {
  return (
    <HeroBanner>
      <Image src={imageSrc} alt={title} fill style={{ objectFit: 'cover', objectPosition: imagePosition }} priority />
      <HeroContent>
        <HeroTitle>{title}</HeroTitle>
        {subtitle && <HeroSubtitle>{subtitle}</HeroSubtitle>}
      </HeroContent>
    </HeroBanner>
  )
}
