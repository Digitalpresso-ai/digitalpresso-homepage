import axios from 'axios';
import type { ArticleEntity } from '@/backend/article/domain/entities/ArticleEntity';
import type { ApiResponse } from '@/backend/shared/types/ApiResponse';

const api = axios.create({ baseURL: '/api' });

// 서버가 4xx/5xx 를 주면 axios 가 "Request failed with status code 400" 같은
// 기본 메시지로 throw 한다. 응답 body 의 한국어 error 메시지를 대신 노출한다.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const serverMsg = error?.response?.data?.error;
    if (serverMsg) return Promise.reject(new Error(serverMsg));
    return Promise.reject(error);
  }
);

export interface GetArticlesParams {
  category?: string;
  limit?: number;
  offset?: number;
}

export async function fetchArticles(params?: GetArticlesParams): Promise<ArticleEntity[]> {
  const { data } = await api.get<ApiResponse<ArticleEntity[]>>('/articles', { params });
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function fetchArticleById(
  id: string
): Promise<{ article: ArticleEntity; prev: ArticleEntity | null; next: ArticleEntity | null }> {
  const { data } = await api.get<ApiResponse<{ article: ArticleEntity; prev: ArticleEntity | null; next: ArticleEntity | null }>>(`/articles/${id}`);
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function fetchArticleStats(): Promise<{ total: number }> {
  const { data } = await api.get<ApiResponse<{ total: number }>>('/articles/stats');
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function createArticleApi(body: Record<string, unknown>): Promise<ArticleEntity> {
  const { data } = await api.post<ApiResponse<ArticleEntity>>('/articles', body);
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function updateArticleApi(id: string, body: Record<string, unknown>): Promise<ArticleEntity> {
  const { data } = await api.put<ApiResponse<ArticleEntity>>(`/articles/${id}`, body);
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function deleteArticleApi(id: string): Promise<void> {
  const { data } = await api.delete<ApiResponse<{ id: string }>>(`/articles/${id}`);
  if (!data.success) throw new Error(data.error);
}

/** draft → published 게시. unpublish=true 면 published → draft 로 내림 */
export async function publishArticleApi(id: string, unpublish = false): Promise<ArticleEntity> {
  const { data } = await api.post<ApiResponse<ArticleEntity>>(
    `/articles/${id}/publish`,
    null,
    { params: unpublish ? { unpublish: 1 } : undefined }
  );
  if (!data.success) throw new Error(data.error);
  return data.data;
}

/** 아티클 고정. unpin=true 면 고정 해제 */
export async function pinArticleApi(id: string, unpin = false): Promise<ArticleEntity> {
  const { data } = await api.post<ApiResponse<ArticleEntity>>(
    `/articles/${id}/pin`,
    null,
    { params: unpin ? { unpin: 1 } : undefined }
  );
  if (!data.success) throw new Error(data.error);
  return data.data;
}
