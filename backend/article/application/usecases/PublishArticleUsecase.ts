import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';

/**
 * 임시저장(draft) 아티클을 실서버에 게시(published)하거나,
 * 게시된 아티클을 다시 임시저장으로 내린다.
 */
export class PublishArticleUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  /** draft → published. 게시 시각(published_at)을 기록한다. */
  async publish(id: string, now: Date): Promise<ArticleEntity | null> {
    return this.repo.setStatus(id, 'published', now);
  }

  /** published → draft. 사이트에서 내린다. */
  async unpublish(id: string): Promise<ArticleEntity | null> {
    return this.repo.setStatus(id, 'draft', null);
  }
}
