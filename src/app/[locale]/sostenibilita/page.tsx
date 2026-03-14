import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { getPageBySlug } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import PageSections from '@/components/content/PageSections'
import PdfDownloadList from '@/components/content/PdfDownloadList'
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

const PdfSection = styled.section`
  margin-top: ${spacing[12]};
`

const PdfHeading = styled.h2`
  font-family: ${fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[6]};
  padding-bottom: ${spacing[2]};
  border-bottom: 2px solid ${colors.accentGold};
`

const FallbackMessage = styled.p`
  font-family: ${fonts.body};
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  text-align: center;
  padding: ${spacing[16]} 0;
`

interface PdfItem {
  title: string
  url: string
}

export default async function SostenibilitaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [page, t] = await Promise.all([
    getPageBySlug('sostenibilita', locale),
    getTranslations({ locale, namespace: 'sustainability' }),
  ])

  if (!page) {
    return (
      <Page>
        <Title>{t('title')}</Title>
        <FallbackMessage>Content coming soon.</FallbackMessage>
      </Page>
    )
  }

  // Extract sections and PDFs
  const sections = page.fields.sections as Record<string, unknown> | undefined
  const pdfs = (sections?.pdfs ?? []) as PdfItem[]

  // Remove pdfs key from sections for rendering other sections
  const otherSections = sections
    ? Object.fromEntries(
        Object.entries(sections).filter(([key]) => key !== 'pdfs')
      )
    : null

  const hasOtherSections =
    otherSections && Object.keys(otherSections).length > 0

  return (
    <Page>
      <Title>{page.fields.title}</Title>

      {page.fields.body && (
        <BodyContent>
          {renderRichText(page.fields.body as unknown as Document)}
        </BodyContent>
      )}

      {hasOtherSections && (
        <SectionsWrapper>
          <PageSections sections={otherSections} />
        </SectionsWrapper>
      )}

      {pdfs.length > 0 && (
        <PdfSection>
          <PdfHeading>{t('pdfSection')}</PdfHeading>
          <PdfDownloadList pdfs={pdfs} />
        </PdfSection>
      )}
    </Page>
  )
}
