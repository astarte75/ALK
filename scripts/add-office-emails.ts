/**
 * Add email and pec fields to the office content type in Contentful,
 * then populate values for Padova and Milano offices.
 *
 * Usage: npx tsx --env-file=.env.local scripts/add-office-emails.ts
 */

import 'dotenv/config'
import { createClient } from 'contentful-management'

async function main() {
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN
  const spaceId = process.env.CONTENTFUL_SPACE_ID

  if (!managementToken || !spaceId) {
    console.error('Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID in .env.local')
    process.exit(1)
  }

  const client = createClient({ accessToken: managementToken })
  const space = await client.getSpace(spaceId)
  const env = await space.getEnvironment('master')

  // Step 1: Add fields to content type
  console.log('Fetching office content type...')
  const contentType = await env.getContentType('office')
  const existingFieldIds = contentType.fields.map((f) => f.id)

  const newFields: Array<Record<string, unknown>> = []

  if (!existingFieldIds.includes('email')) {
    newFields.push({
      id: 'email',
      name: 'Email',
      type: 'Symbol',
      localized: false,
      required: false,
    })
  }

  if (!existingFieldIds.includes('pec')) {
    newFields.push({
      id: 'pec',
      name: 'PEC',
      type: 'Symbol',
      localized: false,
      required: false,
    })
  }

  if (newFields.length > 0) {
    console.log(`Adding ${newFields.length} new field(s): ${newFields.map((f) => f.id).join(', ')}`)
    for (const field of newFields) {
      contentType.fields.push(field as any)
    }
    const updated = await contentType.update()
    console.log('Fields added. Publishing content type...')
    await updated.publish()
    console.log('Content type published.')
  } else {
    console.log('Fields already exist.')
  }

  // Step 2: Populate office entries
  console.log('\nFetching office entries...')
  const entries = await env.getEntries({ content_type: 'office' })

  for (const entry of entries.items) {
    const city = entry.fields.city?.['it-IT'] || entry.fields.city?.['en-US'] || ''
    const cityLower = city.toLowerCase()

    let email: string | undefined
    let pec: string | undefined

    if (cityLower.includes('padova')) {
      email = 'segreteria@alkemiacapital.com'
      pec = 'alkemia@pec.alkemiacapital.it'
    } else if (cityLower.includes('milan')) {
      email = 'info@alkemiacapital.com'
    }

    if (email || pec) {
      let changed = false

      if (email && !entry.fields.email) {
        entry.fields.email = { 'en-US': email }
        changed = true
      }

      if (pec && !entry.fields.pec) {
        entry.fields.pec = { 'en-US': pec }
        changed = true
      }

      if (changed) {
        console.log(`Updating ${city}: email=${email || '-'}, pec=${pec || '-'}`)
        const updated = await entry.update()
        await updated.publish()
        console.log(`  Published.`)
      } else {
        console.log(`${city}: already has email/pec values.`)
      }
    }
  }

  console.log('\nDone!')
}

main().catch((err) => {
  console.error('Error:', err.message || err)
  process.exit(1)
})
