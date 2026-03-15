// Supabase session refresh + portal route protection for middleware

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'

// Portal routes that require authentication
const PROTECTED_SEGMENTS = ['/dashboard', '/fondi/', '/documenti']

function isProtectedRoute(pathname: string): boolean {
  // Strip locale prefix for matching
  const path = pathname.replace(/^\/(it|en)/, '')
  return PROTECTED_SEGMENTS.some((segment) => path.includes(segment))
}

function getLoginUrl(request: NextRequest): string {
  const pathname = request.nextUrl.pathname
  const isEnglish = pathname.startsWith('/en')
  const loginPath = isEnglish ? '/en/investitori' : '/investitori'
  return new URL(loginPath, request.url).toString()
}

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Set on request (for downstream server code)
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session token — MUST use getUser() not getSession()
  // getUser() contacts the Supabase Auth server to validate the token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect unauthenticated users away from protected portal routes
  if (!user && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(getLoginUrl(request))
  }

  return response
}
