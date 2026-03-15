'use client'

import styled from 'styled-components'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { colors, fonts, spacing } from '@/styles/theme'
import type { PortfolioCompany } from '@/lib/contentful/types'

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
`

const Card = styled.article`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  overflow: hidden;
  padding: ${spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
  height: 100%;
  transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: linear-gradient(to top, rgba(46, 196, 182, 0.06), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(46, 196, 182, 0.3);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);

    &::after {
      opacity: 1;
    }
  }
`

const LogoContainer = styled.div`
  position: absolute;
  top: ${spacing[3]};
  right: ${spacing[3]};
  width: 72px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  padding: 4px 8px;
  overflow: hidden;
`

const LogoFallback = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${colors.accentTeal};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${fonts.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.bg};
  flex-shrink: 0;
`

const Name = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 1.3;
`

const Sector = styled.span`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const Description = styled.p`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`

const Year = styled.span`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
`

const Badge = styled.span<{ $type: string }>`
  font-family: ${fonts.body};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 3px ${spacing[2]};
  border-radius: 9999px;
  background: ${({ $type }) =>
    $type === 'Private Equity'
      ? colors.accentTeal
      : $type === 'Venture Capital'
        ? colors.accentGold
        : colors.accentPurple};
  color: ${colors.bg};
`

interface PortfolioCardProps {
  company: PortfolioCompany
  locale: string
}

export default function PortfolioCard({ company }: PortfolioCardProps) {
  const { name, slug, sector, shortDescription, investmentType, year, logo } = company.fields

  const logoAsset = logo as unknown as { fields?: { file?: { url?: string }; title?: string } } | undefined
  const logoUrl = logoAsset?.fields?.file?.url ? `https:${logoAsset.fields.file.url}` : null

  return (
    <StyledLink href={`/portfolio/${slug}`}>
      <Card>
        <LogoContainer>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={name}
              width={56}
              height={28}
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            />
          ) : (
            <LogoFallback>{name.charAt(0)}</LogoFallback>
          )}
        </LogoContainer>
        <Name style={{ paddingRight: '84px' }}>{name}</Name>
        {sector && <Sector>{sector}</Sector>}
        {shortDescription && <Description>{shortDescription}</Description>}
        <BottomRow>
          {year && <Year>{year}</Year>}
          {investmentType && <Badge $type={investmentType}>{investmentType === 'Private Equity' ? 'PE' : investmentType === 'Venture Capital' ? 'VC' : investmentType}</Badge>}
        </BottomRow>
      </Card>
    </StyledLink>
  )
}
