// app/[locale]/terms-of-service/page.tsx

import type { Metadata } from 'next';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';
import { LegalDocument } from '@/components/legal/LegalDocument';

interface TermsOfServicePageProps {
  params: Promise<{ locale: string }>;
}

const TERMS_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: '이용약관 | digitalPresso',
    description:
      'digitalPresso 서비스 이용 약관과 관련된 권리, 의무, 책임 사항을 확인할 수 있습니다.',
  },
  en: {
    title: 'Terms of Service | digitalPresso',
    description:
      'Read the terms, conditions, rights, and responsibilities for using digitalPresso services.',
  },
  zh: {
    title: '使用条款 | digitalPresso',
    description:
      '您可以查阅与digitalPresso服务使用条款相关的权利、义务及责任事项。',
  },
  ja: {
    title: '利用規約 | digitalPresso',
    description:
      'digitalPressoサービス利用に関する条件、権利、義務、責任事項をご確認いただけます。',
  },
};

export async function generateMetadata({
  params,
}: TermsOfServicePageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : 'ko';
  const content = TERMS_META[safeLocale];

  return {
    ...buildPageMetadata({
      locale: safeLocale,
      path: '/terms-of-service',
      title: content.title,
      description: content.description,
    }),
    // 루트 레이아웃의 title.template이 사이트명을 한 번 더 붙이지 않도록 고정한다.
    title: { absolute: content.title },
  };
}

export default function TermsOfServicePage() {
  return <LegalDocument document="terms" />;
}
