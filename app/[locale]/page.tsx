// app/[locale]/page.tsx

import type { Metadata } from "next";
import { HomeAiReportSection } from '@/src/features/home/components/HomeAiReportSection/HomeAiReportSection';
import { HomeApprovalSection } from '@/src/features/home/components/HomeApprovalSection/HomeApprovalSection';
import { HomeCctvSection } from '@/src/features/home/components/HomeCctvSection/HomeCctvSection';
import { HomeWebsiteSection } from '@/src/features/home/components/HomeWebsiteSection/HomeWebsiteSection';
import { HomePricingSection } from '@/src/features/home/components/HomePricingSection/HomePricingSection';
import { HomeContactSection } from '@/src/features/home/components/HomeContactSection/HomeContactSection';
import { HomeEmployeeSection } from '@/src/features/home/components/HomeEmployeeSection/HomeEmployeeSection';
import { HomeDashboardSection } from '@/src/features/home/components/HomeDashboardSection/HomeDashboardSection';
import { HomeFeatureSection } from '@/src/features/home/components/HomeFeatureSection/HomeFeatureSection';
import { HomeHero } from '@/src/features/home/components/HomeHero/HomeHero';
import { HomeMessengerSection } from '@/src/features/home/components/HomeMessengerSection/HomeMessengerSection';
import { HomeNewsSection } from '@/src/features/home/components/HomeNewsSection/HomeNewsSection';
import { HomeProductSection } from '@/src/features/home/components/HomeProductSection/HomeProductSection';
import { HomeProjectSection } from '@/src/features/home/components/HomeProjectSection/HomeProjectSection';
import { HomeUploadSection } from '@/src/features/home/components/HomeUploadSection/HomeUploadSection';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const HOME_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "RENAME DP | 디지털프레소 DigitalPresso 현장 기록·안전·품질 관리 솔루션",
    description:
      "디지털프레소 DigitalPresso의 RENAME DP는 건설 현장 데이터를 AI로 자동 정리해 기록, 보고, 안전·품질 관리를 효율화하는 현장 운영 솔루션입니다.",
  },
  en: {
    title: "RENAME DP | Field Record, Safety, and Quality Platform",
    description:
      "Discover DigitalPresso's AI-powered platform that automates field records, reporting, and safety-quality operations for construction teams.",
  },
  ja: {
    title: "RENAME DP | 現場記録・安全・品質管理プラットフォーム",
    description:
      "DigitalPressoのAIプラットフォームで、建設現場の記録・報告・安全品質管理を自動化し、業務効率を高めます。",
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
    image: "/images/hero-worker.png",
  });
}

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeNewsSection />
      <HomeFeatureSection />
      <HomeProductSection />
      <HomeProjectSection />
      <HomeUploadSection />
      <HomeMessengerSection />
      <HomeDashboardSection />
      <HomeApprovalSection />
      <HomeEmployeeSection />
      <HomeAiReportSection />
      <HomeCctvSection />
      <HomePricingSection />
      <HomeWebsiteSection />
      <HomeContactSection />
    </main>
  );
}
