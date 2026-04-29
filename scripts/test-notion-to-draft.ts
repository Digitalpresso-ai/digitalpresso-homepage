import { getScraps } from '../src/services/notion.service'
import { fetchArticleContent } from '../src/services/crawler.service'
import { uploadArticleDraft } from '../src/services/article-upload.service'
import { generateNewsletterDraft } from '../src/services/draft-generator.service'

function parseArgs() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const randomPick = args.includes('--random')

  const indexArg = args.find((arg) => arg.startsWith('--index='))
  const categoryArg = args.find((arg) => arg.startsWith('--category='))

  const index = indexArg ? Number(indexArg.split('=')[1]) : 0
  const category = categoryArg?.split('=')[1] ?? ''

  return {
    dryRun,
    randomPick,
    index: Number.isFinite(index) && index >= 0 ? index : 0,
    category,
  }
}

async function main() {
  const { dryRun, randomPick, index, category } = parseArgs()

  console.log('[1/5] Notion 스크랩 조회 중...')
  const scraps = await getScraps()
  if (!scraps.length) {
    throw new Error('Notion 스크랩이 비어 있습니다.')
  }

  const pickedIndex = randomPick
    ? Math.floor(Math.random() * scraps.length)
    : index

  const target = scraps[pickedIndex]
  if (!target) {
    throw new Error(`index=${pickedIndex}에 해당하는 스크랩이 없습니다. 전체 ${scraps.length}건`)
  }
  console.log(`선택된 스크랩 index=${pickedIndex} / date=${target.date}`)

  console.log(`[2/5] 기사 크롤링 중... (${target.link})`)
  const crawled = await fetchArticleContent(target.link)
  if (!crawled) {
    throw new Error('기사 크롤링에 실패했습니다.')
  }

  console.log('[3/5] 요약/초안 생성 중...')
  const draft = generateNewsletterDraft({
    articleTitle: crawled.title || '제목 미확인 기사',
    articleBody: crawled.body,
    action: target.action,
    category,
  })

  if (dryRun) {
    console.log('[4/5] dry-run 모드: 업로드 생략')
    console.log(`최종 카테고리: ${draft.category}`)
    console.log('--- DRAFT PREVIEW START ---')
    console.log(draft.content.slice(0, 1200))
    console.log('--- DRAFT PREVIEW END ---')
    return
  }

  console.log('[4/5] 초안 업로드 중...')
  const result = await uploadArticleDraft({
    title: draft.title,
    content: draft.content,
    category: draft.category,
    sourceUrl: target.link,
    contentFormat: 'markdown',
  })

  console.log('[5/5] 완료')
  console.log(result)
}

main().catch((error) => {
  console.error('[FAILED]', error instanceof Error ? error.message : error)
  process.exit(1)
})
