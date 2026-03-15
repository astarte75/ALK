import { setRequestLocale } from 'next-intl/server'
import styled from 'styled-components'
import { Link } from '@/i18n/navigation'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import AnimatedPageHero from '@/components/animations/AnimatedPageHero'
import ScrollReveal from '@/components/animations/ScrollReveal'

/* ── Sections ── */

const Section = styled.section`
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
  color: ${colors.accentTeal};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: ${spacing[3]};
`

const SectionTitle = styled.h2`
  font-family: ${fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[6]};
  line-height: 1.2;

  ${mq.md} {
    font-size: 2.5rem;
  }
`

const IntroText = styled.p`
  font-family: ${fonts.body};
  font-size: 1.0625rem;
  color: ${colors.textSecondary};
  line-height: 1.8;
  text-align: justify;
  margin: 0 0 ${spacing[6]};
`

/* ── Values ── */

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};

  ${mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const ValueCard = styled.div`
  background: ${colors.bg};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: ${spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
  height: 100%;
  transition: border-color 0.3s ease, transform 0.3s ease;

  &:hover {
    border-color: rgba(46, 196, 182, 0.3);
    transform: translateY(-4px);
  }
`

const ValueIcon = styled.div`
  width: 40px;
  height: 40px;
  color: ${colors.accentTeal};

  svg {
    width: 100%;
    height: 100%;
  }
`

const ValueTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`

const ValueText = styled.p`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`

/* ── Quote ── */

const QuoteSection = styled.div`
  text-align: center;
  margin: 0 auto;
`

const QuoteText = styled.blockquote`
  font-family: ${fonts.heading};
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  line-height: 1.5;
  margin: 0 0 ${spacing[4]};
  font-style: italic;

  ${mq.md} {
    font-size: 1.875rem;
  }

  &::before {
    content: '"';
    color: ${colors.accentTeal};
  }

  &::after {
    content: '"';
    color: ${colors.accentTeal};
  }
`

const QuoteAuthor = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.accentGold};
  margin: 0;
`

/* ── Stats ── */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[6]};
  margin-top: ${spacing[8]};

  ${mq.md} {
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
`

const StatLabel = styled.div`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
  margin-top: ${spacing[2]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

/* ── CTA ── */

const CtaSection = styled.div`
  text-align: center;
  margin: 0 auto;
`

const CtaText = styled.p`
  font-family: ${fonts.body};
  font-size: 1.0625rem;
  color: ${colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 ${spacing[6]};
`

const CtaButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${colors.bg};
  background: ${colors.accentTeal};
  padding: 14px ${spacing[8]};
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`

/* ── Content ── */

// SVG icons — minimal line style
function IconIntegrity() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function IconExcellence() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconSustainability() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c-4-2-8-6-8-11a8 8 0 0116 0c0 5-4 9-8 11z" />
      <path d="M12 11v6" />
      <path d="M9 14c1.5-1 3-2.5 3-5" />
      <path d="M15 14c-1.5-1-3-2.5-3-5" />
    </svg>
  )
}

function IconInnovation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
    </svg>
  )
}

const VALUE_ICONS = [IconIntegrity, IconExcellence, IconSustainability, IconInnovation]

interface CultureContent {
  hero: { title: string; subtitle: string }
  intro: { label: string; title: string; text: string[] }
  values: { title: string; text: string }[]
  quote: { text: string; author: string }
  approach: { label: string; title: string; text: string[] }
  stats: { value: string; label: string }[]
  cta: { text: string; buttonText: string; buttonLink: string }
}

const CONTENT_IT: CultureContent = {
  hero: {
    title: 'Life at Alkemia',
    subtitle: 'Dove il talento incontra la passione per l\'impresa',
  },
  intro: {
    label: 'Chi siamo',
    title: 'Le persone al centro',
    text: [
      'In Alkemia crediamo che il capitale umano sia il vero motore della creazione di valore. Il nostro team riunisce professionisti con esperienze complementari nel private equity, venture capital, finanza aziendale e gestione operativa — una squadra composita e affiatata, unita dalla passione per l\'impresa italiana.',
      'Lavoriamo con un approccio collaborativo e orizzontale, dove ogni voce conta e ogni idea può trasformarsi in opportunità. La nostra forza sta nella diversità di competenze e nella coesione del gruppo.',
    ],
  },
  values: [
    { title: 'Integrità', text: 'Agiamo con trasparenza e coerenza, costruendo relazioni di fiducia durature con investitori, imprenditori e collaboratori.' },
    { title: 'Eccellenza', text: 'Puntiamo al massimo in ogni aspetto del nostro lavoro, dalla due diligence alla gestione del portafoglio, senza compromessi sulla qualità.' },
    { title: 'Sostenibilità', text: 'Integriamo i criteri ESG nel nostro processo decisionale perché crediamo che performance e responsabilità siano inscindibili.' },
    { title: 'Innovazione', text: 'Abbracciamo il cambiamento e le nuove tecnologie, supportando le aziende nel loro percorso di trasformazione digitale e crescita.' },
  ],
  quote: {
    text: 'Supportare le imprese significa accompagnarle lungo tutte le fasi del loro percorso: dalla nascita alla crescita, fino alla maturità.',
    author: 'Luca Maurizio Duranti, CEO & Managing Partner',
  },
  approach: {
    label: 'Il nostro approccio',
    title: 'Come lavoriamo',
    text: [
      'Non siamo semplici investitori finanziari. Ci affianchiamo agli imprenditori con competenza operativa, visione strategica e capitale paziente. Ogni investimento è una partnership in cui condividiamo obiettivi, sfide e successi.',
      'Il nostro team opera tra le sedi di Milano e Padova, con una presenza attiva nelle aziende partecipate e un network consolidato nel panorama imprenditoriale italiano ed europeo.',
    ],
  },
  stats: [
    { value: '18', label: 'Professionisti' },
    { value: '2', label: 'Sedi in Italia' },
    { value: '20+', label: 'Anni di esperienza' },
    { value: '5', label: 'Fondi gestiti' },
  ],
  cta: {
    text: 'Scopri i professionisti che rendono Alkemia un partner unico per le imprese italiane.',
    buttonText: 'Conosci il team',
    buttonLink: '/team',
  },
}

const CONTENT_EN: CultureContent = {
  hero: {
    title: 'Life at Alkemia',
    subtitle: 'Where talent meets a passion for enterprise',
  },
  intro: {
    label: 'Who we are',
    title: 'People at the core',
    text: [
      'At Alkemia, we believe that human capital is the true engine of value creation. Our team brings together professionals with complementary experience in private equity, venture capital, corporate finance and operational management — a diverse and close-knit group, united by a passion for Italian enterprise.',
      'We work with a collaborative and horizontal approach, where every voice matters and every idea can become an opportunity. Our strength lies in the diversity of skills and the cohesion of the group.',
    ],
  },
  values: [
    { title: 'Integrity', text: 'We act with transparency and consistency, building lasting relationships of trust with investors, entrepreneurs and colleagues.' },
    { title: 'Excellence', text: 'We aim for the highest standards in every aspect of our work, from due diligence to portfolio management, with no compromise on quality.' },
    { title: 'Sustainability', text: 'We integrate ESG criteria into our decision-making because we believe performance and responsibility are inseparable.' },
    { title: 'Innovation', text: 'We embrace change and new technologies, supporting companies in their digital transformation and growth journey.' },
  ],
  quote: {
    text: 'Supporting companies means accompanying them through every stage of their journey: from inception to growth, through to maturity.',
    author: 'Luca Maurizio Duranti, CEO & Managing Partner',
  },
  approach: {
    label: 'Our approach',
    title: 'How we work',
    text: [
      'We are not just financial investors. We work alongside entrepreneurs with operational expertise, strategic vision and patient capital. Every investment is a partnership in which we share objectives, challenges and successes.',
      'Our team operates between our Milan and Padua offices, with an active presence in portfolio companies and a well-established network across the Italian and European business landscape.',
    ],
  },
  stats: [
    { value: '18', label: 'Professionals' },
    { value: '2', label: 'Offices in Italy' },
    { value: '20+', label: 'Years of experience' },
    { value: '5', label: 'Funds managed' },
  ],
  cta: {
    text: 'Discover the professionals who make Alkemia a unique partner for Italian enterprises.',
    buttonText: 'Meet the team',
    buttonLink: '/team',
  },
}

export default async function CulturePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const c = locale === 'en' ? CONTENT_EN : CONTENT_IT

  return (
    <>
      <AnimatedPageHero
        imageSrc="/images/hero-team.jpg"
        title={c.hero.title}
        subtitle={c.hero.subtitle}
      />

      {/* Intro */}
      <Section>
        <ScrollReveal>
          <SectionLabel>{c.intro.label}</SectionLabel>
          <SectionTitle>{c.intro.title}</SectionTitle>
        </ScrollReveal>
        {c.intro.text.map((p, i) => (
          <ScrollReveal key={i} delay={0.1 + i * 0.1}>
            <IntroText>{p}</IntroText>
          </ScrollReveal>
        ))}
      </Section>

      {/* Values */}
      <SectionDark>
        <SectionDarkInner>
          <ScrollReveal>
            <SectionLabel>{locale === 'it' ? 'I nostri valori' : 'Our values'}</SectionLabel>
            <SectionTitle>{locale === 'it' ? 'Cosa ci guida' : 'What drives us'}</SectionTitle>
          </ScrollReveal>
          <ValuesGrid>
            {c.values.map((v, i) => {
              const Icon = VALUE_ICONS[i]
              return (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <ValueCard>
                    <ValueIcon><Icon /></ValueIcon>
                    <ValueTitle>{v.title}</ValueTitle>
                    <ValueText>{v.text}</ValueText>
                  </ValueCard>
                </ScrollReveal>
              )
            })}
          </ValuesGrid>
        </SectionDarkInner>
      </SectionDark>

      {/* Quote */}
      <Section>
        <ScrollReveal>
          <QuoteSection>
            <QuoteText>{c.quote.text}</QuoteText>
            <QuoteAuthor>— {c.quote.author}</QuoteAuthor>
          </QuoteSection>
        </ScrollReveal>
      </Section>

      {/* Approach + Stats */}
      <SectionDark>
        <SectionDarkInner>
          <ScrollReveal>
            <SectionLabel>{c.approach.label}</SectionLabel>
            <SectionTitle>{c.approach.title}</SectionTitle>
          </ScrollReveal>
          {c.approach.text.map((p, i) => (
            <ScrollReveal key={i} delay={0.1 + i * 0.1}>
              <IntroText>{p}</IntroText>
            </ScrollReveal>
          ))}
          <ScrollReveal delay={0.3}>
            <StatsGrid>
              {c.stats.map((s, i) => (
                <StatItem key={i}>
                  <StatValue>{s.value}</StatValue>
                  <StatLabel>{s.label}</StatLabel>
                </StatItem>
              ))}
            </StatsGrid>
          </ScrollReveal>
        </SectionDarkInner>
      </SectionDark>

      {/* CTA */}
      <Section>
        <ScrollReveal>
          <CtaSection>
            <CtaText>{c.cta.text}</CtaText>
            <CtaButton href={c.cta.buttonLink}>{c.cta.buttonText} →</CtaButton>
          </CtaSection>
        </ScrollReveal>
      </Section>
    </>
  )
}
