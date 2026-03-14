import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getSiteConfig } from '@/lib/contentful/fetchers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/cookie/CookieConsent'
import CustomCursor from '@/components/cursor/CustomCursor'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'it' | 'en')) notFound()

  const [messages, config] = await Promise.all([
    getMessages(),
    getSiteConfig(locale),
  ])

  // Extract logo URL from Contentful asset, fallback to static file
  const logoUrl = config?.fields.logo
    ? `https:${(config.fields.logo as unknown as { fields: { file: { url: string } } }).fields.file.url}`
    : '/logo.svg'

  return (
    <NextIntlClientProvider messages={messages}>
      <CustomCursor />
      <Header logoUrl={logoUrl} logoAlt="Alkemia Capital" />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </NextIntlClientProvider>
  )
}
