// Combined middleware: next-intl routing + Supabase auth session refresh

import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware({
  ...routing,
  localeDetection: false,
})

export async function middleware(request: NextRequest) {
  // Run next-intl routing first
  const response = handleI18nRouting(request)

  // Supabase session refresh + portal route protection
  // Graceful degradation: skip if Supabase env vars are not configured
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const { updateSession } = await import('@/lib/supabase/middleware')
      return await updateSession(request, response)
    } catch {
      // Supabase not available — fall through to i18n-only response
    }
  }

  return response
}

export const config = {
  matcher: ['/', '/(it|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
