import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
import { getInvestmentPlatforms, getFunds } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import type { Document } from '@contentful/rich-text-types'

/* ── Hero ───────────────────────────────────────── */
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

/* ── Two Column ─────────────────────────────────── */
const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[8]};
  align-items: start;
  ${mq.lg} { grid-template-columns: 1fr 1fr; gap: ${spacing[12]}; }
`

/* ── Platform Block ─────────────────────────────── */
const PlatformHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};
`
const PlatformBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  padding: 0 ${spacing[3]};
  border-radius: 24px;
  border: 2px solid ${({ $color }) => $color};
  font-family: ${fonts.heading};
  font-size: 1rem;
  font-weight: 800;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`
const PlatformTitle = styled.h2`
  font-family: ${fonts.heading};
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
  ${mq.lg} { font-size: 2rem; }
`
const DescriptionContent = styled.div`
  font-family: ${fonts.body};
  font-size: 1rem;
  color: ${colors.textSecondary};
  line-height: 1.8;
  margin-bottom: ${spacing[8]};

  p { margin-bottom: ${spacing[3]}; }
  a { color: ${colors.accentTeal}; text-decoration: none; &:hover { text-decoration: underline; } }
`

/* ── Fund Cards ─────────────────────────────────── */
const FundsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[4]};
  ${mq.md} { grid-template-columns: repeat(2, 1fr); }
  ${mq.lg} { grid-template-columns: repeat(3, 1fr); }
`
const FundCard = styled.div`
  background: ${colors.bg};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: ${spacing[6]};
  transition: border-color 0.3s ease, transform 0.3s ease;
  &:hover { border-color: ${colors.accentTeal}; transform: translateY(-2px); }
`
const FundName = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[4]};
`
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing[3]};
`
const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${colors.textPrimary};
`
const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  align-self: flex-start;
  margin-left: calc(-1 * ${spacing[2]});
  font-family: ${fonts.body};
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px ${spacing[2]};
  border-radius: 4px;
  background: ${({ $status }) =>
    $status === 'Active' ? `${colors.accentTeal}20` :
    $status === 'Fundraising' ? `${colors.accentGold}20` :
    `${colors.border}`};
  color: ${({ $status }) =>
    $status === 'Active' ? colors.accentTeal :
    $status === 'Fundraising' ? colors.accentGold :
    colors.textSecondary};
`

/* ── Divider ────────────────────────────────────── */
const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${colors.border};
  margin: 0;
