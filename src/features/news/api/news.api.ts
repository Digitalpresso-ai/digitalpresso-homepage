import { createClient } from '@/lib/supabase/server';
import type { ArticleEntity } from '../types/article.types';

export async function getPublishedArticles(): Promise<ArticleEntity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<ArticleEntity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data;
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
