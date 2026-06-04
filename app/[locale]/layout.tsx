import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import GAPageTracker from '@/components/analytics/GAPageTracker';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const localeClass = locale === 'ja' ? 'locale-ja' : undefined;

  return (
    <NextIntlClientProvider messages={messages}>
      <GoogleAnalytics />
      <GAPageTracker />
      <div className={localeClass}>
        <Header />
        {children}
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
