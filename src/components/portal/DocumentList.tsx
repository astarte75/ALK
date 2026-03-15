'use client'

import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import type { InvestorDocument } from '@/lib/supabase/types'

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const Card = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const DocInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const DocTitle = styled.span`
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 0.95rem;
`

const DocMeta = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  display: flex;
  gap: 0.75rem;
`

const DocTypeBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  background: var(--color-border);
  color: var(--color-text-primary);
`

const DownloadLink = styled.a`
  color: var(--color-accent-teal);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: opacity 0.15s ease;

  &:hover {
    text-decoration: underline;
    opacity: 0.85;
  }
`

const EmptyState = styled.p`
  color: var(--color-text-secondary);
  padding: 2rem;
  text-align: center;
`

function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Map document_type to a display label key
const docTypeLabels: Record<string, string> = {
  quarterly_report: 'Q Report',
  annual_report: 'Annual',
  investor_letter: 'Letter',
  tax_document: 'Tax',
  capital_call_notice: 'Call Notice',
  distribution_notice: 'Distribution',
  other: 'Other',
}

interface DocumentListProps {
  documents: InvestorDocument[]
  locale: string
}

export default function DocumentList({ documents, locale }: DocumentListProps) {
  const t = useTranslations('portal.fundDetail')
  void locale // locale reserved for future date formatting

  if (documents.length === 0) {
    return <EmptyState>{t('noDocuments')}</EmptyState>
  }

  return (
    <List>
      {documents.map((doc) => (
        <Card key={doc.id}>
          <DocInfo>
            <DocTitle>{doc.title}</DocTitle>
            <DocMeta>
              <DocTypeBadge>{docTypeLabels[doc.document_type] ?? doc.document_type}</DocTypeBadge>
              {doc.file_size ? <span>{formatFileSize(doc.file_size)}</span> : null}
            </DocMeta>
          </DocInfo>
          <DownloadLink href={`/api/portal/documents/${doc.id}`} target="_blank" rel="noopener">
            {t('download')}
          </DownloadLink>
        </Card>
      ))}
    </List>
  )
}
