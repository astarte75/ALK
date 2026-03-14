import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import {
  getInvestmentPlatforms,
  getInvestmentPlatformBySlug,
  getFunds,
} from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import FundCard from '@/components/cards/FundCard'
import type { Document } from '@contentful/rich-text-types'

export async function generateStaticParams() {
  const platforms = await getInvestmentPlatforms('it')
  return platforms.flatMap((platform) =>
    routing.locales.map((locale) => ({
      locale,
      slug: platform.fields.slug,
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

const Title = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[6]};
`

const DescriptionContent = styled.div`
  font-family: ${fonts.body};
  color: ${colors.textPrimary};
  line-height: 1.7;
  margin-bottom: ${spacing[12]};
  max-width: 800px;

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

const FundsHeading = styled.h2`
  font-family: ${fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[6]};
`

const FundsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};

  ${mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`

export default async function InvestmentPlatformDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [platform, t] = await Promise.all([
    getInvestmentPlatformBySlug(slug, locale),
    getTranslations({ locale, namespace: 'investmentPlatforms' }),
  ])

  if (!platform) notFound()

  const allFunds = await getFunds(locale)
  const platformFunds = allFunds.filter((f) => {
    const ref = f.fields.platformRef as { sys?: { id: string } } | undefined
    return ref?.sys?.id === platform.sys.id
  })

  return (
    <Page>
      <BackLink href="/investment-platforms">{t('backToOverview')}</BackLink>

      <Title>{platform.fields.name}</Title>

      {platform.fields.description && (
        <DescriptionContent>
          {renderRichText(platform.fields.description as unknown as Document)}
        </DescriptionContent>
      )}

      {platformFunds.length > 0 && (
        <>
          <FundsHeading>{t('funds')}</FundsHeading>
          <FundsGrid>
            {platformFunds.map((fund) => (
              <FundCard key={fund.sys.id} fund={fund} />
            ))}
          </FundsGrid>
        </>
      )}
    </Page>
  )
}
