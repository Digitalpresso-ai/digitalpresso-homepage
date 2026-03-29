import Link from 'next/link';
import { getArticles } from '@/src/features/admin/actions/article.actions';
import styles from './page.module.css';

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>아티클 관리</h1>
        <Link href="/admin/articles/new" className={styles.newBtn}>+ 새 아티클</Link>
      </header>

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
                <th>슬러그</th>
                <th>카테고리</th>
                <th>상태</th>
                <th>작성일</th>
                <th>수정일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className={styles.titleCell}>{article.title}</td>
                  <td className={styles.slugCell}>{article.slug}</td>
                  <td><span className={styles.category}>{article.category}</span></td>
                  <td>
                    <span className={`${styles.status} ${styles[article.status]}`}>
                      {article.status === 'published' ? '발행됨' : '임시저장'}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(article.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(article.updated_at).toLocaleDateString('ko-KR')}
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
