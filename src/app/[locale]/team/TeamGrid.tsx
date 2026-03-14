'use client'

import { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import FilterPills from '@/components/filters/FilterPills'
import TeamCard from '@/components/cards/TeamCard'
import { spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import type { TeamMember } from '@/lib/contentful/types'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[6]};

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const CATEGORIES = ['Partners', 'Investment Team', 'Operations'] as const

interface TeamGridProps {
  members: TeamMember[]
  locale: string
}

export default function TeamGrid({ members, locale }: TeamGridProps) {
  const [category, setCategory] = useState('all')
  const t = useTranslations('team')

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const m of members) {
      const cat = m.fields.category
      if (cat) counts.set(cat, (counts.get(cat) || 0) + 1)
    }

    return [
      { value: 'all', label: t('all'), count: members.length },
      ...CATEGORIES.map((cat) => ({
        value: cat,
        label: cat,
        count: counts.get(cat) || 0,
      })),
    ]
  }, [members, t])

  const filtered = useMemo(
    () => (category === 'all' ? members : members.filter((m) => m.fields.category === category)),
    [members, category]
  )

  return (
    <>
      <FilterPills
        label={t('filterCategory')}
        options={categoryOptions}
        value={category}
        onChange={setCategory}
      />
      <Grid>
        {filtered.map((member) => (
          <TeamCard key={member.sys.id} member={member} locale={locale} />
        ))}
      </Grid>
    </>
  )
}
