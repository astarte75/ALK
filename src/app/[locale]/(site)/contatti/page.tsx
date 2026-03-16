import { setRequestLocale, getTranslations } from 'next-intl/server'
import styled from 'styled-components'
import { getOffices } from '@/lib/contentful/fetchers'
import { colors, fonts, spacing } from '@/styles/theme'
import { mq } from '@/styles/breakpoints'
import ContactForm from '@/components/forms/ContactForm'
import ScrollReveal from '@/components/animations/ScrollReveal'

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

const ContactLink = styled.a`
  display: block;
  font-family: ${fonts.body};
  font-size: 0.95rem;
  color: ${colors.accentTeal};
  text-decoration: none;
  margin-top: ${spacing[1]};

  &:hover {
    text-decoration: underline;
  }
`

const MapLink = styled.a`
  display: block;
  margin-top: ${spacing[4]};
  cursor: pointer;
  text-decoration: none;
`

const MapWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${colors.border};
  aspect-ratio: 16 / 9;
  position: relative;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    filter: grayscale(1) invert(1) contrast(1.1) hue-rotate(180deg);
    pointer-events: none;
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
      <ScrollReveal>
        <Title>{t('title')}</Title>
        <Subtitle>{t('subtitle')}</Subtitle>
      </ScrollReveal>

      <TwoCol>
        <ScrollReveal delay={0.1}>
        <OfficesColumn>
          {offices.map((office) => {
            const isMilano = office.fields.city?.toLowerCase().includes('milan')
            return (
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
                {office.fields.email && (
                  <ContactLink href={`mailto:${office.fields.email}`}>{office.fields.email}</ContactLink>
                )}
                {office.fields.pec && (
                  <ContactLink href={`mailto:${office.fields.pec}`}>PEC: {office.fields.pec}</ContactLink>
                )}
                {isMilano && (
                  <MapLink href="https://www.google.com/maps/search/Alkemia+SGR+SpA+Piazzetta+Pattari+7+Milano" target="_blank" rel="noopener noreferrer">
                    <MapWrapper>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2798.4!2d9.1889625!3d45.4647668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c7ec416b73d5%3A0x152ee4b280455332!2sAlkemia%20SGR%20S.p.A.!5e0!3m2!1sit!2sit!4v1710000000000!5m2!1sit!2sit"
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Alkemia Capital - Milano"
                      />
                    </MapWrapper>
                  </MapLink>
                )}
              </OfficeCard>
            )
          })}
        </OfficesColumn>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ContactForm />
        </ScrollReveal>
      </TwoCol>
    </Page>
  )
}
