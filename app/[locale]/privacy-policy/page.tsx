// app/[locale]/privacy-policy/page.tsx

import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';
import styles from './PrivacyPolicyPage.module.css';

interface PrivacyPolicyBlock {
  type: 'articleTitle' | 'text';
  text: string;
}

interface PrivacyPolicyPageProps {
  params: Promise<{ locale: string }>;
}

const PRIVACY_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "개인정보처리방침 | digitalPresso",
    description:
      "digitalPresso의 개인정보 수집, 이용, 보관, 보호 조치 및 정보주체 권리에 대한 정책입니다.",
  },
  en: {
    title: "Privacy Policy | digitalPresso",
    description:
      "Review digitalPresso's policy on personal data collection, use, retention, protection measures, and user rights.",
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

  return buildPageMetadata({
    locale: safeLocale,
    path: "/privacy-policy",
    title: content.title,
    description: content.description,
  });
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacyPolicyPage');
  const blocks = t.raw('blocks') as PrivacyPolicyBlock[];

  return (
    <main>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>{t('title')}</h2>
          </div>
          <div className={styles.body}>
            {blocks.map((block, index) => (
              <p
                key={`${block.type}-${index}`}
                className={block.type === 'articleTitle' ? styles.articleTitle : undefined}
              >
                {block.text}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
