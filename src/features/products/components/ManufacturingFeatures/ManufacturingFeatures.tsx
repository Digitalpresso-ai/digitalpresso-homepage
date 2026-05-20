import { getTranslations } from "next-intl/server";
import styles from "./ManufacturingFeatures.module.css";

type Point = { title: string; body: string };

export async function ManufacturingFeatures() {
  const t = await getTranslations("productsPage.manufacturing.features");
  const points = t.raw("points") as Point[];

  return (
    <section className={styles.builder} id="dp-builder">
      <div
        className={styles.bg}
        style={{ backgroundImage: "url(/images/dp_builder.png)" }}
        aria-hidden
      />
      <div className={styles.overlay} aria-hidden />

      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={`dp-tag ${styles.tag}`}>{t("tag")}</span>

          <h2 className={styles.heading}>
            {t.rich("heading", {
              accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
              br: () => <br />,
            })}
          </h2>

          <p className={styles.lead}>
            {t.rich("lead", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>

          <ul className={styles.points}>
            {points.map((p) => (
              <li key={p.title}>
                <span className={styles.pointTitle}>{p.title}</span>
                <span className={styles.pointBody}>{p.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
