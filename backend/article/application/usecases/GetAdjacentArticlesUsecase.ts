import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';

export class GetAdjacentArticlesUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(
    id: string
  ): Promise<{ prev: ArticleEntity | null; next: ArticleEntity | null }> {
    const current = await this.repo.findById(id);
    if (!current) return { prev: null, next: null };
    return this.repo.findAdjacentByCategory(id, current.category, current.created_at);
  }
}