`

/* ── Approach Summary ───────────────────────────── */
const ApproachGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};
  ${mq.md} { grid-template-columns: repeat(3, 1fr); }
`
const ApproachCard = styled.div`
  padding: ${spacing[6]};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  text-align: center;
`
const ApproachValue = styled.div`
  font-family: ${fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.accentTeal};
  margin-bottom: ${spacing[2]};
`
const ApproachLabel = styled.div`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

/* ── Page ───────────────────────────────────────── */

const PLATFORM_CONFIG: Record<string, { badge: string; color: string; order: number }> = {
  'Private Equity': { badge: 'PE', color: colors.accentTeal, order: 1 },
  'Venture Capital': { badge: 'VC', color: colors.accentGold, order: 2 },
  'PIPE': { badge: 'PIPE', color: colors.accentPurple, order: 3 },
}

export default async function InvestmentPlatformsV2Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [platforms, allFunds, t] = await Promise.all([
    getInvestmentPlatforms(locale),
    getFunds(locale),
    getTranslations({ locale, namespace: 'investmentPlatforms' }),
  ])

  const isIT = locale === 'it'

  // Sort platforms by configured order
  const sortedPlatforms = [...platforms].sort((a, b) => {
    const orderA = PLATFORM_CONFIG[a.fields.strategy || '']?.order ?? 99
    const orderB = PLATFORM_CONFIG[b.fields.strategy || '']?.order ?? 99
    return orderA - orderB
  })

  // Group funds by platform
  const fundsByPlatform = new Map<string, typeof allFunds>()
  for (const fund of allFunds) {
    const platformRef = fund.fields.platformRef as unknown as { sys?: { id?: string } } | undefined
    const platformId = platformRef?.sys?.id
    if (platformId) {
      const existing = fundsByPlatform.get(platformId) || []
      existing.push(fund)
      fundsByPlatform.set(platformId, existing)
    }
  }

  const totalFunds = allFunds.length
  const totalPlatforms = platforms.length

  return (
    <>
      {/* Hero */}
      <HeroBanner>
        <Image src="/images/hero-platforms.jpg" alt="Investment Platforms" fill style={{ objectFit: 'cover' }} priority />
        <HeroContent>
          <HeroTitle>{isIT ? 'Piattaforme di Investimento' : 'Investment Platforms'}</HeroTitle>
          <HeroSubtitle>
            {isIT
              ? 'Soluzioni di investimento diversificate per accompagnare la crescita delle imprese italiane.'
              : 'Diversified investment solutions to support the growth of Italian enterprises.'}
          </HeroSubtitle>
        </HeroContent>
      </HeroBanner>

      {/* Summary Stats */}
      <SectionLight>
        <ApproachGrid>
          <ApproachCard>
            <ApproachValue>{totalPlatforms}</ApproachValue>
            <ApproachLabel>{isIT ? 'Strategie di investimento' : 'Investment strategies'}</ApproachLabel>
          </ApproachCard>
          <ApproachCard>
            <ApproachValue>{totalFunds}</ApproachValue>
            <ApproachLabel>{isIT ? 'Fondi gestiti' : 'Managed funds'}</ApproachLabel>
          </ApproachCard>
          <ApproachCard>
            <ApproachValue>€270M+</ApproachValue>
            <ApproachLabel>{isIT ? 'Patrimonio gestito complessivo' : 'Total assets under management'}</ApproachLabel>
          </ApproachCard>
        </ApproachGrid>
      </SectionLight>

      {/* Platform Sections */}
      {sortedPlatforms.map((platform, index) => {
        const config = PLATFORM_CONFIG[platform.fields.strategy || ''] || { badge: '?', color: colors.accentTeal, order: 99 }
        const platformFunds = fundsByPlatform.get(platform.sys.id) || []
        const isDark = index % 2 === 0

        const content = (
          <>
            <PlatformHeader>
              <PlatformBadge $color={config.color}>{config.badge}</PlatformBadge>
              <PlatformTitle>{platform.fields.name}</PlatformTitle>
            </PlatformHeader>

            {platform.fields.description && (
              <DescriptionContent>
                {renderRichText(platform.fields.description as unknown as Document)}
              </DescriptionContent>
            )}

            {platformFunds.length > 0 && (
              <>
                <SectionLabel>{isIT ? 'Fondi' : 'Funds'}</SectionLabel>
                <FundsGrid>
                  {platformFunds.map((fund) => (
                    <FundCard key={fund.sys.id}>
                      <FundName>{fund.fields.name}</FundName>
                      <MetricsGrid>
                        {fund.fields.fundSize && (
                          <MetricItem>
                            <MetricLabel>{isIT ? 'Dimensione' : 'Size'}</MetricLabel>
                            <MetricValue>{fund.fields.fundSize}</MetricValue>
                          </MetricItem>
                        )}
                        {fund.fields.status && (
                          <MetricItem>
                            <MetricLabel>Status</MetricLabel>
                            <StatusBadge $status={fund.fields.status}>{fund.fields.status}</StatusBadge>
                          </MetricItem>
                        )}
                        {fund.fields.investmentPeriod && (
                          <MetricItem>
                            <MetricLabel>{isIT ? 'Periodo' : 'Period'}</MetricLabel>
                            <MetricValue>{fund.fields.investmentPeriod}</MetricValue>
                          </MetricItem>
                        )}
                        {fund.fields.strategy && (
                          <MetricItem>
                            <MetricLabel>{isIT ? 'Strategia' : 'Strategy'}</MetricLabel>
                            <MetricValue>{fund.fields.strategy}</MetricValue>
                          </MetricItem>
                        )}
                      </MetricsGrid>
                    </FundCard>
                  ))}
                </FundsGrid>
              </>
            )}
          </>
        )

        if (isDark) {
          return (
            <SectionDark key={platform.sys.id}>
              <SectionDarkInner>{content}</SectionDarkInner>
            </SectionDark>
          )
        }
        return (
          <SectionLight key={platform.sys.id}>
            {content}
          </SectionLight>
        )
      })}
    </>
  )
}
