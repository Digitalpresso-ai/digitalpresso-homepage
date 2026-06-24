import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';

/**
 * 아티클 고정/고정해제. 고정한 글은 목록 최상단에 노출되며,
 * 여러 고정글은 pinned_at 최신순으로 정렬된다.
 */
export class PinArticleUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  /** 고정. 고정 시각(pinned_at)을 기록한다. */
  async pin(id: string, now: Date): Promise<ArticleEntity | null> {
    return this.repo.setPinned(id, now);
  }

  /** 고정 해제. */
  async unpin(id: string): Promise<ArticleEntity | null> {
    return this.repo.setPinned(id, null);
  }
}
