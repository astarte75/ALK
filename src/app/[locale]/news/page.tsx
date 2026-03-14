import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { getNewsArticles } from '@/lib/contentful/fetchers'
import { fonts, colors, spacing } from '@/styles/theme'
import NewsList from './NewsList'

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

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [articles, t] = await Promise.all([
    getNewsArticles(locale),
    getTranslations({ locale, namespace: 'news' }),
  ])

  return (
    <Section>
      <Title>{t('title')}</Title>
      <NewsList articles={articles} locale={locale} />
    </Section>
  )
}
