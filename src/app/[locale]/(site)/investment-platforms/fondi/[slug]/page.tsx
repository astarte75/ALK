import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getFunds, getFundBySlug, getPortfolioCompanies } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import ScrollReveal from '@/components/animations/ScrollReveal'
import PortfolioCard from '@/components/cards/PortfolioCard'
import TeamCard from '@/components/cards/TeamCard'
import type { Document } from '@contentful/rich-text-types'
import type { PortfolioCompany, TeamMember } from '@/lib/contentful/types'
import FundDetailClient from './FundDetailClient'

// Generate static paths for all funds in both locales
export async function generateStaticParams() {
  const funds = await getFunds('it')
  return funds.flatMap((fund) =>
    routing.locales.map((locale) => ({
      locale,
      slug: fund.fields.slug,
    }))
  )
}

/* ── Strategy color mapping ───────────────────────── */
const STRATEGY_CONFIG: Record<string, { badge: string; color: string }> = {
  'Private Equity': { badge: 'PE', color: '#2EC4B6' },
  'Venture Capital': { badge: 'VC', color: '#D4A843' },
  'PIPE': { badge: 'PIPE', color: '#9B59B6' },
  'Hybrid Capital': { badge: 'HC', color: 'linear-gradient(135deg, #2EC4B6, #D4A843)' },
}

/* ── Styled Components ────────────────────────────── */

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[12]} ${spacing[4]};
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.accentTeal};
  text-decoration: none;
  margin-bottom: ${spacing[8]};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &::before {
    content: '\\2190';
    font-size: 1.125rem;
  }
`

const HeroSection = styled.div`
  margin-bottom: ${spacing[8]};
`

const HeroRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[3]};
  flex-wrap: wrap;
`

const StrategyBadge = styled.span<{ $color: string; $isGradient?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  height: 52px;
  padding: 0 ${spacing[3]};
  border-radius: 26px;
  border: 2px solid ${({ $color, $isGradient }) => $isGradient ? '#2EC4B6' : $color};
  font-family: ${fonts.heading};
  font-size: 1.125rem;
  font-weight: 800;
  color: ${({ $color, $isGradient }) => $isGradient ? '#2EC4B6' : $color};
  flex-shrink: 0;
  ${({ $isGradient, $color }) => $isGradient ? `
    background: ${$color};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    border-image: linear-gradient(135deg, #2EC4B6, #D4A843) 1;
  ` : ''}
`

const FundTitle = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;

  ${mq.lg} {
    font-size: 3rem;
  }
`

const GoldBar = styled.div`
  width: 3rem;
  height: 3px;
  background-color: ${colors.accentGold};
  border-radius: 2px;
  margin: ${spacing[3]} 0;
`

/* ── Metrics ──────────────────────────────────────── */
const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[4]};
  margin-bottom: ${spacing[8]};

  ${mq.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const MetricCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: ${spacing[4]} ${spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`

const MetricLabel = styled.span`
  font-family: ${fonts.body};
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const MetricValue = styled.span`
  font-family: ${fonts.heading};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.textPrimary};
`

const StatusValue = styled(MetricValue)<{ $status: string }>`
  color: ${({ $status }) =>
    $status === 'Active' ? colors.accentTeal :
    $status === 'Fundraising' ? colors.accentGold :
    colors.textSecondary};
`

/* ── Content Sections ─────────────────────────────── */
const SectionTitle = styled.h2`
  font-family: ${fonts.heading};
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[6]};

  ${mq.lg} {
    font-size: 2rem;
  }
`

const DescriptionContent = styled.div`
  font-family: ${fonts.body};
  color: ${colors.textPrimary};
  line-height: 1.8;
  margin-bottom: ${spacing[12]};

  h2, h3, h4 {
    font-family: ${fonts.heading};
    color: ${colors.textPrimary};
    margin-top: ${spacing[6]};
    margin-bottom: ${spacing[3]};
  }

  p {
    margin-bottom: ${spacing[4]};
    color: ${colors.textSecondary};
    text-align: justify;
  }

  a {
    color: ${colors.accentTeal};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`

const Section = styled.section`
  margin-bottom: ${spacing[12]};
`

/* ── Target Sectors ───────────────────────────────── */
const PillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing[2]};
`

const Pill = styled.span`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${colors.textPrimary};
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 9999px;
  padding: ${spacing[1]} ${spacing[3]};
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${colors.accentTeal};
  }
`

/* ── Portfolio Grid ───────────────────────────────── */
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[4]};

  ${mq.md} { grid-template-columns: repeat(2, 1fr); }
  ${mq.lg} { grid-template-columns: repeat(3, 1fr); }
`

/* ── Team Grid ────────────────────────────────────── */
const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[4]};

  ${mq.md} { grid-template-columns: repeat(3, 1fr); }
  ${mq.lg} { grid-template-columns: repeat(4, 1fr); }
`

/* ── Documents ────────────────────────────────────── */
const DocList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`

const DocItem = styled.li`
  display: flex;
  align-items: center;
`

const DocLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.accentTeal};
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    text-decoration: underline;
    opacity: 0.85;
  }
`

const DocIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`

/* ── Page Component ───────────────────────────────── */

