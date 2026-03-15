import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getTeamMembers, getTeamMemberBySlug } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import type { Document } from '@contentful/rich-text-types'

export async function generateStaticParams() {
  const members = await getTeamMembers('it')
  return members.flatMap((member) =>
    routing.locales.map((locale) => ({
      locale,
      slug: member.fields.slug,
    }))
  )
}

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[12]} ${spacing[4]};
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.accentTeal};
  text-decoration: none;
  margin-bottom: ${spacing[8]};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &::before {
    content: '\\2190';
    font-size: 1.125rem;
  }
`

const ProfileLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[8]};

  ${mq.lg} {
    flex-direction: row;
    align-items: flex-start;
  }
`

const PhotoColumn = styled.div`
  flex-shrink: 0;

  ${mq.lg} {
    width: 400px;
  }
`

const PhotoContainer = styled.div`
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 12px;
  background: ${colors.surface};

  ${mq.lg} {
    max-width: 400px;
  }
`

const Initials = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${fonts.heading};
  font-size: 3rem;
  font-weight: 700;
  color: ${colors.accentTeal};
  background: ${colors.surface};
`

const InfoColumn = styled.div`
  flex: 1;
  min-width: 0;
`

const MemberName = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[2]} 0;
`

const RoleText = styled.p`
  font-family: ${fonts.body};
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  margin: 0 0 ${spacing[3]} 0;
`

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[6]};
`

const BoardBadge = styled.span`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 4px ${spacing[3]};
  border-radius: 9999px;
  background: ${colors.accentGold};
  color: ${colors.bg};
`

const OfficeLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.textSecondary};

  &::before {
    content: '\\25CB';
    font-size: 0.5rem;
    color: ${colors.accentTeal};
  }
`

const LinkedInLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  font-family: ${fonts.body};
  font-size: 0.875rem;
  color: ${colors.accentTeal};
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &::after {
    content: '\\2197';
    font-size: 0.875rem;
  }
`

const BioContent = styled.div`
  font-family: ${fonts.body};
  color: ${colors.textPrimary};
  line-height: 1.7;

  h2, h3, h4 {
    font-family: ${fonts.heading};
    color: ${colors.textPrimary};
    margin-top: ${spacing[6]};
    margin-bottom: ${spacing[3]};
  }

  p {
    margin-bottom: ${spacing[4]};
    color: ${colors.textSecondary};
  }

  a {
    color: ${colors.accentTeal};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [member, t] = await Promise.all([
    getTeamMemberBySlug(slug, locale),
    getTranslations({ locale, namespace: 'team' }),
  ])

  if (!member) notFound()

  const { name, role, bio, photo, linkedIn, isBoard, office } = member.fields

  const photoAsset = photo as unknown as { fields?: { file?: { url?: string } } } | undefined
  const photoUrl = photoAsset?.fields?.file?.url ? `https:${photoAsset.fields.file.url}` : null

  const initials = name
    .split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Page>
      <BackLink href="/team">{t('backToTeam')}</BackLink>

      <ProfileLayout>
        <PhotoColumn>
          <PhotoContainer>
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            ) : (
              <Initials>{initials}</Initials>
            )}
          </PhotoContainer>
        </PhotoColumn>

        <InfoColumn>
          <MemberName>{name}</MemberName>
          <RoleText>{role}</RoleText>
          <BadgeRow>
            {isBoard && <BoardBadge>{t('boardMember')}</BoardBadge>}
            {office && <OfficeLabel>{office}</OfficeLabel>}
            {linkedIn && (
              <LinkedInLink href={linkedIn} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </LinkedInLink>
            )}
          </BadgeRow>
          <BioContent>
            {bio && renderRichText(bio as unknown as Document)}
          </BioContent>
        </InfoColumn>
      </ProfileLayout>
    </Page>
  )
}
