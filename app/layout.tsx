import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import { getLocale } from "next-intl/server";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GAPageTracker from "@/components/analytics/GAPageTracker";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl, getSiteOrigin } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
  title: {
    default: "디지털프레소 DigitalPresso | RENAME DP",
    template: "%s | DigitalPresso",
  },
  description:
    "디지털프레소 DigitalPresso는 건설 현장 기록, 안전·품질 관리, 보고 자동화를 지원하는 AI 기반 현장 운영 솔루션을 제공합니다.",
  openGraph: {
    siteName: "DigitalPresso",
    images: [
      {
        url: "/images/header-background.png",
        width: 1200,
        height: 630,
        alt: "디지털프레소 DigitalPresso RENAME DP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/header-background.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const HTML_LANG: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en",
  ja: "ja-JP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const htmlLang =
    routing.locales.includes(locale as Locale) ? HTML_LANG[locale as Locale] : HTML_LANG.ko;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DigitalPresso",
    alternateName: "디지털프레소",
    url: getSiteUrl(),
    logo: `${getSiteUrl()}/images/dp_logo_eng.svg`,
  };

  return (
    <html lang={htmlLang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${notoSansJP.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <GoogleAnalytics />
        <GAPageTracker />
        {children}
      </body>
    </html>
  );
}
