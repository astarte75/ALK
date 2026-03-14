import type { EntryFieldTypes, EntrySkeletonType, Entry } from 'contentful'

// --- Content model skeletons ---
// EntrySkeletonType<Fields, ContentTypeId>

export interface FundSkeleton extends EntrySkeletonType {
  contentTypeId: 'fund'
  fields: {
    name: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    description: EntryFieldTypes.RichText
    strategy: EntryFieldTypes.Text
    status: EntryFieldTypes.Text
    fundSize: EntryFieldTypes.Text
    investmentPeriod: EntryFieldTypes.Text
    platformRef: EntryFieldTypes.EntryLink<InvestmentPlatformSkeleton>
  }
}

export interface InvestmentPlatformSkeleton extends EntrySkeletonType {
  contentTypeId: 'investmentPlatform'
  fields: {
    name: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    description: EntryFieldTypes.RichText
    strategy: EntryFieldTypes.Text
    funds: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<FundSkeleton>>
  }
}

export interface PortfolioCompanySkeleton extends EntrySkeletonType {
  contentTypeId: 'portfolioCompany'
  fields: {
    name: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    description: EntryFieldTypes.RichText
    shortDescription: EntryFieldTypes.Text
    sector: EntryFieldTypes.Text
    investmentType: EntryFieldTypes.Text
    year: EntryFieldTypes.Integer
    logo: EntryFieldTypes.AssetLink
    website: EntryFieldTypes.Text
    featured: EntryFieldTypes.Boolean
    fundRef: EntryFieldTypes.EntryLink<FundSkeleton>
    sortOrder: EntryFieldTypes.Integer
  }
}

export interface TeamMemberSkeleton extends EntrySkeletonType {
  contentTypeId: 'teamMember'
  fields: {
    name: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    role: EntryFieldTypes.Text
    category: EntryFieldTypes.Text
    bio: EntryFieldTypes.RichText
    photo: EntryFieldTypes.AssetLink
    linkedIn: EntryFieldTypes.Text
    isBoard: EntryFieldTypes.Boolean
    sortOrder: EntryFieldTypes.Integer
  }
}

export interface NewsArticleSkeleton extends EntrySkeletonType {
  contentTypeId: 'newsArticle'
  fields: {
    title: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    date: EntryFieldTypes.Date
    category: EntryFieldTypes.Text
    excerpt: EntryFieldTypes.Text
    body: EntryFieldTypes.RichText
    featuredImage: EntryFieldTypes.AssetLink
    externalUrl: EntryFieldTypes.Text
  }
}

export interface PageSkeleton extends EntrySkeletonType {
  contentTypeId: 'page'
  fields: {
    title: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    body: EntryFieldTypes.RichText
    sections: EntryFieldTypes.Object
  }
}

export interface SiteConfigSkeleton extends EntrySkeletonType {
  contentTypeId: 'siteConfig'
  fields: {
    siteName: EntryFieldTypes.Text
    tagline: EntryFieldTypes.Text
    heroVideoUrl: EntryFieldTypes.Text
    logo: EntryFieldTypes.AssetLink
    socialLinkedIn: EntryFieldTypes.Text
    socialTwitter: EntryFieldTypes.Text
    contactEmail: EntryFieldTypes.Text
    offices: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<OfficeSkeleton>>
  }
}

export interface OfficeSkeleton extends EntrySkeletonType {
  contentTypeId: 'office'
  fields: {
    city: EntryFieldTypes.Text
    address: EntryFieldTypes.Text
    phone: EntryFieldTypes.Text
    isHeadquarters: EntryFieldTypes.Boolean
    sortOrder: EntryFieldTypes.Integer
  }
}

// --- Resolved entry types (what fetchers return) ---

export type PortfolioCompany = Entry<PortfolioCompanySkeleton, undefined, string>
export type TeamMember = Entry<TeamMemberSkeleton, undefined, string>
export type Fund = Entry<FundSkeleton, undefined, string>
export type NewsArticle = Entry<NewsArticleSkeleton, undefined, string>
export type InvestmentPlatform = Entry<InvestmentPlatformSkeleton, undefined, string>
export type Page = Entry<PageSkeleton, undefined, string>
export type SiteConfig = Entry<SiteConfigSkeleton, undefined, string>
export type Office = Entry<OfficeSkeleton, undefined, string>
