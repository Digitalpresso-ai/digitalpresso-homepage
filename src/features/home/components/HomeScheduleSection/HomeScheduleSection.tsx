import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import styles from './HomeScheduleSection.module.css';
import { ScheduleDemo } from './ScheduleDemo';

const STEP_INDEXES = [0, 1, 2] as const;

export async function HomeScheduleSection() {
  const t = await getTranslations('home.scheduleDemo');

  return (
    <section id="schedule-board" className={styles.section}>
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
          <ScheduleDemo />
        </RevealOnScroll>
      </div>
    </section>
  );
}
