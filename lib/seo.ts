import type { Metadata } from "next";

export type AppLocale = "ko" | "en" | "ja";

const DEFAULT_LOCALE: AppLocale = "ko";
const SUPPORTED_LOCALES: AppLocale[] = ["ko", "en", "ja"];
const HREFLANG_LOCALE: Record<AppLocale, string> = {
  ko: "ko-KR",
  en: "en",
  ja: "ja-JP",
};
const X_DEFAULT_LOCALE: AppLocale = "en";

const OG_LOCALE: Record<AppLocale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
};

function normalizePath(path: string): string {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }

  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}

export function isAppLocale(locale: string): locale is AppLocale {
  return SUPPORTED_LOCALES.includes(locale as AppLocale);
}

export function localizedPath(locale: AppLocale, path: string): string {
  const normalizedPath = normalizePath(path);

  if (locale === DEFAULT_LOCALE) {
    return normalizedPath;
  }

  if (normalizedPath === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath}`;
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const normalizedPath = normalizePath(path);

  return {
    [HREFLANG_LOCALE.ko]: localizedPath("ko", normalizedPath),
    [HREFLANG_LOCALE.en]: localizedPath("en", normalizedPath),
    [HREFLANG_LOCALE.ja]: localizedPath("ja", normalizedPath),
    "x-default": localizedPath(X_DEFAULT_LOCALE, normalizedPath),
  };
}

interface PageMetadataInput {
  locale: AppLocale;
  path: string;
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image = "/images/header-background.png",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = localizedPath(locale, path);
  const images = [{ url: image, alt: title }];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url,
      siteName: "digitalPresso",
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
