'use client'

import { useRef, type FormEvent } from 'react'
import styled from 'styled-components'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-init'
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

interface AnimatedNewsletterStripProps {
  title?: string
  placeholder?: string
  buttonText?: string
}

export default function AnimatedNewsletterStrip({ title, placeholder, buttonText }: AnimatedNewsletterStripProps) {
  const stripRef = useRef<HTMLElement>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  useGSAP(() => {
    if (!stripRef.current) return

    const mm = gsap.matchMedia()

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { reduceMotion } = context.conditions!

      if (reduceMotion) return

      gsap.from(stripRef.current!.children[0], {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stripRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      })
    })
  }, { scope: stripRef })

  return (
    <Strip ref={stripRef}>
      <Inner>
        <Title>{title || 'Newsletter'}</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder={placeholder || 'Email'}
            aria-label={placeholder || 'Email'}
          />
          <Button type="submit">{buttonText || 'Subscribe'}</Button>
        </Form>
      </Inner>
    </Strip>
  )
}
