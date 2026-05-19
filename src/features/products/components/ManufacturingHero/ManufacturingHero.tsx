import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ScrollLink } from "@/src/features/products/components/ScrollLink/ScrollLink";
import styles from "./ManufacturingHero.module.css";

export async function ManufacturingHero() {
  const t = await getTranslations("productsPage.manufacturing.hero");
  const locale = await getLocale();
  const logoSrc =
    locale === "ko" ? "/images/logos/dp_logo_kor.png" : "/images/dp_logo_eng.svg";

  return (
    <section className={styles.hero}>
      <Image
        src="/images/manufacturing-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.bg}
        aria-hidden
      />
      <div className={styles.overlay} aria-hidden />

      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={`dp-tag dp-tag--ghost ${styles.tag}`}>
            {t("tag")}
          </span>

          <h1 className={styles.heading}>
            <span className={styles.line}>
              <span className={styles.inlineLogo}>
                <Image
                  src={logoSrc}
                  alt={t("logoAlt")}
                  width={180}
                  height={40}
                />
              </span>
              {t("headingLogoSuffix")}
            </span>
            <span className={styles.line}>{t("headingMid")}</span>
            <span className={styles.line}>{t("headingLine2")}</span>
          </h1>

          <p className={styles.sub}>{t("body")}</p>

          <ScrollLink targetId="contact" className={styles.cta}>
            <span>{t("cta")}</span>
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </ScrollLink>
        </div>
      </div>
    </section>
  );
}
