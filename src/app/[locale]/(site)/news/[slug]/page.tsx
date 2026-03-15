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
import ScrollReveal from '@/components/animations/ScrollReveal'
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

/* ── Hero section (full-width with image) ── */

const HeroBanner = styled.section`
  position: relative;
  height: min(55vh, 500px);
  min-height: 380px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      var(--color-bg) 0%,
      rgba(26, 30, 34, 0.7) 50%,
      rgba(26, 30, 34, 0.3) 100%
    );
    z-index: 1;
  }
`

const HeroImageContainer = styled.div`
  position: absolute;
  inset: 0;
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: ${spacing[12]} ${spacing[4]} ${spacing[8]};
`

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[4]};
`

const HeroCategoryBadge = styled.span`
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

const HeroDate = styled.time`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: rgba(249, 250, 251, 0.7);
`

const HeroTitle = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 1.2;

  ${mq.md} {
    font-size: 3rem;
  }

  ${mq.lg} {
    font-size: 3.25rem;
  }
`

/* ── Fallback hero (no image) ── */

const FallbackHero = styled.section`
  padding: ${spacing[16]} ${spacing[4]} ${spacing[8]};
  max-width: 1200px;
  margin: 0 auto;
`

const FallbackMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[4]};
`

const FallbackCategoryBadge = styled.span`
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

const FallbackDate = styled.time`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
`

const FallbackTitle = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 1.2;

  ${mq.md} {
    font-size: 3rem;
  }
`

/* ── Article body ── */

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[6]} ${spacing[4]} ${spacing[12]};
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

  const { title, date, category, body, featuredImage } = article.fields

  const imageAsset = featuredImage as unknown as { fields?: { file?: { url?: string } } } | undefined
  const imageUrl = imageAsset?.fields?.file?.url ? `https:${imageAsset.fields.file.url}` : null

  const formattedDate = new Date(date).toLocaleDateString(
    locale === 'it' ? 'it-IT' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <>
      {imageUrl ? (
        <HeroBanner>
          <HeroImageContainer>
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              priority
            />
          </HeroImageContainer>
          <HeroContent>
            <HeroMeta>
              {category && <HeroCategoryBadge>{category}</HeroCategoryBadge>}
              <HeroDate dateTime={date}>{formattedDate}</HeroDate>
            </HeroMeta>
            <HeroTitle>{title}</HeroTitle>
          </HeroContent>
        </HeroBanner>
      ) : (
        <FallbackHero>
          <FallbackMeta>
            {category && <FallbackCategoryBadge>{category}</FallbackCategoryBadge>}
            <FallbackDate dateTime={date}>{formattedDate}</FallbackDate>
          </FallbackMeta>
          <FallbackTitle>{title}</FallbackTitle>
        </FallbackHero>
      )}

      <ContentWrapper>
        <BackLink href="/news">{t('backToNews')}</BackLink>

        <ScrollReveal delay={0.15}>
          <ArticleBody>
            {body && renderRichText(body as unknown as Document)}
          </ArticleBody>
        </ScrollReveal>
      </ContentWrapper>
    </>
  )
}
