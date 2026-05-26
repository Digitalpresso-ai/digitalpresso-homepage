import { marked } from 'marked';
import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';

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
  | { success: true; id: string; deduplicated: boolean }
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
        return { success: true, id: duplicate.id, deduplicated: true };
      }
    }

    const fmt = input.contentFormat ?? 'markdown';
    const content = toHtml(rawContent, fmt);
    const contentEn = input.contentEn ? toHtml(input.contentEn, fmt) : '';
    const contentJa = input.contentJa ? toHtml(input.contentJa, fmt) : '';

    const article = await this.repo.create({
      title,
      title_en: (input.titleEn ?? '').trim(),
      title_ja: (input.titleJa ?? '').trim(),
      content: marker ? `${marker}\n${content}` : content,
      content_en: contentEn,
      content_ja: contentJa,
      cover_img_url: input.coverImgUrl?.trim() || null,
      category,
    });

    return { success: true, id: article.id, deduplicated: false };
  }
}
