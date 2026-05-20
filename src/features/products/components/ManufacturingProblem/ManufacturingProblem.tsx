import { getTranslations } from "next-intl/server";
import styles from "./ManufacturingProblem.module.css";

type Card = {
  title: string;
  subtitle: string;
  description: string;
};

const CARD_IMAGES = [
  "/images/manufacturing-problem-1.png",
  "/images/manufacturing-problem-2.png",
  "/images/manufacturing-problem-3.png",
];

export async function ManufacturingProblem() {
  const t = await getTranslations("productsPage.manufacturing.problem");
  const cards = t.raw("cards") as Card[];

  return (
    <section className={styles.problem}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          {t.rich("heading", {
            accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
            br: () => <br />,
          })}
        </h2>
        <p className={styles.sub}>{t("sub")}</p>
        <ul className={styles.cards}>
          {cards.map((c, idx) => (
            <li key={c.title}>
              <article
                className={styles.card}
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(11,23,70,.88) 75%), url(${CARD_IMAGES[idx]})`,
                }}
              >
                <div className={styles.cardContent}>
                  <span className={styles.cardSubtitle}>{c.subtitle}</span>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <p className={styles.cardDescription}>{c.description}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
