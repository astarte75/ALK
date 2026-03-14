'use client'

import { type FormEvent } from 'react'
import styled from 'styled-components'
import { useTranslations } from 'next-intl'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const Strip = styled.section`
  background: ${colors.accentTeal};
  padding: ${spacing[8]} ${spacing[6]};
`

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing[4]};

  ${mq.md} {
    flex-direction: row;
    justify-content: space-between;
  }
`

const Title = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.bg};
  margin: 0;
  white-space: nowrap;
`

const Form = styled.form`
  display: flex;
  gap: ${spacing[2]};
  width: 100%;
  max-width: 420px;
`

const Input = styled.input`
  flex: 1;
  padding: ${spacing[2]} ${spacing[4]};
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textPrimary};
  background: rgba(26, 30, 34, 0.2);
  border: 1px solid rgba(26, 30, 34, 0.3);
  border-radius: 4px;
  outline: none;

  &::placeholder {
    color: rgba(26, 30, 34, 0.5);
  }

  &:focus {
    border-color: ${colors.bg};
  }
`

const Button = styled.button`
  padding: ${spacing[2]} ${spacing[6]};
  font-family: ${fonts.body};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  background: ${colors.bg};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`

export default function NewsletterStrip() {
  const t = useTranslations('home')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
    <Strip>
      <Inner>
        <Title>{t('newsletter.title')}</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder={t('newsletter.placeholder')}
            aria-label={t('newsletter.placeholder')}
          />
          <Button type="submit">{t('newsletter.subscribe')}</Button>
        </Form>
      </Inner>
    </Strip>
  )
}
