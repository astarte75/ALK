import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { Link } from '@/i18n/navigation'
import { getInvestmentPlatforms } from '@/lib/contentful/fetchers'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[12]} ${spacing[4]};
`

const Title = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[2]};
`

const Subtitle = styled.p`
  font-family: ${fonts.body};
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 ${spacing[12]};
  max-width: 700px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};

  ${mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const PlatformCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: ${spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${colors.accentTeal};
  }
`

const PlatformName = styled.h2`
  font-family: ${fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`

const Strategy = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin: 0;
  flex: 1;
`

const LearnMoreLink = styled(Link)`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.accentTeal};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &::after {
    content: '\\2192';
    font-size: 1rem;
  }
`

export default async function InvestmentPlatformsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [platforms, t] = await Promise.all([
    getInvestmentPlatforms(locale),
    getTranslations({ locale, namespace: 'investmentPlatforms' }),
  ])

  return (
    <Page>
      <Title>{t('title')}</Title>
      <Subtitle>{t('overview')}</Subtitle>

      <Grid>
        {platforms.map((platform) => (
          <PlatformCard key={platform.sys.id}>
            <PlatformName>{platform.fields.name}</PlatformName>
            {platform.fields.strategy && (
              <Strategy>{platform.fields.strategy}</Strategy>
            )}
            <LearnMoreLink href={`/investment-platforms/${platform.fields.slug}`}>
              {t('learnMore')}
            </LearnMoreLink>
          </PlatformCard>
        ))}
      </Grid>
    </Page>
  )
}
