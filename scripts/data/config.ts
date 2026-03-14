/**
 * Site config and office data for Contentful migration.
 */

export interface OfficeData {
  city: { 'it-IT': string; 'en-US': string }
  address: { 'it-IT': string; 'en-US': string }
  phone: string
  isHeadquarters: boolean
  sortOrder: number
}

export interface SiteConfigData {
  siteName: { 'it-IT': string; 'en-US': string }
  tagline: { 'it-IT': string; 'en-US': string }
  heroVideoUrl: string
  socialLinkedIn: string
  socialTwitter: string
  contactEmail: string
}

export const offices: OfficeData[] = [
  {
    city: { 'it-IT': 'Milano', 'en-US': 'Milan' },
    address: {
      'it-IT': 'Piazzetta Pattari, 7 - 20122 Milano',
      'en-US': 'Piazzetta Pattari, 7 - 20122 Milan, Italy',
    },
    phone: '+39 02 359 41052',
    isHeadquarters: false,
    sortOrder: 2,
  },
  {
    city: { 'it-IT': 'Padova', 'en-US': 'Padua' },
    address: {
      'it-IT': 'Piazza Cavour, 4 - 35122 Padova',
      'en-US': 'Piazza Cavour, 4 - 35122 Padua, Italy',
    },
    phone: '+39 049 735 4172',
    isHeadquarters: true,
    sortOrder: 1,
  },
]

export const siteConfig: SiteConfigData = {
  siteName: {
    'it-IT': 'Alkemia Capital',
    'en-US': 'Alkemia Capital',
  },
  tagline: {
    'it-IT': 'Passione per l\'impresa. Creiamo valore sostenibile.',
    'en-US': 'Passion for business. Creating sustainable value.',
  },
  heroVideoUrl: '',
  socialLinkedIn: 'https://www.linkedin.com/company/alkemia-capital/',
  socialTwitter: '',
  contactEmail: 'segreteria@alkemiacapital.com',
}
