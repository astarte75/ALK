'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import NavigationLinks from './NavigationLinks'
import type { NavItem } from './NavigationLinks'
import LanguageSwitcher from './LanguageSwitcher'
import MobileMenu from './MobileMenu'
import {
  HeaderWrapper,
  HeaderInner,
  LogoLink,
  LogoImage,
  DesktopNav,
  RightSection,
  HamburgerButton,
} from './Header.styles'

interface HeaderProps {
  logoUrl: string
  logoAlt: string
}

export default function Header({ logoUrl, logoAlt }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('nav')

  const navItems: NavItem[] = [
    {
      label: t('societa'),
      href: '/societa',
      subItems: [{ label: t('corporateGovernance'), href: '/corporate-governance' }],
    },
    { label: t('investmentPlatforms'), href: '/investment-platforms' },
    { label: t('portfolio'), href: '/portfolio' },
    { label: t('team'), href: '/team' },
    { label: t('news'), href: '/news' },
    { label: t('sostenibilita'), href: '/sostenibilita' },
    { label: t('culture'), href: '/culture' },
    { label: t('contatti'), href: '/contatti' },
    { label: t('investitori'), href: '/investitori', isPortal: true },
  ]

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <div
        ref={sentinelRef}
        style={{ position: 'absolute', top: 0, height: '1px', width: '100%', pointerEvents: 'none' }}
        aria-hidden="true"
      />
      <HeaderWrapper $isScrolled={isScrolled}>
        <HeaderInner>
          <LogoLink as={Link} href="/">
            <LogoImage src={logoUrl} alt={logoAlt} />
          </LogoLink>

          <DesktopNav>
            <NavigationLinks navItems={navItems} />
          </DesktopNav>

          <RightSection>
            <LanguageSwitcher />
            <HamburgerButton
              $isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={isMobileMenuOpen}
            >
              <span />
              <span />
              <span />
            </HamburgerButton>
          </RightSection>
        </HeaderInner>
      </HeaderWrapper>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        logoUrl={logoUrl}
      />
    </>
  )
}
