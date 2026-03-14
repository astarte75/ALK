import { setRequestLocale } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
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

  ${mq.lg} {
    font-size: 3.75rem;
  }
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

  ${mq.lg} {
    font-size: 2.5rem;
  }
`

const SectionText = styled.p`
  font-family: ${fonts.body};
  font-size: 1.0625rem;
  color: ${colors.textSecondary};
  line-height: 1.8;
  margin: 0 0 ${spacing[4]};
`

/* ── Two Column ─────────────────────────────────── */

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[8]};
  align-items: start;

  ${mq.lg} {
    grid-template-columns: 1fr 1fr;
    gap: ${spacing[12]};
  }
`

/* ── ESG Pillar Cards ───────────────────────────── */

const PillarGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const PillarCard = styled.div<{ $accent: string }>`
  padding: ${spacing[8]} ${spacing[6]};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  border-top: 3px solid ${({ $accent }) => $accent};
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ $accent }) => $accent};
  }
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

/* ── Quote ──────────────────────────────────────── */

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

/* ── SFDR Disclosure ────────────────────────────── */

const DisclosureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[4]};

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
  }
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

const RoadmapContent = styled.div`
  flex: 1;
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

/* ── Page ───────────────────────────────────────── */

export default async function SostenibilitaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const isIT = locale === 'it'

  return (
    <>
      {/* Hero */}
      <HeroBanner>
        <Image
          src="/images/hero-poster.jpg"
          alt="Sustainability"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <HeroContent>
          <HeroTitle>
            {isIT ? 'Sostenibilità' : 'Sustainability'}
          </HeroTitle>
          <HeroSubtitle>
            {isIT
              ? 'Integriamo criteri ESG in ogni decisione di investimento per generare valore responsabile e duraturo.'
              : 'We integrate ESG criteria into every investment decision to generate responsible and lasting value.'}
          </HeroSubtitle>
        </HeroContent>
      </HeroBanner>

      {/* Intro */}
      <SectionLight>
        <TwoColumn>
          <div>
            <SectionLabel>ESG</SectionLabel>
            <SectionTitle>
              {isIT ? 'Il nostro impegno verso la sostenibilità' : 'Our commitment to sustainability'}
            </SectionTitle>
            <SectionText>
              {isIT
                ? 'Alkemia riconosce che la creazione di valore a lungo termine è inseparabile da una gestione responsabile delle risorse ambientali, del capitale umano e della governance aziendale. Per questo abbiamo sviluppato una policy ESG che guida le nostre decisioni di investimento e i nostri processi operativi.'
                : 'Alkemia recognizes that long-term value creation is inseparable from responsible management of environmental resources, human capital, and corporate governance. That is why we have developed an ESG policy that guides our investment decisions and operational processes.'}
            </SectionText>
            <SectionText>
              {isIT
                ? 'Crediamo che l\'adozione di criteri ESG non sia solo un obbligo normativo, ma un\'opportunità concreta per migliorare la qualità degli investimenti e contribuire positivamente all\'ambiente e alla società.'
                : 'We believe that adopting ESG criteria is not just a regulatory obligation, but a concrete opportunity to improve investment quality and contribute positively to the environment and society.'}
            </SectionText>
          </div>
          <QuoteBlock>
            <QuoteText>
              {isIT
                ? '«Abbiamo scelto di integrare in modo strutturale i fattori ESG nella nostra governance, perché riteniamo che sostenibilità e performance di lungo periodo siano ormai inscindibili.»'
                : '"We have chosen to structurally integrate ESG factors into our governance, because we believe sustainability and long-term performance are now inseparable."'}
            </QuoteText>
          </QuoteBlock>
        </TwoColumn>
      </SectionLight>

      {/* Three Pillars */}
      <SectionDark>
        <SectionDarkInner>
          <SectionLabel>{isIT ? 'I Tre Pilastri' : 'The Three Pillars'}</SectionLabel>
          <SectionTitle>
            {isIT ? 'Environment, Social, Governance' : 'Environment, Social, Governance'}
          </SectionTitle>
          <PillarGrid>
            <PillarCard $accent={colors.accentTeal}>
              <PillarIcon $accent={colors.accentTeal}>🌱</PillarIcon>
              <PillarTitle>{isIT ? 'Ambiente' : 'Environment'}</PillarTitle>
              <PillarText>
                {isIT
                  ? 'Identifichiamo opportunità di investimento che contribuiscano positivamente all\'ambiente, privilegiando aziende impegnate nella riduzione dell\'impatto ambientale, nell\'efficienza energetica e nell\'economia circolare.'
                  : 'We identify investment opportunities that contribute positively to the environment, favoring companies committed to reducing environmental impact, energy efficiency, and the circular economy.'}
              </PillarText>
            </PillarCard>
            <PillarCard $accent={colors.accentGold}>
              <PillarIcon $accent={colors.accentGold}>🤝</PillarIcon>
              <PillarTitle>{isIT ? 'Sociale' : 'Social'}</PillarTitle>
              <PillarText>
                {isIT
                  ? 'Sosteniamo il benessere delle persone e delle comunità locali, favorendo pratiche di lavoro equo, inclusione, diversità e sviluppo del capitale umano nelle aziende in portafoglio.'
                  : 'We support the well-being of people and local communities, fostering fair labor practices, inclusion, diversity, and human capital development in portfolio companies.'}
              </PillarText>
            </PillarCard>
            <PillarCard $accent={colors.textPrimary}>
              <PillarIcon $accent={colors.textPrimary}>⚖️</PillarIcon>
              <PillarTitle>Governance</PillarTitle>
              <PillarText>
                {isIT
                  ? 'Manteniamo i più alti standard di trasparenza e responsabilità nelle nostre operazioni, promuovendo strutture di governance solide e pratiche di gestione del rischio nelle aziende in cui investiamo.'
                  : 'We maintain the highest standards of transparency and accountability in our operations, promoting solid governance structures and risk management practices in the companies we invest in.'}
              </PillarText>
            </PillarCard>
          </PillarGrid>
        </SectionDarkInner>
      </SectionDark>

      {/* SFDR Disclosure */}
      <SectionLight>
        <SectionLabel>{isIT ? 'Informativa Regolamentare' : 'Regulatory Disclosure'}</SectionLabel>
        <SectionTitle>SFDR — Sustainable Finance Disclosure Regulation</SectionTitle>
        <SectionText>
          {isIT
            ? 'In conformità al Regolamento (UE) 2019/2088, Alkemia fornisce le seguenti informative sulla sostenibilità nel settore dei servizi finanziari.'
            : 'In accordance with Regulation (EU) 2019/2088, Alkemia provides the following disclosures on sustainability in the financial services sector.'}
        </SectionText>
        <DisclosureGrid>
          <DisclosureCard>
            <DisclosureArticle>{isIT ? 'Articolo 3' : 'Article 3'}</DisclosureArticle>
            <DisclosureTitle>{isIT ? 'Politiche di rischio di sostenibilità' : 'Sustainability Risk Policies'}</DisclosureTitle>
            <DisclosureText>
              {isIT
                ? 'Alkemia integra i rischi di sostenibilità nel processo decisionale di investimento, valutando l\'impatto potenziale di eventi ESG sul valore degli investimenti.'
                : 'Alkemia integrates sustainability risks into the investment decision-making process, assessing the potential impact of ESG events on investment value.'}
            </DisclosureText>
          </DisclosureCard>
          <DisclosureCard>
            <DisclosureArticle>{isIT ? 'Articolo 4' : 'Article 4'}</DisclosureArticle>
            <DisclosureTitle>{isIT ? 'Effetti negativi sulla sostenibilità' : 'Adverse Sustainability Impacts'}</DisclosureTitle>
            <DisclosureText>
              {isIT
                ? 'Alkemia dichiara di non tenere attualmente in considerazione gli effetti negativi delle decisioni di investimento sui fattori di sostenibilità, ma si impegna a sviluppare tale framework.'
                : 'Alkemia currently does not consider the adverse impacts of investment decisions on sustainability factors, but is committed to developing such a framework.'}
            </DisclosureText>
          </DisclosureCard>
          <DisclosureCard>
            <DisclosureArticle>{isIT ? 'Articolo 5' : 'Article 5'}</DisclosureArticle>
            <DisclosureTitle>{isIT ? 'Politiche di remunerazione' : 'Remuneration Policies'}</DisclosureTitle>
            <DisclosureText>
              {isIT
                ? 'Le politiche di remunerazione di Alkemia sono coerenti con l\'integrazione dei rischi di sostenibilità, garantendo l\'allineamento degli incentivi con gli obiettivi ESG di lungo periodo.'
                : 'Alkemia\'s remuneration policies are consistent with the integration of sustainability risks, ensuring alignment of incentives with long-term ESG objectives.'}
            </DisclosureText>
          </DisclosureCard>
        </DisclosureGrid>
      </SectionLight>

      {/* Roadmap */}
      <SectionDark>
        <SectionDarkInner>
          <SectionLabel>{isIT ? 'Sviluppo Futuro' : 'Future Development'}</SectionLabel>
          <SectionTitle>
            {isIT ? 'Il nostro percorso verso la piena sostenibilità' : 'Our path to full sustainability'}
          </SectionTitle>
          <SectionText>
            {isIT
              ? 'Alkemia è impegnata a formalizzare e rafforzare progressivamente il proprio impegno verso la sostenibilità attraverso un percorso strutturato.'
              : 'Alkemia is committed to progressively formalizing and strengthening its sustainability commitment through a structured pathway.'}
          </SectionText>
          <RoadmapList>
            <RoadmapItem>
              <RoadmapDot $done />
              <RoadmapContent>
                <RoadmapLabel>{isIT ? 'Completato' : 'Completed'}</RoadmapLabel>
                <RoadmapText>
                  {isIT
                    ? 'Definizione della policy ESG interna e integrazione nei processi di investimento'
                    : 'Definition of internal ESG policy and integration into investment processes'}
                </RoadmapText>
              </RoadmapContent>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapDot $done />
              <RoadmapContent>
                <RoadmapLabel>{isIT ? 'Completato' : 'Completed'}</RoadmapLabel>
                <RoadmapText>
                  {isIT
                    ? 'Informative SFDR (Art. 3, 4, 5) pubblicate e conformità regolamentare'
                    : 'SFDR disclosures (Art. 3, 4, 5) published and regulatory compliance'}
                </RoadmapText>
              </RoadmapContent>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapDot />
              <RoadmapContent>
                <RoadmapLabel>{isIT ? 'In corso' : 'In progress'}</RoadmapLabel>
                <RoadmapText>
                  {isIT
                    ? 'Adesione ai Principi per l\'Investimento Responsabile (PRI) delle Nazioni Unite'
                    : 'Adherence to the United Nations Principles for Responsible Investment (PRI)'}
                </RoadmapText>
              </RoadmapContent>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapDot />
              <RoadmapContent>
                <RoadmapLabel>{isIT ? 'Pianificato' : 'Planned'}</RoadmapLabel>
                <RoadmapText>
                  {isIT
                    ? 'Sviluppo di un framework strutturato per la valutazione degli effetti negativi (PAI) sulle decisioni di investimento'
                    : 'Development of a structured framework for assessing principal adverse impacts (PAI) on investment decisions'}
                </RoadmapText>
              </RoadmapContent>
            </RoadmapItem>
          </RoadmapList>
        </SectionDarkInner>
      </SectionDark>
    </>
  )
}
