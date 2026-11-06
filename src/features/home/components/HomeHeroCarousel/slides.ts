// src/features/home/components/HomeHeroCarousel/slides.ts

export type HeroCarouselSegmentStyle = 'plain' | 'accent' | 'gold';

export interface HeroCarouselSegment {
  /** i18n 메시지 키 (home.heroCarousel.slides.{slideKey}.{textKey}) */
  textKey: string;
  style: HeroCarouselSegmentStyle;
}

interface HeroCarouselLogo {
  src: string;
  width: number;
  height: number;
}

export interface HeroCarouselSlide {
  key: string;
  bg: { src: string; width: number; height: number };
  /** 기관 로고 (TIPA, KAIA 등) */
  partnerLogo: HeroCarouselLogo;
  /** digitalPresso 화이트 로고 — 모든 슬라이드에서 공통. */
  brandLogo: HeroCarouselLogo;
  href: string;
  /** Figma 기준 2줄. 각 줄은 색상이 다른 단어 세그먼트들의 나열. */
  headingLines: HeroCarouselSegment[][];
  /** 'accent' 스타일 세그먼트에 적용되는 그라디언트. */
  accentGradient: string;
  /**
   * 헤딩 아래 보조 설명 문단 (i18n 메시지 키, `home.heroCarousel.slides.
   * {slideKey}.subtext`). Figma: 2줄, `\n`으로 줄바꿈 위치를 명시.
   * 슬라이드에 보조 문단이 없으면 생략.
   */
  hasSubtext?: boolean;
}

// 'gold' 세그먼트는 모든 슬라이드에서 동일한 그라디언트를 쓴다 (Figma: #fbffc9 → #e4ca84).
export const GOLD_GRADIENT = 'linear-gradient(180deg, #fbffc9 0%, #e4ca84 100%)';

const BRAND_LOGO: HeroCarouselLogo = {
  src: '/images/main-hero-logo-3.png',
  width: 870,
  height: 308,
};

// 아직 준비되지 않은 슬라이드는 이 배열에 추가하기 전까지 노출되지 않는다.
// (2장 더 추가될 예정 — 배경/로고 에셋과 링크가 준비되면 이어서 push)
export const HERO_CAROUSEL_SLIDES: HeroCarouselSlide[] = [
  {
    key: 'didimdol',
    bg: { src: '/images/main-hero-bg-1.jpg', width: 2560, height: 801 },
    partnerLogo: { src: '/images/main-hero-logo-1.png', width: 1375, height: 384 },
    brandLogo: BRAND_LOGO,
    href: '/news/article/ac9735f0-5ff5-4b91-b767-748febca5e57',
    accentGradient: 'linear-gradient(180deg, #cafdff 0%, #53eafd 100%)',
    headingLines: [
      [
        { textKey: 'row1Plain', style: 'plain' },
        { textKey: 'row1Accent', style: 'accent' },
      ],
      [
        { textKey: 'row2Accent1', style: 'accent' },
        { textKey: 'row2Plain', style: 'plain' },
        { textKey: 'row2Gold', style: 'gold' },
      ],
    ],
    hasSubtext: true,
  },
  {
    key: 'gmep',
    bg: { src: '/images/main-hero-bg-2.jpg', width: 2560, height: 690 },
    partnerLogo: { src: '/images/main-hero-logo-2.png', width: 661, height: 385 },
    brandLogo: BRAND_LOGO,
    href: '/news/article/de5c27e4-5635-4583-83d3-f4a7394943f1',
    accentGradient: 'linear-gradient(180deg, #d3ffd8 0%, #5dfd88 100%)',
    headingLines: [
      [
        { textKey: 'row1Plain', style: 'plain' },
        { textKey: 'row1Accent', style: 'accent' },
      ],
      [
        { textKey: 'row2Accent1', style: 'accent' },
        { textKey: 'row2Gold', style: 'gold' },
      ],
    ],
    hasSubtext: true,
  },
];

export const HERO_CAROUSEL_AUTOPLAY_MS = 10_000;
