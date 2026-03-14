'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { getConsent, setConsent } from '@/lib/cookies'
import {
  Overlay,
  Modal,
  Title,
  Description,
  ButtonRow,
  AcceptButton,
  RejectButton,
} from './CookieConsent.styles'

export default function CookieConsent() {
  // Initialize false to prevent hydration mismatch (server cannot read cookies)
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('cookie')

  useEffect(() => {
    if (getConsent() === null) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setConsent('accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    setConsent('rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <Overlay>
      <Modal role="dialog" aria-modal="true" aria-labelledby="cookie-title">
        <Title id="cookie-title">{t('title')}</Title>
        <Description>
          {t.rich('description', {
            cookiePolicy: (chunks) => (
              <Link href="/cookie-policy">{chunks}</Link>
            ),
          })}
        </Description>
        <ButtonRow>
          {/* GDPR Italy Garante: both buttons MUST have equal visual prominence */}
          <RejectButton onClick={handleReject}>{t('reject')}</RejectButton>
          <AcceptButton onClick={handleAccept}>{t('accept')}</AcceptButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  )
}
