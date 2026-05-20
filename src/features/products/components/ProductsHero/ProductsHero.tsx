// src/features/products/components/ProductsHero/ProductsHero.tsx

import { getTranslations } from 'next-intl/server';
import styles from './ProductsHero.module.css';

export async function ProductsHero() {
  const t = await getTranslations('productsPage.hub');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>{t('eyebrow')}</span>
        <h1 className={styles.heading}>{t('heading')}</h1>
        <p className={styles.body}>{t('body')}</p>
      </div>
    </section>
  );
}
