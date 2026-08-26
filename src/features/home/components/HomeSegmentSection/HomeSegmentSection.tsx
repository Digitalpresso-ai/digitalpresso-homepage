import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import { ProductLogo } from '@/src/components/product/ProductLogo';
import styles from './HomeSegmentSection.module.css';
import {
  ConstructionIcon,
  FactoryIcon,
  FerrisWheelIcon,
  FileCheckIcon,
  FireExtinguisherIcon,
  RadioTowerIcon,
  TrafficConeIcon,
  WrenchIcon,
  ZapIcon,
} from './icons';

const LEFT = [0, 1, 2, 3] as const;
const RIGHT = [0, 1, 2, 3, 4] as const;

const LEFT_ICONS = [FactoryIcon, WrenchIcon, FireExtinguisherIcon, RadioTowerIcon];
const RIGHT_ICONS = [
  ConstructionIcon,
  TrafficConeIcon,
  FileCheckIcon,
  FerrisWheelIcon,
  ZapIcon,
];

/* How far each card sits back from the hub. The left column bows like "(" and
   the right column bows like ")" so the pair cradles the circle. */
const LEFT_INSET = [0, 48, 48, 0];
const RIGHT_INSET = [0, 48, 96, 48, 0];

const ORBIT_NODES = [
  { cx: 83, cy: 45 },
  { cx: 20, cy: 135 },
  { cx: 20, cy: 225 },
  { cx: 83, cy: 315 },
  { cx: 251, cy: 30 },
  { cx: 328, cy: 105 },
  { cx: 346, cy: 180 },
  { cx: 328, cy: 255 },
  { cx: 251, cy: 330 },
];

export async function HomeSegmentSection() {
  const t = await getTranslations('home.segments');

  return (
    <section id="segments" className={styles.section}>
      <div className={styles.blobs} aria-hidden>
        <span className={styles.blob} style={{ left: '3%', top: '12%', width: 180, height: 180 }} />
        <span className={styles.blob} style={{ left: '10%', bottom: '6%', width: 100, height: 100 }} />
        <span className={styles.blob} style={{ right: '4%', top: '15%', width: 83, height: 83 }} />
        <span className={styles.blob} style={{ right: '2%', bottom: '10%', width: 137, height: 137 }} />
      </div>

      <div className={styles.inner}>
        <RevealOnScroll>
          <h2 className={styles.title}>
            {t('title')}
            <br />
            <strong className={styles.accent}>{t('titleAccent')}</strong>
            {t('titleTail')}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll order={1}>
          <div className={styles.body}>
            {/* ─── Left column ─── */}
            <ul className={styles.colLeft}>
              {LEFT.map((i) => {
                const Icon = LEFT_ICONS[i];
                return (
                  <li
                    key={i}
                    className={styles.row}
                    style={{ '--inset': `${LEFT_INSET[i]}px` } as React.CSSProperties}
                  >
                    <article className={styles.card}>
                      <span className={styles.cardIcon}>
                        <Icon />
                      </span>
                      <div className={styles.cardText}>
                        <h3 className={styles.cardTitle}>{t(`left.${i}.title`)}</h3>
                        <p className={styles.cardDesc}>{t(`left.${i}.desc`)}</p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>

            {/* ─── Centre hub ─── */}
            <div className={styles.hub}>
              <svg className={styles.rings} viewBox="0 0 360 360" aria-hidden>
                <defs>
                  {/* The ring runs deep navy at the top into teal at the
                      bottom, the way the design's sweep reads. */}
                  <linearGradient id="segRing" x1="0.55" y1="0" x2="0.35" y2="1">
                    <stop offset="0%" stopColor="#3f4d8f" />
                    <stop offset="45%" stopColor="#41689f" />
                    <stop offset="100%" stopColor="#74c1cd" />
                  </linearGradient>
                  {/* The inner arc turns teal sooner, so the pair reads as one
                      spiral rather than two matching circles. */}
                  <linearGradient id="segRingB" x1="0.35" y1="0" x2="0.6" y2="1">
                    <stop offset="0%" stopColor="#48588f" />
                    <stop offset="35%" stopColor="#4d84ad" />
                    <stop offset="100%" stopColor="#8fd0d8" />
                  </linearGradient>
                </defs>

                {/* Outer dotted orbit */}
                <circle cx={180} cy={180} r={166} className={styles.orbit} />
                {ORBIT_NODES.map((node, i) => (
                  <circle
                    key={i}
                    cx={node.cx}
                    cy={node.cy}
                    r={5}
                    className={styles.node}
                  />
                ))}

                {/* Two heavy arcs, offset from each other so they read as one
                    continuous spiral rather than concentric circles. */}
                <circle cx={180} cy={180} r={134} className={styles.ringA} />
                <circle cx={180} cy={180} r={125} className={styles.ringB} />
              </svg>

              <div className={styles.hubText}>
                <ProductLogo className={styles.hubLogo} />
                <p className={styles.hubTitle}>{t('hub.title')}</p>
                <p className={styles.hubDesc}>{t('hub.desc')}</p>
                <hr className={styles.hubRule} />
                <p className={styles.hubFlow}>{t('hub.flow')}</p>
              </div>
            </div>

            {/* ─── Right column ─── */}
            <ul className={styles.colRight}>
              {RIGHT.map((i) => {
                const Icon = RIGHT_ICONS[i];
                return (
                  <li
                    key={i}
                    className={styles.row}
                    style={{ '--inset': `${RIGHT_INSET[i]}px` } as React.CSSProperties}
                  >
                    <article className={styles.card}>
                      <span className={styles.cardIcon}>
                        <Icon />
                      </span>
                      <div className={styles.cardText}>
                        <h3 className={styles.cardTitle}>{t(`right.${i}.title`)}</h3>
                        <p className={styles.cardDesc}>{t(`right.${i}.desc`)}</p>
                      </div>
                    </article>
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
