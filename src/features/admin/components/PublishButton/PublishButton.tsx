'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePublishArticle } from '@/src/hooks/mutations/useArticleMutations';
import styles from './PublishButton.module.css';

interface Props {
  articleId: string;
  status: string;
}

/**
 * 임시저장(draft) 아티클을 게시하거나, 게시된 글을 다시 임시저장으로 내린다.
 * 게시 성공/실패 시 목록을 새로고침한다.
 */
export default function PublishButton({ articleId, status }: Props) {
  const router = useRouter();
  const publishMutation = usePublishArticle();
  const [error, setError] = useState<string | null>(null);
  const isPublished = status === 'published';

  const handleClick = async () => {
    setError(null);

    if (isPublished) {
      const ok = window.confirm('이 아티클을 사이트에서 내려 임시저장으로 되돌릴까요?');
      if (!ok) return;
    }

    try {
      await publishMutation.mutateAsync({ id: articleId, unpublish: isPublished });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '처리에 실패했습니다.');
    }
  };

  return (
    <span className={styles.wrap}>
      <button
        type="button"
        onClick={handleClick}
        disabled={publishMutation.isPending}
        className={`${styles.btn} ${isPublished ? styles.unpublish : styles.publish}`}
      >
        {publishMutation.isPending
          ? '처리 중...'
          : isPublished
            ? '내리기'
            : '게시'}
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </span>
  );
}
