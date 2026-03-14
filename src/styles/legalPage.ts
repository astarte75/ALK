import styled from 'styled-components'

export const LegalPageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
`

export const LegalPageTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-8);
  color: var(--color-text-primary);
`

export const LegalPageContent = styled.div`
  color: var(--color-text-secondary);
  line-height: 1.8;
  font-size: 1rem;

  h2 {
    color: var(--color-text-primary);
    margin-top: var(--space-8);
    margin-bottom: var(--space-4);
  }

  h3 {
    color: var(--color-text-primary);
    margin-top: var(--space-6);
    margin-bottom: var(--space-3);
  }

  p {
    margin-bottom: var(--space-4);
  }

  ul,
  ol {
    margin-left: var(--space-6);
    margin-bottom: var(--space-4);
  }

  li {
    margin-bottom: var(--space-2);
  }

  a {
    color: var(--color-accent-teal);
    text-decoration: underline;
  }
`
