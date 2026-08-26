import { getTranslations } from 'next-intl/server';
import { ArrowRight, CloudCog, FileSearch, Handshake, UserPen } from 'lucide-react';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import styles from './HomeSupportSection.module.css';

const STEPS = ['diagnosis', 'poc', 'setup', 'training'] as const;
const STEP_ICONS = [FileSearch, Handshake, CloudCog, UserPen] as const;

function StepIcon({ index }: { index: number }) {
  const Icon = STEP_ICONS[index];
  return <Icon size={32} strokeWidth={2.5} aria-hidden="true" />;
}

function ArrowIcon() {
  return (
    <ArrowRight className={styles.arrowIcon} size={32} strokeWidth={2} aria-hidden="true" />
  );
}

export async function HomeSupportSection() {
  const t = await getTranslations('home.support');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <h2 className={styles.title}>
            {t.rich('title', {
              accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
              br: () => <br />,
              mobileBr: () => <br className={styles.mobileBreak} />,
            })}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll order={1} className={styles.flowReveal}>
          <ol className={styles.flow}>
            {STEPS.map((step, index) => (
              <li key={step} className={styles.stepItem}>
                <article className={styles.card}>
                  <div className={styles.iconBox}>
                    <StepIcon index={index} />
                  </div>
                  <div className={styles.cardCopy}>
                    <h3 className={styles.cardTitle}>{t(`steps.${step}.title`)}</h3>
                    <p className={styles.cardSubtitle}>{t(`steps.${step}.subtitle`)}</p>
                    <p className={styles.cardDesc}>{t(`steps.${step}.desc`)}</p>
                  </div>
                  <span className={`${styles.pill} ${index === 2 ? styles.pillPrimary : ''}`}>
                    {t(`steps.${step}.tag`)}
                  </span>
                </article>
                {index < STEPS.length - 1 && (
                  <span className={styles.arrowWrap}>
                    <ArrowIcon />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </RevealOnScroll>
      </div>
    </section>
  );
}
