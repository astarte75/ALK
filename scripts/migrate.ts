/**
 * Contentful migration script.
 * Creates content types, uploads images, and seeds all Alkemia data.
 *
 * Usage:
 *   npx tsx scripts/migrate.ts                  # Full migration
 *   npx tsx scripts/migrate.ts --dry-run        # Log planned operations
 *   npx tsx scripts/migrate.ts --skip-models    # Skip content type creation
 *   npx tsx scripts/migrate.ts --skip-images    # Skip image uploads
 *   npx tsx scripts/migrate.ts --skip-entries   # Skip entry creation
 *
 * Required env vars: CONTENTFUL_MANAGEMENT_TOKEN, CONTENTFUL_SPACE_ID
 */

import { createClient, type Environment, type Entry } from 'contentful-management'
import { createContentTypes } from './lib/contentful-models.js'
import { uploadAllImages } from './lib/image-upload.js'
import { markdownToRichText, textToRichText } from './lib/rich-text.js'
import { portfolioCompanies, type PortfolioCompanyData } from './data/portfolio.js'
import { teamMembers, type TeamMemberData } from './data/team.js'
import { funds, investmentPlatforms, type FundData, type InvestmentPlatformData } from './data/funds.js'
import { newsArticles, type NewsArticleData } from './data/news.js'
import { pages, type PageData } from './data/pages.js'
import { siteConfig, offices, type OfficeData } from './data/config.js'

// Localized field helpers
type L10n<T> = { 'it-IT': T; 'en-US'?: T }
type LocalizedStr = { 'it-IT': string; 'en-US': string }

function localized<T>(itValue: T, enValue?: T): L10n<T> {
  const result: L10n<T> = { 'it-IT': itValue }
  if (enValue !== undefined) result['en-US'] = enValue
  return result
}

function nonLocalized<T>(value: T): { 'it-IT': T } {
  return { 'it-IT': value }
}

function assetLink(assetId: string) {
  return { sys: { type: 'Link' as const, linkType: 'Asset' as const, id: assetId } }
}

function entryLink(entryId: string) {
  return { sys: { type: 'Link' as const, linkType: 'Entry' as const, id: entryId } }
}

const DELAY_MS = 200

/**
 * Check if an entry with given slug already exists.
 */
async function entryExistsBySlug(
  env: Environment,
  contentType: string,
  slug: string
): Promise<boolean> {
  const existing = await env.getEntries({
    content_type: contentType,
    'fields.slug': slug,
    limit: 1,
  })
  return existing.items.length > 0
}

/**
 * Collect all image URLs from data files for batch upload.
 */
function collectImageUrls(): Array<{ url: string; title: string }> {
  const images: Array<{ url: string; title: string }> = []

  for (const company of portfolioCompanies) {
    if (company.logoUrl) {
      images.push({ url: company.logoUrl, title: `${company.name['it-IT']} Logo` })
    }
  }

  for (const member of teamMembers) {
    if (member.photoUrl && !member.photoUrl.includes('Blank_Profile_M')) {
      images.push({ url: member.photoUrl, title: `${member.name['it-IT']} Photo` })
    }
  }

  for (const article of newsArticles) {
    if (article.imageUrl) {
      images.push({ url: article.imageUrl, title: article.title['it-IT'] })
    }
  }

  return images
}

// --- Entry creation functions ---

