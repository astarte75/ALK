import styled from 'styled-components'
import { mq } from '@/styles/breakpoints'

export const FooterWrapper = styled.footer`
  background: var(--color-surface);
  padding: var(--space-16) var(--space-6);
  border-top: 1px solid var(--color-border);
`

export const FooterInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);

  ${mq.lg} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

export const FooterHeading = styled.h4`
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
`

export const FooterText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
`

export const FooterLink = styled.a`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-accent-teal);
  }
`

export const OfficeName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
`

export const OfficeLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-accent-teal);
  font-weight: 500;
  margin-left: var(--space-2);
`

export const SocialLinks = styled.div`
  display: flex;
  gap: var(--space-4);
  align-items: center;
`

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

export const CopyrightBar = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`
