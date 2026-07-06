// src/features/news/components/NewsArticleCard/NewsArticleCard.tsx

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { NewsArticle, NewsCategory } from "../../types/article.types";
import styles from "./NewsArticleCard.module.css";

interface NewsArticleCardProps {
  article: NewsArticle;
  viewButtonText: string;
  /** 카테고리별 짧은 태그 라벨 (예: 회사/건설/기술) */
  tagLabels: Record<NewsCategory, string>;
  /** 태그 노출 여부. '전체' 탭에서만 true (개별 카테고리 탭은 이미 필터돼 있어 불필요) */
  showTag: boolean;
}

export function NewsArticleCard({ article, viewButtonText, tagLabels, showTag }: NewsArticleCardProps) {
  return (
    <Link href={`/news/article/${article.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.mainImage.alt}
            fill
            style={{ objectFit: article.thumbnailFit || "cover" }}
            sizes="(max-width: 799px) 100vw, (max-width: 1279px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        <div className={styles.hoverOverlay}>
          <span className={styles.hoverButton}>{viewButtonText}</span>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          {showTag && (
            <span className={`${styles.tag} ${styles[`tag_${article.category}`]}`}>
              {tagLabels[article.category]}
            </span>
          )}
          <h3 className={styles.title}>{article.title}</h3>
        </div>
        <p className={styles.description}>{article.description}</p>
        <p className={styles.date}>{article.publishedAt}</p>
      </div>
    </Link>
  );
}
