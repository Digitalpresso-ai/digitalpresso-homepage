import { getTranslations } from "next-intl/server";
import styles from "./ManufacturingFeatures.module.css";

type Block = {
  subtitle: string;
  title: string;
  body1: string;
  body2: string;
  bullets: string[];
};

function Check() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#193cb8"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export async function ManufacturingFeatures() {
  const t = await getTranslations("productsPage.manufacturing.features");
  const blocks = t.raw("blocks") as Block[];

  return (
    <section className={styles.features}>
      <div className={styles.headerArea}>
        <span className="dp-tag">{t("tag")}</span>
        <h2 className={styles.heading}>
          {t.rich("heading", {
            accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
          })}
        </h2>
      </div>

      <ul className={styles.blocks}>
        {blocks.map((block) => (
          <li key={block.title} className={styles.block}>
            <p className={styles.subtitle}>{block.subtitle}</p>
            <h3 className={styles.title}>{block.title}</h3>
            <p className={styles.body}>{block.body1}</p>
            <p className={styles.body}>{block.body2}</p>
            {block.bullets && (
              <ul className={styles.bullets}>
                {block.bullets.map((b) => (
                  <li key={b}>
                    <Check />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
