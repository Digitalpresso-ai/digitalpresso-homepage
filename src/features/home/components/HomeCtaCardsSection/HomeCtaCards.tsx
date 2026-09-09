// src/features/home/components/HomeCtaCardsSection/HomeCtaCards.tsx

'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import { BrochureModal } from '../BrochureModal/BrochureModal';
import styles from './HomeCtaCardsSection.module.css';

const CARDS = [
  { key: 'contact', Icon: Mail, ActionIcon: ArrowRight },
  { key: 'brochure', Icon: BookOpen, ActionIcon: ArrowDown, isBrochure: true },
] as const;

export function HomeCtaCards() {
  const t = useTranslations('home.ctaCards');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.cards}>
        {CARDS.map((card, index) => {
          const { key, Icon, ActionIcon } = card;
          const isBrochure = 'isBrochure' in card && card.isBrochure;

          const cardBody = (
            <>
              <span className={styles.hoverBar} aria-hidden />
              <div className={styles.cardBody}>
                <span className={styles.iconBox}>
                  <Icon size={60} strokeWidth={2.4} aria-hidden="true" />
                </span>
                <h3 className={styles.cardTitle}>{t(`cards.${key}.title`)}</h3>
                <p className={styles.cardDesc}>{t(`cards.${key}.desc`)}</p>
              </div>
              <span className={styles.button}>
                <span>{t(`cards.${key}.button`)}</span>
                <ActionIcon size={24} strokeWidth={2.2} aria-hidden="true" />
              </span>
            </>
          );

          return (
            <RevealOnScroll key={key} order={index + 1} className={styles.cardReveal}>
              {isBrochure ? (
                <button
                  type="button"
                  className={`${styles.card} ${styles.cardButton}`}
                  onClick={() => setIsModalOpen(true)}
                >
                  {cardBody}
                </button>
              ) : (
                <a className={styles.card} href={t(`cards.${key}.href`)}>
                  {cardBody}
                </a>
              )}
            </RevealOnScroll>
          );
        })}
      </div>

      <BrochureModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
