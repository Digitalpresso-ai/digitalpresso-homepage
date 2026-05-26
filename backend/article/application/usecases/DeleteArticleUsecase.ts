import type { IArticleRepository } from '../../domain/repositories/IArticleRepository';

export class DeleteArticleUsecase {
  constructor(private readonly repo: IArticleRepository) {}

  execute(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
