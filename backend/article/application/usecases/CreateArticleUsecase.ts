import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';
import type { CreateArticleDto } from '../dtos/CreateArticleDto';

export class CreateArticleUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  execute(data: CreateArticleDto): Promise<ArticleEntity> {
    return this.repo.create(data);
  }
}
