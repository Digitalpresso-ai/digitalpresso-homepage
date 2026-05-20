// src/features/products/components/ProductsGrid/ProductsGrid.tsx

import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import styles from './ProductsGrid.module.css';

const PRODUCTS = [
  { key: 'manufacturing', href: '/products/manufacturing' },
] as const;

export async function ProductsGrid() {
  const t = await getTranslations('productsPage.hub.items');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <ul className={styles.grid}>
          {PRODUCTS.map(({ key, href }) => (
            <li key={key} className={styles.card}>
              <span className={styles.label}>{t(`${key}.label`)}</span>
              <h2 className={styles.title}>{t(`${key}.title`)}</h2>
              <p className={styles.description}>{t(`${key}.description`)}</p>
              <Link href={href} className={styles.cta}>
                {t(`${key}.cta`)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
