// app/[locale]/contact/page.tsx

import type { Metadata } from "next";
import { ContactInfoCard } from '@/src/features/contact/components/ContactInfoCard/ContactInfoCard';
import { ContactForm } from '@/src/features/contact/components/ContactForm/ContactForm';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';
import styles from './ContactPage.module.css';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

const CONTACT_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "문의하기 | digitalPresso",
    description:
      "RENAME DP 도입 상담과 서비스 문의를 남겨주세요. 현장 업무 환경에 맞는 도입 방안을 안내해드립니다.",
  },
  en: {
    title: "Contact | digitalPresso",
    description:
      "Get in touch for RENAME DP adoption and service inquiries. We will guide you with a rollout plan tailored to your field operations.",
  },
  ja: {
    title: "お問い合わせ | digitalPresso",
    description:
      "RENAME DP導入相談やサービスに関するお問い合わせはこちら。現場運用に合わせた導入プランをご案内します。",
  },
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : "ko";
  const content = CONTACT_META[safeLocale];

  return buildPageMetadata({
    locale: safeLocale,
    path: "/contact",
    title: content.title,
    description: content.description,
    image: "/images/contact-building.png",
  });
}

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <ContactInfoCard />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
