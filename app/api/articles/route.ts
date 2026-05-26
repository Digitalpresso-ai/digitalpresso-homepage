import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  getPublishedArticles,
  createArticle,
} from '@/backend/article/application/server-facade';
import { CreateArticleSchema } from '@/backend/article/application/dtos/CreateArticleDto';
import type { ApiResponse } from '@/backend/shared/types/ApiResponse';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') ?? undefined;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
  const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : undefined;

  try {
    const articles = await getPublishedArticles({ category, limit, offset });
    return NextResponse.json<ApiResponse<typeof articles>>({ success: true, data: articles });
  } catch (e) {
    const error = e instanceof Error ? e.message : '서버 오류';
    return NextResponse.json<ApiResponse<never>>({ success: false, error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateArticleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const article = await createArticle(parsed.data);
    revalidatePath('/[locale]/news', 'page');
    return NextResponse.json<ApiResponse<typeof article>>({ success: true, data: article }, { status: 201 });
  } catch (e) {
    const error = e instanceof Error ? e.message : '서버 오류';
    return NextResponse.json<ApiResponse<never>>({ success: false, error }, { status: 500 });
  }
}
