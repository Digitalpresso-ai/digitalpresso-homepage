import { notFound } from 'next/navigation';
import { getArticleForEdit, deleteArticle } from '@/src/features/admin/actions/article.actions';
import ArticleEditor from '@/src/features/admin/components/ArticleEditor/ArticleEditor';
import styles from './page.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleForEdit(id);

  if (!article) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>아티클 수정</h1>
        <DeleteButton id={id} />
      </div>
      <ArticleEditor article={article} />
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        'use server';
        await deleteArticle(id);
      }}
    >
      <button type="submit" className={styles.deleteBtn}>
        삭제
      </button>
    </form>
  );
}
