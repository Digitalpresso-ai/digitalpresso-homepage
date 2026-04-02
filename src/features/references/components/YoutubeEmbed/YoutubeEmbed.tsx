'use client';

// src/features/references/components/YoutubeEmbed/YoutubeEmbed.tsx

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './YoutubeEmbed.module.css';

interface YoutubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YoutubeEmbed({ videoId, title = 'YouTube video' }: YoutubeEmbedProps) {
  const t = useTranslations('referencesPage.youtube');
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <div className={styles.wrapper}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.wrapper}
      onClick={() => setActivated(true)}
      aria-label={`${title} ${t('playSuffix')}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        fill
        className={styles.thumbnail}
        sizes="(max-width: 799px) 100vw, 50vw"
      />
      <span className={styles.playBtn} aria-hidden="true">
        <svg viewBox="0 0 68 48" width="68" height="48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.8 0 34 0 34 0S12.2 0 7.5 1.7a8.5 8.5 0 0 0-6 6C0 12.4 0 24 0 24s0 11.6 1.5 16.3a8.5 8.5 0 0 0 6 6C12.2 48 34 48 34 48s21.8 0 26.5-1.7a8.5 8.5 0 0 0 6-6C68 35.6 68 24 68 24s0-11.6-1.5-16.3z"
            fill="red"
          />
          <path d="M27 34l18-10-18-10v20z" fill="#fff" />
        </svg>
      </span>
    </button>
  );
}
