'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import styled from 'styled-components'

const SwitcherButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-body);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-accent-teal);
  }
`

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = locale === 'it' ? 'en' : 'it'

  return (
    <SwitcherButton
      onClick={() => router.replace(pathname, { locale: switchTo })}
      aria-label={`Switch to ${switchTo === 'en' ? 'English' : 'Italiano'}`}
    >
      {switchTo.toUpperCase()}
    </SwitcherButton>
  )
}
