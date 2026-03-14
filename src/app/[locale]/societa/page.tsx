import { setRequestLocale } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
import { getPageBySlug } from '@/lib/contentful/fetchers'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import StatsSection from '@/components/sections/StatsSection'

/* ── Hero Banner ────────────────────────────────── */
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

/* ── Sections ───────────────────────────────────── */
const SectionLight = styled.section`
  padding: ${spacing[16]} ${spacing[4]};
  max-width: 1200px;
  margin: 0 auto;
`
const SectionDark = styled.section`
  padding: ${spacing[16]} ${spacing[4]};
  background: ${colors.surface};
`
const SectionDarkInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`
const SectionLabel = styled.span`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${colors.accentTeal};
  margin-bottom: ${spacing[3]};
  display: block;
`
const SectionTitle = styled.h2`
  font-family: ${fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[6]};
  ${mq.lg} { font-size: 2.5rem; }
`
const SectionText = styled.p`
  font-family: ${fonts.body};
  font-size: 1.0625rem;
  color: ${colors.textSecondary};
  line-height: 1.8;
  margin: 0 0 ${spacing[4]};
`
const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[8]};
  align-items: start;
  ${mq.lg} { grid-template-columns: 1fr 1fr; gap: ${spacing[12]}; }
`
const QuoteBlock = styled.blockquote`
  border-left: 4px solid ${colors.accentGold};
  padding: ${spacing[6]} ${spacing[8]};
  margin: ${spacing[8]} 0;
  background: rgba(212, 168, 67, 0.05);
  border-radius: 0 8px 8px 0;
`
const QuoteText = styled.p`
  font-family: ${fonts.heading};
  font-size: 1.375rem;
  font-weight: 500;
  color: ${colors.textPrimary};
  line-height: 1.6;
  margin: 0 0 ${spacing[3]};
  font-style: italic;
`
const QuoteAuthor = styled.span`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.accentGold};
  font-style: normal;
`
const Timeline = styled.div`
  position: relative;
  margin-left: 6px;
  padding-left: 32px;
  border-left: 2px solid;
  border-image: linear-gradient(to bottom, ${colors.accentTeal}, ${colors.accentGold}) 1;
`
const TimelineItem = styled.div`
  position: relative;
  margin-bottom: ${spacing[8]};
  &:last-child { margin-bottom: 0; }
  &::before {
    content: '';
    position: absolute;
    left: -39px;
    top: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${colors.accentTeal};
    border: 3px solid ${colors.surface};
  }
`
const TimelineYear = styled.span`
  font-family: ${fonts.heading};
  font-size: 0.875rem;
  font-weight: 700;
  color: ${colors.accentGold};
  letter-spacing: 0.06em;
`
const TimelineTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: ${spacing[1]} 0 ${spacing[2]};
`
const TimelineText = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`
const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};
  ${mq.md} { grid-template-columns: repeat(3, 1fr); }
`
const ValueCard = styled.div`
  padding: ${spacing[6]};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  transition: border-color 0.3s ease;
  &:hover { border-color: ${colors.accentTeal}; }
`
const ValueIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(46, 196, 182, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: ${spacing[4]};
`
const ValueTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[2]};
`
const ValueText = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`
const CTABanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${spacing[4]};
  padding: ${spacing[8]};
  background: linear-gradient(135deg, rgba(46, 196, 182, 0.1), rgba(212, 168, 67, 0.08));
  border: 1px solid ${colors.border};
  border-radius: 12px;
  margin-top: ${spacing[12]};
`
const CTAText = styled.p`
  font-family: ${fonts.heading};
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
`
const CTALink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[3]} ${spacing[6]};
  background: ${colors.accentTeal};
  color: ${colors.bg};
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.2s ease;
  &:hover { opacity: 0.9; }
`

