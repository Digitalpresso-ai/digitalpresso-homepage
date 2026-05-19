import { getTranslations } from "next-intl/server";
import styles from "./ManufacturingProblem.module.css";

type Card = {
  tag: string;
  title: string;
  date: string;
};

const CARD_IMAGES = [
  "/images/news-card-1.png",
  "/images/references-industry-manufacturing.png",
  "/images/references-industry-semiconductor.png",
];

export async function ManufacturingProblem() {
  const t = await getTranslations("productsPage.manufacturing.problem");
  const cards = t.raw("cards") as Card[];

  return (
    <section className={styles.problem}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          {t.rich("heading", {
            accent: (chunks) => <span className="dp-accent">{chunks}</span>,
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
                  <span className="dp-tag dp-tag--ghost">{c.tag}</span>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <span className={styles.cardDate}>{c.date}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
