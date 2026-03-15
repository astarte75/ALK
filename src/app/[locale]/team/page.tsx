import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { getTeamMembers } from '@/lib/contentful/fetchers'
import { spacing } from '@/styles/theme'
import AnimatedPageHero from '@/components/animations/AnimatedPageHero'
import TeamGrid from './TeamGrid'

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[12]} ${spacing[4]};
`

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [members, t] = await Promise.all([
    getTeamMembers(locale),
    getTranslations({ locale, namespace: 'team' }),
  ])

  return (
    <>
      <AnimatedPageHero
        imageSrc="/images/hero-team.jpg"
        title={t('title')}
      />
      <Section>
        <TeamGrid members={members} locale={locale} />
      </Section>
    </>
  )
}
