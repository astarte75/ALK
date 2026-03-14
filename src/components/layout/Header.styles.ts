import styled, { css } from 'styled-components'
import { mq } from '@/styles/breakpoints'
import { zIndex } from '@/styles/zIndex'

export const HeaderWrapper = styled.header<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.header};
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;

  ${({ $isScrolled }) =>
    $isScrolled
      ? css`
          background-color: var(--color-bg);
          backdrop-filter: blur(12px);
        `
      : css`
          background-color: transparent;
        `}

  ${mq.lg} {
    padding: 0 var(--space-12);
  }
`

export const HeaderInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const LogoLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
`

export const LogoImage = styled.img`
  height: 32px;
  width: auto;

  ${mq.lg} {
    height: 40px;
  }
`

export const DesktopNav = styled.nav`
  display: none;

  ${mq.lg} {
    display: flex;
    align-items: center;
  }
`

export const RightSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-4);
`

export const HamburgerButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;

  ${mq.lg} {
    display: none;
  }

  span {
    display: block;
    width: 24px;
    height: 2px;
    background-color: var(--color-text-primary);
    transition: transform 0.3s ease, opacity 0.3s ease;
    position: absolute;

    &:nth-child(1) {
      transform: ${({ $isOpen }) =>
        $isOpen ? 'rotate(45deg)' : 'translateY(-7px)'};
    }

    &:nth-child(2) {
      opacity: ${({ $isOpen }) => ($isOpen ? 0 : 1)};
    }

    &:nth-child(3) {
      transform: ${({ $isOpen }) =>
        $isOpen ? 'rotate(-45deg)' : 'translateY(7px)'};
    }
  }
`
