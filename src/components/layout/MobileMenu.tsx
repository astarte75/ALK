'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { NavItem } from './NavigationLinks'
import LanguageSwitcher from './LanguageSwitcher'
import {
  MobileOverlay,
  MobileMenuHeader,
  MobileLogoImage,
  CloseButton,
  MobileMenuNav,
  MobileMenuList,
  MobileMenuItem,
  MobileMenuFooter,
} from './MobileMenu.styles'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  logoUrl: string
}

export default function MobileMenu({ isOpen, onClose, navItems, logoUrl }: MobileMenuProps) {
  const t = useTranslations('nav')

  // Flatten sub-items for mobile display
  const flatItems: { label: string; href: string }[] = []
  for (const item of navItems) {
    flatItems.push({ label: item.label, href: item.href })
    if (item.subItems) {
      for (const sub of item.subItems) {
        flatItems.push({ label: sub.label, href: sub.href })
      }
    }
  }

  return (
    <MobileOverlay $isOpen={isOpen} aria-hidden={!isOpen}>
      <MobileMenuHeader>
        <Link href="/" onClick={onClose}>
          <MobileLogoImage src={logoUrl} alt="Alkemia Capital" />
        </Link>
        <CloseButton onClick={onClose} aria-label={t('closeMenu')}>
          <span />
          <span />
        </CloseButton>
      </MobileMenuHeader>

      <MobileMenuNav>
        <MobileMenuList>
          {flatItems.map((item, index) => (
            <MobileMenuItem key={item.href} $isOpen={isOpen} $index={index}>
              <Link href={item.href} onClick={onClose}>
                {item.label}
              </Link>
            </MobileMenuItem>
          ))}
        </MobileMenuList>
      </MobileMenuNav>

      <MobileMenuFooter $isOpen={isOpen}>
        <LanguageSwitcher />
      </MobileMenuFooter>
    </MobileOverlay>
  )
}
