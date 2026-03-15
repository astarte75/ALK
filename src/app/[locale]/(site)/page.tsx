import { setRequestLocale } from 'next-intl/server'
import { getPageBySlug, getNewsArticles } from '@/lib/contentful/fetchers'
import NewsCard from '@/components/cards/NewsCard'
import HomepageClient from './HomepageClient'

interface HomepageSections {
  hero: { headline: string; subtitle: string; ctaText: string; ctaLink: string }
  stats: { value: string; label: string }[]
  newsPreview: { title: string; ctaText: string; ctaLink: string }
  newsletter: { title: string; description: string; placeholder: string; buttonText: string }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [page, articles] = await Promise.all([
    getPageBySlug('homepage', locale),
    getNewsArticles(locale, 3),
  ])

  const s = (page?.fields.sections ?? null) as HomepageSections | null

  const newsCards = articles?.map((article) => (
    <div key={article.sys.id} data-news-card>
      <NewsCard article={article} locale={locale} />
    </div>
  ))

  return (
    <HomepageClient
      locale={locale}
      sections={s}
      newsCards={newsCards}
    />
  )
}