async function createOfficeEntries(
  env: Environment,
  dryRun: boolean
): Promise<Map<string, string>> {
  console.log('\n--- Creating Offices ---')
  const officeMap = new Map<string, string>()

  for (const office of offices) {
    const slug = office.city['it-IT'].toLowerCase()

    if (dryRun) {
      console.log(`  [DRY RUN] Would create office: ${office.city['it-IT']}`)
      officeMap.set(slug, `dry-run-office-${slug}`)
      continue
    }

    // Office has no slug field — check by city name instead
    const existingOffices = await env.getEntries({
      content_type: 'office',
      'fields.city': office.city['it-IT'],
      limit: 1,
    })
    if (existingOffices.items.length > 0) {
      console.log(`  Office "${office.city['it-IT']}" already exists, skipping.`)
      officeMap.set(slug, existingOffices.items[0].sys.id)
      continue
    }

    const entry = await env.createEntry('office', {
      fields: {
        city: localized(office.city['it-IT'], office.city['en-US']),
        address: localized(office.address['it-IT'], office.address['en-US']),
        phone: nonLocalized(office.phone),
        isHeadquarters: nonLocalized(office.isHeadquarters),
        sortOrder: nonLocalized(office.sortOrder),
      },
    })
    await entry.publish()
    officeMap.set(slug, entry.sys.id)
    console.log(`  Created office: ${office.city['it-IT']}`)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }

  return officeMap
}

async function createPlatformEntries(
  env: Environment,
  dryRun: boolean
): Promise<Map<string, string>> {
  console.log('\n--- Creating Investment Platforms ---')
  const platformMap = new Map<string, string>()

  for (const platform of investmentPlatforms) {
    if (dryRun) {
      console.log(`  [DRY RUN] Would create platform: ${platform.name['it-IT']}`)
      platformMap.set(platform.slug, `dry-run-platform-${platform.slug}`)
      continue
    }

    if (await entryExistsBySlug(env, 'investmentPlatform', platform.slug)) {
      console.log(`  Platform "${platform.name['it-IT']}" already exists, skipping.`)
      const existing = await env.getEntries({ content_type: 'investmentPlatform', 'fields.slug': platform.slug, limit: 1 })
      if (existing.items[0]) platformMap.set(platform.slug, existing.items[0].sys.id)
      continue
    }

    const entry = await env.createEntry('investmentPlatform', {
      fields: {
        name: localized(platform.name['it-IT'], platform.name['en-US']),
        slug: nonLocalized(platform.slug),
        description: localized(
          markdownToRichText(platform.description['it-IT']),
          markdownToRichText(platform.description['en-US'])
        ),
        strategy: nonLocalized(platform.strategy),
      },
    })
    await entry.publish()
    platformMap.set(platform.slug, entry.sys.id)
    console.log(`  Created platform: ${platform.name['it-IT']}`)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }

  return platformMap
}

async function createFundEntries(
  env: Environment,
  platformMap: Map<string, string>,
  dryRun: boolean
): Promise<Map<string, string>> {
  console.log('\n--- Creating Funds ---')
  const fundMap = new Map<string, string>()

  for (const fund of funds) {
    if (dryRun) {
      console.log(`  [DRY RUN] Would create fund: ${fund.name['it-IT']}`)
      fundMap.set(fund.slug, `dry-run-fund-${fund.slug}`)
      continue
    }

    if (await entryExistsBySlug(env, 'fund', fund.slug)) {
      console.log(`  Fund "${fund.name['it-IT']}" already exists, skipping.`)
      const existing = await env.getEntries({ content_type: 'fund', 'fields.slug': fund.slug, limit: 1 })
      if (existing.items[0]) fundMap.set(fund.slug, existing.items[0].sys.id)
      continue
    }

    const platformId = platformMap.get(fund.platformSlug)
    const fields: Record<string, unknown> = {
      name: localized(fund.name['it-IT'], fund.name['en-US']),
      slug: nonLocalized(fund.slug),
      description: localized(
        markdownToRichText(fund.description['it-IT']),
        markdownToRichText(fund.description['en-US'])
      ),
      strategy: nonLocalized(fund.strategy),
      status: nonLocalized(fund.status),
      fundSize: nonLocalized(fund.fundSize),
      investmentPeriod: nonLocalized(fund.investmentPeriod),
    }

    if (platformId) {
      fields.platformRef = nonLocalized(entryLink(platformId))
    }

    const entry = await env.createEntry('fund', { fields })
    await entry.publish()
    fundMap.set(fund.slug, entry.sys.id)
    console.log(`  Created fund: ${fund.name['it-IT']}`)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }

  return fundMap
}

