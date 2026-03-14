import { setRequestLocale } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
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

/* ── Section Layout ─────────────────────────────── */

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

/* ── Quote ──────────────────────────────────────── */

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

/* ── Timeline ───────────────────────────────────── */

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

  &:last-child {
    margin-bottom: 0;
  }

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
  text-transform: uppercase;
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

/* ── Values Grid ────────────────────────────────── */

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ValueCard = styled.div`
  padding: ${spacing[6]};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${colors.accentTeal};
  }
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

/* ── LinkedIn CTA ───────────────────────────────── */

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

  &:hover {
    opacity: 0.9;
  }
`

/* ── Page ───────────────────────────────────────── */

export default async function SocietaV2Page({
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
          alt="Alkemia Capital"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <HeroContent>
          <HeroTitle>
            {isIT ? 'Chi Siamo' : 'About Us'}
          </HeroTitle>
          <HeroSubtitle>
            {isIT
              ? 'Creiamo valore sostenibile attraverso investimenti strategici nelle imprese italiane.'
              : 'Creating sustainable value through strategic investments in Italian enterprises.'}
          </HeroSubtitle>
        </HeroContent>
      </HeroBanner>

      {/* Intro */}
      <SectionLight>
        <TwoColumn>
          <div>
            <SectionLabel>{isIT ? 'La Nostra Identità' : 'Our Identity'}</SectionLabel>
            <SectionTitle>Alkemia SGR S.p.A.</SectionTitle>
            <SectionText>
              {isIT
                ? 'Alkemia SGR è una società di gestione del risparmio che opera con un obiettivo chiaro: generare valore duraturo investendo in aziende italiane con forte potenziale di crescita trasformativa. Non ci limitiamo a fornire capitale — affianchiamo le imprese come partner strategici, contribuendo attivamente alla definizione delle strategie di sviluppo e al rafforzamento della governance.'
                : 'Alkemia SGR is an asset management company with a clear objective: generating lasting value by investing in Italian companies with strong transformative growth potential. We go beyond providing capital — we stand alongside businesses as strategic partners, actively contributing to the definition of development strategies and the strengthening of governance.'}
            </SectionText>
            <SectionText>
              {isIT
                ? 'Con oltre vent\'anni di esperienza nei mercati privati, operiamo nel segmento del Lower-Mid Market italiano, un ecosistema ricco di eccellenze imprenditoriali che necessitano di un partner capace di comprenderne le dinamiche e accelerarne la crescita.'
                : 'With over twenty years of experience in private markets, we operate in the Italian Lower-Mid Market segment — an ecosystem rich in entrepreneurial excellence that needs a partner capable of understanding its dynamics and accelerating its growth.'}
            </SectionText>
          </div>
          <QuoteBlock>
            <QuoteText>
              {isIT
                ? '«Investiamo nelle persone prima ancora che nelle aziende. Ogni operazione nasce dalla convinzione che il capitale umano sia il vero motore della creazione di valore.»'
                : '"We invest in people before companies. Every transaction stems from the conviction that human capital is the true engine of value creation."'}
            </QuoteText>
            <QuoteAuthor>— Alkemia SGR</QuoteAuthor>
          </QuoteBlock>
        </TwoColumn>
      </SectionLight>

      {/* Stats */}
      <StatsSection />

      {/* Storia - Timeline */}
      <SectionDark>
        <SectionDarkInner>
          <TwoColumn>
            <div>
              <SectionLabel>{isIT ? 'Il Nostro Percorso' : 'Our Journey'}</SectionLabel>
              <SectionTitle>{isIT ? 'Una storia di crescita continua' : 'A story of continuous growth'}</SectionTitle>
              <SectionText>
                {isIT
                  ? 'Dal 2005, Alkemia ha costruito un track record solido e diversificato, evolvendo costantemente per rispondere alle esigenze di un mercato in trasformazione.'
                  : 'Since 2005, Alkemia has built a solid and diversified track record, constantly evolving to meet the needs of a transforming market.'}
              </SectionText>
            </div>
            <Timeline>
              <TimelineItem>
                <TimelineYear>2005</TimelineYear>
                <TimelineTitle>{isIT ? 'Fondazione' : 'Foundation'}</TimelineTitle>
                <TimelineText>
                  {isIT
                    ? 'Nasce Alkemia con la gestione di due fondi di Private Equity e un fondo Mezzanine, raggiungendo €270M di patrimonio gestito e completando 29 operazioni tra Private Equity e Mezzanine.'
                    : 'Alkemia is founded, managing two Private Equity funds and one Mezzanine fund, reaching €270M in AUM and completing 29 transactions across Private Equity and Mezzanine.'}
                </TimelineText>
              </TimelineItem>
              <TimelineItem>
                <TimelineYear>2017</TimelineYear>
                <TimelineTitle>Carve-out</TimelineTitle>
                <TimelineText>
                  {isIT
                    ? 'Operazione strategica di carve-out con la creazione di un nuovo fondo da €40 milioni, segnando una svolta nell\'evoluzione della società.'
                    : 'Strategic carve-out transaction with the creation of a new €40 million fund, marking a turning point in the company\'s evolution.'}
                </TimelineText>
              </TimelineItem>
              <TimelineItem>
                <TimelineYear>2018</TimelineYear>
                <TimelineTitle>Alkemia SGR</TimelineTitle>
                <TimelineText>
                  {isIT
                    ? 'La società assume il nome Alkemia SGR, riflettendo una nuova visione strategica orientata all\'innovazione e alla diversificazione.'
                    : 'The company takes the name Alkemia SGR, reflecting a new strategic vision oriented towards innovation and diversification.'}
                </TimelineText>
              </TimelineItem>
              <TimelineItem>
                <TimelineYear>2023</TimelineYear>
                <TimelineTitle>{isIT ? 'Espansione' : 'Expansion'}</TimelineTitle>
                <TimelineText>
                  {isIT
                    ? 'Ingresso nel venture capital e lancio di fondi tematici e PIPE, ampliando significativamente l\'offerta di soluzioni di investimento alternativo.'
                    : 'Entry into venture capital and launch of thematic and PIPE funds, significantly expanding the range of alternative investment solutions.'}
                </TimelineText>
              </TimelineItem>
              <TimelineItem>
                <TimelineYear>2024</TimelineYear>
                <TimelineTitle>{isIT ? 'Nuova Governance' : 'New Governance'}</TimelineTitle>
                <TimelineText>
                  {isIT
                    ? 'Ingresso di nuovi equity partner e rafforzamento del board con l\'inserimento di consiglieri indipendenti di alto profilo.'
                    : 'Entry of new equity partners and strengthening of the board with the addition of high-profile independent directors.'}
                </TimelineText>
              </TimelineItem>
            </Timeline>
          </TwoColumn>
        </SectionDarkInner>
      </SectionDark>

      {/* Mission & Approach */}
      <SectionLight>
        <TwoColumn>
          <div>
            <SectionLabel>Mission</SectionLabel>
            <SectionTitle>{isIT ? 'Il nostro impegno' : 'Our Commitment'}</SectionTitle>
            <SectionText>
              {isIT
                ? 'Aspiriamo a diventare il punto di riferimento nel mercato italiano del Lower-Mid Market, offrendo alle piccole e medie imprese un\'ampia gamma di strumenti di investimento alternativo — dal private equity al venture capital, dall\'hybrid capital al PIPE.'
                : 'We aspire to become the reference point in the Italian Lower-Mid Market, offering small and medium enterprises a comprehensive range of alternative investment instruments — from private equity to venture capital, from hybrid capital to PIPE.'}
            </SectionText>
            <SectionText>
              {isIT
                ? 'Il nostro impegno va oltre il rendimento finanziario: sosteniamo progetti di crescita sostenibile, manteniamo un forte legame con il territorio e operiamo secondo una logica di beneficio reciproco tra investitori, imprese e comunità.'
                : 'Our commitment goes beyond financial returns: we support sustainable growth projects, maintain a strong connection with the territory, and operate according to a logic of mutual benefit between investors, businesses, and communities.'}
            </SectionText>
          </div>
          <div>
            <SectionLabel>{isIT ? 'Approccio' : 'Approach'}</SectionLabel>
            <SectionTitle>{isIT ? 'Deal flow proprietario' : 'Proprietary Deal Flow'}</SectionTitle>
            <SectionText>
              {isIT
                ? 'Il nostro approccio si distingue per la combinazione di presenza capillare sul territorio, profonda conoscenza settoriale e un network consolidato di relazioni con imprenditori e professionisti.'
                : 'Our approach stands out through the combination of strong local presence, deep industry knowledge, and a consolidated network of relationships with entrepreneurs and professionals.'}
            </SectionText>
            <SectionText>
              {isIT
                ? 'Grazie a un deal flow proprietario, accediamo a opportunità di investimento di alto valore prima che raggiungano il mercato aperto, operando come partner strategici per le aziende in portafoglio.'
                : 'Through our proprietary deal flow, we access high-value investment opportunities before they reach the open market, acting as strategic partners for portfolio companies.'}
            </SectionText>
          </div>
        </TwoColumn>
      </SectionLight>

      {/* Values */}
      <SectionDark>
        <SectionDarkInner>
          <SectionLabel>{isIT ? 'I Nostri Valori' : 'Our Values'}</SectionLabel>
          <SectionTitle>{isIT ? 'Principi che guidano ogni decisione' : 'Principles that guide every decision'}</SectionTitle>
          <ValuesGrid>
            <ValueCard>
              <ValueIcon>◈</ValueIcon>
              <ValueTitle>{isIT ? 'Trasparenza' : 'Transparency'}</ValueTitle>
              <ValueText>
                {isIT
                  ? 'Comunichiamo in modo chiaro e aperto con tutti i nostri stakeholder, garantendo piena visibilità sulle strategie di investimento e sui risultati ottenuti.'
                  : 'We communicate clearly and openly with all our stakeholders, ensuring full visibility on investment strategies and results achieved.'}
              </ValueText>
            </ValueCard>
            <ValueCard>
              <ValueIcon>◇</ValueIcon>
              <ValueTitle>{isIT ? 'Integrità' : 'Integrity'}</ValueTitle>
              <ValueText>
                {isIT
                  ? 'Operiamo secondo i più elevati standard etici, ponendo la correttezza e la responsabilità al centro di ogni relazione professionale.'
                  : 'We operate according to the highest ethical standards, placing fairness and responsibility at the center of every professional relationship.'}
              </ValueText>
            </ValueCard>
            <ValueCard>
              <ValueIcon>◆</ValueIcon>
              <ValueTitle>{isIT ? 'Sostenibilità' : 'Sustainability'}</ValueTitle>
              <ValueText>
                {isIT
                  ? 'Integriamo criteri ESG in tutte le nostre decisioni di investimento, promuovendo pratiche che generano impatto positivo sull\'ambiente e sulla società.'
                  : 'We integrate ESG criteria into all our investment decisions, promoting practices that generate positive impact on the environment and society.'}
              </ValueText>
            </ValueCard>
          </ValuesGrid>

          {/* LinkedIn CTA */}
          <CTABanner>
            <CTAText>
              {isIT
                ? 'Segui Alkemia Capital su LinkedIn per rimanere aggiornato.'
                : 'Follow Alkemia Capital on LinkedIn to stay updated.'}
            </CTAText>
            <CTALink
              href="https://www.linkedin.com/company/alkemia-capital/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn →
            </CTALink>
          </CTABanner>
        </SectionDarkInner>
      </SectionDark>
    </>
  )
}
