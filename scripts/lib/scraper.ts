/**
 * News article scraper.
 * Fetches full article content from Alkemia website URLs.
 */

export interface ScrapedArticle {
  title: string
  date: string | null
  body: string
  images: string[]
}

/**
 * Scrape a news article page and extract the main content.
 * Returns null on failure with a warning log.
 */
export async function scrapeNewsArticle(url: string): Promise<ScrapedArticle | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AlkemiaMigration/1.0)',
      },
    })

    if (!response.ok) {
      console.warn(`  WARNING: Could not fetch article ${url} (${response.status})`)
      return null
    }

    const html = await response.text()

    // Extract title from <h1> or <title>
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/) || html.match(/<title>([^<]+)<\/title>/)
    const title = titleMatch ? titleMatch[1].trim() : ''

    // Extract article body (content between post-content divs, simplified)
    // This is a basic extraction; the full body is already in alkemiacapital-site.md
    const bodyMatch = html.match(
      /<div[^>]*class="[^"]*(?:entry-content|post-content|elementor-widget-text-editor)[^"]*"[^>]*>([\s\S]*?)<\/div>/
    )
    const body = bodyMatch
      ? bodyMatch[1]
          .replace(/<[^>]+>/g, '') // Strip HTML tags
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim()
      : ''

    // Extract images
    const images: string[] = []
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
    let imgMatch: RegExpExecArray | null
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      if (imgMatch[1].includes('alkemiacapital.com/wp-content/uploads')) {
        images.push(imgMatch[1])
      }
    }

    return { title, date: null, body, images }
  } catch (error) {
    console.warn(`  WARNING: Failed to scrape article ${url}:`, error)
    return null
  }
}

/**
 * Check if an English version of the article exists.
 */
export async function checkEnglishVersion(url: string): Promise<string | null> {
  // Insert /en/ after the domain
  const enUrl = url.replace('alkemiacapital.com/', 'alkemiacapital.com/en/')

  try {
    const response = await fetch(enUrl, { method: 'HEAD' })
    return response.ok ? enUrl : null
  } catch {
    return null
  }
}
