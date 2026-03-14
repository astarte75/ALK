'use client'

import styled from 'styled-components'
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

const Heading = styled.h1`
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

const Subtitle = styled.p`
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

export default function Home() {
  return (
    <Main>
      <Heading>Alkemia Capital</Heading>
      <GoldAccent />
      <Subtitle>
        Private equity e venture capital. Investiamo nel potenziale trasformativo delle imprese
        italiane ed europee.
      </Subtitle>
    </Main>
  )
}
