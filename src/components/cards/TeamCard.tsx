'use client'

import styled from 'styled-components'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { colors, fonts, spacing } from '@/styles/theme'
import type { TeamMember } from '@/lib/contentful/types'

const Card = styled.article`
  text-decoration: none;
  display: block;
`

const PhotoContainer = styled.div`
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 8px;
  background: ${colors.surface};

  img {
    transition: transform 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(26, 30, 34, 0.5), transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
    pointer-events: none;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }

  ${Card}:hover &::after {
    opacity: 0.6;
  }
`

const Initials = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.accentTeal};
  background: ${colors.surface};
`

const Name = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: ${spacing[3]} 0 0 0;
  transition: color 0.3s ease;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${colors.accentTeal};
    transition: width 0.4s ease;
  }

  ${Card}:hover & {
    color: ${colors.accentTeal};

    &::after {
      width: 100%;
    }
  }
`

const Role = styled.p`
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin: ${spacing[1]} 0 0 0;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`

interface TeamCardProps {
  member: TeamMember
  locale: string
}

export default function TeamCard({ member }: TeamCardProps) {
  const { name, slug, role, photo } = member.fields

  const photoAsset = photo as unknown as { fields?: { file?: { url?: string } } } | undefined
  const photoUrl = photoAsset?.fields?.file?.url ? `https:${photoAsset.fields.file.url}` : null

  const initials = name
    .split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <StyledLink href={`/team/${slug}`}>
      <Card>
        <PhotoContainer>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
          ) : (
            <Initials>{initials}</Initials>
          )}
        </PhotoContainer>
        <Name>{name}</Name>
        <Role>{role}</Role>
      </Card>
    </StyledLink>
  )
}
