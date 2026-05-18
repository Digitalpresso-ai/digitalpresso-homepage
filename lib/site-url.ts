const DEFAULT_SITE_URL = 'https://digitalpresso-homepage.vercel.app'

function normalize(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return DEFAULT_SITE_URL

  try {
    const parsed = new URL(raw)
    return normalize(parsed.toString())
  } catch {
    return DEFAULT_SITE_URL
  }
}
