import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArticleApi, updateArticleApi, deleteArticleApi } from '@/src/lib/api/articles.api';

export function useCreateArticle() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => createArticleApi(body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useUpdateArticle(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => updateArticleApi(id, body),
    onSuccess: () => {
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
