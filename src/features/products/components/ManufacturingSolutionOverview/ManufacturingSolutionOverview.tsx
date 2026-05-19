import { getTranslations } from "next-intl/server";
import styles from "./ManufacturingSolutionOverview.module.css";

export async function ManufacturingSolutionOverview() {
  const t = await getTranslations(
    "productsPage.manufacturing.solutionOverview",
  );

  return (
    <section
      className={styles.overview}
      style={{
        backgroundImage: "url(/images/references-industry-manufacturing.png)",
      }}
    >
      <div className={styles.overlay} aria-hidden />
      <div className={styles.inner}>
        <span className="dp-tag dp-tag--ghost">{t("tag")}</span>
        <h2 className={styles.heading}>
          {t.rich("heading", {
            accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
            br: () => <br />,
          })}
        </h2>
        <p className={styles.body}>{t("body")}</p>
      </div>
    </section>
  );
}
