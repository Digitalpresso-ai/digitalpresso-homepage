const defaultUrl = 'https://digitalpresso.ai'
const baseUrl = (process.env.SITE_URL ?? process.argv[2] ?? defaultUrl).replace(/\/$/, '')

async function check(path: string, expectedIncludes: string[] = []) {
  const url = `${baseUrl}${path}`
  const res = await fetch(url)
  const text = await res.text()

  if (!res.ok) {
    throw new Error(`${url} returned ${res.status}`)
  }

  for (const pattern of expectedIncludes) {
    if (!text.includes(pattern)) {
      throw new Error(`${url} missing expected pattern: ${pattern}`)
    }
  }

  console.log(`OK ${url}`)
}

async function main() {
  await check('/sitemap.xml', [baseUrl])
  await check('/robots.txt', [`Sitemap: ${baseUrl}/sitemap.xml`])
  console.log('Deploy verification passed')
}

main().catch((err) => {
  console.error('Deploy verification failed')
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
