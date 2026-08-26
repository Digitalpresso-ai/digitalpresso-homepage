import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './HomeHero.module.css';

const TAG_KEYS = [0, 1, 2, 3] as const;

const BADGES = [
  { src: '/images/main-hero-badge1.webp', altKey: 'badge1Alt', width: 241, height: 240 },
  { src: '/images/main-hero-badge2.webp', altKey: 'badge2Alt', width: 246, height: 240 },
  { src: '/images/main-hero-badge3.webp', altKey: 'badge3Alt', width: 291, height: 240 },
] as const;

export async function HomeHero() {
  const t = await getTranslations('home.hero');
  const tags = TAG_KEYS.map((i) => t(`tags.${i}`));
  const [headingLead, ...headingRest] = t('heading').split('\n');

  return (
    <section className={styles.section}>
      <Image
        src="/images/main-hero-2560.webp"
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={82}
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAAAQBACdASoUAAoAPu1orU2ppqSiMAgBMB2JbACdMoADRzNGk73s6RzAAAD+uV9wFE9wCrtDVmnKsXHxkur2h+oCsoqv9we5je6fQrzX00NXOwkQGSGv0q228NAp7foZpVtCI3zayktgudpvtP0ufpSocrA5Jf8mf2cmKj+vJ4byl9jYNKQk1aPQ2KEbTL1OAAA="
        className={styles.bg}
      />
      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            <span className={styles.headingRow}>
              <Image
                src="/images/main-hero-logo.svg"
                alt={t('logoAlt')}
                width={281}
                height={76}
                priority
                className={styles.logo}
              />
              <span>{headingLead}</span>
            </span>
            {headingRest.map((line) => (
              <span key={line} className={styles.headingRow}>
                {line}
              </span>
            ))}
          </h1>

          <p className={styles.body}>{t('body')}</p>

          <div className={styles.tagRow}>
            {[tags.slice(0, 2), tags.slice(2)].map((line) => (
              <ul key={line.join()} className={styles.tagRowLine}>
                {line.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            ))}
          </div>

          <div className={styles.badgePill}>
            {BADGES.map((badge, i) => (
              <div key={badge.src} className={styles.badgeItem}>
                {i > 0 && <span className={styles.badgeDivider} aria-hidden />}
                <Image
                  src={badge.src}
                  alt={t(badge.altKey)}
                  width={badge.width}
                  height={badge.height}
                  className={styles.badgeImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
