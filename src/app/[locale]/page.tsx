import { setRequestLocale } from 'next-intl/server'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import NewsPreview from '@/components/sections/NewsPreview'
import NewsletterStrip from '@/components/sections/NewsletterStrip'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <HeroSection />
      <StatsSection />
      <NewsPreview locale={locale} />
      <NewsletterStrip />
    </>
  )
}
