import { db } from '@/backend/shared/db';
import { DrArticleRepository } from '../infrastructure/repositories/DrArticleRepository';
import { GetArticlesUsecase } from './usecases/GetArticlesUsecase';
import { GetArticleByIdUsecase } from './usecases/GetArticleByIdUsecase';
import { GetAdjacentArticlesUsecase } from './usecases/GetAdjacentArticlesUsecase';
import { GetArticleStatsUsecase } from './usecases/GetArticleStatsUsecase';
import { CreateArticleUsecase } from './usecases/CreateArticleUsecase';
import { UpdateArticleUsecase } from './usecases/UpdateArticleUsecase';
import { DeleteArticleUsecase } from './usecases/DeleteArticleUsecase';
import { UploadDraftUsecase } from './usecases/UploadDraftUsecase';
import type { FindAllOptions } from '../domain/repositories/IArticleRepository';
import type { CreateArticleDto } from './dtos/CreateArticleDto';
import type { UpdateArticleDto } from './dtos/UpdateArticleDto';
import type { UploadDraftInput } from './usecases/UploadDraftUsecase';

function makeRepo() {
  return new DrArticleRepository(db);
}

export async function getPublishedArticles(options?: FindAllOptions) {
  return new GetArticlesUsecase(makeRepo()).execute(options);
}

export async function getArticleById(id: string) {
  return new GetArticleByIdUsecase(makeRepo()).execute(id);
}

export async function getAdjacentArticles(currentId: string) {
  return new GetAdjacentArticlesUsecase(makeRepo()).execute(currentId);
}

export async function getArticleStats() {
  return new GetArticleStatsUsecase(makeRepo()).execute();
}

export async function createArticle(data: CreateArticleDto) {
  return new CreateArticleUsecase(makeRepo()).execute(data);
}

export async function updateArticle(id: string, data: UpdateArticleDto) {
  return new UpdateArticleUsecase(makeRepo()).execute(id, data);
}

export async function deleteArticle(id: string) {
  return new DeleteArticleUsecase(makeRepo()).execute(id);
}

export async function uploadArticleDraft(input: UploadDraftInput) {
  return new UploadDraftUsecase(makeRepo()).execute(input);
}

export async function getArticleCount(category?: string): Promise<number> {
  return makeRepo().count(category);
}

export async function getArticleCounts(): Promise<Record<string, number>> {
  return makeRepo().countByCategories();
}
