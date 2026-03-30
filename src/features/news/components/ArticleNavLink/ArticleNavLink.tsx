// src/features/news/components/ArticleNavLink/ArticleNavLink.tsx

import { Link } from '@/i18n/navigation';
import styles from './ArticleNavLink.module.css';

type Direction = 'prev' | 'next';

interface ArticleNavLinkProps {
  href: string;
  title: string;
  direction: Direction;
}

function ChevronIcon({ direction }: { direction: Direction }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={styles.chevron}
    >
      <path
        d={direction === 'prev' ? 'M6 9L12 15L18 9' : 'M18 15L12 9L6 15'}
        stroke="#1e2939"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArticleNavLink({
  href,
  title,
  direction,
}: ArticleNavLinkProps) {
  return (
    <Link href={href} className={styles.link}>
      <ChevronIcon direction={direction} />
      <span className={styles.title}>{title}</span>
    </Link>
  );
}
