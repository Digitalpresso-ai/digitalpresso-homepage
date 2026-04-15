// app/[locale]/about-us/page.tsx

import type { Metadata } from "next";
import { AboutHero } from "@/src/features/about/components/AboutHero/AboutHero";
import { AboutTeam } from "@/src/features/about/components/AboutTeam/AboutTeam";
import { AboutOffice } from "@/src/features/about/components/AboutOffice/AboutOffice";
import { buildPageMetadata, isAppLocale, type AppLocale } from "@/lib/seo";

interface AboutUsPageProps {
  params: Promise<{ locale: string }>;
}

const ABOUT_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "회사 소개 | digitalPresso",
    description:
      "digitalPresso의 비전, 팀, 오피스를 소개합니다. 현장 중심 AI 기술로 산업 데이터 자동화를 실현합니다.",
  },
  en: {
    title: "About Us | digitalPresso",
    description:
      "Learn about digitalPresso's vision, team, and office. We build AI solutions for field-first industrial data automation.",
  },
  ja: {
    title: "会社紹介 | digitalPresso",
    description:
      "digitalPressoのビジョン、チーム、オフィスをご紹介します。現場起点のAI技術で産業データ自動化を実現します。",
  },
};

export async function generateMetadata({
  params,
}: AboutUsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : "ko";
  const content = ABOUT_META[safeLocale];

  return buildPageMetadata({
    locale: safeLocale,
    path: "/about-us",
    title: content.title,
    description: content.description,
    image: "/images/about-section1.png",
  });
}

export default function AboutUsPage() {
  return (
    <main>
      <AboutHero />
      <AboutTeam />
      <AboutOffice />
    </main>
  );
}
