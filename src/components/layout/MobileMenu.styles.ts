import styled from 'styled-components'
import { zIndex } from '@/styles/zIndex'

export const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.mobileMenu};
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.4s ease, visibility 0.4s ease;
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

export const MobileMenuItem = styled.li<{ $isOpen: boolean; $index: number }>`
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '20px')});
  transition: opacity 0.4s ease, transform 0.4s ease;
  transition-delay: ${({ $isOpen, $index }) =>
    $isOpen ? `${0.1 + $index * 0.08}s` : '0s'};

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

export const MobileMenuFooter = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: center;
  padding: var(--space-8) var(--space-6);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.4s ease;
  transition-delay: ${({ $isOpen }) => ($isOpen ? '0.8s' : '0s')};
`
