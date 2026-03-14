import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import Image from 'next/image'
import { getPageBySlug, getTeamMembers } from '@/lib/contentful/fetchers'
import { renderRichText } from '@/lib/contentful/richText'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import type { Document } from '@contentful/rich-text-types'

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

const BodyContent = styled.div`
  font-family: ${fonts.body};
  color: ${colors.textPrimary};
  line-height: 1.7;
  max-width: 800px;

  h2, h3, h4 {
    font-family: ${fonts.heading};
    color: ${colors.textPrimary};
    margin-top: ${spacing[8]};
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

const FallbackMessage = styled.p`
  font-family: ${fonts.body};
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  text-align: center;
  padding: ${spacing[16]} 0;
`

interface SectionMember {
  name: string
  role: string
}

export default async function CorporateGovernancePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [page, members, t] = await Promise.all([
    getPageBySlug('corporate-governance', locale),
    getTeamMembers(locale),
    getTranslations({ locale, namespace: 'governance' }),
  ])

  const boardMembers = members.filter((m) => m.fields.isBoard)

  // Extract sections data from page
  const sections = (page?.fields.sections ?? {}) as Record<string, unknown>
  const collegioSindacale = (sections.collegioSindacale ?? []) as SectionMember[]
  const funzioniControllo = (sections.funzioniControllo ?? []) as SectionMember[]

  if (!page && boardMembers.length === 0) {
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

      {/* Board of Directors - with photos */}
      {boardMembers.length > 0 && (
        <Section>
          <SectionHeading>{t('boardTitle')}</SectionHeading>
          <BoardGrid>
            {boardMembers.map((member) => {
              const photoAsset = member.fields.photo as unknown as {
                fields?: { file?: { url?: string }; title?: string }
              } | undefined
              const photoUrl = photoAsset?.fields?.file?.url
                ? `https:${photoAsset.fields.file.url}`
                : null

              return (
                <BoardCard key={member.sys.id}>
                  <PhotoContainer>
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={member.fields.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <PhotoFallback>
                        {member.fields.name.charAt(0)}
                      </PhotoFallback>
                    )}
                  </PhotoContainer>
                  <MemberName>{member.fields.name}</MemberName>
                  {member.fields.role && (
                    <MemberRole>{member.fields.role}</MemberRole>
                  )}
                </BoardCard>
              )
            })}
          </BoardGrid>
        </Section>
      )}

      {/* Collegio Sindacale - compact list */}
      {collegioSindacale.length > 0 && (
        <Section>
          <SectionHeading>{t('collegioTitle')}</SectionHeading>
          <CompactList>
            {collegioSindacale.map((item, i) => (
              <CompactItem key={i}>
                <CompactName>{item.name}</CompactName>
                {item.role && <CompactRole>{item.role}</CompactRole>}
              </CompactItem>
            ))}
          </CompactList>
        </Section>
      )}

      {/* Funzioni di Controllo - compact list */}
      {funzioniControllo.length > 0 && (
        <Section>
          <SectionHeading>{t('funzioniTitle')}</SectionHeading>
          <CompactList>
            {funzioniControllo.map((item, i) => (
              <CompactItem key={i}>
                <CompactName>{item.name}</CompactName>
                {item.role && <CompactRole>{item.role}</CompactRole>}
              </CompactItem>
            ))}
          </CompactList>
        </Section>
      )}

      {/* Shareholder Structure - rich text body */}
      {page?.fields.body && (
        <Section>
          <SectionHeading>{t('shareholderTitle')}</SectionHeading>
          <BodyContent>
            {renderRichText(page.fields.body as unknown as Document)}
          </BodyContent>
        </Section>
      )}
    </Page>
  )
}
