'use client'

import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const HeroWrapper = styled.section`
  position: relative;
  height: 100vh;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const VideoBg = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(26, 30, 34, 0.5) 0%,
    rgba(26, 30, 34, 0.85) 100%
  );
  z-index: 1;
`

const Content = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${spacing[6]};
  max-width: 960px;
`

const Logo = styled.div`
  margin-bottom: ${spacing[8]};
  opacity: 0;
`

const Headline = styled.h1`
  font-family: ${fonts.heading};
  font-size: 3rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;

  ${mq.md} {
    font-size: 4rem;
  }

  ${mq.lg} {
    font-size: 5.5rem;
  }
`

const Word = styled.span`
  display: inline-block;
  overflow: hidden;
  margin-right: 0.25em;

  & > span {
    display: inline-block;
    transform: translateY(110%);
  }
`

const GoldAccent = styled.span`
  display: block;
  width: 0;
  height: 3px;
  background-color: ${colors.accentGold};
  border-radius: 2px;
  margin: ${spacing[6]} auto;
`

const Subtitle = styled.p`
  font-family: ${fonts.body};
  font-size: 1rem;
  color: ${colors.textSecondary};
  max-width: 600px;
  line-height: 1.7;
  margin: 0;
  opacity: 0;

  ${mq.md} {
    font-size: 1.125rem;
  }
`

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
`

const ScrollLine = styled.div`
  width: 1px;
  height: 40px;
  background: ${colors.accentTeal};
  transform-origin: top;
  animation: scrollPulse 2s ease-in-out infinite;

  @keyframes scrollPulse {
    0%, 100% { transform: scaleY(0.3); opacity: 0.3; }
    50% { transform: scaleY(1); opacity: 1; }
  }
`

interface VideoHeroProps {
  headline?: string
  subtitle?: string
  videoSrc?: string
  posterSrc?: string
}

export default function VideoHero({
  headline,
  subtitle,
  videoSrc = '/videos/hero-bg.mp4',
  posterSrc = '/images/hero-poster.jpg',
}: VideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [, setVideoLoaded] = useState(false)
  const headlineText = headline || 'Passione per l\'impresa'

  const words = headlineText.split(' ')

  // Video loading detection (not animation-related)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleReady = () => setVideoLoaded(true)
    video.addEventListener('playing', handleReady)
    video.addEventListener('canplay', handleReady)

    if (video.readyState >= 3) {
      setVideoLoaded(true)
    }

    video.play().catch(() => {
      // Autoplay blocked — dark bg visible, acceptable fallback
    })

    return () => {
      video.removeEventListener('playing', handleReady)
      video.removeEventListener('canplay', handleReady)
    }
  }, [])

  useGSAP(() => {
    if (!containerRef.current) return

    const mm = gsap.matchMedia()

    mm.add({
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { reduceMotion } = context.conditions!

      if (reduceMotion) {
        gsap.set('[data-word-inner]', { y: 0 })
        gsap.set('[data-logo]', { opacity: 1 })
        gsap.set('[data-gold-accent]', { width: '3rem' })
        gsap.set('[data-subtitle]', { opacity: 1, y: 0 })
        gsap.set('[data-scroll-indicator]', { opacity: 1 })
        videoRef.current?.pause()
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.3,
      })

      // Logo fade in
      tl.to('[data-logo]', {
        opacity: 1,
        duration: 0.8,
      })

      // Staggered word reveal
      tl.to('[data-word-inner]', {
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power4.out',
      }, '-=0.3')

      // Gold accent bar grows
      tl.to('[data-gold-accent]', {
        width: '3rem',
        duration: 0.6,
        ease: 'power2.inOut',
      }, '-=0.4')

      // Subtitle fades in
      tl.to('[data-subtitle]', {
        opacity: 1,
        duration: 0.8,
        y: 0,
      }, '-=0.3')

      // Scroll indicator
      tl.to('[data-scroll-indicator]', {
        opacity: 0.7,
        duration: 0.6,
      }, '-=0.2')

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const content = containerRef.current?.querySelector('[data-hero-content]') as HTMLElement
          if (content) {
            gsap.set(content, { y: self.progress * 150, opacity: 1 - self.progress * 0.6 })
          }
        },
      })
    })
  }, { scope: containerRef })

  return (
    <HeroWrapper ref={containerRef}>
      <VideoBg
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={videoSrc} type="video/mp4" />
      </VideoBg>
      <Overlay />
      <Content data-hero-content>
        <Logo data-logo>
          <Image
            src="/images/alkemia-logo-white.png"
            alt="Alkemia Capital"
            width={180}
            height={60}
            style={{ height: 'auto' }}
          />
        </Logo>
        <Headline>
          {words.map((word, i) => (
            <Word key={i}>
              <span data-word-inner>{word}</span>
            </Word>
          ))}
        </Headline>
        <GoldAccent data-gold-accent />
        <Subtitle data-subtitle style={{ transform: 'translateY(20px)' }}>
          {subtitle || ''}
        </Subtitle>
      </Content>
      <ScrollIndicator data-scroll-indicator>
        <ScrollLine />
      </ScrollIndicator>
    </HeroWrapper>
  )
}
