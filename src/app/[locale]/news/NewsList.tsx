'use client'

import { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import ScrollReveal from '@/components/animations/ScrollReveal'
import FilterPills from '@/components/filters/FilterPills'
import NewsCard from '@/components/cards/NewsCard'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import type { NewsArticle } from '@/lib/contentful/types'

const BATCH_SIZE = 6

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[6]};

  ${mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const LoadMoreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing[3]};
  margin-top: ${spacing[8]};
`

const LoadMoreButton = styled.button`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 12px ${spacing[6]};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: transparent;
  color: ${colors.textPrimary};
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: ${colors.accentTeal};
    color: ${colors.accentTeal};
  }
`

const CountText = styled.span`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
`

const CATEGORIES = ['News', 'Insights', 'Events'] as const

interface NewsListProps {
  articles: NewsArticle[]
  locale: string
}

export default function NewsList({ articles, locale }: NewsListProps) {
  const [category, setCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const t = useTranslations('news')

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const a of articles) {
      const cat = a.fields.category
      if (cat) counts.set(cat, (counts.get(cat) || 0) + 1)
    }

    return [
      { value: 'all', label: t('all'), count: articles.length },
      ...CATEGORIES.map((cat) => ({
        value: cat,
        label: cat,
        count: counts.get(cat) || 0,
      })),
    ]
  }, [articles, t])

  const filtered = useMemo(
    () => (category === 'all' ? articles : articles.filter((a) => a.fields.category === category)),
    [articles, category]
  )

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setVisibleCount(BATCH_SIZE)
  }

  return (
    <>
      <ScrollReveal>
        <FilterPills
          label={t('filterCategory')}
          options={categoryOptions}
          value={category}
          onChange={handleCategoryChange}
        />
      </ScrollReveal>
      <ScrollReveal delay={0.15}>
        <Grid>
          {visible.map((article) => (
            <NewsCard key={article.sys.id} article={article} locale={locale} />
          ))}
        </Grid>
      </ScrollReveal>
      {(hasMore || filtered.length > 0) && (
        <ScrollReveal delay={0.25}>
          <LoadMoreWrapper>
            <CountText>
              {visible.length} {t('showing')} {filtered.length} {t('articles')}
            </CountText>
            {hasMore && (
              <LoadMoreButton onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}>
                {t('loadMore')}
              </LoadMoreButton>
            )}
          </LoadMoreWrapper>
        </ScrollReveal>
      )}
    </>
  )
}
