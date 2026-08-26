import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import styles from './HomeTalkSection.module.css';
import { TalkDemo } from './TalkDemo';

const STEP_INDEXES = [0, 1, 2] as const;

export async function HomeTalkSection() {
  const t = await getTranslations('home.talkDemo');

  return (
    <section id="field-talk" className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <div className={styles.head}>
            <div className={styles.headText}>
              <h2 className={styles.title}>
                {t('titleLead')}{' '}
                <Image
                  src="/images/main-sigongtalk-logo-sm.png"
                  alt={t('titleMark')}
                  width={260}
                  height={111}
                  sizes="120px"
                  className={styles.titleLogo}
                />
              </h2>
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
          <TalkDemo />
        </RevealOnScroll>
      </div>
    </section>
  );
}
