import ArticleEditor from '@/src/features/admin/components/ArticleEditor/ArticleEditor';
import styles from './page.module.css';

export const metadata = { title: '새 아티클 — Digitalpresso Admin' };

export default function NewArticlePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>새 아티클</h1>
      <ArticleEditor />
    </div>
  );
}
