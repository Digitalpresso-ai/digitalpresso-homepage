import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArticleApi, updateArticleApi, deleteArticleApi, publishArticleApi, pinArticleApi } from '@/src/lib/api/articles.api';

export function useCreateArticle() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => createArticleApi(body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useUpdateArticle() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      updateArticleApi(id, body),
    onSuccess: (_, { id }) => {
      client.invalidateQueries({ queryKey: ['articles'] });
      client.invalidateQueries({ queryKey: ['article', id] });
    },
  });
}

export function useDeleteArticle() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteArticleApi(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function usePublishArticle() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, unpublish }: { id: string; unpublish?: boolean }) =>
      publishArticleApi(id, unpublish),
    onSuccess: (_, { id }) => {
      client.invalidateQueries({ queryKey: ['articles'] });
      client.invalidateQueries({ queryKey: ['article', id] });
    },
  });
}

export function usePinArticle() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, unpin }: { id: string; unpin?: boolean }) =>
      pinArticleApi(id, unpin),
    onSuccess: (_, { id }) => {
      client.invalidateQueries({ queryKey: ['articles'] });
      client.invalidateQueries({ queryKey: ['article', id] });
    },
  });
}
