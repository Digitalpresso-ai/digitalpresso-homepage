'use client';

import { useRouter } from 'next/navigation';
import { useDeleteArticle } from '@/src/hooks/mutations/useArticleMutations';

export default function DeleteArticleButton({ id, className }: { id: string; className?: string }) {
  const router = useRouter();
  const { mutateAsync, isPending } = useDeleteArticle();

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await mutateAsync(id);
    router.push('/admin/articles');
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={className}
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  );
}
