import { NextResponse } from 'next/server';
import { getArticleStats } from '@/backend/article/application/server-facade';
import type { ApiResponse } from '@/backend/shared/types/ApiResponse';

export async function GET() {
  try {
    const stats = await getArticleStats();
    return NextResponse.json<ApiResponse<typeof stats>>({ success: true, data: stats });
  } catch (e) {
    const error = e instanceof Error ? e.message : '서버 오류';
    return NextResponse.json<ApiResponse<never>>({ success: false, error }, { status: 500 });
  }
}
