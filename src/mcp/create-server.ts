import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { z } from 'zod'
import { getScraps } from '@/src/services/notion.service'
import { fetchArticleContent } from '@/src/services/crawler.service'
import { uploadArticleDraft } from '@/src/services/article-upload.service'
import { generateNewsletterDraft } from '@/src/services/draft-generator.service'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const companyServices = readFileSync(
  join(__dirname, '../../content/company-services.md'),
  'utf-8'
)

export function createServer() {
  const server = new McpServer({
    name: 'dp-article-mcp',
    version: '1.0.0',
  })

  // ── Resources ──────────────────────────────────────────────────────────────

  server.registerResource(
    'company-services',
    'company-services://content',
    {
      title: '회사 서비스 정보',
      description: 'renameDP 전기시공버전 및 종합건설버전 서비스 설명',
      mimeType: 'text/markdown',
    },
    async () => ({
      contents: [{
        uri: 'company-services://content',
        text: companyServices,
        mimeType: 'text/markdown',
      }],
    })
  )

  server.registerResource(
    'notion-scraps',
    'notion://scraps',
    {
      title: 'Notion 스크랩 목록',
      description: '뉴스 스크랩 DB에서 가져온 항목 목록 (JSON)',
      mimeType: 'application/json',
    },
    async () => {
      const scraps = await getScraps()
      return {
        contents: [{
          uri: 'notion://scraps',
          text: JSON.stringify(scraps, null, 2),
          mimeType: 'application/json',
        }],
      }
    }
  )

  // ── Prompts ────────────────────────────────────────────────────────────────

  server.registerPrompt(
    'article-draft-prompt',
    {
      title: '아티클 초안 생성 프롬프트',
      description: '크롤링된 기사 정보와 회사 서비스를 연결해 홈페이지 아티클 초안을 작성하는 프롬프트입니다.',
      argsSchema: {
        articleTitle: z.string().describe('크롤링한 기사 제목'),
        articleBody: z.string().describe('크롤링한 기사 본문'),
        action: z.string().describe('스크랩 시 작성한 활용 방안'),
      },
    },
    async ({ articleTitle, articleBody, action }) => ({
      messages: [{
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `당신은 IT 기업의 콘텐츠 마케터입니다.

[뉴스 기사]
제목: ${articleTitle}
본문: ${articleBody}

[우리 회사 서비스]
${companyServices}

[활용 방안]
${action}

위 정보를 바탕으로 홈페이지 아티클 초안을 작성해주세요.
- 뉴스의 트렌드나 인사이트를 도입부에 활용하세요.
- 회사 서비스 중 이 기사와 가장 관련 있는 1~2개를 선택해 자연스럽게 연결하세요.
- [활용 방안]을 아티클의 핵심 메시지로 삼으세요.
- 출력 형식: Markdown (제목 포함, 예: # 제목)
- 분량: 800~1200자`,
        },
      }],
    })
  )

  // ── Tools ──────────────────────────────────────────────────────────────────

  server.registerTool(
    'get_notion_scraps',
    {
      title: 'Notion 스크랩 목록 조회',
      description: 'Notion DB에서 스크랩된 뉴스 기사 목록을 날짜 내림차순으로 반환합니다.',
    },
    async () => {
      const scraps = await getScraps()
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(scraps, null, 2),
        }],
      }
    }
  )

  server.registerTool(
    'crawl_article',
    {
      title: '기사 내용 크롤링',
      description: '뉴스 기사 URL을 크롤링해 제목과 본문을 반환합니다. Claude가 직접 초안을 작성할 때 사용하세요.',
      inputSchema: {
        link: z.string().describe('크롤링할 뉴스 기사 URL'),
      },
    },
    async ({ link }) => {
      const crawled = await fetchArticleContent(link)
      if (!crawled) {
        return {
          content: [{
            type: 'text' as const,
            text: '해당 기사는 자동으로 읽을 수 없습니다. 내용을 직접 붙여넣어 주세요.',
          }],
          isError: true,
        }
      }

      return {
        content: [{
          type: 'text' as const,
          text: `제목: ${crawled.title}\n\n본문:\n${crawled.body}`,
        }],
      }
    }
  )

  server.registerTool(
    'upload_draft',
    {
      title: '아티클 초안 업로드',
      description: '작성한 초안을 CMS(articles 테이블)에 저장합니다. sourceUrl이 같으면 중복 생성하지 않습니다.',
      inputSchema: {
        title: z.string().min(1).describe('초안 제목'),
        content: z.string().min(1).describe('초안 본문'),
        category: z
          .enum(['company', 'construction', 'technology'])
          .default('company')
          .describe('카테고리'),
        sourceUrl: z.string().url().optional().describe('원문 기사 URL (중복 방지 기준)'),
        contentFormat: z
          .enum(['markdown', 'html'])
          .default('markdown')
          .describe('본문 포맷'),
        titleEn: z.string().optional().describe('영문 제목'),
        titleJa: z.string().optional().describe('일문 제목'),
        contentEn: z.string().optional().describe('영문 본문'),
        contentJa: z.string().optional().describe('일문 본문'),
        coverImgUrl: z.string().url().optional().describe('커버 이미지 URL'),
      },
    },
    async (input) => {
      const result = await uploadArticleDraft(input)

      if (!result.success) {
        return {
          content: [{
            type: 'text' as const,
            text: result.error,
          }],
          isError: true,
        }
      }

      const message = result.deduplicated
        ? `이미 같은 sourceUrl로 저장된 초안이 있어 기존 항목을 반환합니다. id=${result.id}`
        : `초안을 저장했습니다. id=${result.id}`

      return {
        content: [{
          type: 'text' as const,
          text: message,
        }],
      }
    }
  )

  server.registerTool(
    'auto_upload_draft',
    {
      title: '기사 기반 초안 자동 생성/업로드',
      description: '링크 또는 Notion 스크랩을 바탕으로 뉴스레터 초안을 자동 생성해 업로드합니다.',
      inputSchema: {
        link: z.string().url().optional().describe('기사 URL. 없으면 Notion 스크랩에서 자동 선택'),
        scrapIndex: z.number().int().min(0).default(0).describe('Notion 스크랩 인덱스 (link가 없을 때 사용)'),
        category: z.enum(['company', 'construction', 'technology']).optional().describe('카테고리 강제 지정'),
        action: z.string().optional().describe('활용방안 수동 입력 (없으면 Notion 값 또는 기본 문구)'),
      },
    },
    async ({ link, scrapIndex, category, action }) => {
      let sourceLink = link
      let sourceAction = action ?? ''

      if (!sourceLink) {
        const scraps = await getScraps()
        const target = scraps[scrapIndex]
        if (!target) {
          return {
            content: [{
              type: 'text' as const,
              text: `scrapIndex=${scrapIndex}에 해당하는 스크랩이 없습니다. 현재 ${scraps.length}건`,
            }],
            isError: true,
          }
        }
        sourceLink = target.link
        if (!sourceAction) sourceAction = target.action
      }

      const crawled = await fetchArticleContent(sourceLink)
      if (!crawled) {
        return {
          content: [{
            type: 'text' as const,
            text: '기사 본문 크롤링에 실패했습니다. 링크를 확인해 주세요.',
          }],
          isError: true,
        }
      }

      const draft = generateNewsletterDraft({
        articleTitle: crawled.title || '제목 미확인 기사',
        articleBody: crawled.body,
        action: sourceAction,
        category,
      })

      const result = await uploadArticleDraft({
        title: draft.title,
        content: draft.content,
        category: draft.category,
        sourceUrl: sourceLink,
        contentFormat: 'markdown',
      })

      if (!result.success) {
        return {
          content: [{
            type: 'text' as const,
            text: result.error,
          }],
          isError: true,
        }
      }

      return {
        content: [{
          type: 'text' as const,
          text: result.deduplicated
            ? `기존 초안을 재사용했습니다. id=${result.id}`
            : `초안 자동 업로드 완료. id=${result.id}`,
        }],
      }
    }
  )

  return server
}
