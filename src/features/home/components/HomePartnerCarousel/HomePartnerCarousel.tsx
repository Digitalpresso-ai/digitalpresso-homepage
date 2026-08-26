import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './HomePartnerCarousel.module.css';

/* Intrinsic sizes of the trimmed assets; CSS scales them into a shared slot. */
const PARTNERS = [
  { key: 'kaia', src: '/images/partners/kaia.webp', tall: true, width: 325, height: 189 },
  { key: 'kict', src: '/images/partners/kict.webp', semiWide: true, kict: true, width: 735, height: 174 },
  { key: 'nvidia', src: '/images/partners/nvidia.webp', boxed: true, width: 451, height: 166 },
  { key: 'kova', src: '/images/partners/kova.webp', wide: true, width: 366, height: 61 },
  { key: 'kosme', src: '/images/partners/kosme.webp', stacked: true, width: 567, height: 200 },
  { key: 'betahaus', src: '/images/partners/betahaus.webp', betahaus: true, width: 808, height: 200 },
  { key: 'vertical', src: '/images/partners/vertical.webp', semiWide: true, width: 340, height: 86 },
  { key: 'corporation', src: '/images/partners/main-corporation.webp', semiWide: true, corporation: true, width: 1181, height: 314 },
  { key: 'fund', src: '/images/partners/main-fund.webp', semiWide: true, fund: true, width: 640, height: 134 },
] as const;

/* One pass of the strip is ~1370px. Repeating it keeps each half of the track
   wider than any realistic viewport, so the loop never exposes a bare stretch. */
const REPEATS = 3;

export async function HomePartnerCarousel() {
  const t = await getTranslations('home.partners');

  const strip = (copy: number) =>
    PARTNERS.map((p) => (
      <li key={`${copy}-${p.key}`} className={styles.item}>
        <Image
          src={p.src}
          alt={copy === 0 ? t(`names.${p.key}`) : ''}
          width={p.width}
          height={p.height}
          className={`${styles.logo}${'stacked' in p && p.stacked ? ` ${styles.stacked}` : ''}${'boxed' in p && p.boxed ? ` ${styles.boxed}` : ''}${'tall' in p && p.tall ? ` ${styles.tall}` : ''}${'wide' in p && p.wide ? ` ${styles.wide}` : ''}${'semiWide' in p && p.semiWide ? ` ${styles.semiWide}` : ''}${'betahaus' in p && p.betahaus ? ` ${styles.betahausLogo}` : ''}${'kict' in p && p.kict ? ` ${styles.kictLogo}` : ''}${'fund' in p && p.fund ? ` ${styles.fundLogo}` : ''}${'corporation' in p && p.corporation ? ` ${styles.corporationLogo}` : ''}`}
          sizes="240px"
        />
      </li>
    ));

  const half = (offset: number) => (
    <ul className={styles.track}>
      {Array.from({ length: REPEATS }, (_, i) => strip(offset + i))}
    </ul>
  );

  return (
    <section className={styles.section} aria-label={t('label')}>
      <div className={styles.viewport}>
        {half(0)}
        {/* Duplicate half makes the -50% shift land on an exact repeat. */}
        <div className={styles.clone} aria-hidden>
          {half(REPEATS)}
        </div>
      </div>
    </section>
  );
}
