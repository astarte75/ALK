import styled from 'styled-components'
import { mq } from '@/styles/breakpoints'

export const FooterWrapper = styled.footer`
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
`

/* ── Main columns ── */

export const FooterMain = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-6) var(--space-8);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);

  ${mq.md} {
    grid-template-columns: 1fr 1fr;
  }

  ${mq.lg} {
    grid-template-columns: 1.8fr 1fr 0.8fr 1fr 1fr;
  }
`

/* ── Brand column (logo + company info) ── */

export const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`

export const FooterLogo = styled.img`
  height: 28px;
  width: auto;
  align-self: flex-start;
`

export const BrandName = styled.span`
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-accent-teal);
  letter-spacing: 0.02em;
`

export const CompanyInfo = styled.div`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  opacity: 0.6;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const CompanyInfoLine = styled.span`
  display: block;
`

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
`

export const FooterHeading = styled.h4`
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent-teal);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-1);
  text-align: left;
  width: 100%;
`

export const FooterText = styled.p`
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
`

export const FooterLink = styled.a`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.8125rem;
  transition: color 0.2s ease;
  display: block;

  &:hover {
    color: var(--color-accent-teal);
  }
`

export const OfficeName = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
`

export const OfficeLabel = styled.span`
  font-size: 0.6875rem;
  color: var(--color-accent-teal);
  font-weight: 500;
  margin-left: var(--space-2);
`

/* ── Partners column ── */

export const PartnersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);

  a {
    display: inline-block;
    transition: opacity 0.3s ease;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }

  img {
    height: 28px;
    width: auto;
    filter: brightness(0) invert(1);
    transition: filter 0.3s ease;
  }

  a:hover img {
    filter: brightness(0) saturate(100%) invert(68%) sepia(64%) saturate(416%) hue-rotate(127deg) brightness(92%) contrast(92%);
  }
`

/* ── Social ── */

export const SocialLinks = styled.div`
  display: flex;
  gap: var(--space-4);
`

export const SocialLink = styled.a`
  display: inline-flex;
  color: var(--color-text-secondary);
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-accent-teal);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

/* ── Copyright bar ── */

export const CopyrightBar = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  border-top: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-6);
  text-align: center;
  font-size: 0.6875rem;
  color: var(--color-text-secondary);
  opacity: 0.6;
`
