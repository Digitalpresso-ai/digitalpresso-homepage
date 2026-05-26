import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  getArticleById,
  getAdjacentArticles,
  updateArticle,
  deleteArticle,
} from '@/backend/article/application/server-facade';
import { UpdateArticleSchema } from '@/backend/article/application/dtos/UpdateArticleDto';
import type { ApiResponse } from '@/backend/shared/types/ApiResponse';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const [article, adjacent] = await Promise.all([
      getArticleById(id),
      getAdjacentArticles(id),
    ]);
    if (!article) {
      return NextResponse.json<ApiResponse<never>>({ success: false, error: '아티클을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json<ApiResponse<{ article: typeof article; prev: typeof adjacent.prev; next: typeof adjacent.next }>>({
      success: true,
      data: { article, ...adjacent },
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : '서버 오류';
    return NextResponse.json<ApiResponse<never>>({ success: false, error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = UpdateArticleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const article = await updateArticle(id, parsed.data);
    if (!article) {
      return NextResponse.json<ApiResponse<never>>({ success: false, error: '아티클을 찾을 수 없습니다.' }, { status: 404 });
    }

    revalidatePath('/[locale]/news', 'page');
    return NextResponse.json<ApiResponse<typeof article>>({ success: true, data: article });
  } catch (e) {
    const error = e instanceof Error ? e.message : '서버 오류';
    return NextResponse.json<ApiResponse<never>>({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const deleted = await deleteArticle(id);
    if (!deleted) {
      return NextResponse.json<ApiResponse<never>>({ success: false, error: '아티클을 찾을 수 없습니다.' }, { status: 404 });
    }

    revalidatePath('/[locale]/news', 'page');
    return NextResponse.json<ApiResponse<{ id: string }>>({ success: true, data: { id } });
  } catch (e) {
    const error = e instanceof Error ? e.message : '서버 오류';
    return NextResponse.json<ApiResponse<never>>({ success: false, error }, { status: 500 });
  }
}
