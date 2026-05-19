import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ScrollLink } from "@/src/features/products/components/ScrollLink/ScrollLink";
import styles from "./ManufacturingContact.module.css";

type ContactItem = {
  label: string;
  value: string;
};

const ITEM_ICONS = [
  "/icons/mail.svg",
  "/icons/phone.svg",
  "/icons/building.svg",
];

export async function ManufacturingContact() {
  const t = await getTranslations("productsPage.manufacturing.contact");
  const items = t.raw("items") as ContactItem[];

  return (
    <section id="contact" className={styles.contact}>
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

        <div className={styles.list}>
          {items.map((item, idx) => (
            <div key={item.label} className={styles.item}>
              <span className={styles.iconwrap}>
                <Image
                  className={styles.icon}
                  src={ITEM_ICONS[idx]}
                  alt=""
                  width={22}
                  height={22}
                />
              </span>
              <div>
                <div className={styles.label}>{item.label}</div>
                <span className={styles.value}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <ScrollLink targetId="contact" className={styles.cta}>
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
        </ScrollLink>
      </div>
    </section>
  );
}