export default async function FundDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [fund, allCompanies, t] = await Promise.all([
    getFundBySlug(slug, locale),
    getPortfolioCompanies(locale),
    getTranslations({ locale, namespace: 'funds' }),
  ])

  if (!fund) notFound()

  const {
    name,
    description,
    strategy,
    status,
    fundSize,
    investmentPeriod,
    targetSectors,
    documents,
    teamMembers,
  } = fund.fields

  const config = STRATEGY_CONFIG[strategy || ''] || { badge: '?', color: '#2EC4B6' }
  const isGradient = strategy === 'Hybrid Capital'

  // Filter portfolio companies linked to this fund
  const linkedCompanies = allCompanies.filter((company) => {
    const fundRef = company.fields.fundRef as unknown as { sys?: { id?: string } } | undefined
    return fundRef?.sys?.id === fund.sys.id
  })

  // Parse target sectors from comma-separated string
  const sectors = targetSectors
    ? targetSectors.split(',').map((s: string) => s.trim()).filter(Boolean)
    : []

  // Resolve team members
  const resolvedTeamMembers = (teamMembers || []) as unknown as TeamMember[]

  // Resolve documents
  type AssetFields = { fields?: { file?: { url?: string; contentType?: string }; title?: string } }
  const resolvedDocuments = ((documents || []) as unknown as AssetFields[]).filter(
    (doc) => doc?.fields?.file?.url
  )

  const isIT = locale === 'it'

  return (
    <PageContainer>
      <BackLink href="/investment-platforms">{t('backToPlatforms')}</BackLink>

      {/* Hero */}
      <ScrollReveal>
        <HeroSection>
          <HeroRow>
            <StrategyBadge $color={config.color} $isGradient={isGradient}>
              {config.badge}
            </StrategyBadge>
            <FundTitle>{name}</FundTitle>
          </HeroRow>
          <GoldBar />
        </HeroSection>
      </ScrollReveal>

      {/* Metrics */}
      <ScrollReveal delay={0.1}>
        <MetricsRow>
          {fundSize && (
            <MetricCard>
              <MetricLabel>{isIT ? 'Dimensione fondo' : 'Fund Size'}</MetricLabel>
              <MetricValue>{fundSize}</MetricValue>
            </MetricCard>
          )}
          {status && (
            <MetricCard>
              <MetricLabel>Status</MetricLabel>
              <StatusValue $status={status}>{status}</StatusValue>
            </MetricCard>
          )}
          {investmentPeriod && (
            <MetricCard>
              <MetricLabel>{isIT ? 'Periodo di investimento' : 'Investment Period'}</MetricLabel>
              <MetricValue>{investmentPeriod}</MetricValue>
            </MetricCard>
          )}
          {strategy && (
            <MetricCard>
              <MetricLabel>{isIT ? 'Strategia' : 'Strategy'}</MetricLabel>
              <MetricValue>{strategy}</MetricValue>
            </MetricCard>
          )}
        </MetricsRow>
      </ScrollReveal>

      {/* Description */}
      {description && (
        <ScrollReveal delay={0.15}>
          <DescriptionContent>
            {renderRichText(description as unknown as Document)}
          </DescriptionContent>
        </ScrollReveal>
      )}

      {/* Target Sectors */}
      {sectors.length > 0 && (
        <ScrollReveal delay={0.1}>
          <Section>
            <SectionTitle>{t('targetSectors')}</SectionTitle>
            <PillsContainer>
              {sectors.map((sector) => (
                <Pill key={sector}>{sector}</Pill>
              ))}
            </PillsContainer>
          </Section>
        </ScrollReveal>
      )}

      {/* Portfolio Companies */}
      {linkedCompanies.length > 0 && (
        <ScrollReveal delay={0.1}>
          <Section>
            <SectionTitle>{t('portfolioCompanies')}</SectionTitle>
            <CardsGrid>
              {linkedCompanies.map((company) => (
                <PortfolioCard key={company.sys.id} company={company} locale={locale} />
              ))}
            </CardsGrid>
          </Section>
        </ScrollReveal>
      )}

      {/* Team Members */}
      {resolvedTeamMembers.length > 0 && (
        <ScrollReveal delay={0.1}>
          <Section>
            <SectionTitle>{t('teamMembers')}</SectionTitle>
            <TeamGrid>
              {resolvedTeamMembers.map((member) => (
                <TeamCard key={member.sys.id} member={member} locale={locale} />
              ))}
            </TeamGrid>
          </Section>
        </ScrollReveal>
      )}

      {/* Documents */}
      {resolvedDocuments.length > 0 && (
        <ScrollReveal delay={0.1}>
          <Section>
            <SectionTitle>{t('documents')}</SectionTitle>
            <DocList>
              {resolvedDocuments.map((doc, i) => {
                const url = `https:${doc.fields!.file!.url}`
                const title = doc.fields!.title || `${t('downloadDocument')} ${i + 1}`
                return (
                  <DocItem key={i}>
                    <DocLink
                      href={url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DocIcon>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                          <path d="M12 18l4-4h-3v-4h-2v4H8l4 4z" />
                        </svg>
                      </DocIcon>
                      {title}
                    </DocLink>
                  </DocItem>
                )
              })}
            </DocList>
          </Section>
        </ScrollReveal>
      )}

      {/* Client wrapper for any future interactivity */}
      <FundDetailClient />
    </PageContainer>
  )
}
