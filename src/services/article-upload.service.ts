import { createClient } from '@supabase/supabase-js'
import { marked } from 'marked'

export type UploadDraftInput = {
  title: string
  content: string
  category?: string
  sourceUrl?: string
  contentFormat?: 'markdown' | 'html'
  titleEn?: string
  titleJa?: string
  contentEn?: string
  contentJa?: string
  coverImgUrl?: string
}

export type UploadDraftResult =
  | { success: true; id: string; deduplicated: boolean }
  | { success: false; error: string }

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    return null
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function normalizeCategory(category?: string): string {
  const safe = (category ?? 'company').trim().toLowerCase()
  if (safe === 'construction' || safe === 'technology' || safe === 'company') {
    return safe
  }
  return 'company'
}

function sourceMarker(sourceUrl?: string): string {
  if (!sourceUrl) return ''
  return `<!-- mcp_source:${encodeURIComponent(sourceUrl)} -->`
}

function toHtml(content: string, format: 'markdown' | 'html' = 'markdown'): string {
  if (format === 'html') return content
  return marked.parse(content, { async: false }) as string
}

export async function uploadArticleDraft(input: UploadDraftInput): Promise<UploadDraftResult> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return { success: false, error: 'SUPABASE_SERVICE_ROLE_KEY 또는 NEXT_PUBLIC_SUPABASE_URL 환경변수가 필요합니다.' }
  }

  const title = input.title.trim()
  const rawContent = input.content.trim()
  if (!title) return { success: false, error: 'title은 필수입니다.' }
  if (!rawContent) return { success: false, error: 'content는 필수입니다.' }

  const category = normalizeCategory(input.category)
  const marker = sourceMarker(input.sourceUrl)

  if (marker) {
    const { data: duplicate, error: duplicateError } = await supabase
      .from('articles')
      .select('id')
      .ilike('content', `%${marker}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (duplicateError) {
      return { success: false, error: `중복 검사 실패: ${duplicateError.message}` }
    }
    if (duplicate?.id) {
      return { success: true, id: duplicate.id, deduplicated: true }
    }
  }

  const content = toHtml(rawContent, input.contentFormat ?? 'markdown')
  const contentEn = input.contentEn ? toHtml(input.contentEn, input.contentFormat ?? 'markdown') : ''
  const contentJa = input.contentJa ? toHtml(input.contentJa, input.contentFormat ?? 'markdown') : ''

  const payload = {
    title,
    title_en: (input.titleEn ?? '').trim(),
    title_ja: (input.titleJa ?? '').trim(),
    content: marker ? `${marker}\n${content}` : content,
    content_en: contentEn,
    content_ja: contentJa,
    cover_img_url: input.coverImgUrl?.trim() || null,
    category,
  }

  const { data, error } = await supabase
    .from('articles')
    .insert(payload)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `초안 업로드 실패: ${error.message}` }
  }

  return { success: true, id: data.id, deduplicated: false }
}
