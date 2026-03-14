/**
 * Image download from WordPress and upload to Contentful Assets.
 * Strips WordPress thumbnail suffixes for max resolution.
 */

import type { Environment } from 'contentful-management'

const DELAY_MS = 300
const MAX_POLL_RETRIES = 30
const POLL_INTERVAL_MS = 1000

/**
 * Strip WordPress thumbnail suffix from URL for max resolution.
 * e.g., image-1024x683.jpg -> image.jpg
 */
export function stripThumbnailSuffix(url: string): string {
  return url.replace(/-\d+x\d+\./, '.')
}

/**
 * Determine content type from file extension.
 */
function guessContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    gif: 'image/gif',
    avif: 'image/avif',
  }
  return map[ext || ''] || 'image/png'
}

/**
 * Extract filename from URL.
 */
function getFileName(url: string): string {
  const parts = new URL(url).pathname.split('/')
  return parts[parts.length - 1] || 'image.png'
}

/**
 * Upload a single image to Contentful.
 * 1. Strips WP thumbnail suffix for full resolution
 * 2. Falls back to original URL on 404
 * 3. Downloads, uploads, processes, publishes
 */
export async function uploadImage(
  env: Environment,
  imageUrl: string,
  title: string,
  dryRun = false
): Promise<string | null> {
  if (dryRun) {
    console.log(`  [DRY RUN] Would upload image: ${title} from ${imageUrl}`)
    return `dry-run-asset-${title.replace(/\s+/g, '-').toLowerCase()}`
  }

  const fullResUrl = stripThumbnailSuffix(imageUrl)
  let downloadUrl = fullResUrl

  try {
    // Try full-res first; fallback to original on 404
    let response = await fetch(fullResUrl)
    if (!response.ok && fullResUrl !== imageUrl) {
      console.log(`  Full-res URL failed (${response.status}), falling back to original`)
      response = await fetch(imageUrl)
      downloadUrl = imageUrl
    }

    if (!response.ok) {
      console.warn(`  WARNING: Could not download image ${downloadUrl} (${response.status})`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    const fileName = getFileName(downloadUrl)
    const contentType = guessContentType(fileName)

    // Create upload
    const upload = await env.createUpload({ file: arrayBuffer })

    // Create asset
    const asset = await env.createAsset({
      fields: {
        title: { 'it-IT': title },
        file: {
          'it-IT': {
            contentType,
            fileName,
            uploadFrom: {
              sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id },
            },
          },
        },
      },
    })

    // Process and wait
    await asset.processForAllLocales()

    let processedAsset = await env.getAsset(asset.sys.id)
    let retries = 0
    while (!processedAsset.fields.file?.['it-IT']?.url && retries < MAX_POLL_RETRIES) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
      processedAsset = await env.getAsset(asset.sys.id)
      retries++
    }

    if (!processedAsset.fields.file?.['it-IT']?.url) {
      console.warn(`  WARNING: Asset processing timed out for ${title}`)
      return null
    }

    await processedAsset.publish()
    return asset.sys.id
  } catch (error) {
    console.warn(`  WARNING: Failed to upload image ${title}:`, error)
    return null
  }
}

/**
 * Upload all images sequentially, with deduplication.
 * Returns Map<originalUrl, assetId>.
 */
export async function uploadAllImages(
  env: Environment,
  imageUrls: Array<{ url: string; title: string }>,
  dryRun = false
): Promise<Map<string, string>> {
  const assetMap = new Map<string, string>()

  // Deduplicate by URL
  const seen = new Set<string>()
  const unique = imageUrls.filter(({ url }) => {
    if (seen.has(url)) return false
    seen.add(url)
    return true
  })

  console.log(`\nUploading ${unique.length} images...`)

  for (let i = 0; i < unique.length; i++) {
    const { url, title } = unique[i]
    console.log(`  Uploading image ${i + 1}/${unique.length}: ${title}`)

    const assetId = await uploadImage(env, url, title, dryRun)
    if (assetId) {
      assetMap.set(url, assetId)
    }

    // Rate limit delay (sequential processing)
    if (!dryRun && i < unique.length - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS))
    }
  }

  console.log(`  Uploaded ${assetMap.size}/${unique.length} images successfully.\n`)
  return assetMap
}
