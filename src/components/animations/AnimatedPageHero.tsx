'use client'

import { useRef } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
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

const ImageContainer = styled.div`
  position: absolute;
  inset: 0;
  will-change: transform;
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

  ${mq.lg} {
    font-size: 3.75rem;
  }
`

const GoldAccent = styled.span`
  display: block;
  width: 0;
  height: 3px;
  background-color: ${colors.accentGold};
  border-radius: 2px;
  margin: ${spacing[3]} 0;
`

const HeroSubtitle = styled.p`
  font-family: ${fonts.body};
  font-size: 1.25rem;
  color: ${colors.textSecondary};
  margin: 0;
  line-height: 1.6;
`

interface AnimatedPageHeroProps {
  imageSrc: string
  title: string
  subtitle?: string
  imagePosition?: string
}

export default function AnimatedPageHero({
  imageSrc,
  title,
  subtitle,
  imagePosition = 'center',
}: AnimatedPageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    const mm = gsap.matchMedia()

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      normal: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions!
      const section = sectionRef.current!

      const titleEl = section.querySelector('[data-hero-title]')
      const accentEl = section.querySelector('[data-hero-accent]')
      const subtitleEl = section.querySelector('[data-hero-subtitle]')
      const imageContainer = section.querySelector('[data-hero-image]')

      if (reduceMotion) {
        // Show everything immediately
        gsap.set([titleEl, accentEl, subtitleEl].filter(Boolean), {
          opacity: 1,
          y: 0,
        })
        if (accentEl) gsap.set(accentEl, { width: '3rem' })
        return
      }

      // Title fade-in
      if (titleEl) {
        gsap.from(titleEl, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.1,
        })
      }

      // Gold accent bar animates width
      if (accentEl) {
        gsap.to(accentEl, {
          width: '3rem',
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.5,
        })
      }

      // Subtitle fade-in after title
      if (subtitleEl) {
        gsap.from(subtitleEl, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: 0.4,
        })
      }

      // Parallax on scroll — subtle (80px max)
      if (imageContainer) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            gsap.set(imageContainer, {
              y: self.progress * 80,
            })
          },
        })
      }
    })
  }, { scope: sectionRef })

  return (
    <HeroBanner ref={sectionRef}>
      <ImageContainer data-hero-image>
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: 'cover', objectPosition: imagePosition }}
          priority
        />
      </ImageContainer>
      <HeroContent>
        <HeroTitle data-hero-title>{title}</HeroTitle>
        <GoldAccent data-hero-accent />
        {subtitle && <HeroSubtitle data-hero-subtitle>{subtitle}</HeroSubtitle>}
      </HeroContent>
    </HeroBanner>
  )
}
