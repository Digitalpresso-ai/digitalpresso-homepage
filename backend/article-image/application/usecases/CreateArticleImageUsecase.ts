import type { IArticleImageRepository } from '../../domain/repositories/IArticleImageRepository';
import type { ArticleImageEntity } from '../../domain/entities/ArticleImageEntity';

export class CreateArticleImageUsecase {
  constructor(private readonly repo: IArticleImageRepository) {}

  execute(data: Omit<ArticleImageEntity, 'id' | 'created_at'>): Promise<ArticleImageEntity> {
    return this.repo.create(data);
  }
}
