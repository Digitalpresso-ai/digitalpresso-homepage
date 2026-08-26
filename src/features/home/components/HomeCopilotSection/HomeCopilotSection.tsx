import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import styles from './HomeCopilotSection.module.css';
import {
  AiSparkIcon,
  ArrowDownIcon,
  ClipboardCheckIcon,
  ConstructionIcon,
  FileChartPieIcon,
  HistoryIcon,
  MapPinnedIcon,
  ShieldCheckIcon,
} from './icons';

const STAGES = [0, 1, 2] as const;
const SOURCES = [0, 1, 2, 3] as const;

const STAGE_ICONS = [ClipboardCheckIcon, MapPinnedIcon, AiSparkIcon];
const SOURCE_ICONS = [ShieldCheckIcon, FileChartPieIcon, ConstructionIcon, HistoryIcon];

export async function HomeCopilotSection() {
  const t = await getTranslations('home.copilot');

  return (
    <section id="ai-copilot" className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <div className={styles.head}>
            <span className={styles.badge}>{t('badge')}</span>
            <h2 className={styles.title}>
              {t.rich('title', {
                accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
                mobileBr: () => <br className={styles.mobileBreak} />,
              })}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll order={1}>
          <div className={styles.body}>
            {/* The product collage — the section's only image. */}
            <div className={styles.shot}>
              <Image
                src="/images/main-copilot.webp"
                alt={t('imageAlt')}
                width={1584}
                height={1028}
                className={styles.shotImg}
                sizes="(max-width: 1023px) 100vw, 888px"
              />
            </div>

            <ol className={styles.stages}>
              {STAGES.map((i) => {
                const Icon = STAGE_ICONS[i];
                return (
                  <li key={i} className={styles.stageItem}>
                    <article className={styles.card}>
                      <p className={styles.cardTag}>{t(`stages.${i}.stage`)}</p>
                      <div className={styles.cardBody}>
                        <span className={styles.cardIcon}>
                          <Icon />
                        </span>
                        <div className={styles.cardText}>
                          <h3 className={styles.cardTitle}>{t(`stages.${i}.title`)}</h3>
                          <ul className={styles.bullets}>
                            {[0, 1].map((b) => (
                              <li key={b}>
                                <i className={styles.dot} aria-hidden />
                                {t(`stages.${i}.points.${b}`)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>
                    {i < 2 && (
                      <span className={styles.arrow} aria-hidden>
                        <ArrowDownIcon />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </RevealOnScroll>

        <RevealOnScroll order={2}>
          <div className={styles.sources}>
            <p className={styles.sourcesTitle}>
              <span>{t('sourcesTitle')}</span>
            </p>
            <ul className={styles.sourceCard}>
              {SOURCES.map((i) => {
                const Icon = SOURCE_ICONS[i];
                return (
                  <li key={i} className={styles.sourceItem}>
                    <span className={styles.cardIcon}>
                      <Icon />
                    </span>
                    <div className={styles.cardText}>
                      <h3 className={styles.sourceName}>{t(`sources.${i}.title`)}</h3>
                      <p className={styles.sourceDesc}>{t(`sources.${i}.desc`)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
