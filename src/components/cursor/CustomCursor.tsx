'use client'

import { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { mq } from '@/styles/breakpoints'
import { zIndex } from '@/styles/zIndex'

const CURSOR_SIZE = 20
const HALF = CURSOR_SIZE / 2
const INTERACTIVE_SELECTOR =
  'a, button, [data-cursor-hover], input, textarea, select, [role="button"]'

const CursorDot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${CURSOR_SIZE}px;
  height: ${CURSOR_SIZE}px;
  border-radius: 50%;
  border: 2px solid var(--color-accent-teal);
  pointer-events: none;
  z-index: ${zIndex.cursor};
  mix-blend-mode: difference;
  will-change: transform;
  /* No transition on transform — positioning must be instant */

  /* Hidden by default, shown on large screens with a mouse */
  display: none;
  ${mq.lg} {
    display: block;
  }
  @media (hover: none) {
    display: none !important;
  }

  &.hovering {
    width: ${CURSOR_SIZE * 2.5}px;
    height: ${CURSOR_SIZE * 2.5}px;
    border-color: var(--color-accent-gold);
    transition: width 0.15s ease, height 0.15s ease, border-color 0.15s ease;
  }
`

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number>(0)

  const applyPosition = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return
    const el = cursorRef.current
    const size = el.classList.contains('hovering') ? CURSOR_SIZE * 2.5 : CURSOR_SIZE
    const half = size / 2
    el.style.transform = `translate3d(${x - half}px, ${y - half}px, 0)`
  }, [])

  useEffect(() => {
    // Skip entirely on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    let mouseX = -100
    let mouseY = -100

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      // Use rAF for smooth 60fps cursor tracking
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => applyPosition(mouseX, mouseY))
    }

    const handleOver = (e: Event) => {
      const target = (e.target as HTMLElement).closest?.(INTERACTIVE_SELECTOR)
      if (target) cursorRef.current?.classList.add('hovering')
    }

    const handleOut = (e: Event) => {
      const target = (e.target as HTMLElement).closest?.(INTERACTIVE_SELECTOR)
      if (target) cursorRef.current?.classList.remove('hovering')
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)

    return () => {
      cancelAnimationFrame(rafId.current)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [applyPosition])

  return <CursorDot ref={cursorRef} />
}
