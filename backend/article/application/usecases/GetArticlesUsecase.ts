import type { IArticleRepository, FindAllOptions } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';

export class GetArticlesUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  execute(options?: FindAllOptions): Promise<ArticleEntity[]> {
    return this.repo.findAll(options);
  }
}
