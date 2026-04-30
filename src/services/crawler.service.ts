import * as cheerio from 'cheerio'
import type { CrawledArticle } from '@/src/types/mcp'

const USER_AGENT =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

export async function fetchArticleContent(url: string): Promise<CrawledArticle | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null

    const html = await res.text()
    const $ = cheerio.load(html)

    const title =
      $('meta[property="og:title"]').attr('content')?.trim() ||
      $('h1').first().text().trim() ||
      ''

    const bodySelector =
      $('article p').length > 0 ? 'article p'
      : $('main p').length > 0 ? 'main p'
      : 'p'

    const body = $(bodySelector)
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length >= 30)
      .join('\n\n')

    if (!title && !body) return null

    return { title, body }
  } catch {
    return null
  }
}
