'use client'

import { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import FilterPills from '@/components/filters/FilterPills'
import PortfolioCard from '@/components/cards/PortfolioCard'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import type { PortfolioCompany } from '@/lib/contentful/types'

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

const Count = styled.p`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin: 0 0 ${spacing[4]} 0;
`

const AREA_OPTIONS_BASE = [
  { value: 'all', labelKey: 'all' },
  { value: 'Private Equity', label: 'Private Equity' },
  { value: 'Venture Capital', label: 'Venture Capital' },
  { value: 'PIPE', label: 'PIPE' },
]

interface PortfolioGridProps {
  companies: PortfolioCompany[]
  locale: string
}

export default function PortfolioGrid({ companies, locale }: PortfolioGridProps) {
  const t = useTranslations('portfolio')
  const [area, setArea] = useState('all')
  const [sector, setSector] = useState('all')

  // Build area options with translated "All" label
  const areaOptions = useMemo(
    () =>
      AREA_OPTIONS_BASE.map((opt) => ({
        value: opt.value,
        label: opt.value === 'all' ? t('all') : opt.label!,
      })),
    [t]
  )

  // Filter by area first (used for sector counts)
  const areaFiltered = useMemo(
    () =>
      area === 'all'
        ? companies
        : companies.filter((c) => c.fields.investmentType === area),
    [companies, area]
  )

  // Build sector options dynamically from area-filtered companies, with counts
  const sectorOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of areaFiltered) {
      const s = c.fields.sector
      if (s) counts.set(s, (counts.get(s) ?? 0) + 1)
    }
    const sorted = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    return [
      { value: 'all', label: t('all'), count: areaFiltered.length },
      ...sorted.map(([s, count]) => ({ value: s, label: s, count })),
    ]
  }, [areaFiltered, t])

  // Apply both filters
  const filtered = useMemo(
    () =>
      sector === 'all'
        ? areaFiltered
        : areaFiltered.filter((c) => c.fields.sector === sector),
    [areaFiltered, sector]
  )

  const handleAreaChange = (val: string) => {
    setArea(val)
    setSector('all') // reset sector when area changes
  }

  return (
    <>
      <FilterPills
        label={t('filterArea')}
        options={areaOptions}
        value={area}
        onChange={handleAreaChange}
      />
      <FilterPills
        label={t('filterSector')}
        options={sectorOptions}
        value={sector}
        onChange={setSector}
      />
      <Count>
        {filtered.length} {t('companiesCount')}
      </Count>
      <Grid>
        {filtered.map((company) => (
          <PortfolioCard key={company.sys.id} company={company} locale={locale} />
        ))}
      </Grid>
    </>
  )
}
