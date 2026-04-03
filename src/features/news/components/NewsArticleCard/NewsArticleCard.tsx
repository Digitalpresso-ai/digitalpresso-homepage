// src/features/news/components/NewsArticleCard/NewsArticleCard.tsx

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "../../types/article.types";
import styles from "./NewsArticleCard.module.css";

interface NewsArticleCardProps {
  article: NewsArticle;
}

export function NewsArticleCard({ article }: NewsArticleCardProps) {
  return (
    <Link href={`/news/article/${article.id}`} className={styles.card}>
      <div className={`${styles.imageWrapper}${article.thumbnailBorder ? ` ${styles.imageWrapperBorder}` : ''}`}>
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.mainImage.alt}
            fill
            unoptimized
            style={{ objectFit: article.thumbnailFit || "cover" }}
            sizes="(max-width: 799px) 100vw, (max-width: 1279px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.description}>{article.description}</p>
      </div>
    </Link>
  );
}
