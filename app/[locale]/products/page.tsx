// app/[locale]/products/page.tsx

import type { Metadata } from "next";
import { ProductsHero } from "@/src/features/products/components/ProductsHero/ProductsHero";
import { ProductsGrid } from "@/src/features/products/components/ProductsGrid/ProductsGrid";
import { buildPageMetadata, isAppLocale, type AppLocale } from "@/lib/seo";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

const PRODUCTS_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "제품 소개 | digitalPresso",
    description:
      "디지털프레소의 산업별 AI 솔루션을 한눈에 확인하세요. 현장 데이터를 자동화해 운영 효율과 품질을 끌어올립니다.",
  },
  en: {
    title: "Products | digitalPresso",
    description:
      "Browse digitalPresso's industry-specific AI solutions. We automate field data to lift operational efficiency and quality.",
  },
  ja: {
    title: "製品紹介 | digitalPresso",
    description:
      "digitalPressoの業界別AIソリューションをご覧ください。現場データを自動化し、運用効率と品質を高めます。",
  },
};

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : "ko";
  const content = PRODUCTS_META[safeLocale];

  return buildPageMetadata({
    locale: safeLocale,
    path: "/products",
    title: content.title,
    description: content.description,
  });
}

export default function ProductsPage() {
  return (
    <main>
      <ProductsHero />
      <ProductsGrid />
    </main>
  );
}
