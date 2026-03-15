import styled from 'styled-components'
import { zIndex } from '@/styles/zIndex'

export const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.mobileMenu};
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  visibility: hidden;
  opacity: 0;
  overflow-y: auto;
`

export const MobileMenuHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--space-6);
  height: 80px;
  flex-shrink: 0;
`

export const MobileLogoImage = styled.img`
  height: 32px;
  width: auto;
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
  padding: 0;
  position: relative;

  span {
    display: block;
    width: 24px;
    height: 2px;
    background-color: var(--color-text-primary);
    position: absolute;

    &:nth-child(1) {
      transform: rotate(45deg);
    }

    &:nth-child(2) {
      transform: rotate(-45deg);
    }
  }
`

export const MobileMenuNav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: var(--space-8);
  padding: var(--space-8) 0;
`

export const MobileMenuList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
`

export const MobileMenuItem = styled.li`
  opacity: 0;
  transform: translateY(30px);

  a {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-accent-teal);
    }
  }
`

export const MobileMenuFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: var(--space-8) var(--space-6);
  opacity: 0;
`
