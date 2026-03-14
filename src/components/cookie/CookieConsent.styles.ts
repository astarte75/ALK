import styled from 'styled-components'
import { zIndex } from '@/styles/zIndex'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.cookieOverlay};
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
`

export const Modal = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--space-8);
  max-width: 520px;
  width: 100%;
`

export const Title = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
`

export const Description = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);

  a {
    color: var(--color-accent-teal);
    text-decoration: underline;
  }
`

export const ButtonRow = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-6);
`

// GDPR Italy Garante: Accept and Reject must have EQUAL visual prominence
// Same flex, padding, font-size, font-weight -- only fill color differs
const BaseButton = styled.button`
  flex: 1;
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`

export const AcceptButton = styled(BaseButton)`
  background-color: var(--color-accent-teal);
  color: var(--color-bg);
  border: 2px solid var(--color-accent-teal);
`

export const RejectButton = styled(BaseButton)`
  background-color: transparent;
  color: var(--color-text-primary);
  border: 2px solid var(--color-text-secondary);
`
