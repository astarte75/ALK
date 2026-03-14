import { createClient } from 'contentful'

// Delivery client — published content, cached
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

// Preview client — draft content, not cached
export const contentfulPreviewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  host: 'preview.contentful.com',
})

// Select client based on draft mode
export function getClient(preview = false) {
  return preview ? contentfulPreviewClient : contentfulClient
}
