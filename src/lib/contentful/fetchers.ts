import { unstable_cache } from 'next/cache'
import { getClient } from './client'
import { toContentfulLocale } from './locale'
import type {
  PortfolioCompanySkeleton,
  PortfolioCompany,
  TeamMemberSkeleton,
  TeamMember,
  FundSkeleton,
  Fund,
  NewsArticleSkeleton,
  NewsArticle,
  InvestmentPlatformSkeleton,
  InvestmentPlatform,
  PageSkeleton,
  Page,
  SiteConfigSkeleton,
  SiteConfig,
  OfficeSkeleton,
  Office,
} from './types'

// --- Portfolio Companies ---

export const getPortfolioCompanies = unstable_cache(
  async (locale: string): Promise<PortfolioCompany[]> => {
    const client = getClient()
    const res = await client.getEntries<PortfolioCompanySkeleton>({
      content_type: 'portfolioCompany',
      locale: toContentfulLocale(locale),
      order: ['fields.sortOrder'],
      include: 2,
      limit: 100,
    })
    return res.items
  },
  ['portfolioCompanies'],
  { tags: ['portfolioCompany'] }
)

export const getPortfolioCompanyBySlug = unstable_cache(
  async (slug: string, locale: string): Promise<PortfolioCompany | null> => {
    const client = getClient()
    const res = await client.getEntries<PortfolioCompanySkeleton>({
      content_type: 'portfolioCompany',
      'fields.slug': slug,
      locale: toContentfulLocale(locale),
      include: 2,
      limit: 1,
    })
    return res.items[0] ?? null
  },
  ['portfolioCompanyBySlug'],
  { tags: ['portfolioCompany'] }
)

// --- Team Members ---

export const getTeamMembers = unstable_cache(
  async (locale: string): Promise<TeamMember[]> => {
    const client = getClient()
    const res = await client.getEntries<TeamMemberSkeleton>({
      content_type: 'teamMember',
      locale: toContentfulLocale(locale),
      order: ['fields.sortOrder'],
      include: 2,
      limit: 100,
    })
    return res.items
  },
  ['teamMembers'],
  { tags: ['teamMember'] }
)

export const getTeamMemberBySlug = unstable_cache(
  async (slug: string, locale: string): Promise<TeamMember | null> => {
    const client = getClient()
    const res = await client.getEntries<TeamMemberSkeleton>({
      content_type: 'teamMember',
      'fields.slug': slug,
      locale: toContentfulLocale(locale),
      limit: 1,
    })
    return res.items[0] ?? null
  },
  ['teamMemberBySlug'],
  { tags: ['teamMember'] }
)

// --- Funds ---

export const getFunds = unstable_cache(
  async (locale: string): Promise<Fund[]> => {
    const client = getClient()
    const res = await client.getEntries<FundSkeleton>({
      content_type: 'fund',
      locale: toContentfulLocale(locale),
      include: 2,
      limit: 100,
    })
    return res.items
  },
  ['funds'],
  { tags: ['fund'] }
)

export const getFundBySlug = unstable_cache(
  async (slug: string, locale: string): Promise<Fund | null> => {
    const client = getClient()
    const res = await client.getEntries<FundSkeleton>({
      content_type: 'fund',
      'fields.slug': slug,
      locale: toContentfulLocale(locale),
      include: 2,
      limit: 1,
    })
    return res.items[0] ?? null
  },
  ['fundBySlug'],
  { tags: ['fund'] }
)

// --- News Articles ---

export const getNewsArticles = unstable_cache(
  async (locale: string, limit = 100): Promise<NewsArticle[]> => {
    const client = getClient()
    const res = await client.getEntries<NewsArticleSkeleton>({
      content_type: 'newsArticle',
      locale: toContentfulLocale(locale),
      order: ['-fields.date'],
      limit,
    })
    return res.items
  },
  ['newsArticles'],
  { tags: ['newsArticle'] }
)

export const getNewsArticleBySlug = unstable_cache(
  async (slug: string, locale: string): Promise<NewsArticle | null> => {
    const client = getClient()
    const res = await client.getEntries<NewsArticleSkeleton>({
      content_type: 'newsArticle',
      'fields.slug': slug,
      locale: toContentfulLocale(locale),
      limit: 1,
    })
    return res.items[0] ?? null
  },
  ['newsArticleBySlug'],
  { tags: ['newsArticle'] }
)

// --- Investment Platforms ---

export const getInvestmentPlatforms = unstable_cache(
  async (locale: string): Promise<InvestmentPlatform[]> => {
    const client = getClient()
    const res = await client.getEntries<InvestmentPlatformSkeleton>({
      content_type: 'investmentPlatform',
      locale: toContentfulLocale(locale),
      include: 2,
      limit: 100,
    })
    return res.items
  },
  ['investmentPlatforms'],
  { tags: ['investmentPlatform'] }
)

export const getInvestmentPlatformBySlug = unstable_cache(
  async (slug: string, locale: string): Promise<InvestmentPlatform | null> => {
    const client = getClient()
    const res = await client.getEntries<InvestmentPlatformSkeleton>({
      content_type: 'investmentPlatform',
      'fields.slug': slug,
      locale: toContentfulLocale(locale),
      include: 2,
      limit: 1,
    })
    return res.items[0] ?? null
  },
  ['investmentPlatformBySlug'],
  { tags: ['investmentPlatform'] }
)

// --- Pages ---

export const getPageBySlug = unstable_cache(
  async (slug: string, locale: string): Promise<Page | null> => {
    const client = getClient()
    const res = await client.getEntries<PageSkeleton>({
      content_type: 'page',
      'fields.slug': slug,
      locale: toContentfulLocale(locale),
      limit: 1,
    })
    return res.items[0] ?? null
  },
  ['pageBySlug'],
  { tags: ['page'] }
)

// --- Site Config ---

export const getSiteConfig = unstable_cache(
  async (locale: string): Promise<SiteConfig | null> => {
    const client = getClient()
    const res = await client.getEntries<SiteConfigSkeleton>({
      content_type: 'siteConfig',
      locale: toContentfulLocale(locale),
      include: 2,
      limit: 1,
    })
    return res.items[0] ?? null
  },
  ['siteConfig'],
  { tags: ['siteConfig'] }
)

// --- Offices ---

export const getOffices = unstable_cache(
  async (locale: string): Promise<Office[]> => {
    const client = getClient()
    const res = await client.getEntries<OfficeSkeleton>({
      content_type: 'office',
      locale: toContentfulLocale(locale),
      order: ['fields.sortOrder'],
      limit: 100,
    })
    return res.items
  },
  ['offices'],
  { tags: ['office'] }
)