async function createPortfolioEntries(
  env: Environment,
  assetMap: Map<string, string>,
  dryRun: boolean
): Promise<void> {
  console.log('\n--- Creating Portfolio Companies ---')

  for (let i = 0; i < portfolioCompanies.length; i++) {
    const company = portfolioCompanies[i]

    if (dryRun) {
      console.log(`  [DRY RUN] Would create company ${i + 1}/${portfolioCompanies.length}: ${company.name['it-IT']}`)
      continue
    }

    if (await entryExistsBySlug(env, 'portfolioCompany', company.slug)) {
      console.log(`  Company "${company.name['it-IT']}" already exists, skipping.`)
      continue
    }

    const fields: Record<string, unknown> = {
      name: localized(company.name['it-IT'], company.name['en-US']),
      slug: nonLocalized(company.slug),
      shortDescription: localized(company.shortDescription['it-IT'], company.shortDescription['en-US']),
      sector: nonLocalized(company.sector),
      investmentType: nonLocalized(company.investmentType),
      year: nonLocalized(company.year),
      website: nonLocalized(company.website),
      featured: nonLocalized(company.featured),
      sortOrder: nonLocalized(company.sortOrder),
    }

    // Description (rich text)
    if (company.description) {
      fields.description = localized(
        markdownToRichText(company.description['it-IT']),
        markdownToRichText(company.description['en-US'])
      )
    }

    // Logo asset link
    if (company.logoUrl) {
      const assetId = assetMap.get(company.logoUrl)
      if (assetId) {
        fields.logo = nonLocalized(assetLink(assetId))
      }
    }

    const entry = await env.createEntry('portfolioCompany', { fields })
    await entry.publish()
    console.log(`  Created company ${i + 1}/${portfolioCompanies.length}: ${company.name['it-IT']}`)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }
}

async function createTeamEntries(
  env: Environment,
  assetMap: Map<string, string>,
  dryRun: boolean
): Promise<void> {
  console.log('\n--- Creating Team Members ---')

  for (let i = 0; i < teamMembers.length; i++) {
    const member = teamMembers[i]

    if (dryRun) {
      console.log(`  [DRY RUN] Would create team member ${i + 1}/${teamMembers.length}: ${member.name['it-IT']}`)
      continue
    }

    if (await entryExistsBySlug(env, 'teamMember', member.slug)) {
      console.log(`  Team member "${member.name['it-IT']}" already exists, skipping.`)
      continue
    }

    const fields: Record<string, unknown> = {
      name: localized(member.name['it-IT'], member.name['en-US']),
      slug: nonLocalized(member.slug),
      role: localized(member.role['it-IT'], member.role['en-US']),
      category: nonLocalized(member.category),
      linkedIn: nonLocalized(member.linkedIn),
      isBoard: nonLocalized(member.isBoard),
      sortOrder: nonLocalized(member.sortOrder),
    }

    // Bio (rich text)
    if (member.bio) {
      fields.bio = localized(
        markdownToRichText(member.bio['it-IT']),
        markdownToRichText(member.bio['en-US'])
      )
    }

    // Photo asset link
    if (member.photoUrl && !member.photoUrl.includes('Blank_Profile_M')) {
      const assetId = assetMap.get(member.photoUrl)
      if (assetId) {
        fields.photo = nonLocalized(assetLink(assetId))
      }
    }

    const entry = await env.createEntry('teamMember', { fields })
    await entry.publish()
    console.log(`  Created team member ${i + 1}/${teamMembers.length}: ${member.name['it-IT']}`)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }
}

