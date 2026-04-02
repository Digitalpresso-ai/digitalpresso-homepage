'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ArticleFormData } from '@/src/features/news/types/article.types';

type ActionResult = { error: string } | { success: true };
type CreateResult = { error: string } | { success: true; id: string };

export async function getArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, created_at, cover_img_url')
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

export async function createArticleShell(title: string): Promise<CreateResult> {
  const supabase = await createClient();
  const payload = {
    title,
    content: '',
    cover_img_url: null,
  };

  const { data, error } = await supabase
    .from('articles')
    .insert(payload)
    .select('id')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/admin/articles');
  revalidatePath('/[locale]/news', 'page');
  return { success: true, id: data.id };
}

export async function updateArticle(id: string, formData: ArticleFormData): Promise<ActionResult> {
  const supabase = await createClient();
  const payload = {
    ...formData,
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
    .select('id');

  if (error) return { total: 0 };

  const total = data.length;
  return { total };
}
