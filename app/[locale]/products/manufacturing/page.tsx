// app/[locale]/products/manufacturing/page.tsx

import type { Metadata } from "next";
import { ManufacturingHero } from "@/src/features/products/components/ManufacturingHero/ManufacturingHero";
import { ManufacturingProblem } from "@/src/features/products/components/ManufacturingProblem/ManufacturingProblem";
import { ManufacturingSolutionOverview } from "@/src/features/products/components/ManufacturingSolutionOverview/ManufacturingSolutionOverview";
import { ManufacturingPhases } from "@/src/features/products/components/ManufacturingPhases/ManufacturingPhases";
import { ManufacturingFeatures } from "@/src/features/products/components/ManufacturingFeatures/ManufacturingFeatures";
import { ManufacturingResults } from "@/src/features/products/components/ManufacturingResults/ManufacturingResults";
import { ManufacturingContact } from "@/src/features/products/components/ManufacturingContact/ManufacturingContact";
import { buildPageMetadata, isAppLocale, type AppLocale } from "@/lib/seo";

interface ManufacturingPageProps {
  params: Promise<{ locale: string }>;
}

const MANUFACTURING_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "제조업 DX · AX 솔루션 | digitalPresso",
    description:
      "공정 데이터 자동 수집과 AI 분석으로 제조 현장의 생산성, 품질, 안전을 함께 끌어올리는 디지털프레소의 제조업 솔루션입니다.",
  },
  en: {
    title: "Manufacturing DX · AX Solution | digitalPresso",
    description:
      "digitalPresso's manufacturing solution automates shop-floor data capture and applies AI analytics to lift productivity, quality, and safety together.",
  },
  ja: {
    title: "製造業 DX・AX ソリューション | digitalPresso",
    description:
      "工程データの自動収集とAI分析により、製造現場の生産性・品質・安全を同時に高めるdigitalPressoの製造業ソリューションです。",
  },
};

export async function generateMetadata({
  params,
}: ManufacturingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : "ko";
  const content = MANUFACTURING_META[safeLocale];

  return buildPageMetadata({
    locale: safeLocale,
    path: "/products/manufacturing",
    title: content.title,
    description: content.description,
  });
}

export default function ManufacturingPage() {
  return (
    <main>
      <ManufacturingHero />
      <ManufacturingProblem />
      <ManufacturingSolutionOverview />
      <ManufacturingPhases />
      <ManufacturingFeatures />
      <ManufacturingResults />
      <ManufacturingContact />
    </main>
  );
}
