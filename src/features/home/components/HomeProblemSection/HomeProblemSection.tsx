import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './HomeProblemSection.module.css';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import {
  ArrowRightIcon,
  ClockArrowDownIcon,
  ConstructionIcon,
  FileXIcon,
  FolderOpenIcon,
} from './icons';

const STEP_ICONS = [ConstructionIcon, FileXIcon, FolderOpenIcon, ClockArrowDownIcon];
const STEP_INDEXES = [0, 1, 2, 3] as const;
const BULLET_INDEXES = [0, 1, 2] as const;

const PHOTOS = [
  {
    src: '/images/main-problem1.webp',
    blur: 'data:image/webp;base64,UklGRpQAAABXRUJQVlA4WAoAAAAQAAAADwAACQAAQUxQSBMAAAABD/D+/4iIIBZM8pfeG0JE/7MBAFZQOCBaAAAAMAIAnQEqEAAKAAOAWiWMAnQGLLWvqkjVW8AA/uoA1BF5xVKowpRAUt/ub4IC2wdCCmzPqVsdCo25psbNRvFjGfmxH5q3PVEbEak6oQcO+s3UgD9p1F8edEAA',
  },
  {
    src: '/images/main-problem2.webp',
    blur: 'data:image/webp;base64,UklGRpIAAABXRUJQVlA4WAoAAAAQAAAADwAACQAAQUxQSBYAAAABF3D//4iIgSDb5pKVnOkNIvqfsLsKVlA4IFYAAAAQAgCdASoQAAoAA4BaJZQCw7EYBfPOhcXQAP68Zgy7efD8iDMfrhxbih5oa0GELvP5gZreWrEp05Jfwo8a2FxQHU4t0HJW+ytjWQKNmJZTMBlL2SQAAA==',
  },
] as const;

export async function HomeProblemSection() {
  const t = await getTranslations('home.problem');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <h2 className={styles.heading}>
            <span className={styles.headingLine}>{t('headingLine1')}</span>
            <span className={styles.headingLine}>
              <em className={styles.highlight}>{t('headingHighlight')}</em>
              {t('headingLine2Post')}
            </span>
          </h2>
        </RevealOnScroll>

        <ol className={styles.steps}>
          {STEP_INDEXES.map((i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={i} className={styles.stepItem}>
                <RevealOnScroll order={i + 1} className={styles.stepReveal}>
                  <div className={styles.stepCard}>
                    <span className={styles.iconBox}>
                      <Icon />
                    </span>
                    <span className={styles.stepText}>
                      <strong className={styles.stepTitle}>{t(`steps.${i}.0`)}</strong>
                      <span className={styles.stepDesc}>{t(`steps.${i}.1`)}</span>
                    </span>
                  </div>
                </RevealOnScroll>
                {i < STEP_INDEXES.length - 1 && (
                  <span className={styles.arrow} aria-hidden>
                    <ArrowRightIcon />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <div className={styles.cards}>
          {PHOTOS.map((photo, i) => (
            <RevealOnScroll key={photo.src} order={i + 5} className={styles.cardReveal}>
              <article className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src={photo.src}
                    alt={t(`cards.${i}.imageAlt`)}
                    fill
                    sizes="(max-width: 799px) 100vw, 628px"
                    placeholder="blur"
                    blurDataURL={photo.blur}
                    className={styles.photo}
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{t(`cards.${i}.title`)}</h3>
                  <p className={styles.cardDesc}>{t(`cards.${i}.desc`)}</p>
                  <hr className={styles.divider} />
                  <ul className={styles.bullets}>
                    {BULLET_INDEXES.map((b) => (
                      <li key={b} className={styles.bullet}>
                        <span className={styles.dot} aria-hidden />
                        <span className={styles.bulletText}>
                          {t.rich(`cards.${i}.bullets.${b}`, {
                            br: () => <br className={styles.mobileBreak} />,
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
