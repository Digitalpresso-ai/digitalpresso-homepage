import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  publishArticle,
  unpublishArticle,
  getArticleById,
} from '@/backend/article/application/server-facade';
import type { ApiResponse } from '@/backend/shared/types/ApiResponse';

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/articles/[id]/publish        → draft 를 게시(published)
 * POST /api/articles/[id]/publish?unpublish=1 → 게시된 글을 임시저장으로 내림
 */
export async function POST(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { id } = await params;
  const unpublish = req.nextUrl.searchParams.get('unpublish') === '1';

  try {
    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json<ApiResponse<never>>({ success: false, error: '아티클을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 게시 전 최소 검증: 제목/본문/대표 이미지가 있어야 게시 가능
    if (!unpublish) {
      if (!existing.title?.trim()) {
        return NextResponse.json<ApiResponse<never>>({ success: false, error: '제목이 없어 게시할 수 없습니다.' }, { status: 400 });
      }
      if (!existing.content?.trim() || existing.content === '<p></p>') {
        return NextResponse.json<ApiResponse<never>>({ success: false, error: '본문이 없어 게시할 수 없습니다.' }, { status: 400 });
      }
      if (!existing.cover_img_url?.trim()) {
        return NextResponse.json<ApiResponse<never>>({ success: false, error: '대표 이미지가 없어 게시할 수 없습니다.' }, { status: 400 });
      }
    }

    const article = unpublish
      ? await unpublishArticle(id)
      : await publishArticle(id, new Date());

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
