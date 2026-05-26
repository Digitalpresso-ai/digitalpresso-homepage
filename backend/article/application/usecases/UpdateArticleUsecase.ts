import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';
import type { UpdateArticleDto } from '../dtos/UpdateArticleDto';

export class UpdateArticleUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  execute(id: string, data: UpdateArticleDto): Promise<ArticleEntity | null> {
    return this.repo.update(id, data);
  }
}
