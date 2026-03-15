'use client'

import styled from 'styled-components'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { colors, fonts, spacing } from '@/styles/theme'
import type { NewsArticle } from '@/lib/contentful/types'

const Card = styled.article`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    border-color: rgba(46, 196, 182, 0.2);
  }
`

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;

  img {
    transition: transform 0.4s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.06);
  }
`

const Body = styled.div`
  padding: ${spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`

const DateText = styled.time`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  color: ${colors.textSecondary};
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

const Title = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;

  ${Card}:hover & {
    color: ${colors.accentTeal};
  }
`

const Excerpt = styled.p`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin: 0;
  line-height: 1.6;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`

function truncateWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/)
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(' ') + ' [...]'
}

interface NewsCardProps {
  article: NewsArticle
  locale: string
}

export default function NewsCard({ article, locale }: NewsCardProps) {
  const { title, slug, date, category, excerpt, featuredImage } = article.fields

  const formattedDate = new Date(date).toLocaleDateString(
    locale === 'it' ? 'it-IT' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  const imageUrl = featuredImage
    ? `https:${(featuredImage as unknown as { fields: { file: { url: string } } }).fields.file.url}`
    : null

  return (
    <StyledLink href={`/news/${slug}`}>
      <Card>
        {imageUrl && (
          <ImageWrapper>
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </ImageWrapper>
        )}
        <Body>
          <Meta>
            <DateText dateTime={date}>{formattedDate}</DateText>
            {category && <CategoryBadge>{category}</CategoryBadge>}
          </Meta>
          <Title>{title}</Title>
          {excerpt && <Excerpt>{truncateWords(excerpt, 25)}</Excerpt>}
        </Body>
      </Card>
    </StyledLink>
  )
}
