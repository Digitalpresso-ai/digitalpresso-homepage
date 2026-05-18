import { Client } from '@notionhq/client'
import type { NotionScrap } from '@/src/types/mcp'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function getScraps(): Promise<NotionScrap[]> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    sorts: [{ property: '날짜', direction: 'descending' }],
  })

  return response.results.flatMap((page) => {
    if (page.object !== 'page' || !('properties' in page)) return []

    const props = page.properties
    const action =
      props['액션']?.type === 'title'
        ? props['액션'].title.map((t) => t.plain_text).join('')
        : props['액션']?.type === 'rich_text'
          ? props['액션'].rich_text.map((t) => t.plain_text).join('')
          : ''
    const date =
      props['날짜']?.type === 'date' ? (props['날짜'].date?.start ?? '') : ''
    const link =
      props['링크']?.type === 'url'
        ? (props['링크'].url ?? '')
        : props['링크']?.type === 'rich_text'
          ? props['링크'].rich_text.map((t) => t.plain_text).join('')
          : ''

    if (!link) return []

    return [{ id: page.id, action, date, link }]
  })
}
