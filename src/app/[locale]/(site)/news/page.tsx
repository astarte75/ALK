import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { getNewsArticles } from '@/lib/contentful/fetchers'
import { spacing } from '@/styles/theme'
import AnimatedPageHero from '@/components/animations/AnimatedPageHero'
import NewsList from './NewsList'

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[12]} ${spacing[4]};
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
    <>
      <AnimatedPageHero
        imageSrc="/images/hero-news.jpg"
        title={t('title')}
        imagePosition="top"
      />
      <Section>
        <NewsList articles={articles} locale={locale} />
      </Section>
    </>
  )
}
