import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GAPageTracker from "@/components/analytics/GAPageTracker";
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
  metadataBase: new URL("https://digitalpresso-homepage.vercel.app"),
  title: {
    default: "digitalPresso | RENAME DP",
    template: "%s | digitalPresso",
  },
  description:
    "건설 현장 기록, 안전·품질 관리, 보고 자동화를 지원하는 AI 기반 현장 운영 솔루션",
  openGraph: {
    siteName: "digitalPresso",
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
    images: ["/images/header-background.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${notoSansJP.variable}`}
      >
        <GoogleAnalytics />
        <GAPageTracker />
        {children}
      </body>
    </html>
  );
}
