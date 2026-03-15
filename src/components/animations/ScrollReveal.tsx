'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  className?: string
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const mm = gsap.matchMedia()

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      normal: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions!

      if (reduceMotion) {
        gsap.set(containerRef.current!, { opacity: 1, x: 0, y: 0 })
        return
      }

      const fromVars: gsap.TweenVars = {
        opacity: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      }

      if (direction === 'up') {
        fromVars.y = 40
      } else if (direction === 'left') {
        fromVars.x = 40
      } else if (direction === 'right') {
        fromVars.x = -40
      }

      gsap.from(containerRef.current!, fromVars)
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
