/**
 * Contentful content type definitions for all 8 models.
 * Field IDs match exactly the skeleton types in src/lib/contentful/types.ts.
 */

import type { Environment } from 'contentful-management'

const DELAY_BETWEEN_TYPES_MS = 300

/**
 * Helper: create content type idempotently (skip if exists).
 */
async function ensureContentType(
  env: Environment,
  id: string,
  definition: {
    name: string
    displayField: string
    fields: Array<Record<string, unknown>>
  },
  dryRun: boolean
): Promise<void> {
  try {
    await env.getContentType(id)
    console.log(`  Content type "${id}" already exists, skipping.`)
    return
  } catch {
    // Does not exist, create it
  }

  if (dryRun) {
    console.log(`  [DRY RUN] Would create content type "${id}" with ${definition.fields.length} fields`)
    return
  }

  console.log(`  Creating content type "${id}"...`)
  const ct = await env.createContentTypeWithId(id, {
    name: definition.name,
    displayField: definition.displayField,
    fields: definition.fields as any,
  })
  await ct.publish()
  console.log(`  Published content type "${id}".`)
}

/**
 * Create all 8 content types idempotently.
 * Field IDs MUST match src/lib/contentful/types.ts skeleton definitions.
 */
export async function createContentTypes(env: Environment, dryRun = false): Promise<void> {
  console.log('\n=== Creating Content Types ===\n')

  // 1. office
  await ensureContentType(env, 'office', {
    name: 'Office',
    displayField: 'city',
    fields: [
      { id: 'city', name: 'City', type: 'Symbol', required: true, localized: true },
      { id: 'address', name: 'Address', type: 'Symbol', localized: true },
      { id: 'phone', name: 'Phone', type: 'Symbol', localized: false },
      { id: 'isHeadquarters', name: 'Is Headquarters', type: 'Boolean', localized: false },
      { id: 'sortOrder', name: 'Sort Order', type: 'Integer', localized: false },
    ],
  }, dryRun)
  await delay(DELAY_BETWEEN_TYPES_MS)

  // 2. investmentPlatform
  await ensureContentType(env, 'investmentPlatform', {
    name: 'Investment Platform',
    displayField: 'name',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', required: true, localized: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false, validations: [{ unique: true }] },
      { id: 'description', name: 'Description', type: 'RichText', localized: true },
      { id: 'strategy', name: 'Strategy', type: 'Symbol', localized: false },
      {
        id: 'funds',
        name: 'Funds',
        type: 'Array',
        localized: false,
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [{ linkContentType: ['fund'] }],
        },
      },
    ],
  }, dryRun)
  await delay(DELAY_BETWEEN_TYPES_MS)

  // 3. fund
  await ensureContentType(env, 'fund', {
    name: 'Fund',
    displayField: 'name',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', required: true, localized: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false, validations: [{ unique: true }] },
      { id: 'description', name: 'Description', type: 'RichText', localized: true },
      {
        id: 'strategy',
        name: 'Strategy',
        type: 'Symbol',
        localized: false,
        validations: [{ in: ['Private Equity', 'Venture Capital', 'PIPE', 'Hybrid Capital'] }],
      },
      {
        id: 'status',
        name: 'Status',
        type: 'Symbol',
        localized: false,
        validations: [{ in: ['Active', 'Closed', 'Fundraising'] }],
      },
      { id: 'fundSize', name: 'Fund Size', type: 'Symbol', localized: false },
      { id: 'investmentPeriod', name: 'Investment Period', type: 'Symbol', localized: false },
      {
        id: 'platformRef',
        name: 'Platform',
        type: 'Link',
        linkType: 'Entry',
        localized: false,
        validations: [{ linkContentType: ['investmentPlatform'] }],
      },
      { id: 'targetSectors', name: 'Target Sectors', type: 'Symbol', localized: true },
      {
        id: 'documents',
        name: 'Documents',
        type: 'Array',
        localized: false,
        items: {
          type: 'Link',
          linkType: 'Asset',
        },
      },
      {
        id: 'teamMembers',
        name: 'Team Members',
        type: 'Array',
        localized: false,
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [{ linkContentType: ['teamMember'] }],
        },
      },
    ],
  }, dryRun)
  await delay(DELAY_BETWEEN_TYPES_MS)

  // 4. portfolioCompany
  await ensureContentType(env, 'portfolioCompany', {
    name: 'Portfolio Company',
    displayField: 'name',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', required: true, localized: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false, validations: [{ unique: true }] },
      { id: 'description', name: 'Description', type: 'RichText', localized: true },
      { id: 'shortDescription', name: 'Short Description', type: 'Symbol', localized: true },
      {
        id: 'sector',
        name: 'Sector',
        type: 'Symbol',
        localized: false,
        validations: [{ in: ['ICT', 'Automotive & Mobility', 'Agri-tech', 'Food & Beverage', 'Fintech', 'Cybersecurity', 'HR Tech', 'Digital Services', 'Other'] }],
      },
      {
        id: 'investmentType',
        name: 'Investment Type',
        type: 'Symbol',
        localized: false,
        validations: [{ in: ['Private Equity', 'Venture Capital', 'PIPE'] }],
      },
      { id: 'year', name: 'Year', type: 'Integer', localized: false },
      { id: 'logo', name: 'Logo', type: 'Link', linkType: 'Asset', localized: false },
      { id: 'website', name: 'Website', type: 'Symbol', localized: false },
      { id: 'featured', name: 'Featured', type: 'Boolean', localized: false },
      {
        id: 'fundRef',
        name: 'Fund Reference',
        type: 'Link',
        linkType: 'Entry',
        localized: false,
        validations: [{ linkContentType: ['fund'] }],
      },
      { id: 'sortOrder', name: 'Sort Order', type: 'Integer', localized: false },
    ],
  }, dryRun)
  await delay(DELAY_BETWEEN_TYPES_MS)

  // 5. teamMember
  await ensureContentType(env, 'teamMember', {
    name: 'Team Member',
    displayField: 'name',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', required: true, localized: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false, validations: [{ unique: true }] },
      { id: 'role', name: 'Role', type: 'Symbol', localized: true },
      {
        id: 'category',
        name: 'Category',
        type: 'Symbol',
        localized: false,
        validations: [{ in: ['Partners', 'Investment Team', 'Operations', 'Board'] }],
      },
      { id: 'bio', name: 'Bio', type: 'RichText', localized: true },
      { id: 'photo', name: 'Photo', type: 'Link', linkType: 'Asset', localized: false },
      { id: 'linkedIn', name: 'LinkedIn', type: 'Symbol', localized: false },
      { id: 'isBoard', name: 'Is Board Member', type: 'Boolean', localized: false },
      {
        id: 'office',
        name: 'Office',
        type: 'Symbol',
        localized: false,
        validations: [{ in: ['Milano', 'Padova'] }],
      },
      { id: 'sortOrder', name: 'Sort Order', type: 'Integer', localized: false },
    ],
  }, dryRun)
  await delay(DELAY_BETWEEN_TYPES_MS)

  // 6. newsArticle
  await ensureContentType(env, 'newsArticle', {
    name: 'News Article',
    displayField: 'title',
    fields: [
      { id: 'title', name: 'Title', type: 'Symbol', required: true, localized: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false, validations: [{ unique: true }] },
      { id: 'date', name: 'Date', type: 'Date', localized: false },
      {
        id: 'category',
        name: 'Category',
        type: 'Symbol',
        localized: false,
        validations: [{ in: ['News', 'Insights', 'Events'] }],
      },
      { id: 'excerpt', name: 'Excerpt', type: 'Text', localized: true },
      { id: 'body', name: 'Body', type: 'RichText', localized: true },
      { id: 'featuredImage', name: 'Featured Image', type: 'Link', linkType: 'Asset', localized: false },
      { id: 'externalUrl', name: 'External URL', type: 'Symbol', localized: false },
    ],
  }, dryRun)
  await delay(DELAY_BETWEEN_TYPES_MS)

  // 7. page
  await ensureContentType(env, 'page', {
    name: 'Page',
    displayField: 'title',
    fields: [
      { id: 'title', name: 'Title', type: 'Symbol', required: true, localized: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false, validations: [{ unique: true }] },
      { id: 'body', name: 'Body', type: 'RichText', localized: true },
      { id: 'sections', name: 'Sections', type: 'Object', localized: false },
    ],
  }, dryRun)
  await delay(DELAY_BETWEEN_TYPES_MS)

  // 8. siteConfig
  await ensureContentType(env, 'siteConfig', {
    name: 'Site Config',
    displayField: 'siteName',
    fields: [
      { id: 'siteName', name: 'Site Name', type: 'Symbol', localized: true },
      { id: 'tagline', name: 'Tagline', type: 'Symbol', localized: true },
      { id: 'heroVideoUrl', name: 'Hero Video URL', type: 'Symbol', localized: false },
      { id: 'logo', name: 'Logo', type: 'Link', linkType: 'Asset', localized: false },
      { id: 'socialLinkedIn', name: 'Social LinkedIn', type: 'Symbol', localized: false },
      { id: 'socialTwitter', name: 'Social Twitter', type: 'Symbol', localized: false },
      { id: 'contactEmail', name: 'Contact Email', type: 'Symbol', localized: false },
      {
        id: 'offices',
        name: 'Offices',
        type: 'Array',
        localized: false,
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [{ linkContentType: ['office'] }],
        },
      },
    ],
  }, dryRun)

  console.log('\n=== Content Types Complete ===\n')
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
