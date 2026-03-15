import { getSiteConfig, getOffices } from '@/lib/contentful/fetchers'
import { getLocale, getTranslations } from 'next-intl/server'
import {
  FooterWrapper,
  FooterMain,
  BrandColumn,
  FooterLogo,
  BrandName,
  CompanyInfo,
  CompanyInfoLine,
  FooterColumn,
  FooterHeading,
  FooterText,
  FooterLink,
  OfficeName,
  OfficeLabel,
  PartnersList,
  SocialLinks,
  SocialLink,
  CopyrightBar,
} from './Footer.styles'

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const COMPANY_LINES_IT = [
  'Cap. Soc. € 1.200.000,00 I.V.',
  'Cod. Fisc. e n. iscriz. reg. impr. di Padova 03344740240',
  'Iscritta al R.E.A. al n. PD-445564',
  'P. IVA 03344740240',
  'Iscritta al n. 99 dell\'Albo delle Società di Gestione del Risparmio ex art. 35, comma 1, D.Lgs. n. 58/1998, Sezione Gestori di FIA',
  'Soggetta all\'attività di direzione e coordinamento da parte di Kite Holding S.r.l.',
]

const COMPANY_LINES_EN = [
  'Share Capital € 1,200,000.00 fully paid',
  'Tax Code and Padova Business Register no. 03344740240',
  'R.E.A. no. PD-445564',
  'VAT no. 03344740240',
  'Registered at no. 99 of the Register of Asset Management Companies pursuant to art. 35, par. 1, Legislative Decree no. 58/1998, AIF Managers Section',
  'Subject to the direction and coordination of Kite Holding S.r.l.',
]

export default async function Footer() {
  const locale = await getLocale()
  const [config, offices, t] = await Promise.all([
    getSiteConfig(locale),
    getOffices(locale),
    getTranslations('footer'),
  ])

  const currentYear = new Date().getFullYear()
  const linkedInUrl = config?.fields.socialLinkedIn as string | undefined
  const isIT = locale === 'it'

  return (
    <FooterWrapper>
      <FooterMain>
        {/* Brand + Company Info */}
        <BrandColumn>
          <FooterLogo
            src="/images/alkemia-logo-white.png"
            alt="Alkemia Capital"
          />
          <BrandName>Alkemia SGR S.p.A.</BrandName>
          <CompanyInfo>
            {(isIT ? COMPANY_LINES_IT : COMPANY_LINES_EN).map((line, i) => (
              <CompanyInfoLine key={i}>{line}</CompanyInfoLine>
            ))}
          </CompanyInfo>
        </BrandColumn>

        {/* Offices */}
        <FooterColumn>
          <FooterHeading>{t('offices')}</FooterHeading>
          {offices.map((office) => (
            <div key={office.sys.id}>
              <OfficeName>
                {office.fields.city as string}
                {office.fields.isHeadquarters && (
                  <OfficeLabel>{t('headquarters')}</OfficeLabel>
                )}
              </OfficeName>
              <FooterText>{office.fields.address as string}</FooterText>
              {office.fields.phone && (
                <FooterText>{office.fields.phone as string}</FooterText>
              )}
            </div>
          ))}
        </FooterColumn>

        {/* Legal */}
        <FooterColumn>
          <FooterHeading>{t('legal')}</FooterHeading>
          <FooterLink href={`/${isIT ? '' : 'en/'}privacy`}>
            {t('privacy')}
          </FooterLink>
          <FooterLink href={`/${isIT ? '' : 'en/'}cookie-policy`}>
            {t('cookiePolicy')}
          </FooterLink>
          <FooterLink href="https://whistleblowing.alkemiacapital.com" target="_blank" rel="noopener noreferrer">
            Whistleblowing
          </FooterLink>
        </FooterColumn>

        {/* Partners */}
        <FooterColumn>
          <FooterHeading>Partners</FooterHeading>
          <PartnersList>
            <a href="https://www.aifi.it" target="_blank" rel="noopener noreferrer">
              <img src="/images/logo-aifi.svg" alt="AIFI" />
            </a>
            <a href="https://www.italiantechalliance.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/logo-italian-tech-alliance.png" alt="Italian Tech Alliance" />
            </a>
          </PartnersList>
        </FooterColumn>

        {/* Social */}
        <FooterColumn>
          <FooterHeading>{t('social')}</FooterHeading>
          <SocialLinks>
            {linkedInUrl && (
              <SocialLink
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </SocialLink>
            )}
          </SocialLinks>
        </FooterColumn>
      </FooterMain>

      <CopyrightBar>
        &copy; {currentYear} {t('copyright')}
      </CopyrightBar>
    </FooterWrapper>
  )
}
