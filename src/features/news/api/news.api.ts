import { createClient } from '@/lib/supabase/server';
import type { ArticleEntity } from '../types/article.types';

export async function getPublishedArticles(): Promise<ArticleEntity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getArticleById(id: string): Promise<ArticleEntity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getAdjacentArticles(
  currentId: string
): Promise<{ prev: ArticleEntity | null; next: ArticleEntity | null }> {
  const current = await getArticleById(currentId);
  if (!current) return { prev: null, next: null };

  const supabase = await createClient();

  const [olderResult, newerResult] = await Promise.all([
    supabase
      .from('articles')
      .select('*')
      .eq('category', current.category)
      .lt('created_at', current.created_at)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('articles')
      .select('*')
      .eq('category', current.category)
      .gt('created_at', current.created_at)
      .order('created_at', { ascending: true })
      .limit(1)
      .single(),
  ]);

  return {
    prev: olderResult.data ?? null,
    next: newerResult.data ?? null,
  };
}
