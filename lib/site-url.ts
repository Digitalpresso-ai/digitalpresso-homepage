const DEFAULT_SITE_URL = "https://digitalpresso.ai";

function normalizeSiteUrl(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSiteUrl(): string {
  const rawSiteUrl = process.env.SITE_URL?.trim();

  if (!rawSiteUrl) {
    return DEFAULT_SITE_URL;
  }

  return normalizeSiteUrl(rawSiteUrl);
}

export function getSiteOrigin(): URL {
  return new URL(getSiteUrl());
}