async function createNewsEntries(
  env: Environment,
  assetMap: Map<string, string>,
  dryRun: boolean
): Promise<void> {
  console.log('\n--- Creating News Articles ---')

  for (let i = 0; i < newsArticles.length; i++) {
    const article = newsArticles[i]

    if (dryRun) {
      console.log(`  [DRY RUN] Would create article ${i + 1}/${newsArticles.length}: ${article.title['it-IT']}`)
      continue
    }

    if (await entryExistsBySlug(env, 'newsArticle', article.slug)) {
      console.log(`  Article "${article.title['it-IT']}" already exists, skipping.`)
      continue
    }

    const fields: Record<string, unknown> = {
      title: localized(article.title['it-IT'], article.title['en-US']),
      slug: nonLocalized(article.slug),
      date: nonLocalized(article.date),
      category: nonLocalized(article.category),
      excerpt: localized(article.excerpt['it-IT'], article.excerpt['en-US']),
      externalUrl: nonLocalized(article.externalUrl),
    }

    // Body (rich text)
    if (article.body) {
      fields.body = localized(
        markdownToRichText(article.body['it-IT']),
        markdownToRichText(article.body['en-US'])
      )
    }

    // Featured image
    if (article.imageUrl) {
      const assetId = assetMap.get(article.imageUrl)
      if (assetId) {
        fields.featuredImage = nonLocalized(assetLink(assetId))
      }
    }

    const entry = await env.createEntry('newsArticle', { fields })
    await entry.publish()
    console.log(`  Created article ${i + 1}/${newsArticles.length}: ${article.title['it-IT']}`)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }
}

async function createPageEntries(
  env: Environment,
  dryRun: boolean
): Promise<void> {
  console.log('\n--- Creating Pages ---')

  for (const page of pages) {
    if (dryRun) {
      console.log(`  [DRY RUN] Would create page: ${page.title['it-IT']}`)
      continue
    }

    if (await entryExistsBySlug(env, 'page', page.slug)) {
      console.log(`  Page "${page.title['it-IT']}" already exists, skipping.`)
      continue
    }

    const fields: Record<string, unknown> = {
      title: localized(page.title['it-IT'], page.title['en-US']),
      slug: nonLocalized(page.slug),
      body: localized(
        markdownToRichText(page.body['it-IT']),
        markdownToRichText(page.body['en-US'])
      ),
    }

    if (page.sections) {
      fields.sections = nonLocalized(page.sections)
    }

    const entry = await env.createEntry('page', { fields })
    await entry.publish()
    console.log(`  Created page: ${page.title['it-IT']}`)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }
}