/* ── Types ──────────────────────────────────────── */
interface SocietaSections {
  hero: { title: string; subtitle: string }
  intro: { label: string; title: string; paragraphs: string[]; quote: { text: string; author: string } }
  timeline: { label: string; title: string; description: string; items: { year: string; title: string; text: string }[] }
  mission: { label: string; title: string; paragraphs: string[] }
  approach: { label: string; title: string; paragraphs: string[] }
  values: { label: string; title: string; items: { icon: string; title: string; text: string }[] }
  linkedin: { text: string; url: string }
}

/* ── Page ───────────────────────────────────────── */
export default async function SocietaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const page = await getPageBySlug('societa', locale)
  const s = (page?.fields.sections ?? null) as SocietaSections | null

  if (!s) {
    return (
      <SectionLight>
        <HeroTitle>Società</HeroTitle>
        <SectionText>Content coming soon.</SectionText>
      </SectionLight>
    )
  }

  return (
    <>
      <HeroBanner>
        <Image src="/images/hero-about.jpg" alt={s.hero.title} fill style={{ objectFit: 'cover' }} priority />
        <HeroContent>
          <HeroTitle>{s.hero.title}</HeroTitle>
          <HeroSubtitle>{s.hero.subtitle}</HeroSubtitle>
        </HeroContent>
      </HeroBanner>

      <SectionLight>
        <TwoColumn>
          <div>
            <SectionLabel>{s.intro.label}</SectionLabel>
            <SectionTitle>{s.intro.title}</SectionTitle>
            {s.intro.paragraphs.map((p, i) => <SectionText key={i}>{p}</SectionText>)}
          </div>
          <QuoteBlock>
            <QuoteText>{s.intro.quote.text}</QuoteText>
            <QuoteAuthor>— {s.intro.quote.author}</QuoteAuthor>
          </QuoteBlock>
        </TwoColumn>
      </SectionLight>

      <StatsSection />

      <SectionDark>
        <SectionDarkInner>
          <TwoColumn>
            <div>
              <SectionLabel>{s.timeline.label}</SectionLabel>
              <SectionTitle>{s.timeline.title}</SectionTitle>
              <SectionText>{s.timeline.description}</SectionText>
            </div>
            <Timeline>
              {s.timeline.items.map((item, i) => (
                <TimelineItem key={i}>
                  <TimelineYear>{item.year}</TimelineYear>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineText>{item.text}</TimelineText>
                </TimelineItem>
              ))}
            </Timeline>
          </TwoColumn>
        </SectionDarkInner>
      </SectionDark>

      <SectionLight>
        <TwoColumn>
          <div>
            <SectionLabel>{s.mission.label}</SectionLabel>
            <SectionTitle>{s.mission.title}</SectionTitle>
            {s.mission.paragraphs.map((p, i) => <SectionText key={i}>{p}</SectionText>)}
          </div>
          <div>
            <SectionLabel>{s.approach.label}</SectionLabel>
            <SectionTitle>{s.approach.title}</SectionTitle>
            {s.approach.paragraphs.map((p, i) => <SectionText key={i}>{p}</SectionText>)}
          </div>
        </TwoColumn>
      </SectionLight>

      <SectionDark>
        <SectionDarkInner>
          <SectionLabel>{s.values.label}</SectionLabel>
          <SectionTitle>{s.values.title}</SectionTitle>
          <ValuesGrid>
            {s.values.items.map((v, i) => (
              <ValueCard key={i}>
                <ValueIcon>{v.icon}</ValueIcon>
                <ValueTitle>{v.title}</ValueTitle>
                <ValueText>{v.text}</ValueText>
              </ValueCard>
            ))}
          </ValuesGrid>
          <CTABanner>
            <CTAText>{s.linkedin.text}</CTAText>
            <CTALink href={s.linkedin.url} target="_blank" rel="noopener noreferrer">
              LinkedIn →
            </CTALink>
          </CTABanner>
        </SectionDarkInner>
      </SectionDark>
    </>
  )
}
