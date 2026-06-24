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
import { PublishArticleUsecase } from './usecases/PublishArticleUsecase';
import type { FindAllOptions } from '../domain/repositories/IArticleRepository';
import type { CreateArticleDto } from './dtos/CreateArticleDto';
import type { UpdateArticleDto } from './dtos/UpdateArticleDto';
import type { UploadDraftInput } from './usecases/UploadDraftUsecase';

function makeRepo() {
  return new DrArticleRepository(db);
}

/** 공개용: published 아티클만 조회한다. (사이트, sitemap, 공개 API) */
export async function getPublishedArticles(options?: FindAllOptions) {
  return new GetArticlesUsecase(makeRepo()).execute({ ...options, status: 'published' });
}

/** admin용: 상태 무관 전체(임시저장+게시) 조회. status 옵션으로 좁힐 수 있다. */
export async function getAdminArticles(options?: FindAllOptions) {
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

/** draft → published 게시 */
export async function publishArticle(id: string, now: Date) {
  return new PublishArticleUsecase(makeRepo()).publish(id, now);
}

/** published → draft (사이트에서 내림) */
export async function unpublishArticle(id: string) {
  return new PublishArticleUsecase(makeRepo()).unpublish(id);
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

/** 공개 뉴스 페이지 카테고리별 카운트: published 만 집계 */
export async function getArticleCounts(): Promise<Record<string, number>> {
  return makeRepo().countByCategories('published');
}
