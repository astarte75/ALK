import styled from 'styled-components'
import { getNewsArticles } from '@/lib/contentful/fetchers'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import NewsCard from '@/components/cards/NewsCard'

const Section = styled.section`
  padding: ${spacing[16]} ${spacing[6]};
`

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto ${spacing[8]};
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`

const Title = styled.h2`
  font-family: ${fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;

  ${mq.md} {
    font-size: 2.5rem;
  }
`

const ViewAllLink = styled.a`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.accentTeal};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};
  max-width: 1200px;
  margin: 0 auto;

  ${mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`

interface NewsPreviewProps {
  locale: string
  title?: string
  ctaText?: string
}

export default async function NewsPreview({ locale, title, ctaText }: NewsPreviewProps) {
  const articles = await getNewsArticles(locale, 3)

  if (!articles || articles.length === 0) return null

  const newsPath = locale === 'it' ? '/news' : '/en/news'

  return (
    <Section>
      <Header>
        <Title>{title || 'News'}</Title>
        <ViewAllLink href={newsPath}>{ctaText || '→'}</ViewAllLink>
      </Header>
      <Grid>
        {articles.map((article) => (
          <NewsCard
            key={article.sys.id}
            article={article}
            locale={locale}
          />
        ))}
      </Grid>
    </Section>
  )
}
