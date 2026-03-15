'use client'

import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { logout } from '@/app/[locale]/(portal)/investitori/actions'

const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
`

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-accent-teal);
    border-color: var(--color-accent-teal);
  }
`

interface PortalHeaderProps {
  showLogout?: boolean
}

export default function PortalHeader({ showLogout = false }: PortalHeaderProps) {
  const t = useTranslations('portal')

  return (
    <HeaderBar>
      <LogoLink href="/">
        <Image
          src="/images/alkemia-logo-white.png"
          alt="Alkemia Capital"
          width={140}
          height={32}
          priority
        />
      </LogoLink>
      {showLogout && (
        <form action={logout}>
          <LogoutButton type="submit">{t('logout')}</LogoutButton>
        </form>
      )}
    </HeaderBar>
  )
}
