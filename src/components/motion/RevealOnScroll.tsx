'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { useIntersectionObserver } from '@/src/hooks/useIntersectionObserver';
import styles from './RevealOnScroll.module.css';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Stagger index; each step delays the reveal by 100ms. */
  order?: number;
}

/**
 * Fades its children up by a few pixels the first time they scroll into view.
 * Deliberately subtle — the motion should register without pulling focus.
 */
export function RevealOnScroll({ children, className, order = 0 }: RevealOnScrollProps) {
  const [shown, setShown] = useState(false);
  const reveal = useCallback(() => setShown(true), []);
  const ref = useIntersectionObserver(reveal, {
    enabled: !shown,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.15,
  });

  return (
    <div
      ref={ref}
      className={`${styles.reveal}${shown ? ` ${styles.revealed}` : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${order * 100}ms` }}
    >
      {children}
    </div>
  );
}
