import { getPageBySlug } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { notFound } from 'next/navigation'
import type { Document } from '@contentful/rich-text-types'
import type { Metadata } from 'next'
import { LegalPageWrapper, LegalPageTitle, LegalPageContent } from '@/styles/legalPage'
import ScrollReveal from '@/components/animations/ScrollReveal'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = await getPageBySlug('reclami', locale)
  return {
    title: page?.fields.title ?? 'Reclami',
  }
}

export default async function ReclamiPage({ params }: Props) {
  const { locale } = await params
  const page = await getPageBySlug('reclami', locale)
  if (!page) notFound()

  return (
    <LegalPageWrapper>
      <ScrollReveal>
        <LegalPageTitle>{page.fields.title}</LegalPageTitle>
        <LegalPageContent>
          {renderRichText(page.fields.body as Document)}
        </LegalPageContent>
      </ScrollReveal>
    </LegalPageWrapper>
  )
}
