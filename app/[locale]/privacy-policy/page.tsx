// app/[locale]/privacy-policy/page.tsx

import { getTranslations } from 'next-intl/server';
import styles from './PrivacyPolicyPage.module.css';

interface PrivacyPolicyBlock {
  type: 'articleTitle' | 'text';
  text: string;
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
