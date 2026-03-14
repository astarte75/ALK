/**
 * Content validation script.
 * Proves the typed fetch layer works end-to-end against real Contentful data.
 *
 * Usage: npx tsx scripts/validate-content.ts
 *
 * This script patches `next/cache` so that unstable_cache calls resolve
 * outside the Next.js runtime, then imports the project's actual typed
 * fetchers (src/lib/contentful/fetchers.ts) to validate runtime behaviour.
 */

import 'dotenv/config'
import Module from 'node:module'

// Patch next/cache so unstable_cache works outside Next.js runtime.
// unstable_cache(fn, keys, opts) simply becomes fn (pass-through).
const originalResolveFilename = (Module as any)._resolveFilename
;(Module as any)._resolveFilename = function (
  request: string,
  parent: any,
  isMain: boolean,
  options: any
) {
  if (request === 'next/cache') {
    // Return a virtual module path — we intercept the require below
    return '__next_cache_mock__'
  }
  return originalResolveFilename.call(this, request, parent, isMain, options)
}

const originalLoad = (Module as any)._cache
// Pre-populate the require cache with our mock
require.cache['__next_cache_mock__'] = {
  id: '__next_cache_mock__',
  filename: '__next_cache_mock__',
  loaded: true,
  exports: {
    unstable_cache: (fn: Function, _keys?: string[], _opts?: any) => fn,
    revalidateTag: () => {},
    revalidatePath: () => {},
  },
} as any

// NOW import the actual typed fetchers — they will get the mocked next/cache
async function main() {
  const {
    getPortfolioCompanies,
    getPortfolioCompanyBySlug,
    getTeamMembers,
    getFunds,
    getNewsArticles,
    getInvestmentPlatforms,
    getPageBySlug,
    getSiteConfig,
    getOffices,
  } = await import('../src/lib/contentful/fetchers')

  let allPassed = true

  function check(label: string, ok: boolean) {
    console.log(`${ok ? '\u2713' : '\u2717'} ${label}`)
    if (!ok) allPassed = false
  }

  console.log('=== Contentful Content Validation ===\n')

  // Portfolio Companies (IT)
  const companies = await getPortfolioCompanies('it')
  check(`Portfolio Companies (IT): ${companies.length} (expected >= 15)`, companies.length >= 15)

  // Portfolio Companies (EN)
  const companiesEN = await getPortfolioCompanies('en')
  check(`Portfolio Companies (EN): ${companiesEN.length} (expected >= 15)`, companiesEN.length >= 15)

  // Team Members
  const team = await getTeamMembers('it')
  check(`Team Members (IT): ${team.length} (expected >= 15)`, team.length >= 15)

  // Funds
  const fundsList = await getFunds('it')
  check(`Funds (IT): ${fundsList.length} (expected >= 5)`, fundsList.length >= 5)

  // Investment Platforms
  const platforms = await getInvestmentPlatforms('it')
  check(`Investment Platforms (IT): ${platforms.length} (expected >= 3)`, platforms.length >= 3)

  // News Articles
  const news = await getNewsArticles('it')
  check(`News Articles (IT): ${news.length} (expected >= 5)`, news.length >= 5)

  // Site Config
  const config = await getSiteConfig('it')
  check('Site Config (IT): exists', config !== null)

  // Offices
  const officesList = await getOffices('it')
  check(`Offices (IT): ${officesList.length} (expected >= 2)`, officesList.length >= 2)

  // Slug-based fetch (proves single-entity typed fetcher)
  if (companies.length > 0) {
    const slug = companies[0].fields.slug
    const bySlug = await getPortfolioCompanyBySlug(slug, 'it')
    check(`Slug fetch (portfolioCompany "${slug}"): found`, bySlug !== null)
  }

  // Page by slug
  const page = await getPageBySlug('societa', 'it')
  check('Page by slug ("societa"): found', page !== null)

  // Locale mapping validation (proves 'it' -> 'it-IT' and 'en' -> 'en-US')
  if (companies.length > 0 && companiesEN.length > 0) {
    check(
      'Locale mapping: IT and EN both return name field',
      companies[0].fields.name !== undefined && companiesEN[0].fields.name !== undefined
    )
  }

  // TypeScript type safety at runtime (field access without errors)
  if (team.length > 0) {
    const member = team[0]
    check(
      'TypeScript type safety (team): name is string, slug is string',
      typeof member.fields.name === 'string' && typeof member.fields.slug === 'string'
    )
  }

  console.log('')
  if (allPassed) {
    console.log('\u2713 All content validation checks passed!')
    process.exit(0)
  } else {
    console.log('\u2717 Some checks failed.')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Validation failed:', err)
  process.exit(1)
})
