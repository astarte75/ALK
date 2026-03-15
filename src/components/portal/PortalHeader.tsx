'use client'

import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { logout } from '@/app/[locale]/(portal)/investitori/actions'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const AdminLink = styled(Link)`
  font-family: var(--font-body);
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-accent-gold);
  color: var(--color-accent-gold);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-accent-gold);
    color: var(--color-bg);
  }
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
  isAdmin?: boolean
}

export default function PortalHeader({ showLogout = false, isAdmin = false }: PortalHeaderProps) {
  const t = useTranslations('portal')

  return (
    <HeaderBar>
      <LogoLink href="/">
        <Image
          src="/images/alkemia-logo-white.png"
          alt="Alkemia Capital"
          width={32}
          height={32}
          priority
          style={{ height: 32, width: 'auto' }}
        />
      </LogoLink>
      <RightSection>
        {isAdmin && (
          <AdminLink href="/investitori/admin">Admin</AdminLink>
        )}
        <LanguageSwitcher />
        {showLogout && (
          <form action={logout}>
            <LogoutButton type="submit">{t('logout')}</LogoutButton>
          </form>
        )}
      </RightSection>
    </HeaderBar>
  )
}
