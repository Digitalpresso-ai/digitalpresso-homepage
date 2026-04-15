// app/[locale]/terms-of-service/page.tsx

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';
import styles from './TermsOfServicePage.module.css';

interface TermsOfServiceBlock {
  type: 'articleTitle' | 'text';
  text: string;
}

interface TermsOfServicePageProps {
  params: Promise<{ locale: string }>;
}

const TERMS_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: '이용 약관 | digitalPresso',
    description:
      'digitalPresso 서비스 이용 약관과 관련된 권리, 의무, 책임 사항을 확인할 수 있습니다.',
  },
  en: {
    title: 'Terms of Service | digitalPresso',
    description:
      'Read the terms, conditions, rights, and responsibilities for using digitalPresso services.',
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

  return buildPageMetadata({
    locale: safeLocale,
    path: '/terms-of-service',
    title: content.title,
    description: content.description,
  });
}

export default async function TermsOfServicePage() {
  const t = await getTranslations('termsOfServicePage');
  const blocks = t.raw('blocks') as TermsOfServiceBlock[];

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
