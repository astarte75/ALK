'use client'

import { useRef } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const NarrativeWrapper = styled.div`
  position: relative;
`

const Panel = styled.section`
  position: relative;
  height: 100vh;
  height: min(100svh, 800px);
  display: flex;
  align-items: center;
  overflow: hidden;
`

const PanelImageWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`

const PanelOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(26, 30, 34, 0.88) 0%,
    rgba(26, 30, 34, 0.6) 100%
  );
  z-index: 1;
`

const PanelContent = styled.div`
  position: relative;
  z-index: 2;
  padding: ${spacing[6]};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const PanelTitle = styled.h2`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  line-height: 1.1;
  margin: 0 0 ${spacing[4]};
  max-width: 600px;

  ${mq.md} {
    font-size: 3.5rem;
  }

  ${mq.lg} {
    font-size: 4.5rem;
  }
`

const PanelDescription = styled.p`
  font-family: ${fonts.body};
  font-size: 1rem;
  color: ${colors.textSecondary};
  line-height: 1.7;
  max-width: 500px;
  margin: 0 0 ${spacing[6]};
  text-align: justify;

  ${mq.md} {
    font-size: 1.125rem;
  }
`

const PanelCta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${fonts.body};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.accentTeal};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: gap 0.3s ease;

  &:hover {
    gap: 1rem;
  }

  &::after {
    content: '→';
    font-size: 1.2em;
  }
`

const PanelNumber = styled.span`
  font-family: ${fonts.heading};
  font-size: 8rem;
  font-weight: 800;
  color: ${colors.accentTeal};
  opacity: 0.06;
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  z-index: 2;
  line-height: 1;

  ${mq.md} {
    font-size: 12rem;
  }
`

interface NarrativePanel {
  title: string
  description: string
  ctaText: string
  ctaLink: string
  image: string
}

interface ScrollNarrativeProps {
  panels?: NarrativePanel[]
  locale: string
}

const DEFAULT_PANELS_IT: NarrativePanel[] = [
  {
    title: 'Oltre il capitale',
    description: 'Da oltre 20 anni affianchiamo imprenditori italiani con competenza operativa, visione strategica e capitale paziente. Non solo investitori, ma partner nel percorso di crescita.',
    ctaText: 'Chi siamo',
    ctaLink: '/societa',
    image: '/images/hero-about.jpg',
  },
  {
    title: 'Piattaforme di investimento',
    description: 'Private Equity, Venture Capital e PIPE: tre strategie complementari per sostenere le imprese in ogni fase del loro percorso di crescita.',
    ctaText: 'Le nostre piattaforme',
    ctaLink: '/investment-platforms',
    image: '/images/hero-platforms.jpg',
  },
  {
    title: 'Creazione di valore',
    description: '29 operazioni completate, 18 aziende in portfolio e €270M di asset under management. Numeri che raccontano una storia di crescita concreta.',
    ctaText: 'Portfolio',
    ctaLink: '/portfolio',
    image: '/images/hero-portfolio.jpg',
  },
  {
    title: 'La nostra squadra',
    description: 'Un team di professionisti con competenze complementari, uniti dalla passione per l\'innovazione e dall\'impegno verso l\'eccellenza operativa.',
    ctaText: 'Il team',
    ctaLink: '/team',
    image: '/images/hero-team.jpg',
  },
]

const DEFAULT_PANELS_EN: NarrativePanel[] = [
  {
    title: 'Beyond Capital',
    description: 'For over 20 years, we have supported Italian entrepreneurs with operational expertise, strategic vision and patient capital. Not just investors, but partners in the growth journey.',
    ctaText: 'About us',
    ctaLink: '/en/societa',
    image: '/images/hero-about.jpg',
  },
  {
    title: 'Investment Platforms',
    description: 'Private Equity, Venture Capital and PIPE: three complementary strategies to support companies at every stage of their growth journey.',
    ctaText: 'Our platforms',
    ctaLink: '/en/investment-platforms',
    image: '/images/hero-platforms.jpg',
  },
  {
    title: 'Value Creation',
    description: '29 completed operations, 18 portfolio companies and €270M in assets under management. Numbers that tell a story of concrete growth.',
    ctaText: 'Portfolio',
    ctaLink: '/en/portfolio',
    image: '/images/hero-portfolio.jpg',
  },
  {
    title: 'Our Team',
    description: 'A team of professionals with complementary skills, united by a passion for innovation and a commitment to operational excellence.',
    ctaText: 'The team',
    ctaLink: '/en/team',
    image: '/images/hero-team.jpg',
  },
]

export default function ScrollNarrative({ panels, locale }: ScrollNarrativeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const data = panels || (locale === 'en' ? DEFAULT_PANELS_EN : DEFAULT_PANELS_IT)

  useGSAP(() => {
    if (!wrapperRef.current) return

    const mm = gsap.matchMedia()

    mm.add({
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { reduceMotion } = context.conditions!

      if (reduceMotion) return

      const panelEls = wrapperRef.current!.querySelectorAll('[data-narrative-panel]')

      panelEls.forEach((panel) => {
        const title = panel.querySelector('[data-panel-title]')
        const desc = panel.querySelector('[data-panel-desc]')
        const cta = panel.querySelector('[data-panel-cta]')
        const img = panel.querySelector('[data-panel-img]')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        })

        // Image parallax
        if (img) {
          gsap.to(img, {
            y: -60,
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        // Content reveals
        if (title) {
          tl.from(title, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          })
        }

        if (desc) {
          tl.from(desc, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
          }, '-=0.4')
        }

        if (cta) {
          tl.from(cta, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.out',
          }, '-=0.3')
        }
      })
    })
  }, { scope: wrapperRef })

  return (
    <NarrativeWrapper ref={wrapperRef}>
      {data.map((panel, i) => (
        <Panel key={i} data-narrative-panel>
          <PanelImageWrapper>
            <Image
              src={panel.image}
              alt=""
              fill
              quality={80}
              style={{ objectFit: 'cover', transform: 'scale(1.1)' }}
              data-panel-img
            />
          </PanelImageWrapper>
          <PanelOverlay />
          <PanelContent>
            <PanelTitle data-panel-title>{panel.title}</PanelTitle>
            <PanelDescription data-panel-desc>{panel.description}</PanelDescription>
            <PanelCta href={panel.ctaLink} data-panel-cta>{panel.ctaText}</PanelCta>
          </PanelContent>
          <PanelNumber aria-hidden="true">0{i + 1}</PanelNumber>
        </Panel>
      ))}
    </NarrativeWrapper>
  )
}
