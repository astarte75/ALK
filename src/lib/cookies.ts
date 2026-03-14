export type ConsentValue = 'accepted' | 'rejected'

export function getConsent(): ConsentValue | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)cookie_consent=(\w+)/)
  return (match?.[1] as ConsentValue) ?? null
}

export function setConsent(value: ConsentValue): void {
  const maxAge = 365 * 24 * 60 * 60 // 1 year
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  document.cookie = `cookie_consent=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`
}

// Future extension point for category-based consent
export interface ConsentCategories {
  technical: boolean   // always true
  analytics: boolean   // future
  marketing: boolean   // future
}
