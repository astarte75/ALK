'use client'

import styled from 'styled-components'
import { colors, fonts, spacing } from '@/styles/theme'

// Timeline item (for storia sections)
interface TimelineItem {
  title: string
  description: string
  year?: string
}

// List section (for governance compact lists)
interface ListSection {
  title: string
  items: { name: string; role: string }[]
}

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[8]};
`

const TimelineBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`

const TimelineEntry = styled.div`
  padding-left: ${spacing[6]};
  border-left: 3px solid ${colors.accentGold};
  padding-bottom: ${spacing[4]};
`

const TimelineYear = styled.span`
  font-family: ${fonts.heading};
  font-size: 0.875rem;
  font-weight: 700;
  color: ${colors.accentTeal};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const TimelineTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: ${spacing[1]} 0 ${spacing[2]};
`

const TimelineDescription = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${colors.textSecondary};
  margin: 0;
`

const ListSectionContainer = styled.div`
  margin-bottom: ${spacing[6]};
`

const ListSectionTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[4]};
  padding-bottom: ${spacing[2]};
  border-bottom: 2px solid ${colors.accentGold};
`

const ListItem = styled.div`
  padding: ${spacing[3]} 0;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ListName = styled.span`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${colors.textPrimary};
`

const ListRole = styled.span`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
`

const FallbackPre = styled.pre`
  font-size: 0.75rem;
  color: ${colors.textSecondary};
  background: ${colors.surface};
  padding: ${spacing[4]};
  border-radius: 8px;
  overflow-x: auto;
`

function isTimelineArray(data: unknown): data is TimelineItem[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === 'object' &&
    data[0] !== null &&
    'title' in data[0] &&
    'description' in data[0]
  )
}

function isListSection(data: unknown): data is ListSection {
  return (
    typeof data === 'object' &&
    data !== null &&
    'title' in data &&
    'items' in data &&
    Array.isArray((data as ListSection).items)
  )
}

function isListSectionArray(data: unknown): data is ListSection[] {
  return Array.isArray(data) && data.length > 0 && isListSection(data[0])
}

function renderTimeline(items: TimelineItem[]) {
  return (
    <TimelineBlock>
      {items.map((item, i) => (
        <TimelineEntry key={i}>
          {item.year && <TimelineYear>{item.year}</TimelineYear>}
          <TimelineTitle>{item.title}</TimelineTitle>
          <TimelineDescription>{item.description}</TimelineDescription>
        </TimelineEntry>
      ))}
    </TimelineBlock>
  )
}

function renderListSection(section: ListSection) {
  return (
    <ListSectionContainer key={section.title}>
      <ListSectionTitle>{section.title}</ListSectionTitle>
      {section.items.map((item, i) => (
        <ListItem key={i}>
          <ListName>{item.name}</ListName>
          {item.role && <ListRole>{item.role}</ListRole>}
        </ListItem>
      ))}
    </ListSectionContainer>
  )
}

export default function PageSections({
  sections,
}: {
  sections: Record<string, unknown> | unknown
}) {
  if (!sections) return null

  // If sections is an array of timeline items
  if (isTimelineArray(sections)) {
    return <SectionWrapper>{renderTimeline(sections)}</SectionWrapper>
  }

  // If sections is an array of list sections
  if (isListSectionArray(sections)) {
    return (
      <SectionWrapper>
        {(sections as ListSection[]).map((section) => renderListSection(section))}
      </SectionWrapper>
    )
  }

  // If sections is an object with named keys
  if (typeof sections === 'object' && sections !== null && !Array.isArray(sections)) {
    const entries = Object.entries(sections as Record<string, unknown>)

    return (
      <SectionWrapper>
        {entries.map(([key, value]) => {
          // Value is a timeline array
          if (isTimelineArray(value)) {
            return <div key={key}>{renderTimeline(value)}</div>
          }

          // Value is a list section
          if (isListSection(value)) {
            return <div key={key}>{renderListSection(value)}</div>
          }

          // Value is array of list sections
          if (isListSectionArray(value)) {
            return (
              <div key={key}>
                {(value as ListSection[]).map((section) => renderListSection(section))}
              </div>
            )
          }

          // Value is array of { name, role } items (compact governance list)
          if (
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === 'object' &&
            value[0] !== null &&
            'name' in value[0]
          ) {
            return (
              <div key={key}>
                {renderListSection({
                  title: key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (s) => s.toUpperCase()),
                  items: value as { name: string; role: string }[],
                })}
              </div>
            )
          }

          // Generic text content
          if (typeof value === 'string') {
            return (
              <div key={key}>
                <TimelineDescription>{value}</TimelineDescription>
              </div>
            )
          }

          // Fallback: render as JSON
          return (
            <FallbackPre key={key}>
              {JSON.stringify(value, null, 2)}
            </FallbackPre>
          )
        })}
      </SectionWrapper>
    )
  }

  // Ultimate fallback
  return (
    <FallbackPre>
      {JSON.stringify(sections, null, 2)}
    </FallbackPre>
  )
}
