import { readFileSync } from 'fs'
import { join } from 'path'

type Category = 'company' | 'construction' | 'technology'

type ServiceProfile = {
  name: string
  summary: string
  features: string[]
  keywords: string[]
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  company: ['브랜드', '조직', '운영', '경영', '성과', '전략', '고객', '도입', '디지털전환'],
  construction: ['건설', '시공', '현장', '안전', '공정', 'tbm', '위험성평가', '중대재해', '품질', '근로자'],
  technology: ['ai', '인공지능', 'ocr', '자동화', '플랫폼', '데이터', '클라우드', '모델', '기술', '알고리즘'],
}

function parseCompanyServices(): ServiceProfile[] {
  const file = readFileSync(join(process.cwd(), 'content/company-services.md'), 'utf-8')
  const sections = file
    .split('\n# ')
    .map((s, i) => (i === 0 ? s : `# ${s}`))
    .filter((s) => s.trim().startsWith('# '))

  return sections.map((section) => {
    const lines = section.split('\n')
    const name = lines[0].replace(/^#\s*/, '').trim()
    const summaryMatch = section.match(/## 서비스 요약\s*([\s\S]*?)\n## /)
    const featureBlock = section.match(/## 주요 기능\s*([\s\S]*?)\n## /)?.[1] ?? ''
    const keywordsBlock = section.match(/## 연관 키워드\s*([\s\S]*?)$/)?.[1] ?? ''

    return {
      name,
      summary: summaryMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '',
      features: featureBlock
        .split('\n')
        .map((line) => line.replace(/^- /, '').replace(/\*\*/g, '').trim())
        .filter(Boolean),
      keywords: keywordsBlock
        .split(',')
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean),
    }
  })
}

export function sanitizeNewsText(text: string): string {
  return text
    .replace(/\[[^\]]{0,80}(기자|특파원)[^\]]{0,80}\]/g, ' ')
    .replace(/\([^)]{0,80}(기자|특파원)[^)]{0,80}\)/g, ' ')
    .replace(/\b[가-힣]{2,4}\s*기자\b/g, ' ')
    .replace(/대한경제|연합뉴스|뉴시스|머니투데이|조선비즈|이데일리|매일경제|한국경제|서울경제|아시아경제|파이낸셜뉴스/g, ' ')
    .replace(/\b입력\s*\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}[^ ]*/g, ' ')
    .replace(/\b수정\s*\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}[^ ]*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeTitle(title: string): string {
  return sanitizeNewsText(title)
    .replace(/\[.*?\]|\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractKeySentences(body: string, maxCount = 2): string[] {
  const normalized = sanitizeNewsText(body)
  return normalized
    .split(/(?<=[.!?。！？])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 25)
    .slice(0, maxCount)
}

function detectCategory(articleText: string, action: string): Category {
  const corpus = `${articleText}\n${action}`.toLowerCase()
  const scores = (Object.keys(CATEGORY_KEYWORDS) as Category[]).map((category) => ({
    category,
    score: CATEGORY_KEYWORDS[category].reduce((acc, keyword) => (
      corpus.includes(keyword.toLowerCase()) ? acc + 1 : acc
    ), 0),
  }))
  scores.sort((a, b) => b.score - a.score)
  return scores[0]?.score > 0 ? scores[0].category : 'company'
}

function matchServices(articleText: string, action: string): ServiceProfile[] {
  const corpus = `${articleText}\n${action}`.toLowerCase()
  return parseCompanyServices()
    .map((service) => ({
      service,
      score: service.keywords.reduce((acc, keyword) => (corpus.includes(keyword) ? acc + 1 : acc), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((row) => row.service)
}

function brandedTitle(baseTitle: string, category: Category): string {
  const prefix: Record<Category, string> = {
    company: '산업 이슈',
    construction: '건설 현장 이슈',
    technology: '기술 이슈',
  }
  const suffix: Record<Category, string> = {
    company: '왜 지금 중요한가 — 디지털 전환 관점',
    construction: '왜 지금 중요한가 — 현장 대응 관점',
    technology: '왜 지금 중요한가 — 실무 적용 관점',
  }
  return `${prefix[category]}: ${baseTitle} — ${suffix[category]}`
}

export function generateNewsletterDraft(input: {
  articleTitle: string
  articleBody: string
  action: string
  category?: string
}) {
  const cleanedTitle = normalizeTitle(input.articleTitle)
  const cleanedBody = sanitizeNewsText(input.articleBody)
  const autoCategory = detectCategory(`${cleanedTitle}\n${cleanedBody}`, input.action)
  const finalCategory = (input.category === 'company' || input.category === 'construction' || input.category === 'technology')
    ? input.category
    : autoCategory

  const key = extractKeySentences(cleanedBody, 2)
  const issueLine = key[0] ?? '최근 업계 흐름은 현장 운영의 비효율이 곧 비용과 리스크로 이어질 수 있음을 보여줍니다.'
  const painLine = key[1] ?? '특히 수기 중심 보고, 분산된 커뮤니케이션, 이력 누락은 현장 대응의 공백을 키우는 요인으로 지적됩니다.'

  const services = matchServices(`${cleanedTitle}\n${cleanedBody}`, input.action)
  const serviceNames = services.map((s) => s.name).join(', ') || '리네임디피'
  const featureBullets = services
    .flatMap((s) => s.features.slice(0, 4))
    .slice(0, 4)
    .map((f) => `- ${f}`)
    .join('\n') || '- 현장 데이터 기록 자동화\n- 위험요소 대응 이력 관리\n- 실시간 소통 및 보고 체계화'

  const content = `# ${brandedTitle(cleanedTitle, finalCategory)}

> 최근 현장 이슈는 점검의 횟수보다 기록의 지속성과 관리 체계의 연결성이 더 중요하다는 점을 보여주고 있습니다.

${issueLine}

${painLine}

이런 상황에서 중요한 것은 단순히 점검을 반복하는 것이 아니라, 현장 데이터를 누락 없이 축적하고 즉시 공유할 수 있는 운영 구조를 갖추는 일입니다.

## 현장에서 반복되는 관리 공백

현장에서는 여전히 수기 보고, 산발적 소통, 조치 이력 누락이 동시에 발생합니다. 이로 인해 같은 문제가 반복되고, 대응 속도와 판단 정확도 모두 떨어질 수 있습니다.

## 리네임디피가 대응하는 방식

디지털프레소의 ${serviceNames}은 현장 기록과 보고 체계를 하나의 흐름으로 연결해, 실행 가능한 데이터 기반 운영을 지원합니다.

${featureBullets}

이 과정에서 실무자는 반복 행정 업무를 줄이고, 관리자는 현황과 리스크를 더 빠르게 파악해 대응할 수 있습니다.

## 이번 이슈가 남기는 시사점

${input.action || '핵심은 현장과 관리 조직이 같은 데이터를 동시에 보고, 즉시 실행으로 연결되는 체계를 만드는 것입니다.'}

디지털 전환은 새로운 시스템을 덧붙이는 일이 아니라, 현장의 일하는 방식을 가볍고 지속 가능한 구조로 바꾸는 일입니다. 디지털프레소는 이러한 전환이 실제 현장에서 작동하도록 돕겠습니다.

문의: digitalpresso@digitalpresso.ai`

  return {
    title: brandedTitle(cleanedTitle, finalCategory),
    content,
    category: finalCategory,
  }
}
