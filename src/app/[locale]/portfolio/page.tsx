import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { getPortfolioCompanies } from '@/lib/contentful/fetchers'
import { fonts, colors, spacing } from '@/styles/theme'
import PortfolioGrid from './PortfolioGrid'

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[12]} ${spacing[4]};
`

const Title = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[8]} 0;
`

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [companies, t] = await Promise.all([
    getPortfolioCompanies(locale),
    getTranslations({ locale, namespace: 'portfolio' }),
  ])

  return (
    <Section>
      <Title>{t('title')}</Title>
      <PortfolioGrid companies={companies} locale={locale} />
    </Section>
  )
}
