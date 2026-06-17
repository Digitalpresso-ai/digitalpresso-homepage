// app/[locale]/page.tsx

import type { Metadata } from "next";
import { HomeContactSection } from '@/src/features/home/components/HomeContactSection/HomeContactSection';
import { HomeImpactSection } from '@/src/features/home/components/HomeImpactSection/HomeImpactSection';
import { HomeHero } from '@/src/features/home/components/HomeHero/HomeHero';
import { HomeMessengerSection } from '@/src/features/home/components/HomeMessengerSection/HomeMessengerSection';
import { HomeNewsSection } from '@/src/features/home/components/HomeNewsSection/HomeNewsSection';
import { HomeProductSection } from '@/src/features/home/components/HomeProductSection/HomeProductSection';
import { HomeShowcaseSection } from '@/src/features/home/components/HomeShowcaseSection/HomeShowcaseSection';
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
      <HomeNewsSection />
      <HomeImpactSection />
      <HomeProductSection />
      <HomeShowcaseSection
        namespace="home.upload"
        imageSrc="/images/section-upload.png"
        imageAspectRatio="480 / 634"
        variant="compact"
      />
      <HomeShowcaseSection
        namespace="home.defect"
        imageSrc="/images/section-defect.png"
        imageAspectRatio="480 / 634"
        variant="compact"
        reverse
      />
      <HomeMessengerSection />
      <HomeShowcaseSection
        namespace="home.dashboard"
        imageSrc="/images/section-dashboard.png"
        imageAspectRatio="564 / 407"
        background="#ebf2ff"
        reverse
      />
      <HomeShowcaseSection
        namespace="home.blueprint"
        imageSrc="/images/section-blueprint.png"
        imageAspectRatio="564 / 318"
        background="#eef3fb"
        objectFit="cover"
      />
      <HomeShowcaseSection
        namespace="home.documents"
        imageSrc="/images/section-documents.png"
        imageAspectRatio="564 / 382"
        background="#eef3fb"
        objectFit="cover"
        bodySize="md"
        reverse
      />
      <HomeShowcaseSection
        namespace="home.workReports"
        imageSrc="/images/section-work-reports.png"
        imageAspectRatio="564 / 350"
        background="#eef3fb"
        objectFit="cover"
      />
      <HomeContactSection />
    </main>
  );
}
