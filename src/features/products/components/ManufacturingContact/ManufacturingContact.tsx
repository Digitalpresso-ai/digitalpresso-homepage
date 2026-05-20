import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import styles from "./ManufacturingContact.module.css";

export async function ManufacturingContact() {
  const t = await getTranslations("productsPage.manufacturing.contact");

  return (
    <section className={styles.contact}>
      <div className={styles.inner}>
        <div className={styles.textgroup}>
          <span className="dp-tag">{t("tag")}</span>
          <h2 className={styles.heading}>
            {t("headingLine1")}
            <br />
            {t("headingLine2")}
          </h2>
          <p className={styles.sub}>{t("body")}</p>
        </div>

        <Link href="/contact" className={styles.cta}>
          {t("cta")}
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
