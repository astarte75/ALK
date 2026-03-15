'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components'
import { login } from '@/app/[locale]/(portal)/investitori/actions'

// -- Styled Components --

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Wrapper = styled.div`
  min-height: calc(100vh - 64px);
  min-height: calc(100svh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--color-bg);
`

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (min-width: 480px) {
    padding: 2.5rem;
  }
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 2rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-family: var(--font-body);
`

const Input = styled.input`
  height: 48px;
  padding: 0 1rem;
  font-size: 1rem;
  font-family: var(--font-body);
  color: var(--color-text-primary);
  background: #1a1e22;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: var(--color-accent-teal);
    box-shadow: 0 0 0 2px rgba(46, 196, 182, 0.2);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`

const SubmitBtn = styled.button`
  height: 48px;
  margin-top: 0.5rem;
  background: var(--color-accent-teal);
  color: #fff;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
  }
`

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 0.25rem;
`

// -- Submit Button with loading state --

function SubmitButton() {
  const { pending } = useFormStatus()
  const t = useTranslations('portal.login')

  return (
    <SubmitBtn type="submit" disabled={pending}>
      {pending ? t('loading') : t('submit')}
    </SubmitBtn>
  )
}

// -- Login Form --

interface LoginFormProps {
  locale: string
}

export default function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations('portal.login')
  const [state, formAction] = useActionState(login, null)

  return (
    <Wrapper>
      <Card>
        <LogoContainer>
          <Image
            src="/images/alkemia-logo-white.png"
            alt="Alkemia Capital"
            width={72}
            height={72}
            priority
            style={{ height: 72, width: 'auto' }}
          />
        </LogoContainer>
        <Title>{t('title')}</Title>
        <Subtitle>{t('subtitle')}</Subtitle>
        <form action={formAction}>
          <input type="hidden" name="locale" value={locale} />
          <FormGroup>
            <Label>
              {t('email')}
              <Input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="email@example.com"
              />
            </Label>
            <Label>
              {t('password')}
              <Input
                type="password"
                name="password"
                required
                autoComplete="current-password"
              />
            </Label>
            <SubmitButton />
          </FormGroup>
          {state?.error && (
            <ErrorMessage>
              {state.error === 'invalid_credentials'
                ? t('error')
                : t('errorGeneric')}
            </ErrorMessage>
          )}
        </form>
      </Card>
    </Wrapper>
  )
}
