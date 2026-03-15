import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { getPortfolioCompanies } from '@/lib/contentful/fetchers'
import { spacing } from '@/styles/theme'
import AnimatedPageHero from '@/components/animations/AnimatedPageHero'
import PortfolioGrid from './PortfolioGrid'

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[12]} ${spacing[4]};
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
    <>
      <AnimatedPageHero
        imageSrc="/images/hero-portfolio.jpg"
        title={t('title')}
      />
      <Section>
        <PortfolioGrid companies={companies} locale={locale} />
      </Section>
    </>
  )
}
