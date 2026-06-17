import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/site-url';

const intlMiddleware = createIntlMiddleware(routing);

// 정식 도메인(예: digitalpresso.ai)의 호스트네임
const CANONICAL_HOST = new URL(getSiteUrl()).host;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 비정식 호스트(*.vercel.app 등)로 들어온 요청은 정식 도메인으로 301 영구 이동.
  // 과거에 색인된 vercel.app URL을 정식 도메인으로 통합하고 404 노출을 막는다.
  const host = request.headers.get('host') ?? '';
  if (host && host !== CANONICAL_HOST && host.endsWith('.vercel.app')) {
    const target = new URL(getSiteUrl());
    target.pathname = request.nextUrl.pathname;
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, 301);
  }

  // Admin 경로 인증 처리
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return response;
  }

  // i18n 처리 (일반 페이지)
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
