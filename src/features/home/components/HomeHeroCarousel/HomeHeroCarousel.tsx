// src/features/home/components/HomeHeroCarousel/HomeHeroCarousel.tsx

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  GOLD_GRADIENT,
  HERO_CAROUSEL_AUTOPLAY_MS,
  HERO_CAROUSEL_SLIDES,
  type HeroCarouselSegmentStyle,
  type HeroCarouselSlide,
} from './slides';
import styles from './HomeHeroCarousel.module.css';

const SLIDE_TRANSITION_MS = 500;

function SlideContent({ slide, t }: { slide: HeroCarouselSlide; t: (key: string) => string }) {
  const slideT = (path: string) => t(`slides.${slide.key}.${path}`);

  const segmentClassName = (style: HeroCarouselSegmentStyle) =>
    style === 'plain' ? undefined : styles.accent;

  const segmentGradient = (style: HeroCarouselSegmentStyle) =>
    style === 'accent' ? slide.accentGradient : style === 'gold' ? GOLD_GRADIENT : undefined;

  return (
    <>
      <div className={styles.bgLayer} aria-hidden>
        <Image
          src={slide.bg.src}
          alt=""
          fill
          sizes="100vw"
          quality={82}
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.logoRow} aria-label={slideT('logoAlt')}>
            <Image
              src={slide.partnerLogo.src}
              alt=""
              width={slide.partnerLogo.width}
              height={slide.partnerLogo.height}
              className={styles.logo}
            />
            <span className={styles.logoDivider} aria-hidden />
            <Image
              src={slide.brandLogo.src}
              alt=""
              width={slide.brandLogo.width}
              height={slide.brandLogo.height}
              className={styles.logo}
            />
          </div>

          <h2 className={styles.heading}>
            {slide.headingLines.map((line, lineIndex) => (
              <span className={styles.headingRow} key={lineIndex}>
                {line
                  .map((segment) => ({ segment, text: slideT(segment.textKey) }))
                  .filter(({ text }) => text.length > 0)
                  .map(({ segment, text }) => (
                    <span
                      key={segment.textKey}
                      className={segmentClassName(segment.style)}
                      style={{ backgroundImage: segmentGradient(segment.style) }}
                    >
                      {text}
                    </span>
                  ))}
              </span>
            ))}
          </h2>

          {slide.hasSubtext && (
            <p className={styles.subtext}>{slideT('subtext')}</p>
          )}

          <Link className={styles.button} href={slide.href}>
            <span>{slideT('button')}</span>
            <ArrowRight size={36} strokeWidth={2.2} aria-hidden="true" className={styles.buttonIcon} />
          </Link>
        </div>
      </div>
    </>
  );
}

export function HomeHeroCarousel() {
  const t = useTranslations('home.heroCarousel');
  const [index, setIndex] = useState(0);
  const slideCount = HERO_CAROUSEL_SLIDES.length;
  // A single long-lived interval plus a paused flag — rather than repeatedly
  // clearInterval/setInterval on every hover in/out or manual nav click —
  // keeps the 10s cadence exact and avoids interval-churn edge cases where
  // a rapid pause/resume sequence (e.g. a pointer sweeping over the section
  // on its way to a nav button) could otherwise let a tick fire early.
  const pausedRef = useRef(false);

  // Track slot holds one extra slide on each side of the visible one (prev /
  // current / next) so a page-turn slide can animate the whole strip with a
  // single transform, then snap back without a transition once the move
  // lands — the classic "infinite" 3-slide-track trick.
  const [trackOffset, setTrackOffset] = useState<-1 | 0 | 1>(0);
  const isAnimatingRef = useRef(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (slideCount <= 1) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      goToDirection(1);
    }, HERO_CAROUSEL_AUTOPLAY_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideCount]);

  useEffect(() => clearAnimationTimeout, []);

  function clearAnimationTimeout() {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }

  const goToDirection = useCallback((direction: 1 | -1) => {
    if (isAnimatingRef.current) return; // ignore input mid-transition
    isAnimatingRef.current = true;
    setTrackOffset(direction);
    clearAnimationTimeout();
    animationTimeoutRef.current = setTimeout(() => {
      setIndex((i) => ((i + direction) % slideCount + slideCount) % slideCount);
      setTrackOffset(0);
      isAnimatingRef.current = false;
    }, SLIDE_TRANSITION_MS);
  }, [slideCount]);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  const goPrev = useCallback(() => goToDirection(-1), [goToDirection]);
  const goNext = useCallback(() => goToDirection(1), [goToDirection]);

  if (slideCount === 0) return null;

  const prevIndex = (index - 1 + slideCount) % slideCount;
  const nextIndex = (index + 1) % slideCount;

  return (
    <section
      className={styles.section}
      aria-label={t('label')}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{
            // .track is 300% wide (3 slides at 33.3333% each), so shifting
            // by one slide is a translateX of -33.3333% relative to the
            // track's own box — not -100%, which would overshoot by 3x.
            transform: `translateX(${(-1 - trackOffset) * (100 / 3)}%)`,
            transition: trackOffset === 0 ? 'none' : `transform ${SLIDE_TRANSITION_MS}ms ease-in-out`,
          }}
        >
          <div className={styles.slide} aria-hidden={slideCount <= 1}>
            {slideCount > 1 && <SlideContent slide={HERO_CAROUSEL_SLIDES[prevIndex]} t={t} />}
          </div>
          <div className={styles.slide}>
            <SlideContent slide={HERO_CAROUSEL_SLIDES[index]} t={t} />
          </div>
          <div className={styles.slide} aria-hidden={slideCount <= 1}>
            {slideCount > 1 && <SlideContent slide={HERO_CAROUSEL_SLIDES[nextIndex]} t={t} />}
          </div>
        </div>

        {slideCount > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navPrev}`}
              onClick={goPrev}
              aria-label={t('prevSlide')}
            >
              <ArrowLeft size={36} strokeWidth={2} aria-hidden="true" className={styles.navIcon} />
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navNext}`}
              onClick={goNext}
              aria-label={t('nextSlide')}
            >
              <ArrowRight size={36} strokeWidth={2} aria-hidden="true" className={styles.navIcon} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
