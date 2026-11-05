// app/[locale]/privacy-policy/page.tsx

import type { Metadata } from "next";
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';
import { LegalDocument } from '@/components/legal/LegalDocument';

interface PrivacyPolicyPageProps {
  params: Promise<{ locale: string }>;
}

const PRIVACY_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "개인정보 처리방침 | digitalPresso",
    description:
      "digitalPresso의 개인정보 수집, 이용, 보관, 보호 조치 및 정보주체 권리에 대한 정책입니다.",
  },
  en: {
    title: "Privacy Policy | digitalPresso",
    description:
      "Review digitalPresso's policy on personal data collection, use, retention, protection measures, and user rights.",
  },
  zh: {
    title: "隐私政策 | digitalPresso",
    description:
      "本政策涉及digitalPresso对个人信息的收集、使用、保存、保护措施以及信息主体的权利。",
  },
  ja: {
    title: "プライバシーポリシー | digitalPresso",
    description:
      "digitalPressoにおける個人情報の収集、利用、保管、保護措置、および情報主体の権利に関する方針です。",
  },
};

export async function generateMetadata({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : "ko";
  const content = PRIVACY_META[safeLocale];

  return {
    ...buildPageMetadata({
      locale: safeLocale,
      path: "/privacy-policy",
      title: content.title,
      description: content.description,
    }),
    // 루트 레이아웃의 title.template이 사이트명을 한 번 더 붙이지 않도록 고정한다.
    title: { absolute: content.title },
  };
}

export default function PrivacyPolicyPage() {
  return <LegalDocument document="privacy" />;
}
