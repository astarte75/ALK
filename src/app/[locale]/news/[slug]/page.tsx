import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getNewsArticles, getNewsArticleBySlug } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import type { Document } from '@contentful/rich-text-types'

export async function generateStaticParams() {
  const articles = await getNewsArticles('it')
  return articles.flatMap((article) =>
    routing.locales.map((locale) => ({
      locale,
      slug: article.fields.slug,
    }))
  )
}

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[12]} ${spacing[4]};
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.accentTeal};
  text-decoration: none;
  margin-bottom: ${spacing[8]};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &::before {
    content: '\\2190';
    font-size: 1.125rem;
  }
`

const FeaturedImageContainer = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: ${spacing[6]};
  background: ${colors.surface};
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[4]};
`

const CategoryBadge = styled.span`
  font-family: ${fonts.body};
  font-size: 0.7rem;
  font-weight: 600;
  color: ${colors.accentTeal};
  border: 1px solid ${colors.accentTeal};
  border-radius: 9999px;
  padding: 2px ${spacing[2]};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`

const DateText = styled.time`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
`

const ArticleTitle = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[8]} 0;
  line-height: 1.2;

  ${mq.md} {
    font-size: 3rem;
  }
`

const ArticleBody = styled.div`
  max-width: 720px;
  margin: 0 auto;
  font-family: ${fonts.body};
  color: ${colors.textPrimary};
  line-height: 1.7;

  h2, h3, h4 {
    font-family: ${fonts.heading};
    color: ${colors.textPrimary};
    margin-top: ${spacing[8]};
    margin-bottom: ${spacing[3]};
  }

  h2 {
    font-size: 1.75rem;
  }

  h3 {
    font-size: 1.375rem;
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

  img {
    border-radius: 8px;
    margin: ${spacing[6]} 0;
  }

  ul, ol {
    margin-bottom: ${spacing[4]};
    padding-left: ${spacing[6]};
    color: ${colors.textSecondary};
  }

  li {
    margin-bottom: ${spacing[2]};
  }

  blockquote {
    border-left: 3px solid ${colors.accentTeal};
    padding-left: ${spacing[4]};
    margin: ${spacing[6]} 0;
    color: ${colors.textSecondary};
    font-style: italic;
  }
`

const ExternalLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${colors.accentTeal};
  text-decoration: none;
  margin-top: ${spacing[8]};
  padding: 12px ${spacing[6]};
  border: 1px solid ${colors.accentTeal};
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${colors.accentTeal};
    color: ${colors.bg};
  }

  &::after {
    content: '\\2197';
    font-size: 1rem;
  }
`

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [article, t] = await Promise.all([
    getNewsArticleBySlug(slug, locale),
    getTranslations({ locale, namespace: 'news' }),
  ])

  if (!article) notFound()

  const { title, date, category, body, featuredImage, externalUrl } = article.fields

  const imageAsset = featuredImage as unknown as { fields?: { file?: { url?: string } } } | undefined
  const imageUrl = imageAsset?.fields?.file?.url ? `https:${imageAsset.fields.file.url}` : null

  const formattedDate = new Date(date).toLocaleDateString(
    locale === 'it' ? 'it-IT' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <Page>
      <BackLink href="/news">{t('backToNews')}</BackLink>

      {imageUrl && (
        <FeaturedImageContainer>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </FeaturedImageContainer>
      )}

      <MetaRow>
        {category && <CategoryBadge>{category}</CategoryBadge>}
        <DateText dateTime={date}>{formattedDate}</DateText>
      </MetaRow>

      <ArticleTitle>{title}</ArticleTitle>

      <ArticleBody>
        {body && renderRichText(body as unknown as Document)}
      </ArticleBody>

      {externalUrl && (
        <ArticleBody>
          <ExternalLink href={externalUrl} target="_blank" rel="noopener noreferrer">
            {t('readOriginal')}
          </ExternalLink>
        </ArticleBody>
      )}
    </Page>
  )
}
