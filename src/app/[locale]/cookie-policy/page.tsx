import { getPageBySlug } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { notFound } from 'next/navigation'
import type { Document } from '@contentful/rich-text-types'
import type { Metadata } from 'next'
import { LegalPageWrapper, LegalPageTitle, LegalPageContent } from '@/styles/legalPage'
import ScrollReveal from '@/components/animations/ScrollReveal'

// Content must exist in Contentful as a `page` entry with slug "cookie-policy"
// in both it-IT and en-US locales. Returns 404 if not yet seeded.

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = await getPageBySlug('cookie-policy', locale)
  return {
    title: page?.fields.title ?? 'Cookie Policy',
  }
}

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params
  const page = await getPageBySlug('cookie-policy', locale)
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
