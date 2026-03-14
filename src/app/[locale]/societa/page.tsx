import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { getPageBySlug } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import PageSections from '@/components/content/PageSections'
import StatsSection from '@/components/sections/StatsSection'
import type { Document } from '@contentful/rich-text-types'

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
  margin: 0 0 ${spacing[8]};
`

const BodyContent = styled.div`
  font-family: ${fonts.body};
  color: ${colors.textPrimary};
  line-height: 1.7;
  margin-bottom: ${spacing[12]};
  max-width: 800px;

  h2, h3, h4 {
    font-family: ${fonts.heading};
    color: ${colors.textPrimary};
    margin-top: ${spacing[8]};
    margin-bottom: ${spacing[3]};
  }

  p {
    margin-bottom: ${spacing[4]};
    color: ${colors.textSecondary};
  }

  a {
    color: ${colors.accentTeal};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

const SectionsWrapper = styled.div`
  margin-bottom: ${spacing[12]};
`

const FallbackMessage = styled.p`
  font-family: ${fonts.body};
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  text-align: center;
  padding: ${spacing[16]} 0;
`

export default async function SocietaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [page, t] = await Promise.all([
    getPageBySlug('societa', locale),
    getTranslations({ locale, namespace: 'about' }),
  ])

  if (!page) {
    return (
      <Page>
        <Title>{t('title')}</Title>
        <FallbackMessage>Content coming soon.</FallbackMessage>
        <StatsSection />
      </Page>
    )
  }

  return (
    <Page>
      <Title>{page.fields.title}</Title>

      {page.fields.body && (
        <BodyContent>
          {renderRichText(page.fields.body as unknown as Document)}
        </BodyContent>
      )}

      {page.fields.sections && (
        <SectionsWrapper>
          <PageSections sections={page.fields.sections} />
        </SectionsWrapper>
      )}

      <StatsSection />
    </Page>
  )
}
