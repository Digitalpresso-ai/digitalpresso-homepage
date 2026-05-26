import { notFound } from 'next/navigation';
import { getArticleById } from '@/backend/article/application/server-facade';
import ArticleEditor from '@/src/features/admin/components/ArticleEditor/ArticleEditor';
import DeleteArticleButton from '@/src/features/admin/components/DeleteArticleButton/DeleteArticleButton';
import styles from './page.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>아티클 수정</h1>
        <DeleteArticleButton id={id} className={styles.deleteBtn} />
      </div>
      <ArticleEditor article={article} />
    </div>
  );
}
