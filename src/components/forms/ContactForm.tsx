'use client'

import { useState, type FormEvent } from 'react'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error'

const Form = styled.form`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: ${spacing[6]};

  ${mq.md} {
    padding: ${spacing[8]};
  }
`

const FieldGrid = styled.div`
  display: grid;
  gap: ${spacing[4]};

  ${mq.sm} {
    grid-template-columns: 1fr 1fr;
  }
`

const FieldGroup = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;

  ${mq.sm} {
    grid-column: ${(p) => (p.$fullWidth ? '1 / -1' : 'auto')};
  }
`

const Label = styled.label`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin-bottom: ${spacing[1]};
`

const inputStyles = `
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--space-3) var(--space-4);
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--color-accent-teal);
  }

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.5;
  }
`

const Input = styled.input`
  ${inputStyles}
`

const Select = styled.select`
  ${inputStyles}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%23999'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-4) center;
  padding-right: calc(var(--space-4) + 20px);
`

const Textarea = styled.textarea`
  ${inputStyles}
  min-height: 120px;
  resize: vertical;
`

const SubmitButton = styled.button`
  font-family: ${fonts.body};
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.bg};
  background: ${colors.accentTeal};
  border: none;
  border-radius: 8px;
  padding: ${spacing[3]};
  width: 100%;
  cursor: pointer;
  transition: opacity 0.2s ease;
  margin-top: ${spacing[2]};

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ErrorText = styled.span`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  color: #e74c3c;
  margin-top: 4px;
`

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  background: rgba(0, 200, 120, 0.08);
  border: 1px solid rgba(0, 200, 120, 0.25);
  border-radius: 8px;
  padding: ${spacing[4]} ${spacing[6]};
  color: #00c878;
  font-family: ${fonts.body};
  font-size: 0.95rem;
  line-height: 1.5;
`

const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.08);
  border: 1px solid rgba(231, 76, 60, 0.25);
  border-radius: 8px;
  padding: ${spacing[4]} ${spacing[6]};
  color: #e74c3c;
  font-family: ${fonts.body};
  font-size: 0.95rem;
  line-height: 1.5;
`

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm() {
  const t = useTranslations('contact')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [requestType, setRequestType] = useState('')
  const [message, setMessage] = useState('')

  const [status, setStatus] = useState<SubmissionState>('idle')
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

  const requestTypeOptions = [
    { value: 'investitore', label: t('requestTypes.investor') },
    { value: 'opportunita', label: t('requestTypes.opportunity') },
    { value: 'segreteria', label: t('requestTypes.general') },
  ]

  function validate(): boolean {
    const errors: Record<string, boolean> = {}

    if (!firstName.trim()) errors.firstName = true
    if (!lastName.trim()) errors.lastName = true
    if (!email.trim() || !EMAIL_REGEX.test(email)) errors.email = true
    if (!phone.trim()) errors.phone = true
    if (!requestType) errors.requestType = true
    if (!message.trim()) errors.message = true

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!validate()) return

    setStatus('submitting')

    try {
      // reCAPTCHA v3 predisposition:
      // When NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set, load the reCAPTCHA script
      // and obtain a token via grecaptcha.execute(siteKey, { action: 'contact' }).
      // For now, this is not active — recaptchaToken will be undefined.
      const recaptchaToken: string | undefined = undefined

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          requestType,
          message: message.trim(),
          recaptchaToken,
        }),
      })

      if (res.ok) {
        setStatus('success')
        setFirstName('')
        setLastName('')
        setEmail('')
        setPhone('')
        setRequestType('')
        setMessage('')
        setFieldErrors({})
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <SuccessMessage>
        <span style={{ fontSize: '1.5rem' }}>&#10003;</span>
        {t('success')}
      </SuccessMessage>
    )
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FieldGrid>
        <FieldGroup>
          <Label htmlFor="firstName">{t('firstName')} *</Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {fieldErrors.firstName && <ErrorText>{t('required')}</ErrorText>}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="lastName">{t('lastName')} *</Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {fieldErrors.lastName && <ErrorText>{t('required')}</ErrorText>}
        </FieldGroup>

        <FieldGroup $fullWidth>
          <Label htmlFor="email">{t('email')} *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldErrors.email && (
            <ErrorText>
              {!email.trim() ? t('required') : t('invalidEmail')}
            </ErrorText>
          )}
        </FieldGroup>

        <FieldGroup $fullWidth>
          <Label htmlFor="phone">{t('phone')} *</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {fieldErrors.phone && <ErrorText>{t('required')}</ErrorText>}
        </FieldGroup>

        <FieldGroup $fullWidth>
          <Label htmlFor="requestType">{t('requestType')} *</Label>
          <Select
            id="requestType"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            required
          >
            <option value="" disabled>
              —
            </option>
            {requestTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          {fieldErrors.requestType && <ErrorText>{t('required')}</ErrorText>}
        </FieldGroup>

        <FieldGroup $fullWidth>
          <Label htmlFor="message">{t('message')} *</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {fieldErrors.message && <ErrorText>{t('required')}</ErrorText>}
        </FieldGroup>

        <FieldGroup $fullWidth>
          <SubmitButton type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? t('submitting') : t('submit')}
          </SubmitButton>
        </FieldGroup>
      </FieldGrid>

      {status === 'error' && <ErrorMessage>{t('error')}</ErrorMessage>}
    </Form>
  )
}
