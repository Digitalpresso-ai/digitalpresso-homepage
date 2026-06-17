import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";
import { getSiteUrl } from "@/lib/site-url";
import QueryProvider from "@/src/providers/QueryProvider";
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

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "디지털프레소(digitalPresso) | RENAME DP",
    template: "%s | digitalPresso",
  },
  description:
    "디지털프레소(digitalPresso) — 건설 현장 기록, 안전·품질 관리, 보고 자동화를 지원하는 AI 기반 현장 운영 솔루션",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "digitalPresso",
    title: "digitalPresso | RENAME DP",
    description:
      "건설 현장 기록, 안전·품질 관리, 보고 자동화를 지원하는 AI 기반 현장 운영 솔루션",
    images: [
      {
        url: "/images/header-background.png",
        width: 1200,
        height: 630,
        alt: "digitalPresso RENAME DP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "digitalPresso | RENAME DP",
    description:
      "건설 현장 기록, 안전·품질 관리, 보고 자동화를 지원하는 AI 기반 현장 운영 솔루션",
    images: ["/images/header-background.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      "naver-site-verification": "9e7914b79e8352bb6479811768d5c77878fa9c03",
    },
  },
};

// Organization 구조화 데이터(JSON-LD).
// 구글에 회사 정체성을 명시적으로 알리고, alternateName으로 한글 브랜드명("디지털프레소")을
// 영문명(digitalPresso)과 연결해 한글 검색에서도 사이트가 노출되도록 돕는다.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "digitalPresso",
  alternateName: ["디지털프레소", "디지털 프레소", "RENAME DP"],
  url: siteUrl,
  logo: `${siteUrl}/images/header-background.png`,
  description:
    "건설 현장 기록, 안전·품질 관리, 보고 자동화를 지원하는 AI 기반 현장 운영 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${notoSansJP.variable} ${pretendard.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
