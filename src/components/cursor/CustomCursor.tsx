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
  transition: transform 0.15s ease;
  transform: translate(-100px, -100px);

  /* Hidden by default, shown on large screens with a mouse */
  display: none;
  ${mq.lg} {
    display: block;
  }
  @media (hover: none) {
    display: none !important;
  }
`

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const hovering = useRef(false)

  const applyTransform = useCallback(() => {
    if (!cursorRef.current) return
    const { x, y } = pos.current
    const scale = hovering.current ? ' scale(2.5)' : ''
    cursorRef.current.style.transform = `translate(${x - HALF}px, ${y - HALF}px)${scale}`
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      applyTransform()
    },
    [applyTransform],
  )

  useEffect(() => {
    // Skip entirely on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    document.addEventListener('mousemove', onMouseMove, { passive: true })

    const handleOver = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.matches?.(INTERACTIVE_SELECTOR)) {
        hovering.current = true
        applyTransform()
      }
    }

    const handleOut = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.matches?.(INTERACTIVE_SELECTOR)) {
        hovering.current = false
        applyTransform()
      }
    }

    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [onMouseMove, applyTransform])

  return <CursorDot ref={cursorRef} />
}
