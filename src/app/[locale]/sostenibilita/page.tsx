import { setRequestLocale } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
import { getPageBySlug } from '@/lib/contentful/fetchers'
import { getClient } from '@/lib/contentful/client'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

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
  margin: 0;
  background: rgba(212, 168, 67, 0.05);
  border-radius: 0 8px 8px 0;
`
const QuoteText = styled.p`
  font-family: ${fonts.heading};
  font-size: 1.375rem;
  font-weight: 500;
  color: ${colors.textPrimary};
  line-height: 1.6;
  margin: 0;
  font-style: italic;
`

/* ── Pillar Cards ───────────────────────────────── */
const PillarGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};
  ${mq.md} { grid-template-columns: repeat(3, 1fr); }
`
const PillarCard = styled.div<{ $accent: string }>`
  padding: ${spacing[8]} ${spacing[6]};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  border-top: 3px solid ${({ $accent }) => $accent};
  transition: transform 0.3s ease, border-color 0.3s ease;
  &:hover { transform: translateY(-4px); border-color: ${({ $accent }) => $accent}; }
`
const PillarIcon = styled.div<{ $accent: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ $accent }) => `${$accent}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: ${spacing[4]};
`
const PillarTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[3]};
`
const PillarText = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`

/* ── SFDR Cards ─────────────────────────────────── */
const DisclosureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[4]};
  ${mq.md} { grid-template-columns: repeat(3, 1fr); }
`
const DisclosureCard = styled.div`
  padding: ${spacing[6]};
  background: ${colors.bg};
  border: 1px solid ${colors.border};
  border-radius: 12px;
`
const DisclosureArticle = styled.span`
  font-family: ${fonts.heading};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${colors.accentGold};
  display: block;
  margin-bottom: ${spacing[2]};
`
const DisclosureTitle = styled.h4`
  font-family: ${fonts.heading};
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[2]};
`
const DisclosureText = styled.p`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`

/* ── Roadmap ────────────────────────────────────── */
const RoadmapList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`
const RoadmapItem = styled.div`
  display: flex;
  gap: ${spacing[4]};
  align-items: flex-start;
  padding: ${spacing[4]} ${spacing[6]};
  border: 1px solid ${colors.border};
  border-radius: 8px;
`
const RoadmapDot = styled.div<{ $done?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $done }) => $done ? colors.accentTeal : colors.accentGold};
  flex-shrink: 0;
  margin-top: 4px;
`
const RoadmapLabel = styled.span`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`
const RoadmapText = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.textPrimary};
  margin: ${spacing[1]} 0 0;
  line-height: 1.6;
`

/* ── Document Downloads ─────────────────────────── */
const DocList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`
const DocLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  padding: ${spacing[4]} ${spacing[6]};
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.2s ease;
  &:hover { border-color: ${colors.accentTeal}; }
`
const DocIcon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`
const DocTitle = styled.span`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.textPrimary};
  flex: 1;
`
const DocAction = styled.span`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: ${colors.accentTeal};
  flex-shrink: 0;
`

/* ── Types ──────────────────────────────────────── */
const PILLAR_ACCENTS = [colors.accentTeal, colors.accentGold, colors.textPrimary]

interface SostenibilitaSections {
  hero: { title: string; subtitle: string }
  intro: { label: string; title: string; paragraphs: string[]; quote: string }
  pillars: { label: string; title: string; items: { icon: string; title: string; text: string }[] }
  sfdr: { label: string; title: string; description: string; items: { article: string; title: string; text: string }[] }
  roadmap: { label: string; title: string; description: string; items: { status: string; label: string; text: string }[] }
  documents?: { label: string; title: string; items: { title: string; assetId: string }[] }
}

/* ── Page ───────────────────────────────────────── */
export default async function SostenibilitaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const page = await getPageBySlug('sostenibilita', locale)
  const s = (page?.fields.sections ?? null) as SostenibilitaSections | null

  // Resolve document asset URLs
  const docUrls = new Map<string, string>()
  if (s?.documents?.items) {
    const client = getClient()
    for (const doc of s.documents.items) {
      try {
        const asset = await client.getAsset(doc.assetId)
        const url = asset.fields.file?.url
        if (url) docUrls.set(doc.assetId, `https:${url}`)
      } catch { /* skip */ }
    }
  }

  if (!s) {
    return (
      <SectionLight>
        <HeroTitle>Sostenibilità</HeroTitle>
        <SectionText>Content coming soon.</SectionText>
      </SectionLight>
    )
  }

  return (
    <>
      <HeroBanner>
        <Image src="/images/hero-sustainability-3.jpg" alt={s.hero.title} fill style={{ objectFit: 'cover' }} priority />
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
            <QuoteText>{s.intro.quote}</QuoteText>
          </QuoteBlock>
        </TwoColumn>
      </SectionLight>

      <SectionDark>
        <SectionDarkInner>
          <SectionLabel>{s.pillars.label}</SectionLabel>
          <SectionTitle>{s.pillars.title}</SectionTitle>
          <PillarGrid>
            {s.pillars.items.map((p, i) => (
              <PillarCard key={i} $accent={PILLAR_ACCENTS[i] || colors.accentTeal}>
                <PillarIcon $accent={PILLAR_ACCENTS[i] || colors.accentTeal}>{p.icon}</PillarIcon>
                <PillarTitle>{p.title}</PillarTitle>
                <PillarText>{p.text}</PillarText>
              </PillarCard>
            ))}
          </PillarGrid>
        </SectionDarkInner>
      </SectionDark>

      <SectionLight>
        <SectionLabel>{s.sfdr.label}</SectionLabel>
        <SectionTitle>{s.sfdr.title}</SectionTitle>
        <SectionText>{s.sfdr.description}</SectionText>
        <DisclosureGrid>
          {s.sfdr.items.map((d, i) => (
            <DisclosureCard key={i}>
              <DisclosureArticle>{d.article}</DisclosureArticle>
              <DisclosureTitle>{d.title}</DisclosureTitle>
              <DisclosureText>{d.text}</DisclosureText>
            </DisclosureCard>
          ))}
        </DisclosureGrid>
      </SectionLight>

      <SectionDark>
        <SectionDarkInner>
          <SectionLabel>{s.roadmap.label}</SectionLabel>
          <SectionTitle>{s.roadmap.title}</SectionTitle>
          <SectionText>{s.roadmap.description}</SectionText>
          <RoadmapList>
            {s.roadmap.items.map((r, i) => (
              <RoadmapItem key={i}>
                <RoadmapDot $done={r.status === 'done'} />
                <div>
                  <RoadmapLabel>{r.label}</RoadmapLabel>
                  <RoadmapText>{r.text}</RoadmapText>
                </div>
              </RoadmapItem>
            ))}
          </RoadmapList>
        </SectionDarkInner>
      </SectionDark>

      {s.documents && s.documents.items.length > 0 && (
        <SectionLight>
          <SectionLabel>{s.documents.label}</SectionLabel>
          <SectionTitle>{s.documents.title}</SectionTitle>
          <DocList>
            {s.documents.items.map((doc, i) => {
              const url = docUrls.get(doc.assetId)
              if (!url) return null
              return (
                <DocLink key={i} href={url} target="_blank" rel="noopener noreferrer" download>
                  <DocIcon>📄</DocIcon>
                  <DocTitle>{doc.title}</DocTitle>
                  <DocAction>Download ↓</DocAction>
                </DocLink>
              )
            })}
          </DocList>
        </SectionLight>
      )}
    </>
  )
}
