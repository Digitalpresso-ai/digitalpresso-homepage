'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ArticleFormData } from '@/src/features/news/types/article.types';

type ActionResult = { error: string } | { success: true };

export async function getArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, status, category, published_at, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getArticleForEdit(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function createArticle(formData: ArticleFormData): Promise<ActionResult> {
  const supabase = await createClient();

  const payload = {
    ...formData,
    published_at: formData.status === 'published' ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from('articles')
    .insert(payload)
    .select('id')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/admin/articles');
  revalidatePath('/[locale]/news', 'page');
  redirect(`/admin/articles/${data.id}/edit`);
}

export async function updateArticle(id: string, formData: ArticleFormData): Promise<ActionResult> {
  const supabase = await createClient();

  const payload = {
    ...formData,
    published_at: formData.status === 'published' ? new Date().toISOString() : null,
  };

  const { error } = await supabase
    .from('articles')
    .update(payload)
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/articles');
  revalidatePath('/[locale]/news', 'page');
  return { success: true };
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('articles').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/articles');
  revalidatePath('/[locale]/news', 'page');
  redirect('/admin/articles');
}

export async function getArticleStats() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('status, created_at');

  if (error) return { total: 0, published: 0, draft: 0 };

  const total = data.length;
  const published = data.filter((a) => a.status === 'published').length;
  const draft = data.filter((a) => a.status === 'draft').length;

  return { total, published, draft };
}
