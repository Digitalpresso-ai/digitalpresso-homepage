import { uploadArticleDraft } from '../src/services/article-upload.service'

async function main() {
  const r = await uploadArticleDraft({
    title: 'MCP 테스트 초안',
    content: '# 테스트 본문\n\n업로드 확인',
    category: 'company',
    sourceUrl: 'https://example.com/test-1',
    contentFormat: 'markdown',
  })
  console.log(r)
}

main().catch(console.error)
