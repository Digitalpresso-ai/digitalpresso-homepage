// src/features/news/components/NewsArticleDetail/NewsArticleDetail.tsx

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { ArticleNavLink } from '../ArticleNavLink/ArticleNavLink';
import type { NewsArticle } from '../../types/article.types';
import styles from './NewsArticleDetail.module.css';

function sanitizeHtmlImages(html: string): string {
  return html.replace(/<img([^>]*)>/gi, (_match, attrs: string) => {
    const cleaned = attrs
      .replace(/\s*style="[^"]*"/gi, '')
      .replace(/\s*width="[^"]*"/gi, '')
      .replace(/\s*height="[^"]*"/gi, '');
    return `<img${cleaned} style="max-width:70%;height:auto;display:block;margin:0 0 24px">`;
  });
}

interface NewsArticleDetailProps {
  article: NewsArticle;
  prevArticle?: NewsArticle;
  nextArticle?: NewsArticle;
}

export async function NewsArticleDetail({
  article,
  prevArticle,
  nextArticle,
}: NewsArticleDetailProps) {
  const t = await getTranslations('newsPage.detail');

  let imageIndex = 0;

  return (
    <div className={styles.container}>
      {/* Header: title + category */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          {article.title.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <p className={styles.categoryLabel}>{article.categoryLabel}</p>
      </div>

      {/* Body content */}
      <div className={styles.body}>
        {/* Main image — CMS 글은 HTML 본문에 이미지가 포함되어 있으므로 생략 */}
        {!article.isHtmlContent && article.mainImage.src && (
          <div className={styles.mainImage}>
            <Image
              src={article.mainImage.src}
              alt={article.mainImage.alt}
              width={article.mainImage.width}
              height={article.mainImage.height}
              style={{ width: '100%', maxWidth: article.mainImage.width, height: 'auto' }}
              priority
            />
          </div>
        )}

        {article.isHtmlContent ? (
          <div
            className={styles.htmlContent}
            dangerouslySetInnerHTML={{ __html: sanitizeHtmlImages(article.bodyParagraphs[0]) }}
          />
        ) : (
          <>
            {/* Paragraphs + inline images + headings + lists */}
            {article.bodyParagraphs.map((paragraph, i) => {
              if (paragraph.startsWith('__IMAGE_')) {
                const img = article.bodyImages[imageIndex];
                imageIndex++;
                if (!img) return null;
                return (
                  <div key={`img-${i}`} className={styles.bodyImage}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      style={{ width: '100%', maxWidth: img.width, height: 'auto' }}
                    />
                  </div>
                );
              }
              if (paragraph.startsWith('__HEADING__')) {
                return (
                  <h3 key={i} className={styles.subHeading}>
                    {paragraph.replace('__HEADING__', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('__LIST__')) {
                const items = paragraph.replace('__LIST__', '').split('|');
                return (
                  <ul key={i} className={styles.bulletList}>
                    {items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith('__LINKS__')) {
                const links = paragraph
                  .replace('__LINKS__', '')
                  .split('|')
                  .map((entry) => {
                    const [label, url] = entry.split('::');
                    return { label, url };
                  });
                return (
                  <div key={i} className={styles.linkList}>
                    {links.map((link, j) => (
                      <a
                        key={j}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.relatedLink}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                );
              }
              return (
                <p key={i} className={styles.paragraph}>
                  {paragraph}
                </p>
              );
            })}

            {/* Source link */}
            {article.sourceUrl && (
              <p className={styles.sourceLink}>
                <span>{t('sourceLabel')}</span>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.sourceUrl}
                </a>
              </p>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        {(nextArticle || prevArticle) && (
          <div className={styles.navLinks}>
            {prevArticle && (
              <ArticleNavLink
                href={`/news/article/${prevArticle.id}`}
                title={prevArticle.title}
                direction="next"
              />
            )}
            {nextArticle && (
              <ArticleNavLink
                href={`/news/article/${nextArticle.id}`}
                title={nextArticle.title}
                direction="prev"
              />
            )}
          </div>
        )}

        <Link href="/news" className={styles.listButton}>
          {t('listButton')}
        </Link>
      </div>
    </div>
  );
}
