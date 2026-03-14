const LOCALE_MAP: Record<string, string> = {
  it: 'it-IT',
  en: 'en-US',
}

export function toContentfulLocale(routeLocale: string): string {
  return LOCALE_MAP[routeLocale] ?? 'it-IT'
}
