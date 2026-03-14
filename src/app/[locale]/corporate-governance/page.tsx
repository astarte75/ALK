import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getPageBySlug, getTeamMembers } from '@/lib/contentful/fetchers'
import { getClient } from '@/lib/contentful/client'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[12]} ${spacing[4]};
`

const Title = styled.h1`
  font-family: ${fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[12]};
`

const Section = styled.section`
  margin-bottom: ${spacing[16]};
`

const SectionHeading = styled.h2`
  font-family: ${fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing[6]};
  padding-bottom: ${spacing[2]};
  border-bottom: 2px solid ${colors.accentGold};
`

const SectionDescription = styled.p`
  font-family: ${fonts.body};
  font-size: 1rem;
  color: ${colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 ${spacing[6]};
`

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[6]};

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const BoardCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`

const PhotoContainer = styled.div`
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 8px;
  overflow: hidden;
  background: ${colors.surface};
`

const PhotoFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.surface};
  font-family: ${fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.accentTeal};
`

const MemberName = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`

const MemberRole = styled.p`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
  margin: 0;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover h3 {
    color: ${colors.accentTeal};
  }
`

const CompactList = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 8px;
  overflow: hidden;
`

const CompactItem = styled.div`
  padding: ${spacing[4]} ${spacing[6]};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  gap: 2px;

  &:last-child {
    border-bottom: none;
  }
`

const CompactName = styled.span`
  font-family: ${fonts.body};
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${colors.textPrimary};
`

const CompactRole = styled.span`
  font-family: ${fonts.body};
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
`

const FallbackMessage = styled.p`
  font-family: ${fonts.body};
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  text-align: center;
  padding: ${spacing[16]} 0;
`

interface BoardMember {
  name: string
  role: string
  isTeamMember?: boolean
  slug?: string
  photoAssetId?: string
}

interface SectionMember {
  name: string
  role: string
}

interface GovernanceSections {
  boardMembers?: BoardMember[]
  sindaci?: SectionMember[]
  controlFunctions?: SectionMember[]
  shareholding?: string
}

export default async function CorporateGovernancePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [page, teamMembers, t] = await Promise.all([
    getPageBySlug('corporate-governance', locale),
    getTeamMembers(locale),
    getTranslations({ locale, namespace: 'governance' }),
  ])

  const sections = (page?.fields.sections ?? {}) as GovernanceSections

  // Build photo URL map from team members
  const teamPhotoMap = new Map<string, string>()
  for (const m of teamMembers) {
    const photo = m.fields.photo as unknown as { fields?: { file?: { url?: string } } } | undefined
    if (photo?.fields?.file?.url) {
      teamPhotoMap.set(m.fields.slug, `https:${photo.fields.file.url}`)
    }
  }

  // Resolve photos for non-team board members (by asset ID)
  const assetPhotoMap = new Map<string, string>()
  if (sections.boardMembers) {
    const assetIds = sections.boardMembers
      .filter(m => m.photoAssetId && !m.isTeamMember)
      .map(m => m.photoAssetId!)
    if (assetIds.length > 0) {
      const client = getClient()
      for (const id of assetIds) {
        try {
          const asset = await client.getAsset(id)
          const url = asset.fields.file?.url
          if (url) assetPhotoMap.set(id, `https:${url}`)
        } catch {
          // Asset not found, skip
        }
      }
    }
  }

  if (!page && !sections.boardMembers) {
    return (
      <Page>
        <Title>{t('title')}</Title>
        <FallbackMessage>Content coming soon.</FallbackMessage>
      </Page>
    )
  }

  return (
    <Page>
      <Title>{t('title')}</Title>

      {/* Shareholding */}
      {sections.shareholding && (
        <Section>
          <SectionHeading>{t('shareholderTitle')}</SectionHeading>
          <SectionDescription>{sections.shareholding}</SectionDescription>
        </Section>
      )}

      {/* Board of Directors */}
      {sections.boardMembers && sections.boardMembers.length > 0 && (
        <Section>
          <SectionHeading>{t('boardTitle')}</SectionHeading>
          <BoardGrid>
            {sections.boardMembers.map((member) => {
              const photoUrl = member.isTeamMember && member.slug
                ? teamPhotoMap.get(member.slug) || null
                : member.photoAssetId
                  ? assetPhotoMap.get(member.photoAssetId) || null
                  : null

              const card = (
                <BoardCard key={member.name}>
                  <PhotoContainer>
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={member.name}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <PhotoFallback>
                        {member.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                      </PhotoFallback>
                    )}
                  </PhotoContainer>
                  <MemberName>{member.name}</MemberName>
                  <MemberRole>{member.role}</MemberRole>
                </BoardCard>
              )

              if (member.isTeamMember && member.slug) {
                return (
                  <StyledLink key={member.name} href={`/team/${member.slug}`}>
                    {card}
                  </StyledLink>
                )
              }
              return card
            })}
          </BoardGrid>
        </Section>
      )}

      {/* Collegio Sindacale */}
      {sections.sindaci && sections.sindaci.length > 0 && (
        <Section>
          <SectionHeading>{t('collegioTitle')}</SectionHeading>
          <CompactList>
            {sections.sindaci.map((item, i) => (
              <CompactItem key={i}>
                <CompactName>{item.name}</CompactName>
                {item.role && <CompactRole>{item.role}</CompactRole>}
              </CompactItem>
            ))}
          </CompactList>
        </Section>
      )}

      {/* Control Functions */}
      {sections.controlFunctions && sections.controlFunctions.length > 0 && (
        <Section>
          <SectionHeading>{t('funzioniTitle')}</SectionHeading>
          <CompactList>
            {sections.controlFunctions.map((item, i) => (
              <CompactItem key={i}>
                <CompactName>{item.name}</CompactName>
                {item.role && <CompactRole>{item.role}</CompactRole>}
              </CompactItem>
            ))}
          </CompactList>
        </Section>
      )}
    </Page>
  )
}
