'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './AboutOffice.module.css';

interface Props {
  images: readonly string[];
  captions: string[];
}

export function AboutOfficeGallery({ images, captions }: Props) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealed);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.gallery}>
      {images.map((src, index) => (
        <div
          key={src}
          ref={(el) => { itemRefs.current[index] = el; }}
          className={styles.galleryItem}
        >
          <div className={styles.imageWrapper}>
            <Image
              src={src}
              alt={captions[index]}
              fill
              className={styles.image}
              sizes="(max-width: 799px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
          <span className={styles.caption}>{captions[index]}</span>
        </div>
      ))}
    </div>
  );
}
