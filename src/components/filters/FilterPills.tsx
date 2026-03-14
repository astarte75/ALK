'use client'

import styled from 'styled-components'
import { colors, fonts, spacing } from '@/styles/theme'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterPillsProps {
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing[2]};
  margin-bottom: ${spacing[4]};
`

const Pill = styled.button<{ $active: boolean }>`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 6px ${spacing[3]};
  border-radius: 9999px;
  border: 1px solid ${({ $active }) => ($active ? colors.accentTeal : colors.border)};
  background: ${({ $active }) => ($active ? colors.accentTeal : 'transparent')};
  color: ${({ $active }) => ($active ? colors.bg : colors.textSecondary)};
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${colors.accentTeal};
  }
`

export default function FilterPills({ label, options, value, onChange }: FilterPillsProps) {
  return (
    <Group role="group" aria-label={label}>
      {options.map((opt) => (
        <Pill
          key={opt.value}
          $active={value === opt.value}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
          {opt.count !== undefined ? ` (${opt.count})` : ''}
        </Pill>
      ))}
    </Group>
  )
}
