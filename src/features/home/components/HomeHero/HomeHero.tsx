import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import TrackedLink from '@/components/analytics/TrackedLink';
import styles from './HomeHero.module.css';

interface HeroShot {
  src: string;
  altKey: 'glassesAlt' | 'detectionAlt' | 'reportAlt';
  width: number;
  height: number;
  /** Per-shot layout slot (Figma 1920 frame: 548 / 497 / 558px wide). */
  className: string;
}

const EN_GLASSES: HeroShot = { src: '/images/main-hero-english1.webp', altKey: 'glassesAlt', width: 1200, height: 901, className: styles.shotGlasses };
const EN_DETECTION: HeroShot = { src: '/images/main-hero-english2.webp', altKey: 'detectionAlt', width: 1200, height: 1039, className: styles.shotDetection };
const EN_REPORT: HeroShot = { src: '/images/main-hero-english3.webp', altKey: 'reportAlt', width: 1200, height: 826, className: styles.shotReport };

// 이미지 속 문구가 번역되지 않으므로 영어 페이지는 영문 캡처를,
// 한국어·일본어·중국어 페이지는 한국어 캡처를 보여준다.
const EN_SHOTS: HeroShot[] = [EN_GLASSES, EN_DETECTION, EN_REPORT];

// 한국어 캡처는 영문 캡처와 같은 캔버스 크기·카드 위치로 맞춰 변환해 둔다.
const KO_SHOTS: HeroShot[] = [
  { src: '/images/main-hero-korea1.webp', altKey: 'glassesAlt', width: 1200, height: 901, className: styles.shotGlasses },
  { src: '/images/main-hero-korea2.webp', altKey: 'detectionAlt', width: 1200, height: 1039, className: styles.shotDetection },
  { src: '/images/main-hero-korea3.webp', altKey: 'reportAlt', width: 1200, height: 826, className: styles.shotReport },
];

export async function HomeHero() {
  const t = await getTranslations('home.hero');
  const locale = await getLocale();
  const shots = locale === 'en' ? EN_SHOTS : KO_SHOTS;
  const isKorean = locale === 'ko';

  return (
    <section className={styles.section}>
      <div className={styles.bgLayer} aria-hidden>
        <Image
          src="/images/main-hero-city.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={80}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwBACdASoUAAwAPu1iqU2ppaQiMAgBMB2JZgCdMoAC8ge/2ga7IFu6FkAA/rncm/1WNtK4KdGFCN/6r9XexSD/xv62+ILy0zk4n87465BUblgxrAA="
          className={styles.bg}
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.heading}>
          <span className={styles.headingRow}>
            {isKorean ? (
              // Figma: 281x76 logo slot; the SVG carries its own drop shadow,
              // so it is drawn larger (303x98) and pulled back into the slot.
              <Image
                src="/images/logos/renamedp-logo-kor-white.svg"
                alt={t('logoAlt')}
                width={303}
                height={98}
                priority
                className={styles.logoKo}
              />
            ) : (
              <Image
                src="/images/renamedp-logo-eng-white.png"
                alt={t('logoAlt')}
                width={960}
                height={236}
                priority
                className={styles.logoEn}
              />
            )}
            <span className={styles.cyan}>{t('headingRow1')}</span>
          </span>
          <span className={styles.headingRow}>
            <span>
              <span className={styles.cyan}>{t('headingRow2Lead')}</span>
              <span className={styles.gold}>{t('headingRow2Accent')}</span>
              <span className={styles.cyan}>{t('headingRow2Tail')}</span>
            </span>
          </span>
        </h1>

        <p className={styles.body}>{t('body')}</p>

        <TrackedLink href="/contact" location="home_hero" className={styles.cta}>
          {t('cta')}
        </TrackedLink>
      </div>

      <div className={styles.shots}>
        {shots.map((shot) => (
          <Image
            key={shot.src}
            src={shot.src}
            alt={t(`shots.${shot.altKey}`)}
            width={shot.width}
            height={shot.height}
            loading="eager"
            quality={80}
            sizes="(max-width: 1920px) 29vw, 560px"
            className={`${styles.shot} ${shot.className}`}
          />
        ))}
      </div>
    </section>
  );
}
