import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalHeader from '@/components/portal/PortalHeader'
import LoginForm from '@/components/portal/LoginForm'

export default async function InvestitoriLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Redirect authenticated users to dashboard
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(`/${locale === 'en' ? 'en/' : ''}investitori/dashboard`)
  }

  return (
    <>
      <PortalHeader showLogout={false} />
      <LoginForm locale={locale} />
    </>
  )
}
