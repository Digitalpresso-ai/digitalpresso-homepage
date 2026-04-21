// app/[locale]/references/page.tsx

import type { Metadata } from "next";
import { ReferencesHero } from '@/src/features/references/components/ReferencesHero/ReferencesHero';
import { ReferencesServiceSection } from '@/src/features/references/components/ReferencesServiceSection/ReferencesServiceSection';
import { ReferencesKepcoSection } from '@/src/features/references/components/ReferencesKepcoSection/ReferencesKepcoSection';
import { ReferencesElectricalSection } from '@/src/features/references/components/ReferencesElectricalSection/ReferencesElectricalSection';
import { ReferencesIndustriesSection } from '@/src/features/references/components/ReferencesIndustriesSection/ReferencesIndustriesSection';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';

interface ReferencesPageProps {
  params: Promise<{ locale: string }>;
}

const REFERENCES_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "고객 사례 | 디지털프레소 DigitalPresso",
    description:
      "디지털프레소 DigitalPresso가 건설·전기·인프라 현장에서 만든 실제 도입 사례와 성과를 확인해보세요.",
  },
  en: {
    title: "References | DigitalPresso",
    description:
      "Explore real implementation cases and outcomes delivered by DigitalPresso across construction, electrical, and infrastructure projects.",
  },
  ja: {
    title: "導入事例 | DigitalPresso",
    description:
      "建設・電気・インフラ分野でDigitalPressoが実現した導入事例と成果をご覧ください。",
  },
};

export async function generateMetadata({
  params,
}: ReferencesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : "ko";
  const content = REFERENCES_META[safeLocale];

  return buildPageMetadata({
    locale: safeLocale,
    path: "/references",
    title: content.title,
    description: content.description,
    image: "/images/references-hero-bg.png",
  });
}

export default function ReferencesPage() {
  return (
    <main>
      <ReferencesHero />
      <ReferencesServiceSection />
      <ReferencesKepcoSection />
      <ReferencesElectricalSection />
      <ReferencesIndustriesSection />
    </main>
  );
}
