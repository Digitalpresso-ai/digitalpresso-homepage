import Link from 'next/link';
import { getArticles } from '@/src/features/admin/actions/article.actions';
import styles from './page.module.css';

const CATEGORY_FILTERS = [
  { key: 'company', label: '회사소식' },
  { key: 'construction', label: '건설소식' },
  { key: 'technology', label: '기술소식' },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  company: '회사소식',
  construction: '건설소식',
  technology: '기술소식',
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeFilter = category ?? 'company';
  const articles = await getArticles(activeFilter);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>아티클 관리</h1>
        <Link href="/admin/articles/new" className={styles.newBtn}>+ 새 아티클</Link>
      </header>

      <div className={styles.filterBar}>
        <Link
          href="/admin/articles?category=company"
          className={`${styles.filterBtn} ${activeFilter === 'company' ? styles.filterBtnActive : ''}`}
        >
          회사소식
        </Link>
        <span className={styles.filterDivider}>|</span>
        <Link
          href="/admin/articles?category=construction"
          className={`${styles.filterBtn} ${activeFilter === 'construction' ? styles.filterBtnActive : ''}`}
        >
          건설소식
        </Link>
        <span className={styles.filterDivider}>|</span>
        <Link
          href="/admin/articles?category=technology"
          className={`${styles.filterBtn} ${activeFilter === 'technology' ? styles.filterBtnActive : ''}`}
        >
          기술소식
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className={styles.empty}>
          <p>아직 아티클이 없습니다.</p>
          <Link href="/admin/articles/new" className={styles.emptyLink}>첫 번째 아티클 작성하기 →</Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>제목</th>
                <th>카테고리</th>
                <th>작성일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className={styles.titleCell}>{article.title}</td>
                  <td>
                    <span className={styles.category}>
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(article.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className={styles.actionsCell}>
                    <Link href={`/admin/articles/${article.id}/edit`} className={styles.editLink}>
                      수정
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
