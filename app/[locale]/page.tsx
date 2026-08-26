// app/[locale]/page.tsx

import type { Metadata } from "next";
import { HomeBlueprintSection } from '@/src/features/home/components/HomeBlueprintSection/HomeBlueprintSection';
import { HomeReportSection } from '@/src/features/home/components/HomeReportSection/HomeReportSection';
import { HomeScheduleSection } from '@/src/features/home/components/HomeScheduleSection/HomeScheduleSection';
import { HomeCopilotSection } from '@/src/features/home/components/HomeCopilotSection/HomeCopilotSection';
import { HomeSegmentSection } from '@/src/features/home/components/HomeSegmentSection/HomeSegmentSection';
import { HomeResultSection } from '@/src/features/home/components/HomeResultSection/HomeResultSection';
import { HomeSupportSection } from '@/src/features/home/components/HomeSupportSection/HomeSupportSection';
import { HomeCtaCardsSection } from '@/src/features/home/components/HomeCtaCardsSection/HomeCtaCardsSection';
import { HomeSafetySection } from '@/src/features/home/components/HomeSafetySection/HomeSafetySection';
import { HomeRecordSection } from '@/src/features/home/components/HomeRecordSection/HomeRecordSection';
import { HomeDefectSection } from '@/src/features/home/components/HomeDefectSection/HomeDefectSection';
import { HomeTalkSection } from '@/src/features/home/components/HomeTalkSection/HomeTalkSection';
import { HomeHero } from '@/src/features/home/components/HomeHero/HomeHero';
import { HomePartnerCarousel } from '@/src/features/home/components/HomePartnerCarousel/HomePartnerCarousel';
import { HomePlatformSection } from '@/src/features/home/components/HomePlatformSection/HomePlatformSection';
import { HomeProblemSection } from '@/src/features/home/components/HomeProblemSection/HomeProblemSection';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const HOME_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "디지털프레소(digitalPresso) | RENAME DP 현장 기록·안전·품질 관리 솔루션",
    description:
      "디지털프레소(digitalPresso)는 건설 현장 데이터를 AI로 자동 정리해 기록, 보고, 안전·품질 관리를 효율화하는 RENAME DP 솔루션을 제공합니다.",
  },
  en: {
    title: "digitalPresso (디지털프레소) | RENAME DP Field Record, Safety, and Quality Platform",
    description:
      "digitalPresso (디지털프레소) provides RENAME DP, an AI-powered platform that automates field records, reporting, and safety-quality operations for construction teams.",
  },
  ja: {
    title: "digitalPresso (디지털프레소) | RENAME DP 現場記録・安全・品質管理プラットフォーム",
    description:
      "digitalPresso（디지털프레소）のAIプラットフォームRENAME DPで、建設現場の記録・報告・安全品質管理を自動化し、業務効率を高めます。",
  },
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : "ko";
  const content = HOME_META[safeLocale];

  return buildPageMetadata({
    locale: safeLocale,
    path: "/",
    title: content.title,
    description: content.description,
    image: "/images/bg_main_hero.png",
  });
}

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomePartnerCarousel />
      <HomeProblemSection />
      <HomePlatformSection />
      <HomeBlueprintSection />
      <HomeSafetySection />
      <HomeRecordSection />
      <HomeDefectSection />
      <HomeTalkSection />
      <HomeReportSection />
      <HomeScheduleSection />
      <HomeCopilotSection />
      <HomeSegmentSection />
      <HomeResultSection />
      <HomeSupportSection />
      <HomeCtaCardsSection />
    </main>
  );
}
