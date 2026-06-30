import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  pinArticle,
  unpinArticle,
  getArticleById,
} from '@/backend/article/application/server-facade';
import type { ApiResponse } from '@/backend/shared/types/ApiResponse';

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/articles/[id]/pin           → 고정 (목록 최상단)
 * POST /api/articles/[id]/pin?unpin=1   → 고정 해제
 */
export async function POST(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { id } = await params;
  const unpin = req.nextUrl.searchParams.get('unpin') === '1';

  try {
    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json<ApiResponse<never>>({ success: false, error: '아티클을 찾을 수 없습니다.' }, { status: 404 });
    }

    const article = unpin
      ? await unpinArticle(id)
      : await pinArticle(id, new Date());

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
