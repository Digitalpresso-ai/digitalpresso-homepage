import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import styles from "./Footer.module.css";

export async function Footer() {
  const t = await getTranslations("common.footer");

  const primaryNavLinks = [
    { href: "/about-us", label: t("nav.aboutUs") },
    { href: "/references", label: t("nav.references") },
    { href: "/news", label: t("nav.news") },
  ] as const;

  const legalNavLinks = [
    { href: "/terms-of-service", label: t("nav.termsOfService") },
    { href: "/privacy-policy", label: t("nav.privacyPolicy") },
  ] as const;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <Image
            src="/images/dp_logo_eng.svg"
            alt="디지털프레소 로고"
            width={264}
            height={93}
            sizes="(max-width: 1279px) 200px, 264px"
            className={styles.logo}
          />
          <small className={styles.copyright}>{t("copyright")}</small>
        </div>

        <nav className={styles.nav} aria-label="푸터 네비게이션">
          <ul className={styles.navColumn}>
            {primaryNavLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className={styles.navColumn}>
            {legalNavLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
