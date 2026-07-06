import { marked } from 'marked';
import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';
import { sanitizeArticleImages } from '../sanitizeArticleImages';

export interface UploadDraftInput {
  title: string;
  content: string;
  category?: string;
  sourceUrl?: string;
  contentFormat?: 'markdown' | 'html';
  titleEn?: string;
  titleJa?: string;
  contentEn?: string;
  contentJa?: string;
  coverImgUrl?: string;
}

export type UploadDraftResult =
  | { success: true; id: string; deduplicated: boolean; removedImages: string[] }
  | { success: false; error: string };

function normalizeCategory(category?: string): 'company' | 'construction' | 'technology' {
  const safe = (category ?? 'company').trim().toLowerCase();
  if (safe === 'construction' || safe === 'technology') return safe;
  return 'company';
}

function sourceMarker(sourceUrl?: string): string {
  if (!sourceUrl) return '';
  return `<!-- mcp_source:${encodeURIComponent(sourceUrl)} -->`;
}

function toHtml(content: string, format: 'markdown' | 'html' = 'markdown'): string {
  if (format === 'html') return content;
  return marked.parse(content, { async: false }) as string;
}

export class UploadDraftUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: UploadDraftInput): Promise<UploadDraftResult> {
    const title = input.title.trim();
    const rawContent = input.content.trim();
    if (!title) return { success: false, error: 'title은 필수입니다.' };
    if (!rawContent) return { success: false, error: 'content는 필수입니다.' };

    const category = normalizeCategory(input.category);
    const marker = sourceMarker(input.sourceUrl);

    if (marker) {
      const duplicate = await this.repo.findByContentPattern(`%${marker}%`);
      if (duplicate) {
        return { success: true, id: duplicate.id, deduplicated: true, removedImages: [] };
      }
    }

    const fmt = input.contentFormat ?? 'markdown';

    // MCP/스킬 업로드는 이미지 바이너리가 전송되지 않으므로, 마크다운의 상대경로 이미지
    // (예: article9-main.png)는 실서버에서 접속 불가능해 깨진다. 저장 전에 걸러내고,
    // admin 에디터가 인식할 수 있는 플레이스홀더로 치환한다.
    const ko = sanitizeArticleImages(toHtml(rawContent, fmt));
    const en = input.contentEn ? sanitizeArticleImages(toHtml(input.contentEn, fmt)) : null;
    const ja = input.contentJa ? sanitizeArticleImages(toHtml(input.contentJa, fmt)) : null;

    const content = ko.html;
    const contentEn = en?.html ?? '';
    const contentJa = ja?.html ?? '';
    const removedImages = [
      ...ko.removed,
      ...(en?.removed ?? []),
      ...(ja?.removed ?? []),
    ];

    // MCP/스킬로 올라온 글은 항상 임시저장(draft)으로 들어간다.
    // 대표 이미지를 넣고 admin 에서 [게시] 를 눌러야 실서버에 공개된다.
    const article = await this.repo.create({
      title,
      title_en: (input.titleEn ?? '').trim(),
      title_ja: (input.titleJa ?? '').trim(),
      content: marker ? `${marker}\n${content}` : content,
      content_en: contentEn,
      content_ja: contentJa,
      cover_img_url: input.coverImgUrl?.trim() || null,
      category,
      status: 'draft',
      published_at: null,
    });

    return { success: true, id: article.id, deduplicated: false, removedImages };
  }
}
