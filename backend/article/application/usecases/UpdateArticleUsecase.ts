import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';
import type { UpdateArticleDto } from '../dtos/UpdateArticleDto';

export class UpdateArticleUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  execute(id: string, data: UpdateArticleDto): Promise<ArticleEntity | null> {
    const { published_date, ...rest } = data;

    // 게시일(published_date)이 오면 created_at 을 해당 날짜로 조정한다.
    // 정오(12:00 UTC)로 고정해 타임존에 따라 하루 밀리는 문제를 피한다.
    const patch: Partial<Omit<ArticleEntity, 'id'>> = { ...rest };
    if (published_date) {
      patch.created_at = new Date(`${published_date}T12:00:00.000Z`);
    }

    return this.repo.update(id, patch);
  }
}
