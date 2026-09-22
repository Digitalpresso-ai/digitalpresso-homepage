import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

// Noto Sans KR/JP/SC는 next/font/google로 로드하지 않는다: Google Fonts API상
// 이 CJK 폰트들이 제공하는 subsets는 latin/latin-ext/cyrillic/vietnamese뿐이라,
// subsets: ["latin"]을 지정해도 실제 한글/가나/한자 글리프는 전혀 받아지지 않고
// 브라우저가 조용히 시스템 폴백 폰트로 렌더링한다(줄바꿈 위치가 사용자 OS마다
// 달라지는 원인이 됨). 대신 Google Fonts CSS2 API를 <link>로 직접 불러
// unicode-range 기반으로 실제 필요한 CJK 서브셋이 로드되게 한다.
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
      "naver-site-verification": "0ca72e1f05ccb55a1fc98ffb753510b4858e798a",
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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable}`}
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
