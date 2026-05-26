import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';

export class GetArticleByIdUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  execute(id: string): Promise<ArticleEntity | null> {
    return this.repo.findById(id);
  }
}