async function createSiteConfigEntry(
  env: Environment,
  officeMap: Map<string, string>,
  assetMap: Map<string, string>,
  dryRun: boolean
): Promise<void> {
  console.log('\n--- Creating Site Config ---')

  if (dryRun) {
    console.log('  [DRY RUN] Would create site config')
    return
  }

  // Check if already exists
  const existing = await env.getEntries({
    content_type: 'siteConfig',
    limit: 1,
  })
  if (existing.items.length > 0) {
    console.log('  Site config already exists, skipping.')
    return
  }

  const officeLinks = Array.from(officeMap.values()).map((id) => entryLink(id))

  const fields: Record<string, unknown> = {
    siteName: localized(siteConfig.siteName['it-IT'], siteConfig.siteName['en-US']),
    tagline: localized(siteConfig.tagline['it-IT'], siteConfig.tagline['en-US']),
    heroVideoUrl: nonLocalized(siteConfig.heroVideoUrl),
    socialLinkedIn: nonLocalized(siteConfig.socialLinkedIn),
    socialTwitter: nonLocalized(siteConfig.socialTwitter),
    contactEmail: nonLocalized(siteConfig.contactEmail),
    offices: nonLocalized(officeLinks),
  }

  const entry = await env.createEntry('siteConfig', { fields })
  await entry.publish()
  console.log('  Created site config.')
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const skipModels = args.includes('--skip-models')
  const skipImages = args.includes('--skip-images')
  const skipEntries = args.includes('--skip-entries')

  console.log('=== Alkemia Contentful Migration ===')
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Skip models: ${skipModels}, Skip images: ${skipImages}, Skip entries: ${skipEntries}`)

  if (!dryRun) {
    const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN
    const spaceId = process.env.CONTENTFUL_SPACE_ID

    if (!token || !spaceId) {
      console.error('ERROR: CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID must be set.')
      process.exit(1)
    }

    const client = createClient({ accessToken: token })
    const space = await client.getSpace(spaceId)
    const env = await space.getEnvironment('master')

    // Step 1: Content types
    if (!skipModels) {
      await createContentTypes(env, false)
    }

    // Step 2: Images
    let assetMap = new Map<string, string>()
    if (!skipImages) {
      assetMap = await uploadAllImages(env, collectImageUrls(), false)
    }

    // Step 3: Entries
    if (!skipEntries) {
      const officeMap = await createOfficeEntries(env, false)
      const platformMap = await createPlatformEntries(env, false)
      const fundMap = await createFundEntries(env, platformMap, false)
      await createPortfolioEntries(env, assetMap, false)
      await createTeamEntries(env, assetMap, false)
      await createNewsEntries(env, assetMap, false)
      await createPageEntries(env, false)
      await createSiteConfigEntry(env, officeMap, assetMap, false)
    }
  } else {
    // Dry run: log all planned operations

    // Step 1: Content types
    if (!skipModels) {
      console.log('\n=== Content Types (Dry Run) ===')
      const typeNames = [
        'office', 'investmentPlatform', 'fund', 'portfolioCompany',
        'teamMember', 'newsArticle', 'page', 'siteConfig'
      ]
      for (const name of typeNames) {
        console.log(`  [DRY RUN] Would create content type: ${name}`)
      }
    }

    // Step 2: Images
    let assetMap = new Map<string, string>()
    if (!skipImages) {
      const imageUrls = collectImageUrls()
      console.log(`\n=== Images (Dry Run): ${imageUrls.length} images ===`)
      for (const { url, title } of imageUrls) {
        console.log(`  [DRY RUN] Would upload: ${title}`)
        assetMap.set(url, `dry-run-${title.replace(/\s+/g, '-').toLowerCase()}`)
      }
    }

    // Step 3: Entries
    if (!skipEntries) {
      console.log(`\n=== Offices: ${offices.length} entries ===`)
      for (const o of offices) console.log(`  [DRY RUN] Would create office: ${o.city['it-IT']}`)

      console.log(`\n=== Investment Platforms: ${investmentPlatforms.length} entries ===`)
      for (const p of investmentPlatforms) console.log(`  [DRY RUN] Would create platform: ${p.name['it-IT']}`)

      console.log(`\n=== Funds: ${funds.length} entries ===`)
      for (const f of funds) console.log(`  [DRY RUN] Would create fund: ${f.name['it-IT']}`)

      console.log(`\n=== Portfolio Companies: ${portfolioCompanies.length} entries ===`)
      for (const c of portfolioCompanies) console.log(`  [DRY RUN] Would create company: ${c.name['it-IT']}`)

      console.log(`\n=== Team Members: ${teamMembers.length} entries ===`)
      for (const m of teamMembers) console.log(`  [DRY RUN] Would create member: ${m.name['it-IT']}`)

      console.log(`\n=== News Articles: ${newsArticles.length} entries ===`)
      for (const a of newsArticles) console.log(`  [DRY RUN] Would create article: ${a.title['it-IT']}`)

      console.log(`\n=== Pages: ${pages.length} entries ===`)
      for (const p of pages) console.log(`  [DRY RUN] Would create page: ${p.title['it-IT']}`)

      console.log('\n=== Site Config: 1 entry ===')
      console.log('  [DRY RUN] Would create site config')
    }
  }

  console.log('\n=== Migration Complete ===')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
