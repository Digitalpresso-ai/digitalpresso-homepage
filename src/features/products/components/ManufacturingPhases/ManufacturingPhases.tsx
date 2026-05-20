import { getTranslations } from "next-intl/server";
import styles from "./ManufacturingPhases.module.css";

type PhaseItem = {
  n: string;
  label: string;
  title: string;
  sub: string;
  body: string;
  bullets: string[];
};

function Check() {
  return (
    <svg
      width={18}
      height={18}
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

export async function ManufacturingPhases() {
  const t = await getTranslations("productsPage.manufacturing.phases");
  const items = t.raw("items") as PhaseItem[];

  return (
    <section className={styles.phases}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className="dp-tag">{t("tag")}</span>
          <h2 className={styles.heading}>
            {t.rich("heading", {
              accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
              br: () => <br />,
            })}
          </h2>
        </header>
        <ol className={styles.list}>
          {items.map((p, i) => (
            <li key={p.n} className={styles.item}>
              <div className={styles.num}>
                <span className={styles.numFig}>{p.n}</span>
                <span className={styles.numLabel}>{p.label}</span>
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.sub}>{p.sub}</p>
                <p className={styles.copy}>{p.body}</p>
                <ul className={styles.bullets}>
                  {p.bullets.map((b) => (
                    <li key={b}>
                      <Check />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {i < items.length - 1 && (
                <span className={styles.rail} aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
