'use client'

import LenisProvider from '@/components/providers/LenisProvider'
import VideoHero from '@/components/sections/animated/VideoHero'
import ScrollNarrative from '@/components/sections/animated/ScrollNarrative'
import AnimatedStats from '@/components/sections/animated/AnimatedStats'
import AnimatedNewsPreview from '@/components/sections/animated/AnimatedNewsPreview'
import AnimatedNewsletterStrip from '@/components/sections/animated/AnimatedNewsletterStrip'

interface HomepageSections {
  hero: { headline: string; subtitle: string; ctaText: string; ctaLink: string }
  stats: { value: string; label: string }[]
  newsPreview: { title: string; ctaText: string; ctaLink: string }
  newsletter: { title: string; description: string; placeholder: string; buttonText: string }
}

interface HomepageClientProps {
  locale: string
  sections: HomepageSections | null
  newsCards: React.ReactNode
}

export default function HomepageClient({ locale, sections: s, newsCards }: HomepageClientProps) {
  const newsPath = locale === 'it' ? '/news' : '/en/news'

  return (
    <LenisProvider>
      <VideoHero
        headline={s?.hero.headline}
        subtitle={s?.hero.subtitle}
      />
      <ScrollNarrative locale={locale} />
      <AnimatedStats stats={s?.stats} />
      <AnimatedNewsPreview
        title={s?.newsPreview?.title}
        ctaText={s?.newsPreview?.ctaText}
        newsPath={newsPath}
      >
        {newsCards}
      </AnimatedNewsPreview>
      <AnimatedNewsletterStrip
        title={s?.newsletter?.title}
        placeholder={s?.newsletter?.placeholder}
        buttonText={s?.newsletter?.buttonText}
      />
    </LenisProvider>
  )
}
