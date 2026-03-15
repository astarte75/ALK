'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-init'
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
  const overlayRef = useRef<HTMLDivElement>(null)

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

  useGSAP(() => {
    if (!overlayRef.current) return

    const overlay = overlayRef.current
    const items = overlay.querySelectorAll('[data-menu-item]')
    const footer = overlay.querySelector('[data-menu-footer]')

    const mm = gsap.matchMedia()

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      normal: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions!

      if (isOpen) {
        if (reduceMotion) {
          gsap.set(overlay, { visibility: 'visible', opacity: 1 })
          gsap.set(items, { opacity: 1, y: 0 })
          if (footer) gsap.set(footer, { opacity: 1 })
          return
        }

        const tl = gsap.timeline()
        tl.set(overlay, { visibility: 'visible' })
          .to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' })
          .to(items, {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.5,
            ease: 'power3.out',
          }, '-=0.1')

        if (footer) {
          tl.to(footer, { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2')
        }
      } else {
        if (reduceMotion) {
          gsap.set(overlay, { visibility: 'hidden', opacity: 0 })
          gsap.set(items, { opacity: 0, y: 30 })
          if (footer) gsap.set(footer, { opacity: 0 })
          return
        }

        const tl = gsap.timeline()
        if (footer) {
          tl.to(footer, { opacity: 0, duration: 0.15, ease: 'power2.in' })
        }
        tl.to(items, {
          opacity: 0,
          y: 30,
          stagger: 0.03,
          duration: 0.2,
          ease: 'power2.in',
        }, footer ? '-=0.1' : 0)
          .to(overlay, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.1')
          .set(overlay, { visibility: 'hidden' })
      }
    })
  }, { dependencies: [isOpen], scope: overlayRef })

  return (
    <MobileOverlay ref={overlayRef} aria-hidden={!isOpen}>
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
          {flatItems.map((item) => (
            <MobileMenuItem key={item.href} data-menu-item>
              <Link href={item.href} onClick={onClose}>
                {item.label}
              </Link>
            </MobileMenuItem>
          ))}
        </MobileMenuList>
      </MobileMenuNav>

      <MobileMenuFooter data-menu-footer>
        <LanguageSwitcher />
      </MobileMenuFooter>
    </MobileOverlay>
  )
}
