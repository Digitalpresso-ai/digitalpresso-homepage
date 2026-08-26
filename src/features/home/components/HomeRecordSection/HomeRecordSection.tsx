import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import styles from './HomeRecordSection.module.css';
import { RecordDemo } from './RecordDemo';

const STEP_INDEXES = [0, 1] as const;

export async function HomeRecordSection() {
  const t = await getTranslations('home.recordDemo');

  return (
    <section id="construction-record" className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <div className={styles.head}>
            <div className={styles.headText}>
              <h2 className={styles.title}>{t('title')}</h2>
              <p className={styles.desc}>{t('desc')}</p>
            </div>
            <ol className={styles.steps}>
              {STEP_INDEXES.map((i) => (
                <li key={i} className={styles.step}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepBody}>
                    <strong className={styles.stepName}>{t(`steps.${i}.name`)}</strong>
                    <span className={styles.stepDash}>-</span>
                    <span className={styles.stepDesc}>{t(`steps.${i}.desc`)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </RevealOnScroll>

        <RevealOnScroll order={1}>
          <RecordDemo />
        </RevealOnScroll>
      </div>
    </section>
  );
}
