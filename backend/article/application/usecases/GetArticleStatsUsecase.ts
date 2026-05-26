import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';

export class GetArticleStatsUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(): Promise<{ total: number }> {
    const total = await this.repo.count();
    return { total };
  }
}
