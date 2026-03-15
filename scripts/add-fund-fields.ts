/**
 * Add new fields (targetSectors, documents, teamMembers) to the existing
 * fund content type in Contentful via the Management API.
 *
 * Usage: npx tsx scripts/add-fund-fields.ts
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

  console.log('Fetching fund content type...')
  const contentType = await env.getContentType('fund')

  const existingFieldIds = contentType.fields.map((f) => f.id)

  const newFields: Array<Record<string, unknown>> = []

  if (!existingFieldIds.includes('targetSectors')) {
    newFields.push({
      id: 'targetSectors',
      name: 'Target Sectors',
      type: 'Symbol',
      localized: true,
      required: false,
    })
  }

  if (!existingFieldIds.includes('documents')) {
    newFields.push({
      id: 'documents',
      name: 'Documents',
      type: 'Array',
      localized: false,
      required: false,
      items: {
        type: 'Link',
        linkType: 'Asset',
      },
    })
  }

  if (!existingFieldIds.includes('teamMembers')) {
    newFields.push({
      id: 'teamMembers',
      name: 'Team Members',
      type: 'Array',
      localized: false,
      required: false,
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: ['teamMember'] }],
      },
    })
  }

  if (newFields.length === 0) {
    console.log('All fields already exist. Nothing to do.')
    return
  }

  console.log(`Adding ${newFields.length} new field(s): ${newFields.map((f) => f.id).join(', ')}`)

  for (const field of newFields) {
    contentType.fields.push(field as any)
  }

  const updated = await contentType.update()
  console.log('Fields added. Publishing content type...')
  await updated.publish()
  console.log('Done! Fund content type updated and published.')
}

main().catch((err) => {
  console.error('Error:', err.message || err)
  process.exit(1)
})
