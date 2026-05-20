import { getTranslations } from "next-intl/server";
import styles from "./ManufacturingResults.module.css";

type Stat = {
  value: string;
  unit: string;
  label: string;
  sub: string;
};

export async function ManufacturingResults() {
  const t = await getTranslations("productsPage.manufacturing.results");
  const stats = t.raw("stats") as Stat[];

  return (
    <section className={styles.results}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className="dp-tag dp-tag--ghost">{t("tag")}</span>
          <h2 className={styles.heading}>
            {t.rich("heading", {
              accent: (chunks) => (
                <span className={styles.accent}>{chunks}</span>
              ),
              br: () => <br />,
            })}
          </h2>
        </header>
        <ul className={styles.list}>
          {stats.map((s) => (
            <li key={s.label} className={styles.item}>
              <div className={styles.num}>
                <span className={styles.value}>{s.value}</span>
                <span className={styles.unit}>{s.unit}</span>
              </div>
              <div className={styles.label}>{s.label}</div>
              <div className={styles.sub}>{s.sub}</div>
            </li>
          ))}
        </ul>
        <p className={styles.note}>{t("note")}</p>
      </div>
    </section>
  );
}
