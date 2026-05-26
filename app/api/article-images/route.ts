import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/backend/shared/db';
import { DrArticleImageRepository } from '@/backend/article-image/infrastructure/repositories/DrArticleImageRepository';
import { CreateArticleImageUsecase } from '@/backend/article-image/application/usecases/CreateArticleImageUsecase';
import type { ApiResponse } from '@/backend/shared/types/ApiResponse';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { article_id, image_url, alt, width, height, caption, sort_order } = body;

    const repo = new DrArticleImageRepository(db);
    const usecase = new CreateArticleImageUsecase(repo);
    const image = await usecase.execute({
      article_id,
      image_url,
      alt: alt ?? null,
      width: width ?? null,
      height: height ?? null,
      caption: caption ?? null,
      sort_order: sort_order ?? 0,
    });

    return NextResponse.json<ApiResponse<typeof image>>({ success: true, data: image }, { status: 201 });
  } catch (e) {
    const error = e instanceof Error ? e.message : '서버 오류';
    return NextResponse.json<ApiResponse<never>>({ success: false, error }, { status: 500 });
  }
}
