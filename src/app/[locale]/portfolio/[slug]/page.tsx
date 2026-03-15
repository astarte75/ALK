import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getPortfolioCompanies, getPortfolioCompanyBySlug } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import ScrollReveal from '@/components/animations/ScrollReveal'
import type { Document } from '@contentful/rich-text-types'

// Generate static paths for all companies in both locales
export async function generateStaticParams() {
  const companies = await getPortfolioCompanies('it')
  return companies.flatMap((company) =>
    routing.locales.map((locale) => ({
      locale,
      slug: company.fields.slug,
    }))
  )
}

const Page = styled.div`
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

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[8]};
`

const LogoContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 12px;
  overflow: hidden;
`

const LogoFallback = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: ${colors.accentTeal};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.bg};
`

const CompanyName = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  flex-wrap: wrap;
`

const SectorLabel = styled.span`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const Badge = styled.span<{ $type: string }>`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 4px ${spacing[3]};
  border-radius: 9999px;
  background: ${({ $type }) =>
    $type === 'Private Equity'
      ? colors.accentTeal
      : $type === 'Venture Capital'
        ? colors.accentGold
        : colors.accentPurple};
  color: ${colors.bg};
`

const YearText = styled.span`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[8]};

  ${mq.lg} {
    grid-template-columns: 2fr 1fr;
  }
`

const DescriptionContent = styled.div`
  font-family: ${fonts.body};
  color: ${colors.textPrimary};
  line-height: 1.7;

  h2, h3, h4 {
    font-family: ${fonts.heading};
    color: ${colors.textPrimary};
    margin-top: ${spacing[6]};
    margin-bottom: ${spacing[3]};
  }

  p {
    margin-bottom: ${spacing[4]};
    color: ${colors.textSecondary};
  }

  a {
    color: ${colors.accentTeal};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`

const InfoCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: ${spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`

const InfoLabel = styled.span`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const InfoValue = styled.span`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.textPrimary};
`

const WebsiteLink = styled.a`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.accentTeal};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};

  &:hover {
    text-decoration: underline;
  }

  &::after {
    content: '\\2197';
    font-size: 0.875rem;
  }
`

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [company, t] = await Promise.all([
    getPortfolioCompanyBySlug(slug, locale),
    getTranslations({ locale, namespace: 'portfolio' }),
  ])

  if (!company) notFound()

  const { name, description, sector, investmentType, year, logo, website, fundRef } = company.fields

  const logoAsset = logo as unknown as { fields?: { file?: { url?: string }; title?: string } } | undefined
  const logoUrl = logoAsset?.fields?.file?.url ? `https:${logoAsset.fields.file.url}` : null

  const fundEntry = fundRef as unknown as { fields?: { name?: string } } | undefined
  const fundName = fundEntry?.fields?.name

  return (
    <Page>
      <BackLink href="/portfolio">{t('backToPortfolio')}</BackLink>

      <ScrollReveal>
        <Header>
          <LogoContainer>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={name}
                width={56}
                height={56}
                style={{ objectFit: 'contain', width: '56px', height: '56px' }}
              />
            ) : (
              <LogoFallback>{name.charAt(0)}</LogoFallback>
            )}
          </LogoContainer>
          <CompanyName>{name}</CompanyName>
          <MetaRow>
            {sector && <SectorLabel>{sector}</SectorLabel>}
            {year && <YearText>{year}</YearText>}
            {investmentType && <Badge $type={investmentType}>{investmentType}</Badge>}
          </MetaRow>
        </Header>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <ContentGrid>
          <DescriptionContent>
            {description && renderRichText(description as unknown as Document)}
          </DescriptionContent>

          <Sidebar>
            <InfoCard>
            {website && (
              <InfoItem>
                <InfoLabel>{t('website')}</InfoLabel>
                <WebsiteLink href={website} target="_blank" rel="noopener noreferrer">
                  {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </WebsiteLink>
              </InfoItem>
            )}
            {sector && (
              <InfoItem>
                <InfoLabel>{t('sector')}</InfoLabel>
                <InfoValue>{sector}</InfoValue>
              </InfoItem>
            )}
            {investmentType && (
              <InfoItem>
                <InfoLabel>{t('investmentType')}</InfoLabel>
                <InfoValue>{investmentType}</InfoValue>
              </InfoItem>
            )}
            {year && (
              <InfoItem>
                <InfoLabel>{t('yearOfInvestment')}</InfoLabel>
                <InfoValue>{year}</InfoValue>
              </InfoItem>
            )}
            {fundName && (
              <InfoItem>
                <InfoLabel>{t('fund')}</InfoLabel>
                <InfoValue>{fundName}</InfoValue>
              </InfoItem>
            )}
            </InfoCard>
          </Sidebar>
        </ContentGrid>
      </ScrollReveal>
    </Page>
  )
}
