'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import styled from 'styled-components'
import { mq } from '@/styles/breakpoints'

export interface NavItem {
  label: string
  href: string
  subItems?: { label: string; href: string }[]
}

interface NavigationLinksProps {
  navItems: NavItem[]
  onItemClick?: () => void
  vertical?: boolean
}

const NavList = styled.ul<{ $vertical?: boolean }>`
  display: flex;
  flex-direction: ${({ $vertical }) => ($vertical ? 'column' : 'row')};
  align-items: ${({ $vertical }) => ($vertical ? 'center' : 'center')};
  gap: ${({ $vertical }) => ($vertical ? 'var(--space-8)' : 'var(--space-6)')};
  list-style: none;
`

const NavItemWrapper = styled.li`
  position: relative;
`

const NavLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: var(--color-accent-teal);
  }
`

const NavButton = styled.button`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: var(--color-accent-teal);
  }
`

const Dropdown = styled.ul<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--space-2) 0;
  min-width: 220px;
  list-style: none;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: translateX(-50%) translateY(${({ $isOpen }) => ($isOpen ? '8px' : '4px')});
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
  z-index: 10;

  ${mq.lg} {
    left: 0;
    transform: translateX(0) translateY(${({ $isOpen }) => ($isOpen ? '8px' : '4px')});
  }
`

const DropdownItem = styled.li`
  a {
    display: block;
    padding: var(--space-2) var(--space-4);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
      color: var(--color-accent-teal);
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
`

const ChevronDown = styled.span`
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid currentColor;
  margin-top: 2px;
`

export default function NavigationLinks({ navItems, onItemClick, vertical }: NavigationLinksProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <NavList $vertical={vertical}>
      {navItems.map((item, index) => {
        if (item.subItems && item.subItems.length > 0) {
          return (
            <NavItemWrapper
              key={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <NavButton type="button">
                {item.label}
                <ChevronDown />
              </NavButton>
              <Dropdown $isOpen={hoveredIndex === index}>
                <DropdownItem>
                  <Link href={item.href} onClick={onItemClick}>
                    {item.label}
                  </Link>
                </DropdownItem>
                {item.subItems.map((sub) => (
                  <DropdownItem key={sub.href}>
                    <Link href={sub.href} onClick={onItemClick}>
                      {sub.label}
                    </Link>
                  </DropdownItem>
                ))}
              </Dropdown>
            </NavItemWrapper>
          )
        }

        return (
          <NavItemWrapper key={item.href}>
            <NavLink href={item.href} onClick={onItemClick}>
              {item.label}
            </NavLink>
          </NavItemWrapper>
        )
      })}
    </NavList>
  )
}
