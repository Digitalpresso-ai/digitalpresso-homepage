import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import styles from './HomePlatformSection.module.css';
import { BotIcon, BrainCogIcon, EyeIcon } from './icons';

const DEVICES = [
  { src: '/images/main-glass.png', width: 231, height: 141, className: 'glass' },
  { src: '/images/main-device.png', width: 93, height: 213, className: 'mobile' },
] as const;

const SOURCE_INDEXES = [0, 1, 2, 3, 4] as const;
const CENTER_ICONS = [BrainCogIcon, EyeIcon, BotIcon];
const GROUP_SIZES = [5, 6] as const;

export async function HomePlatformSection() {
  const t = await getTranslations('home.platform');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <h2 className={styles.heading}>
            <span className={styles.headingLine}>
              {t('h1a')}
              <em className={styles.highlight}>{t('h1b')}</em>
            </span>
            <span className={styles.headingLine}>
              {t('h2a')}
              <em className={styles.highlight}>{t('h2b')}</em>
              {t('h2c')}
            </span>
          </h2>
        </RevealOnScroll>

        <div className={styles.columns}>
          {/* ─── Left: where field data comes from ─── */}
          <RevealOnScroll order={1} className={styles.columnReveal}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{t('left.title')}</h3>
                <p className={styles.cardDesc}>{t('left.desc')}</p>
              </div>

              <ul className={styles.devices}>
                {DEVICES.map((device, i) => (
                  <li key={device.src} className={styles.device}>
                    <span className={styles.deviceCircle}>
                      <Image
                        src={device.src}
                        alt={t(`left.devices.${i}.alt`)}
                        width={device.width}
                        height={device.height}
                        className={styles[device.className]}
                      />
                    </span>
                    <span className={styles.deviceLabel}>{t(`left.devices.${i}.label`)}</span>
                  </li>
                ))}
              </ul>

              <hr className={styles.divider} />

              <ul className={styles.chips}>
                {SOURCE_INDEXES.map((i) => (
                  <li key={i} className={styles.chip}>
                    {t(`left.items.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          {/* ─── Center: the AI itself ─── */}
          <RevealOnScroll order={2} className={styles.centerReveal}>
            <div className={styles.center}>
              <div className={styles.centerHead}>
                <p className={styles.brand}>
                  <Image
                    src="/images/main-color-logo.svg"
                    alt={t('center.logoAlt')}
                    width={134}
                    height={36}
                    className={styles.brandLogo}
                  />
                  <span className={styles.brandSuffix}>{t('center.suffix')}</span>
                </p>
                <p className={styles.flow}>
                  {t.rich('center.flow', { br: () => <br className={styles.mobileBreak} /> })}
                </p>
              </div>

              <div className={styles.orbit}>
                <span className={styles.ring} aria-hidden />
                <ul className={styles.centerCards}>
                  {CENTER_ICONS.map((Icon, i) => (
                    <li key={i} className={`${styles.centerCard} ${styles[`centerCard${i}`]}`}>
                      <span className={styles.iconBox}>
                        <Icon />
                      </span>
                      <span className={styles.centerText}>
                        <strong className={styles.centerTitle}>{t(`center.cards.${i}.title`)}</strong>
                        <span className={styles.centerDesc}>{t(`center.cards.${i}.desc`)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealOnScroll>

          {/* ─── Right: what comes out of it ─── */}
          <RevealOnScroll order={3} className={styles.columnReveal}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{t('right.title')}</h3>
              </div>
              <hr className={styles.divider} />

              {GROUP_SIZES.map((size, g) => (
                <div key={g} className={styles.group}>
                  {g > 0 && <hr className={styles.divider} />}
                  <h4 className={styles.groupTitle}>{t(`right.groups.${g}.title`)}</h4>
                  <ul className={styles.bullets}>
                    {Array.from({ length: size }, (_, b) => (
                      <li key={b} className={styles.bullet}>
                        <span className={styles.dot} aria-hidden />
                        {t(`right.groups.${g}.items.${b}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
