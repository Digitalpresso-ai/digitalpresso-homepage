'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePinArticle } from '@/src/hooks/mutations/useArticleMutations';
import styles from './PinButton.module.css';

interface Props {
  articleId: string;
  pinnedAt: Date | string | null;
}

/**
 * 아티클을 고정/고정해제한다. 고정한 글은 목록 최상단에 노출된다.
 */
export default function PinButton({ articleId, pinnedAt }: Props) {
  const router = useRouter();
  const pinMutation = usePinArticle();
  const [error, setError] = useState<string | null>(null);
  const isPinned = !!pinnedAt;

  const handleClick = async () => {
    setError(null);
    try {
      await pinMutation.mutateAsync({ id: articleId, unpin: isPinned });
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
        disabled={pinMutation.isPending}
        className={`${styles.btn} ${isPinned ? styles.pinned : styles.unpinned}`}
        title={isPinned ? '고정 해제' : '맨 위에 고정'}
      >
        {pinMutation.isPending ? '처리 중...' : isPinned ? '📌 고정됨' : '고정'}
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </span>
  );
}
