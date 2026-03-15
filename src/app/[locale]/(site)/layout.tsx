import { getSiteConfig } from '@/lib/contentful/fetchers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/cookie/CookieConsent'
import CustomCursor from '@/components/cursor/CustomCursor'

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const config = await getSiteConfig(locale)

  // Extract logo URL from Contentful asset, fallback to static white logo
  const logoUrl = config?.fields.logo
    ? `https:${(config.fields.logo as unknown as { fields: { file: { url: string } } }).fields.file.url}`
    : '/images/alkemia-logo-white.png'

  return (
    <>
      <CustomCursor />
      <Header logoUrl={logoUrl} logoAlt="Alkemia Capital" />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </>
  )
}
