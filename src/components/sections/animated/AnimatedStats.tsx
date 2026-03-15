'use client'

import { useRef } from 'react'
import styled from 'styled-components'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
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

interface Stat {
  value: string
  label: string
}

interface AnimatedStatsProps {
  stats?: Stat[]
}

const DEFAULT_STATS: Stat[] = [
  { value: '~20', label: 'Years' },
  { value: '€270M', label: 'AUM' },
  { value: '29', label: 'Transactions' },
  { value: '18', label: 'Companies' },
]

function parseStatValue(value: string): { prefix: string; number: number; suffix: string } {
  const match = value.match(/^([^0-9]*?)(\d+)(.*)$/)
  if (!match) return { prefix: '', number: 0, suffix: value }
  return {
    prefix: match[1],
    number: parseInt(match[2], 10),
    suffix: match[3],
  }
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const data = stats && stats.length > 0 ? stats : DEFAULT_STATS

  useGSAP(() => {
    if (!sectionRef.current) return

    const mm = gsap.matchMedia()

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { reduceMotion } = context.conditions!

      if (reduceMotion) return

      const valueEls = sectionRef.current!.querySelectorAll<HTMLElement>('[data-stat-value]')
      const itemEls = sectionRef.current!.querySelectorAll('[data-stat-item]')

      // Fade-up stagger for stat items
      gsap.from(itemEls, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Counter animation for each stat value
      valueEls.forEach((el) => {
        const rawValue = el.getAttribute('data-stat-value') || ''
        const { prefix, number, suffix } = parseStatValue(rawValue)

        if (number === 0) return

        const counter = { val: 0 }

        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              val: number,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`
              },
            })
          },
        })
      })
    })
  }, { scope: sectionRef })

  return (
    <Section ref={sectionRef}>
      <Grid>
        {data.map((stat, i) => (
          <StatItem key={i} data-stat-item>
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
