'use client'

import { useRef } from 'react'
import styled from 'styled-components'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-init'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const Section = styled.section`
  padding: ${spacing[16]} ${spacing[6]};
`

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto ${spacing[8]};
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`

const Title = styled.h2`
  font-family: ${fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;

  ${mq.md} {
    font-size: 2.5rem;
  }
`

const ViewAllLink = styled.a`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.accentTeal};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};
  max-width: 1200px;
  margin: 0 auto;

  ${mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`

interface AnimatedNewsPreviewProps {
  title?: string
  ctaText?: string
  newsPath: string
  children: React.ReactNode
}

export default function AnimatedNewsPreview({ title, ctaText, newsPath, children }: AnimatedNewsPreviewProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    const mm = gsap.matchMedia()

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { reduceMotion } = context.conditions!

      if (reduceMotion) return

      // Fade up header
      gsap.from('[data-news-header]', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Stagger cards
      const cards = sectionRef.current!.querySelectorAll('[data-news-card]')
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    })
  }, { scope: sectionRef })

  return (
    <Section ref={sectionRef}>
      <Header data-news-header>
        <Title>{title || 'News'}</Title>
        <ViewAllLink href={newsPath}>{ctaText || '→'}</ViewAllLink>
      </Header>
      <Grid>
        {children}
      </Grid>
    </Section>
  )
}
