// src/features/home/components/HomeNewsSection/HomeNewsCard.tsx

import Image from 'next/image';
import styles from './HomeNewsCard.module.css';

interface HomeNewsCardProps {
  title: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
}

export function HomeNewsCard({ title, date, imageSrc, imageAlt }: HomeNewsCardProps) {
  return (
    <article className={styles.card}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 799px) 100vw, 240px"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.cardContent}>
        <p className={styles.cardTitle}>{title}</p>
        <time className={styles.cardDate}>{date}</time>
      </div>
    </article>
  );
}
