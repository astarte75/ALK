import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
import { getPageBySlug } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import type { Document } from '@contentful/rich-text-types'
import ScrollReveal from '@/components/animations/ScrollReveal'

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
  max-width: 900px;
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

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};
  margin-bottom: ${spacing[12]};

  ${mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ValueCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: ${spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`

const ValueTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`

const ValueDescription = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`

const PhotoGrid = styled.div`
  columns: 1;
  column-gap: ${spacing[4]};

  ${mq.md} {
    columns: 2;
  }

  ${mq.lg} {
    columns: 3;
  }
`

const PhotoItem = styled.div`
  break-inside: avoid;
  margin-bottom: ${spacing[4]};
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`

const FallbackMessage = styled.p`
  font-family: ${fonts.body};
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  text-align: center;
  padding: ${spacing[16]} 0;
`

interface ValueItem {
  title: string
  description: string
  icon?: string
}

interface PhotoItem2 {
  url: string
  title?: string
  width?: number
  height?: number
}

export default async function CulturePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [page, t] = await Promise.all([
    getPageBySlug('culture', locale),
    getTranslations({ locale, namespace: 'culture' }),
  ])

  if (!page) {
    return (
      <Page>
        <Title>{t('title')}</Title>
        <FallbackMessage>Content coming soon.</FallbackMessage>
      </Page>
    )
  }

  // Extract sections
  const sections = page.fields.sections as Record<string, unknown> | undefined
  const values = (sections?.values ?? []) as ValueItem[]
  const photos = (sections?.photos ?? []) as PhotoItem2[]

  return (
    <Page>
      <ScrollReveal>
        <Title>{page.fields.title}</Title>
      </ScrollReveal>

      {page.fields.body && (
        <ScrollReveal delay={0.1}>
          <BodyContent>
            {renderRichText(page.fields.body as unknown as Document)}
          </BodyContent>
        </ScrollReveal>
      )}

      {values.length > 0 && (
        <ScrollReveal delay={0.2}>
          <ValuesGrid>
            {values.map((value, i) => (
              <ValueCard key={i}>
                <ValueTitle>{value.title}</ValueTitle>
                {value.description && (
                  <ValueDescription>{value.description}</ValueDescription>
                )}
              </ValueCard>
            ))}
          </ValuesGrid>
        </ScrollReveal>
      )}

      {photos.length > 0 && (
        <ScrollReveal delay={0.3}>
          <PhotoGrid>
            {photos.map((photo, i) => (
              <PhotoItem key={i}>
                <Image
                  src={photo.url.startsWith('//') ? `https:${photo.url}` : photo.url}
                  alt={photo.title ?? ''}
                  width={photo.width ?? 600}
                  height={photo.height ?? 400}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </PhotoItem>
            ))}
          </PhotoGrid>
        </ScrollReveal>
      )}
    </Page>
  )
}
