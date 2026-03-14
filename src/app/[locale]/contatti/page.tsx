import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { getOffices } from '@/lib/contentful/fetchers'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import ContactForm from '@/components/forms/ContactForm'

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
  margin: 0 0 ${spacing[2]};
`

const Subtitle = styled.p`
  font-family: ${fonts.body};
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 ${spacing[12]};
  max-width: 640px;
`

const TwoCol = styled.div`
  display: grid;
  gap: ${spacing[12]};

  ${mq.lg} {
    grid-template-columns: 1fr 1.5fr;
  }
`

const OfficesColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`

const OfficeCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: ${spacing[6]};
`

const OfficeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[3]};
`

const CityName = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
`

const HqBadge = styled.span`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.accentTeal};
  background: rgba(0, 200, 180, 0.1);
  border: 1px solid rgba(0, 200, 180, 0.25);
  border-radius: 4px;
  padding: 2px 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const Address = styled.p`
  font-family: ${fonts.body};
  font-size: 0.95rem;
  color: ${colors.textSecondary};
  line-height: 1.5;
  margin: 0 0 ${spacing[2]};
  white-space: pre-line;
`

const PhoneLink = styled.a`
  font-family: ${fonts.body};
  font-size: 0.95rem;
  color: ${colors.accentTeal};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export default async function ContattiPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [offices, t] = await Promise.all([
    getOffices(locale),
    getTranslations({ locale, namespace: 'contact' }),
  ])

  return (
    <Page>
      <Title>{t('title')}</Title>
      <Subtitle>{t('subtitle')}</Subtitle>

      <TwoCol>
        <OfficesColumn>
          {offices.map((office) => (
            <OfficeCard key={office.sys.id}>
              <OfficeHeader>
                <CityName>{office.fields.city}</CityName>
                {office.fields.isHeadquarters && (
                  <HqBadge>{t('headquarters')}</HqBadge>
                )}
              </OfficeHeader>
              <Address>{office.fields.address}</Address>
              {office.fields.phone && (
                <PhoneLink href={`tel:${office.fields.phone.replace(/\s/g, '')}`}>
                  {office.fields.phone}
                </PhoneLink>
              )}
            </OfficeCard>
          ))}
        </OfficesColumn>

        <ContactForm />
      </TwoCol>
    </Page>
  )
}
