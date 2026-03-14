'use client'

import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { colors, fonts, spacing } from '@/styles/theme'

interface PdfItem {
  title: string
  url: string
}

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`

const ListItem = styled.li`
  display: flex;
  align-items: center;
`

const DownloadLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  color: ${colors.accentTeal};
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    text-decoration: underline;
    opacity: 0.85;
  }
`

const PdfIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`

export default function PdfDownloadList({ pdfs }: { pdfs: PdfItem[] }) {
  const t = useTranslations('sustainability')

  if (!pdfs || pdfs.length === 0) return null

  return (
    <List>
      {pdfs.map((pdf, i) => (
        <ListItem key={i}>
          <DownloadLink
            href={pdf.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            title={`${t('downloadPdf')} - ${pdf.title}`}
          >
            <PdfIcon>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                <path d="M12 18l4-4h-3v-4h-2v4H8l4 4z" />
              </svg>
            </PdfIcon>
            {pdf.title}
          </DownloadLink>
        </ListItem>
      ))}
    </List>
  )
}
