import { setRequestLocale } from 'next-intl/server'
import { getPageBySlug } from '@/lib/contentful/fetchers'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import NewsPreview from '@/components/sections/NewsPreview'
import NewsletterStrip from '@/components/sections/NewsletterStrip'

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

  const page = await getPageBySlug('homepage', locale)
  const s = (page?.fields.sections ?? null) as HomepageSections | null

  return (
    <>
      <HeroSection
        headline={s?.hero.headline}
        subtitle={s?.hero.subtitle}
      />
      <StatsSection stats={s?.stats} />
      <NewsPreview locale={locale} title={s?.newsPreview?.title} ctaText={s?.newsPreview?.ctaText} />
      <NewsletterStrip
        title={s?.newsletter?.title}
        description={s?.newsletter?.description}
        placeholder={s?.newsletter?.placeholder}
        buttonText={s?.newsletter?.buttonText}
      />
    </>
  )
}
